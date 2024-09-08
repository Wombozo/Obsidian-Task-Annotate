import { Editor, MarkdownView, Plugin, Notice } from 'obsidian';
import { TaskAnnotateSettings, DEFAULT_SETTINGS, SettingTab } from './settings';
import { TaskAnnotateModal } from './modal';

export default class TaskAnnotatePlugin extends Plugin {
    settings: TaskAnnotateSettings;

    async onload() {
        await this.loadSettings();

        if (!this.settings) {
            console.error("Error : Settings not initialized");
            return;
        }

        this.addSettingTab(new SettingTab(this));
		this.addCommand({
			id: 'annotate-task-command',
			name: 'Annotate task',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const cursorPosition = editor.getCursor();
				const lineNumber = cursorPosition.line;
				const lineText = editor.getLine(lineNumber);

				const isTaskLine = lineText.trimStart().startsWith('- [ ]') || lineText.trimStart().startsWith('- [x]');
				const isLineEmpty = lineText.trim().length === 0;

				if (isTaskLine || isLineEmpty) {
					const availableTags = this.settings.tags;

					const tagsPresent = isTaskLine ? (lineText.match(/#\S+/g) || []) : [];
					const linkPresent = isTaskLine ? this.extractFromPattern(lineText, this.settings.linkFormat, 'filepath') : '';	

					new TaskAnnotateModal(this.app, 
										  linkPresent, this.settings.showFileLink, this.settings.taskDirectory, 
										  this.settings.showTags, availableTags, tagsPresent, 
										  (selectedTags: string[], selectedFilepath: string) => {
						const tagString = selectedTags.join(' ');
						const prefix = '- [ ] ';

						const restOfStr = isTaskLine ? lineText.replace(/^- \[.\](?:\s*#\S+)*\s*(.*)/, '$1') : '';

						const fileTask = selectedFilepath !== '' ? this.makeLink(selectedFilepath) : '';
						const fullStr = prefix + tagString + ' ' + fileTask + ' ' + restOfStr;

						editor.replaceRange(fullStr, { line: lineNumber, ch: 0 }, { line: lineNumber, ch: lineText.length });

						const newLineText = editor.getLine(lineNumber);
						const endOfLine = newLineText.length;
						editor.setCursor({ line: lineNumber, ch: endOfLine });
					}).open();
				} else {
					new Notice('Tasks Annotate: The cursor is not on a Task, nor a newline');
				}
			}

		});

    }

	makeAlias(filepath: string) : string {
		const lastPart = filepath.split('/').pop();
		const patt = lastPart?.replace(this.settings.patternToRemove, '');
		return patt ? patt.replace('\.md', '') : '';
	}

	makeLink(filepath: string) {
		const alias = this.makeAlias(filepath);
		return this.settings.linkFormat
        .replace('{filepath}', filepath)
        .replace('{alias}', alias);
	}

	
	extractFromPattern(text: string, pattern: string, placeholder: string) {
		let regexPattern = pattern
		.replace(/[\.\[\]\(\)\|\{\}]/g, '\\$&');  // Échapper les caractères spéciaux

		regexPattern = regexPattern.replace(`\\{${placeholder}\\}`, '(.+?)');

		regexPattern = regexPattern.replace('\\{alias\\}', '.+?');

		const regex = new RegExp(regexPattern);

		const match = text.match(regex);

		if (match && match[1]) {
			return match[1].trim();
		}

		return '';
	}





    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
