import { type App, PluginSettingTab, Setting } from "obsidian";

import { CATEGORIES } from "../findings/schema.ts";
import type ProofreadPlugin from "../main.ts";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
	mechanical: "Typos, articles, prepositions, agreement, commas.",
	vocabulary: "A word the note is talking around.",
	clutter: "Qualifiers, nominalizations, long words, redundancy.",
};

export class ProofreadSettingTab extends PluginSettingTab {
	constructor(
		app: App,
		private readonly plugin: ProofreadPlugin,
	) {
		super(app, plugin);
	}

	override display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Report folder")
			.setDesc(
				"Where a proofread run leaves its reports, relative to the vault. " +
					"A note at content/one.md is read from <folder>/content/one.md.json.",
			)
			.addText((text) =>
				text.setValue(this.plugin.settings.sidecarFolder).onChange(async (value) => {
					this.plugin.settings.sidecarFolder = value.trim() || ".proofread";
					await this.plugin.saveState();
				}),
			);

		new Setting(containerEl)
			.setName("Check for new reports")
			.setDesc("Seconds between checks. 0 leaves it to the reload command.")
			.addText((text) =>
				text.setValue(String(this.plugin.settings.pollSeconds)).onChange(async (value) => {
					const seconds = Number.parseInt(value, 10);
					this.plugin.settings.pollSeconds = Number.isFinite(seconds) && seconds >= 0 ? seconds : 2;
					await this.plugin.saveState();
				}),
			);

		new Setting(containerEl).setName("Show").setHeading();

		for (const category of CATEGORIES) {
			new Setting(containerEl)
				.setName(category)
				.setDesc(CATEGORY_DESCRIPTIONS[category] ?? "")
				.addToggle((toggle) =>
					toggle.setValue(this.plugin.settings.show[category]).onChange(async (value) => {
						this.plugin.settings.show[category] = value;
						await this.plugin.saveState();
						this.plugin.reapply();
					}),
				);
		}

		new Setting(containerEl)
			.setName("Open the panel automatically")
			.setDesc("When a note turns out to have findings, without taking focus from it.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.autoOpenPanel).onChange(async (value) => {
					this.plugin.settings.autoOpenPanel = value;
					await this.plugin.saveState();
				}),
			);
	}
}
