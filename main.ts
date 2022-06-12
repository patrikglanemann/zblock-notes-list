import { Plugin } from "obsidian";
export default class ExamplePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"zblockNotes",
			(content, el, ctx) => {
				const files = this.app.vault.getFiles().map((file) => ({
					name: file.basename,
					lastChanged: file.stat.mtime,
					path: file.path,
				}));

				const activeFile = this.app.workspace.getActiveFile().path;
				const filesF = files.filter((file) => file.path != activeFile);

				filesF.sort((a, b) => {
					return b.lastChanged - a.lastChanged;
				});

				const baseDiv = el.createDiv("div");

				filesF.map((file) => {
					const block = baseDiv.createEl("blockquote");
					block.createEl("h4", { text: file.name });
					block.createEl("span", {
						attr: { src: file.path },
						cls: "internal-embed",
					});
				});
			}
		);
	}
}
