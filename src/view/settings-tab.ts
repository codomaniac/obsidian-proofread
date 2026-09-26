import { type App, PluginSettingTab, Setting, type SettingDefinitionItem } from "obsidian";

import { CATEGORIES, type FindingCategory } from "../findings/schema.ts";
import type ProofreadPlugin from "../main.ts";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
	mechanical: "Typos, articles, prepositions, agreement, commas.",
	vocabulary: "A word the note is talking around.",
	clutter: "Qualifiers, nominalizations, long words, redundancy.",
	clarity: "A sentence whose subject is not its character, or whose verb is far away.",
};

const FOLDER_DESC =
	"Where a proofread run leaves its reports, relative to the vault. " +
	"A note at content/one.md is read from <folder>/content/one.md.json.";

const POLL_DESC = "Seconds between checks. 0 leaves it to the reload command.";

const PANEL_DESC = "When a note turns out to have findings, without taking focus from it.";

function categoryKey(category: FindingCategory): string {
	return `show.${category}`;
}

export class ProofreadSettingTab extends PluginSettingTab {
	constructor(
		app: App,
		private readonly plugin: ProofreadPlugin,
	) {
		super(app, plugin);
	}

	/**
	 * The declarative form, which is what puts these in Obsidian's settings
	 * search. `display()` below is the fallback for anyone on an older build.
	 */
	override getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				name: "Report folder",
				desc: FOLDER_DESC,
				control: { type: "text", key: "sidecarFolder", defaultValue: ".proofread" },
			},
			{
				name: "Check for new reports",
				desc: POLL_DESC,
				control: { type: "number", key: "pollSeconds", defaultValue: 2 },
			},
			...CATEGORIES.map((category): SettingDefinitionItem => ({
				name: `Show ${category} findings`,
				desc: CATEGORY_DESCRIPTIONS[category] ?? "",
				control: { type: "toggle", key: categoryKey(category), defaultValue: true },
			})),
			{
				name: "Open the panel automatically",
				desc: PANEL_DESC,
				control: { type: "toggle", key: "autoOpenPanel", defaultValue: false },
			},
		];
	}

	override getControlValue(key: string): unknown {
		const { settings } = this.plugin;
		if (key.startsWith("show.")) return settings.show[key.slice(5) as FindingCategory];
		return (settings as unknown as Record<string, unknown>)[key];
	}

	override async setControlValue(key: string, value: unknown): Promise<void> {
		const { settings } = this.plugin;

		if (key.startsWith("show.")) {
			settings.show[key.slice(5) as FindingCategory] = Boolean(value);
			await this.plugin.saveState();
			this.plugin.reapply();
			return;
		}

		if (key === "sidecarFolder") settings.sidecarFolder = String(value).trim() || ".proofread";
		else if (key === "pollSeconds") settings.pollSeconds = pollSecondsFrom(value);
		else if (key === "autoOpenPanel") settings.autoOpenPanel = Boolean(value);

		await this.plugin.saveState();
	}

	override display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Report folder")
			.setDesc(FOLDER_DESC)
			.addText((text) =>
				text.setValue(this.plugin.settings.sidecarFolder).onChange(async (value) => {
					await this.setControlValue("sidecarFolder", value);
				}),
			);

		new Setting(containerEl)
			.setName("Check for new reports")
			.setDesc(POLL_DESC)
			.addText((text) =>
				text.setValue(String(this.plugin.settings.pollSeconds)).onChange(async (value) => {
					await this.setControlValue("pollSeconds", value);
				}),
			);

		new Setting(containerEl).setName("Show").setHeading();

		for (const category of CATEGORIES) {
			new Setting(containerEl)
				.setName(category)
				.setDesc(CATEGORY_DESCRIPTIONS[category] ?? "")
				.addToggle((toggle) =>
					toggle.setValue(this.plugin.settings.show[category]).onChange(async (value) => {
						await this.setControlValue(categoryKey(category), value);
					}),
				);
		}

		new Setting(containerEl)
			.setName("Open the panel automatically")
			.setDesc(PANEL_DESC)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.autoOpenPanel).onChange(async (value) => {
					await this.setControlValue("autoOpenPanel", value);
				}),
			);
	}
}

/** 0 disables polling; anything unreadable falls back to the default. */
function pollSecondsFrom(value: unknown): number {
	const seconds = Number(value);
	return Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : 2;
}
