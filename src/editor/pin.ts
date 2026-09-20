import { type Extension, Facet, Prec, StateEffect, StateField } from "@codemirror/state";
import { EditorView, type Tooltip, type TooltipView, keymap, showTooltip } from "@codemirror/view";

import type { Finding } from "../findings/schema.ts";
import { renderCard } from "./card.ts";
import { type EditorFinding, dropFinding, findingsAt, findingsField } from "./state.ts";

export interface PinHandlers {
	/** The author fixed it, or said it needs no fixing. */
	onResolve?: (finding: Finding) => void;
	/** The author read the rule and disagrees. This one has to stick. */
	onDismiss?: (finding: Finding) => void;
}

/** Opens the editable card on a finding, or closes it with null. */
export const pinFinding = StateEffect.define<string | null>();

const pinHandlers = Facet.define<PinHandlers, PinHandlers>({
	combine: (values) => values[0] ?? {},
});

const pinnedId = StateField.define<string | null>({
	create() {
		return null;
	},

	update(value, transaction) {
		for (const effect of transaction.effects) {
			if (effect.is(pinFinding)) value = effect.value;
		}
		if (value === null) return null;

		// The finding can go away under the card — dropped, or typed away.
		const open = transaction.state.field(findingsField);
		return open.some((item) => item.finding.id === value) ? value : null;
	},
});

function itemById(items: readonly EditorFinding[], id: string): EditorFinding | undefined {
	return items.find((item) => item.finding.id === id);
}

/** Every finding covering this one's middle, so a stepper can walk them. */
function siblings(items: readonly EditorFinding[], item: EditorFinding): EditorFinding[] {
	return findingsAt([...items], Math.floor((item.from + item.to) / 2));
}

function buildView(view: EditorView, id: string): TooltipView {
	const dom = createDiv({ cls: "proofread-card proofread-card-pinned" });

	const handlers = view.state.facet(pinHandlers);
	const item = itemById(view.state.field(findingsField), id);
	let input: HTMLInputElement | null = null;

	const close = (): void => {
		view.dispatch({ effects: pinFinding.of(null) });
		view.focus();
	};

	if (item) {
		const here = siblings(view.state.field(findingsField), item);
		if (here.length > 1) {
			const index = here.findIndex((one) => one.finding.id === id);
			const stepper = dom.createDiv({ cls: "proofread-stepper" });
			stepper.createSpan({ text: `${index + 1} of ${here.length} here` });
			const next = stepper.createEl("button", { cls: "proofread-step", text: "Next" });
			next.addEventListener("click", () => {
				const following = here[(index + 1) % here.length];
				view.dispatch({ effects: pinFinding.of(following.finding.id) });
			});
		}

		renderCard(dom, item.finding);

		const fix = dom.createDiv({ cls: "proofread-fix" });
		input = fix.createEl("input", { cls: "proofread-input", type: "text" });
		// Seeded with the note's own words. A suggested rewrite would be the
		// one thing this plugin must never put in front of the author.
		input.value = view.state.doc.sliceString(item.from, item.to);
		input.setAttribute("aria-label", "Replacement text");

		const apply = (): void => {
			const current = itemById(view.state.field(findingsField), id);
			if (!current || !input) return close();

			const replacement = input.value;
			if (replacement === view.state.doc.sliceString(current.from, current.to)) return close();

			view.dispatch({
				changes: { from: current.from, to: current.to, insert: replacement },
				effects: [dropFinding.of(id), pinFinding.of(null)],
			});
			handlers.onResolve?.(current.finding);
			view.focus();
		};

		input.addEventListener("keydown", (event) => {
			// The editor and Obsidian both listen further up; neither should
			// see what is being typed into this field.
			event.stopPropagation();
			if (event.key === "Enter") {
				event.preventDefault();
				apply();
			} else if (event.key === "Escape") {
				event.preventDefault();
				close();
			}
		});

		const actions = dom.createDiv({ cls: "proofread-actions" });

		const applyButton = actions.createEl("button", { cls: "mod-cta", text: "Apply" });
		applyButton.addEventListener("click", apply);

		const resolveButton = actions.createEl("button", { text: "Resolve" });
		resolveButton.addEventListener("click", () => {
			view.dispatch({ effects: [dropFinding.of(id), pinFinding.of(null)] });
			handlers.onResolve?.(item.finding);
			view.focus();
		});

		const dismissButton = actions.createEl("button", { text: "Dismiss" });
		dismissButton.addEventListener("click", () => {
			view.dispatch({ effects: [dropFinding.of(id), pinFinding.of(null)] });
			handlers.onDismiss?.(item.finding);
			view.focus();
		});

		dom.createEl("p", {
			cls: "proofread-hint",
			text: "Enter applies · Esc closes · Dismiss keeps it out of later runs",
		});
	}

	return {
		dom,
		mount() {
			input?.focus();
			input?.select();
		},
	};
}

const pinnedTooltip = showTooltip.compute([pinnedId, findingsField], (state): Tooltip | null => {
	const id = state.field(pinnedId);
	if (id === null) return null;

	const item = itemById(state.field(findingsField), id);
	if (!item) return null;

	return {
		pos: item.from,
		end: item.to,
		above: true,
		arrow: true,
		create: (view) => buildView(view, id),
	};
});

const clickToPin = EditorView.domEventHandlers({
	mousedown(event, view) {
		if (event.button !== 0) return false;

		const target = event.target as HTMLElement | null;
		if (target?.closest(".proofread-card")) return false;

		const highlight = target?.closest(".proofread-finding");
		if (!highlight) {
			if (view.state.field(pinnedId) !== null) view.dispatch({ effects: pinFinding.of(null) });
			return false;
		}

		const position = view.posAtCoords({ x: event.clientX, y: event.clientY });
		if (position === null) return false;

		const here = findingsAt(view.state.field(findingsField), position);
		if (here.length === 0) return false;

		view.dispatch({ effects: pinFinding.of(here[0].finding.id) });
		return false; // the click still places the cursor
	},
});

const closeOnEscape = Prec.high(
	keymap.of([
		{
			key: "Escape",
			run: (view) => {
				if (view.state.field(pinnedId) === null) return false;
				view.dispatch({ effects: pinFinding.of(null) });
				return true;
			},
		},
	]),
);

export function proofreadPin(handlers: PinHandlers = {}): Extension {
	return [pinnedId, pinnedTooltip, clickToPin, closeOnEscape, pinHandlers.of(handlers)];
}
