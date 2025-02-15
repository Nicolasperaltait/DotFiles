import React, { useEffect, useState, useMemo } from "react";
import { AdvancedToolbox } from "@advanced-toolbox/toolbox";
import { ToolboxPluginEmojiPicker, ToolboxPluginEmojiPickerAdapter } from "@advanced-toolbox/plugin-emoji-picker";
import { ToolboxPluginGiphy, ToolboxPluginGiphyAdapter } from "@advanced-toolbox/plugin-giphy";
import {
	ToolboxPluginParaphraser,
	ToolboxPluginParaphraserAdapter,
	type ToolboxPluginParaphraserSuggestion,
	type ToolboxPluginParaphraserParaphraseFunction,
} from "@advanced-toolbox/plugin-paraphraser";
import type {
	ToolboxApplyEvent,
	ToolboxConfig,
	ToolboxTextContext,
	ToolboxRequestResponse,
	ToolboxTextSelectionType,
} from "@advanced-toolbox/types";
import { elementFactory } from "../../index";
import { EnvironmentAdapter } from "../../../common/environmentAdapter";
import { classes } from "../../../common/utils";
import type { SynonymSet } from "../../../background/synonyms";
import type { RephraseObject } from "../../../core/Checker";

export interface Props {
	config: ToolboxConfig;
	textContext: ToolboxTextContext;
	showRuleId: boolean;
	textfieldElement: Element;
	isIdle: boolean;
	hasDarkBackground: boolean;
	close: () => void;
	onApply: (event: ToolboxApplyEvent) => void;
	setTextHighlight: (type: ToolboxTextSelectionType, range: [number, number]) => void;
	removeTextHighlight: () => void;
	loadSentenceParaphrasings: (
		subject: string,
		mode: string | undefined
	) => Promise<Array<Pick<RephraseObject, "uuid" | "text">>>;
	loadSubSentenceParaphrasings: (subject: string, start: number, end: number) => Promise<SynonymSet[]>;
}

const LTCompToolboxContent = elementFactory("comp-toolbox-content");

const createParaphraserAdapterConfig = (
	options: Pick<Props, "loadSentenceParaphrasings" | "loadSubSentenceParaphrasings">
) => {
	const sentence: ToolboxPluginParaphraserParaphraseFunction = (config) => {
		const request = options.loadSentenceParaphrasings(config.subject, config.context.mode);

		return {
			getData: async () => {
				const result: ToolboxRequestResponse<ToolboxPluginParaphraserSuggestion[]> = {
					status: "error",
					data: [],
				};

				try {
					const rephrases = await request;
					result.data = rephrases.map(({ uuid, text: to }) => ({ uuid, to }));
					result.status = "success";
				} catch (err) {
					console.error("Failed to load sentence rewritings for the Toolbox.", err);
				}

				return result;
			},
			abort: () => EnvironmentAdapter.abortPhraseRequests("rewrite"),
		};
	};
	const subSentence: ToolboxPluginParaphraserParaphraseFunction = (config) => {
		const [start, end] = config.context.range;
		const request = options.loadSubSentenceParaphrasings(config.subject, start, end);

		return {
			getData: async () => {
				const result: ToolboxRequestResponse<ToolboxPluginParaphraserSuggestion[]> = {
					status: "error",
					data: [],
				};

				try {
					const rephrases = await request;
					result.data = rephrases.flatMap(({ synonyms }) =>
						synonyms.map(({ word }, i) => ({
							uuid: `${word}-${i}`,
							to: word,
						}))
					);
					result.status = "success";
				} catch (err) {
					console.error("Failed to load sub-sentence paraphrasings for the Toolbox.", err);
				}

				return result;
			},
			abort: () => EnvironmentAdapter.abortSynonymsRequest(),
		};
	};
	const customSentenceModes = [
		{
			order: 1,
			sentenceParaphraseMode: "casual",
		},
		{
			order: 2,
			sentenceParaphraseMode: "formal",
		},
	];

	return { phrase: subSentence, word: subSentence, sentence, customSentenceModes };
};

const ToolboxContent: React.FC<Props> = ({
	config,
	textContext,
	textfieldElement,
	hasDarkBackground,
	isIdle,
	close,
	onApply,
	setTextHighlight,
	removeTextHighlight,
	loadSentenceParaphrasings,
	loadSubSentenceParaphrasings,
}) => {
	const [view, setView] = useState<React.FunctionComponentElement<unknown> | null>(null);
	const paraphraserAdapterConfig = useMemo(
		() =>
			createParaphraserAdapterConfig({
				loadSentenceParaphrasings,
				loadSubSentenceParaphrasings,
			}),
		[loadSentenceParaphrasings, loadSubSentenceParaphrasings]
	);

	useEffect(() => {
		if (view) {
			return;
		}

		const emojiDataBaseUrl = EnvironmentAdapter.getURL(process.env.EMOJI_DATA_BASE_PATH ?? "/");
		const emojiLocales = (() => {
			try {
				const locales = process.env.EMOJI_LOCALES ?? [];

				if (!Array.isArray(locales)) {
					throw new Error(
						`Expected 'EMOJI_LOCALES' to be an array; retrieved ${typeof process.env.EMOJI_LOCALES}.`
					);
				}

				return locales;
			} catch (e) {
				console.error("Failed to retrieve emoji locales.", e);

				return [];
			}
		})();

		ToolboxPluginEmojiPicker.addAdapter(
			new ToolboxPluginEmojiPickerAdapter({
				emojiDataBaseUrl,
				emojiLocales,
			})
		);
		ToolboxPluginParaphraser.addAdapter(new ToolboxPluginParaphraserAdapter(paraphraserAdapterConfig));
		ToolboxPluginGiphy.addAdapter(new ToolboxPluginGiphyAdapter({ apiKey: "sXGNsG8jHYVfhNuNZ0L5oUqUKTPpqgHd" }));
		const toolbox = new AdvancedToolbox({
			...config,
			plugins: [ToolboxPluginEmojiPicker, ToolboxPluginParaphraser, ToolboxPluginGiphy],
		});
		const toolboxView = toolbox.createView({
			context: textContext,
			colorScheme: hasDarkBackground ? "dark" : "light",
			textfieldElement,
			close,
			onApply,
			setTextHighlight,
			removeTextHighlight,
		});

		setView(toolboxView);
	}, [
		view,
		config,
		close,
		onApply,
		setTextHighlight,
		removeTextHighlight,
		paraphraserAdapterConfig,
		textfieldElement,
		hasDarkBackground,
		textContext,
	]);

	return (
		<LTCompToolboxContent className={classes(isIdle && "lt-toolbox-content--is-idle")}>{view}</LTCompToolboxContent>
	);
};

export default ToolboxContent;
