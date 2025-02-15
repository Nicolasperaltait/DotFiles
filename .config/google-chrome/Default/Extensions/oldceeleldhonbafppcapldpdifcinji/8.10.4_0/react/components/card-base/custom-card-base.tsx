import React, { useRef, useState, useImperativeHandle, useCallback, forwardRef } from "react";
import { elementFactory } from "../../index";

export type CardType = "wide" | "narrow";

export interface Props {
	type: CardType;
	updatePosition?: (container: HTMLElement | null) => void;
	moveIntoViewport: (container: HTMLElement | null) => void;
}

export interface CardBaseRef {
	updatePosition: () => void;
	updateCardType: (cardType: CardType) => void;
}

const LtCompCardBase = elementFactory("comp-card-base");

const CardBase = forwardRef<CardBaseRef, React.PropsWithChildren<Props>>(function CardBase(
	{ type, updatePosition, moveIntoViewport, children },
	ref
) {
	const cardBaseRef = useRef<HTMLElement>(null);
	const [cardType, setCardType] = useState<CardType>(type);

	const updateCardPosition = useCallback(() => {
		updatePosition?.(cardBaseRef.current);
	}, [updatePosition]);

	useImperativeHandle<object, CardBaseRef>(
		ref,
		() => ({
			updatePosition: updateCardPosition,
			updateCardType: setCardType,
		}),
		[updateCardPosition]
	);

	return <LtCompCardBase ref={cardBaseRef}>{children}</LtCompCardBase>;
});

export default CardBase;
