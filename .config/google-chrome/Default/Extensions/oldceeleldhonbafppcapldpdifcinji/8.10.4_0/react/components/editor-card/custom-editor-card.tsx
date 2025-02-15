import React, { ReactNode, forwardRef } from "react";
import { Props } from "./editor-card";
import CardBase, { CardBaseRef } from "../card-base/custom-card-base";

const CustomEditorCard = forwardRef<CardBaseRef, Props>(function EditorCard(
	{ initialContentProps, mode, root, forwardUpdateContentFn, customEditorCard, ...cardBaseProps },
	cardBaseRef
) {
	return (
		<CardBase {...cardBaseProps} ref={cardBaseRef}>
			{customEditorCard &&
				((customEditorCard as any).render({
					initialContentProps,
					mode,
					root,
					forwardUpdateContentFn,
					cardBaseProps,
					cardBaseRef,
				} as any) as ReactNode)}
		</CardBase>
	);
});

export default CustomEditorCard;
