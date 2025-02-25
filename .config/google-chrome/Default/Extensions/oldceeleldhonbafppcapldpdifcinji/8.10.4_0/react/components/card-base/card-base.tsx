import React, { useMemo, useRef, useState, useEffect, useImperativeHandle, useCallback, forwardRef } from "react";
import { i18nManager } from "../../../common/i18nManager";
import { classes } from "../../../common/utils";
import { isFunction, isUndefined } from "../../../core/utils";
import KeyboardNavigation from "../keyboard-navigation/keyboard-navigation";
import KeyboardNavigationHint from "../keyboard-navigation-hint/keyboard-navigation-hint";
import useStopPropagation from "../../hooks/use-stop-propagation";
import { Div, Span, elementFactory, useI18nContext, useStorageContext } from "../../index";
import { useDraggable, BaseCardContextProvider } from "./hooks";
import type { CardMode } from "../../../ts-types/common";

export type CardType = "wide" | "narrow";

export interface Props {
	root: HTMLElement;
	mode: CardMode | undefined;
	type: CardType;
	isPremium: boolean;
	disablePremiumTeaser: boolean;
	className?: string;
	keyboardNavigationEnabled: boolean;
	keyboardEventTarget: Document;
	backdropRoot: HTMLElement;
	showRuleId: boolean;
	onModeChange?: (mode: CardMode) => void;
	onClose: () => void;
	onPremiumClick?: (subject: "logo" | "badge") => void;
	onDetachCard: () => void;
	updatePosition?: (container: HTMLElement | null) => void;
	moveIntoViewport: (container: HTMLElement | null) => void;
}

export interface CardBaseRef {
	updatePosition: () => void;
	updateCardType: (cardType: CardType) => void;
}

type SelectorProps = Pick<Props, "mode" | "showRuleId" | "onModeChange">;

const LtCompCardBase = elementFactory("comp-card-base");

const Selector: React.FC<SelectorProps> = ({ mode, showRuleId, onModeChange }) => {
	const { hasCustomServer, getSettings } = useStorageContext();
	const hasRephrasingEnabled = getSettings().hasRephrasingEnabled && !hasCustomServer();

	const [menuVisible, setMenuVisible] = useState(false);
	const { current: i18n } = useRef<Record<"paraphraser" | "checker" | "toolbox", string>>({
		paraphraser: i18nManager.getMessage("cardSelectorLabelParaphraser"),
		checker: i18nManager.getMessage("cardSelectorLabelChecker"),
		toolbox: "Toolbox [T]",
	});
	const caption = useMemo(() => {
		switch (mode) {
			case "correct":
				return i18n.checker;
			case "paraphrase":
				return i18n.paraphraser;
			case "toolbox":
				return i18n.toolbox;
			default:
				throw new Error(`Unexpected mode "${mode}"`);
		}
	}, [mode]);
	const toggleMenu = useStopPropagation(() => setMenuVisible(menuVisible ? false : true));
	const selectParaphrase = useStopPropagation(() => {
		setMenuVisible(false);
		onModeChange?.("paraphrase");
	});
	const selectCorrect = useStopPropagation(() => {
		setMenuVisible(false);
		onModeChange?.("correct");
	});
	const selectToolbox = useStopPropagation(() => {
		setMenuVisible(false);
		onModeChange?.("toolbox");
	});
	const handleBackdropClick = useStopPropagation(() => {
		setMenuVisible(false);
	});

	return (
		<>
			<Div className="lt-comp-card-base__selector">
				<Div
					className={classes(
						"lt-comp-card-base__selector__label",
						menuVisible && "lt-comp-card-base__selector__label--active",
						!hasRephrasingEnabled && "lt-comp-card-base__selector__label--disabled"
					)}
					onClick={hasRephrasingEnabled ? toggleMenu : undefined}
				>
					{caption}
				</Div>
				{menuVisible && (
					<Div className="lt-comp-card-base__selector__menu">
						<Div
							className={classes(
								"lt-comp-card-base__selector__menu-item",
								"lt-comp-card-base__selector__menu-item--paraphrase",
								mode === "paraphrase" && "lt-comp-card-base__selector__menu-item--current"
							)}
							onClick={selectParaphrase}
						>
							{i18n.paraphraser}
						</Div>
						<Div
							className={classes(
								"lt-comp-card-base__selector__menu-item",
								"lt-comp-card-base__selector__menu-item--correct",
								mode === "correct" && "lt-comp-card-base__selector__menu-item--current"
							)}
							onClick={selectCorrect}
						>
							{i18n.checker}
						</Div>
						{/* TODO: change condition to bring the Toolbox to the mode selector */}
						{Date.now() === 0 && (
							<Div
								className={classes(
									"lt-comp-card-base__selector__menu-item",
									"lt-comp-card-base__selector__menu-item--toolbox",
									mode === "toolbox" && "lt-comp-card-base__selector__menu-item--current"
								)}
								onClick={selectToolbox}
							>
								Toolbox [T]
							</Div>
						)}
					</Div>
				)}
			</Div>
			{menuVisible && <Div className="lt-comp-card-base__selector-backdrop" onClick={handleBackdropClick} />}
		</>
	);
};

const DragHandleBase: React.ForwardRefRenderFunction<HTMLElement> = (_, ref) => {
	return (
		<Div className="lt-comp-card-base__draggable">
			<Div className="lt-comp-card-base__draggable__handle" ref={ref}>
				{/* @see src/assets/images/card-drag-handle.svg */}
				<svg
					width="20"
					height="8"
					viewBox="0 0 20 8"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="lt-comp-card-base__draggable__handle__graphic"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M1.6 3.2C2.48366 3.2 3.2 2.48366 3.2 1.6C3.2 0.716344 2.48366 0 1.6 0C0.716344 0 0 0.716344 0 1.6C0 2.48366 0.716344 3.2 1.6 3.2ZM7.2 3.2C8.08366 3.2 8.8 2.48366 8.8 1.6C8.8 0.716344 8.08366 0 7.2 0C6.31634 0 5.6 0.716344 5.6 1.6C5.6 2.48366 6.31634 3.2 7.2 3.2ZM14.4 1.6C14.4 2.48366 13.6837 3.2 12.8 3.2C11.9163 3.2 11.2 2.48366 11.2 1.6C11.2 0.716344 11.9163 0 12.8 0C13.6837 0 14.4 0.716344 14.4 1.6ZM18.4 3.2C19.2837 3.2 20 2.48366 20 1.6C20 0.716344 19.2837 0 18.4 0C17.5163 0 16.8 0.716344 16.8 1.6C16.8 2.48366 17.5163 3.2 18.4 3.2ZM3.2 6.4C3.2 7.28366 2.48366 8 1.6 8C0.716344 8 0 7.28366 0 6.4C0 5.51634 0.716344 4.8 1.6 4.8C2.48366 4.8 3.2 5.51634 3.2 6.4ZM7.2 8C8.08366 8 8.8 7.28366 8.8 6.4C8.8 5.51634 8.08366 4.8 7.2 4.8C6.31634 4.8 5.6 5.51634 5.6 6.4C5.6 7.28366 6.31634 8 7.2 8ZM14.4 6.4C14.4 7.28366 13.6837 8 12.8 8C11.9163 8 11.2 7.28366 11.2 6.4C11.2 5.51634 11.9163 4.8 12.8 4.8C13.6837 4.8 14.4 5.51634 14.4 6.4ZM18.4 8C19.2837 8 20 7.28366 20 6.4C20 5.51634 19.2837 4.8 18.4 4.8C17.5163 4.8 16.8 5.51634 16.8 6.4C16.8 7.28366 17.5163 8 18.4 8Z"
						fill="currentColor"
					/>
				</svg>
			</Div>
		</Div>
	);
};
const DragHandle = forwardRef(DragHandleBase);

const CardBase = forwardRef<CardBaseRef, React.PropsWithChildren<Props>>(function CardBase(
	{
		root,
		mode,
		type,
		isPremium,
		disablePremiumTeaser,
		className,
		keyboardNavigationEnabled,
		keyboardEventTarget,
		backdropRoot,
		showRuleId,
		onModeChange,
		onClose,
		onPremiumClick,
		onDetachCard,
		updatePosition,
		moveIntoViewport,
		children,
	},
	ref
) {
	const getMessage = useI18nContext();
	const { current: i18n } = useRef<Record<"close", string>>({
		close: getMessage("close"),
	});
	const cardBaseRef = useRef<HTMLElement>(null);
	const dragHandleRef = useRef<HTMLElement>(null);
	const [cardType, setCardType] = useState<CardType>(type);
	const handleModeChange = useMemo(
		() => (isFunction(onModeChange) ? (newMode: CardMode) => onModeChange?.(newMode) : undefined),
		[onModeChange]
	);
	const showModeSelector = useMemo(
		() => isFunction(handleModeChange) && mode !== "toolbox",
		[handleModeChange, mode]
	);
	const showDragHandle = useMemo(() => mode !== "toolbox", [mode]);
	const draggableInstance = useDraggable(cardBaseRef.current, dragHandleRef.current, backdropRoot);
	const updateCardPosition = useCallback(() => {
		if (draggableInstance.isDetached === false) {
			updatePosition?.(cardBaseRef.current);
		}
	}, [updatePosition, draggableInstance.isDetached]);
	const moveCardIntoViewport = useCallback(() => {
		moveIntoViewport(cardBaseRef.current);
		draggableInstance.destroyDomMeasurementCache();
	}, [moveIntoViewport, draggableInstance]);
	const shouldUpsell = isPremium === false && disablePremiumTeaser !== true;
	const handleClose = useStopPropagation(onClose);
	const handleLogoClick = useStopPropagation(() => {
		onPremiumClick?.("logo");
	});
	const handleBadgeClick = useStopPropagation(() => {
		onPremiumClick?.("badge");
	});

	useImperativeHandle<object, CardBaseRef>(
		ref,
		() => ({
			updatePosition: updateCardPosition,
			updateCardType: setCardType,
		}),
		[updateCardPosition]
	);

	useEffect(() => {
		if (draggableInstance.isDetached) {
			onDetachCard();
		}
	}, [draggableInstance.isDetached, onDetachCard]);

	if (isUndefined(mode)) {
		return (
			<LtCompCardBase
				className={classes("notranslate", className, "lt-comp-card-base--narrow")}
				data-lt-testid="card-container"
				ref={cardBaseRef}
			>
				<Div className="lt-comp-card-base__header">
					<Div className="lt-comp-card-base__header__left">
						<Div className="lt-comp-card-base__logo" />
						<Div className="lt-comp-card-base__caption">LanguageTool</Div>
					</Div>
				</Div>
				{children}
			</LtCompCardBase>
		);
	}

	return (
		<KeyboardNavigation
			enableKeyboard={keyboardNavigationEnabled}
			keyboardEventTarget={keyboardEventTarget}
			root={root}
			mode={mode}
			onClose={onClose}
		>
			<BaseCardContextProvider
				value={{
					isDetached: draggableInstance.isDetached,
					adjustPosition: draggableInstance.adjustPosition,
					updateCardPosition,
					moveCardIntoViewport,
				}}
			>
				<LtCompCardBase
					className={classes(
						"notranslate",
						className,
						draggableInstance.isDraggable && "lt-comp-card-base--draggable",
						draggableInstance.isDragging && "lt-comp-card-base--dragging",
						draggableInstance.isDetached && "lt-comp-card-base--detached",
						draggableInstance.isInSnapProximity && "lt-comp-card-base--in-snap-proximity",
						draggableInstance.isResetting && "lt-comp-card-base--resetting",
						cardType === "wide" && "lt-comp-card-base--wide",
						cardType === "narrow" && "lt-comp-card-base--narrow"
					)}
					data-lt-testid="card-container"
					ref={cardBaseRef}
				>
					{showDragHandle && <DragHandle ref={dragHandleRef} />}
					<Div className="lt-comp-card-base__header">
						<Div className="lt-comp-card-base__header__left">
							<Div
								className={classes(
									"lt-comp-card-base__logo",
									shouldUpsell && "lt-comp-card-base__logo--clickable"
								)}
								onClick={shouldUpsell ? handleLogoClick : undefined}
							/>
							{showModeSelector ? (
								<Selector mode={mode} showRuleId={showRuleId} onModeChange={handleModeChange} />
							) : (
								<Div className="lt-comp-card-base__caption">LanguageTool</Div>
							)}
						</Div>
						<Div className="lt-comp-card-base__header__right">
							{shouldUpsell && (
								<Span
									className="lt-comp-card-base__badge"
									data-lt-testid="badge-basic"
									onClick={handleBadgeClick}
								>
									Basic
								</Span>
							)}
							<Div
								className="lt-comp-card-base__close lt-icon__close_small"
								onClick={handleClose}
								data-lt-testid="card-close"
							>
								<Span className="lt-comp-card-base__close__label">{i18n.close}</Span>
							</Div>
						</Div>
					</Div>
					{keyboardNavigationEnabled && (
						<KeyboardNavigationHint className="lt-comp-editor-card__keyboard-hint" />
					)}
					{children}
				</LtCompCardBase>
			</BaseCardContextProvider>
		</KeyboardNavigation>
	);
});

export default CardBase;
