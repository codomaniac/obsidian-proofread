import { hoverTooltip } from "@codemirror/view";

import { renderCard } from "./card.ts";
import { findingsAt, findingsField } from "./state.ts";

/**
 * Read-only on purpose. A CodeMirror hover tooltip closes as soon as the
 * pointer leaves it, so nothing here can be typed into; clicking the highlight
 * opens the card that can.
 */
export const findingHover = hoverTooltip(
	(view, position) => {
		const here = findingsAt(view.state.field(findingsField), position);
		if (here.length === 0) return null;

		const innermost = here[0];
		return {
			pos: innermost.from,
			end: innermost.to,
			above: true,
			create: () => {
				const dom = createDiv({ cls: "proofread-card proofread-card-hover" });
				renderCard(dom, innermost.finding, here.length - 1);
				return { dom };
			},
		};
	},
	{ hoverTime: 250 },
);
