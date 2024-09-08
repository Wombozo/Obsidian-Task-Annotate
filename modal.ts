import { App, Modal, TFolder, TFile } from 'obsidian';

export class TaskAnnotateModal extends Modal {
	enableTags: boolean;
	availableTags: string[];
	selectedTags: string[] = [];
	tagsPresent: string[] = [];
	onSubmit: (selectedTags: string[], selectedFile: string) => void;
	currentStep: number;
	handleEnterKey: (event: KeyboardEvent) => void;
	selectedFilePath: string;
	taskDirectory: string;
	enableFileLink: boolean;
	linkPresent: string;

	constructor(app: App, linkPresent: string, enableFileLink: boolean, taskDirectory: string, enableTags: boolean, availableTags: string[], tagsPresent: string[], 
				onSubmit: (selectedTags: string[], selectedFile: string) => void) {
		super(app);
		this.availableTags = availableTags;
		this.tagsPresent = tagsPresent;
		this.selectedTags = [...tagsPresent];
		this.onSubmit = onSubmit;
		this.enableTags = enableTags;
		this.taskDirectory = taskDirectory;
		this.enableFileLink = enableFileLink;
		this.selectedFilePath = '';
		this.linkPresent = linkPresent;

		this.handleEnterKey = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				event.stopPropagation();
				this.close();
			}
		};
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.addClass('task-annotate');

		const modalHeader = contentEl.createEl('div', { cls: 'modal-header' });
		modalHeader.createEl('h2', { text: 'Tasks Annotate' });

		const container = contentEl.createEl('div', { cls: 'modal-container' });
		const tagsContainer = container.createEl('div', { cls: 'tags-container' });
		tagsContainer.createEl('h3', { text: 'Tags to add to the task :' });
		const ul = tagsContainer.createEl('ul', { cls: 'list-tags' });

		if (this.enableFileLink && this.enableTags) {
			container.createEl('div', { cls: 'vertical-rule'} );
		}

		const fileContainer = container.createEl('div', { cls: 'file-container' });
		fileContainer.createEl('h3', { text: 'Task file to link :' });
		const fileSelect = fileContainer.createEl('select', { cls: 'file-select' });
		const noneOption = fileSelect.createEl('option', { text: '(None)', value: '' });
		noneOption.selected = this.linkPresent === '' ? true : false;

		const footer = contentEl.createEl('div', { cls: 'modal-footer' });
		const buttonClose = footer.createEl('button', { text: 'Close' });


		buttonClose.addEventListener('click', () => this.close());

		document.addEventListener('keydown', this.handleEnterKey);

		const allTags = Array.from(new Set([...this.availableTags, ...this.tagsPresent]));

		const renderStep1 = () => {
			allTags.forEach(tag => {
				const isChecked = this.tagsPresent.includes(tag);
				const cmTag = `cm-tag-${tag.replace(/[\/#]/g, '')}`;

				const tagRow = ul.createEl('li', { cls: 'tag-list-item' });

				const checkbox = tagRow.createEl('input', { type: 'checkbox', cls: 'tag-checkbox' });
				if (isChecked) {
					checkbox.checked = true;
				}

				tagRow.createEl('span', { 
					text: '#', 
					cls: [
						cmTag,
						'hashtag-symbol', 
						'cm-formatting', 
						'cm-formatting-hashtag', 
						'cm-hashtag', 
						'cm-hashtag-begin'
					] 
				});

				tagRow.createEl('span', { 
					text: `${tag.replace(/#/g, '')}`, 
					cls: [
						'tag-label', 
						cmTag, 
						'cm-hashtag', 
						'cm-hashtag-end'
					] 
				});

				checkbox.addEventListener('change', (event: Event) => {
					const target = event.target as HTMLInputElement;
					if (target.checked) {
						this.selectedTags.push(tag);
					} else {
						this.selectedTags = this.selectedTags.filter(t => t !== tag);
					}
				});
			});

			const rootFolder = this.taskDirectory !== null ? this.taskDirectory : '';
			const folder = this.app.vault.getAbstractFileByPath(rootFolder);
			
			if (folder && folder instanceof TFolder) {
				const files = folder.children.filter(f => f instanceof TFile) as TFile[];
			
				files.forEach(file => {
					const option = fileSelect.createEl('option', { text: file.path });
					option.value = file.path;
					option.selected = file.path === this.linkPresent;
				});
			} else {
				console.error(`Root folder ${rootFolder} does not exist`);
			}
			
			fileSelect.addEventListener('change', (event: Event) => {
				this.selectedFilePath = (event.target as HTMLSelectElement).value;
				console.log(`Selected File : ${this.selectedFilePath}`);
			});
		};

		renderStep1();
		if (this.enableTags == false) {
			tagsContainer.remove();
		} if (this.enableFileLink == false) {
			fileContainer.remove();
		}
	}


	onClose() {
		// Retirer l'écouteur d'événement keydown lors de la fermeture de la modal
		document.removeEventListener('keydown', this.handleEnterKey);

		const { contentEl } = this;
		contentEl.empty();
		this.onSubmit(this.selectedTags, this.selectedFilePath);
	}
}


