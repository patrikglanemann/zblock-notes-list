import { Plugin } from "obsidian";

export default class ZblockNotes extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"zblockNotes",
			(content, el, ctx) => {
				let limit = 10;
				let inputLimit = parseInt(content);
				if (!isNaN(inputLimit)) {
					limit = inputLimit;
				}

				const files = this.app.vault
					.getMarkdownFiles()
					.map((file) => ({
						name: file.basename,
						lastChanged: file.stat.mtime,
						path: file.path,
					}))
					.filter((file) => file.path != ctx.sourcePath)
					.sort((a, b) => {
						return b.lastChanged - a.lastChanged;
					})
					.slice(0, limit);

				const baseDiv = document.createElement("div");

				files.map((file) => {
					const block = baseDiv.createEl("blockquote", {
						cls: "zblockNotes",
					});
					const link = block.createEl("a", {
						cls: "internal-link zblockNotes-link",
						href: file.path,
						attr: {
							"data-href": file.path,
							target: "_blank",
							rel: "noopener",
						},
					});
					link.createEl("h6", {
						cls: "zblockNotes-title",
						text: file.name,
					});
					block.createEl("span", {
						attr: { src: file.path },
						cls: "internal-embed",
					});
				});

				el.appendChild(baseDiv);
			}
		);
	}
}
