import { PluginSettingTab, Setting, TFolder } from 'obsidian';
import TaskAnnotatePlugin from 'main';


export interface TaskAnnotateSettings {
	tags: string[];
	taskDirectory: string;
	showTags: boolean;
	showFileLink: boolean;
	patternToRemove: string;
	linkFormat: string;
}

export const DEFAULT_SETTINGS: TaskAnnotateSettings = {
	tags: [],
	showTags: false,
	showFileLink: false,
	taskDirectory: '/',
	linkFormat: '[T::[[{filepath}|{alias}]]]',
	patternToRemove: 'task-'
}

export class SettingTab extends PluginSettingTab {
	plugin: TaskAnnotatePlugin;

	constructor(plugin: TaskAnnotatePlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();


		containerEl.classList.add('task-annotate-settings');

		let showTags = this.plugin.settings.showTags;
		let showFileLink = this.plugin.settings.showFileLink;


		containerEl.createEl('h2', { text: 'Tags' });
		new Setting(containerEl)
			.setName('Enable task tags')
			.setDesc('Check this to prefix tasks with tags')
			.addToggle(toggle => toggle
				.setValue(showTags)
				.onChange(async (value) => {
					showTags = value;
					this.plugin.settings.showTags = value;


					const tagsContainer = containerEl.querySelector('.task-annotate-tags-setting-container') as HTMLElement;
					if (tagsContainer) {
						tagsContainer.style.display = showTags ? 'flex' : 'none';
					}
					this.display();

					await this.plugin.saveSettings();
				})
			);


		const tagsSetting = new Setting(containerEl.createDiv({ cls: ['task-annotate-setting-container', 'task-annotate-tags-setting-container'] }));
		tagsSetting.settingEl.style.display = showTags ? 'flex' : 'none';
		tagsSetting
			.setName('List of Tags')
			.setDesc('Enter a list of tags separated by commas')
			.addTextArea(text => text
				.setPlaceholder('e.g., #tag1, #tag2, #tag3')
				.setValue(this.plugin.settings.tags.join(','))
				.onChange(async (value) => {
					this.plugin.settings.tags = value.split(',').map(tag => tag.trim());
					await this.plugin.saveSettings();
				}));


		containerEl.createEl('h2', { text: 'File tasks' });
		new Setting(containerEl)
			.setName('Enable file task link')
			.setDesc('Check this to prefix tasks with file task link')
			.addToggle(toggle => toggle
				.setValue(showFileLink)
				.onChange(async (value) => {
					showFileLink = value;
					this.plugin.settings.showFileLink = value;


					const fileTaskContainer = containerEl.querySelector('.task-annotate-filetask-setting-container') as HTMLElement;
					if (fileTaskContainer) {
						fileTaskContainer.style.display = showFileLink ? 'flex' : 'none';
					}
					this.display();

					console.log(fileTaskContainer.style.display);
					await this.plugin.saveSettings();
				})
			);


		const fileTaskSetting = new Setting(containerEl.createDiv({ cls: ['task-annotate-setting-container', 'task-annotate-filetask-setting-container'] }));
		fileTaskSetting.settingEl.style.display = showFileLink ? 'flex' : 'none';

		fileTaskSetting
			.setName('Directory of tasks')
			.setDesc('Directory to look for task files to link tasks with')
			.addDropdown(dropdown => {
				const folders = this.app.vault.getAllLoadedFiles().filter(f => f instanceof TFolder);
				folders.forEach((folder: TFolder) => {
					dropdown.addOption(folder.path, folder.path);
				});


				dropdown.setValue(this.plugin.settings.taskDirectory || '/');

				dropdown.onChange(async (value) => {
					this.plugin.settings.taskDirectory = value;
					await this.plugin.saveSettings();
				});
			});


		const aliasSetting = new Setting(containerEl.createDiv({ cls: ['task-annotate-setting-container', 'task-annotate-filetask-setting-container'] }));
		aliasSetting.settingEl.style.display = showFileLink ? 'flex' : 'none';

		aliasSetting
			.setName('Pattern to remove to get the alias')
			.setDesc('The pattern to remove from task filenames')
			.addTextArea(text => text
				.setPlaceholder('e.g., task-')
				.setValue(this.plugin.settings.patternToRemove)
				.onChange(async (value) => {
					this.plugin.settings.patternToRemove = value;
					await this.plugin.saveSettings();
				}));


		const patternSetting = new Setting(containerEl.createDiv({ cls: ['task-annotate-setting-container', 'task-annotate-filetask-setting-container'] }));
		patternSetting.settingEl.style.display = showFileLink ? 'flex' : 'none';

		patternSetting
			.setName('Pattern for linking task file')
			.setDesc('A pattern to link your task file with your task (the alias is the alias obtained from the previous pattern)')
			.addTextArea(text => text
				.setPlaceholder('e.g., [T::[[{filepath}|{alias}]]]')
				.setValue(this.plugin.settings.linkFormat)
				.onChange(async (value) => {
					this.plugin.settings.linkFormat = value;
					await this.plugin.saveSettings();
				}));
	}
}
