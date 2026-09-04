import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, OnDestroy, output, signal, ViewChild } from '@angular/core';
import { VisibilityToggler } from '../visibility-toggler/visibility-toggler';
import { UiInputDirective } from '../../../../../../directives/uiInputDirective';
import { FileUploadWrapper } from '../file-upload-wrapper/file-upload-wrapper';
import { UploadedFile } from '../../../../../../models/uploadedFile';
import { CreateWorkDTO, TattooStyle, WorkEntity } from '../../../../../../models/work';
import { TATTOO_STYLES } from '../../../../../../models/tattooStyles';

export type TattooStyles = typeof TATTOO_STYLES[number]['value'];

@Component({
	selector: 'app-item-popup',
	imports: [VisibilityToggler, UiInputDirective, FileUploadWrapper],
	templateUrl: './item-popup.html',
	styleUrl: './item-popup.css',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemPopup implements OnDestroy {
	tattooStyles = TATTOO_STYLES;
	isOpen = signal<boolean>(false);
	isEditing: boolean = false;

	title = signal('');
	style = signal<TattooStyle | ''>('');
	description = signal('');
	visible = signal(true);

	uploadedFiles = signal<UploadedFile[]>([]);
	@ViewChild(VisibilityToggler)visibilityToggler!: VisibilityToggler;

	createWorkEvent = output<{
		workData: CreateWorkDTO;
		files: UploadedFile[];
	}>();

	open(data?: WorkEntity) {
		this.isEditing = data !== undefined
		this.isOpen.set(true);

		this.title.set(data?.title ?? '');
		this.style.set(data?.style ?? '');
		this.description.set(data?.description ?? '');
		this.visible.set(data?.visible ?? true);

		this.uploadedFiles.set(
			data?.photosUrls.map(url => ({
				url,
				isLocal: false
			})) ?? []
		);
	}

	onFilesSelected(files: File[]) {
		const uploadedFiles = files.map(file => ({
			id: crypto.randomUUID(),
			file,
			url: URL.createObjectURL(file),
			isLocal: true
		}));

		this.uploadedFiles.update(current => [
			...current,
			...uploadedFiles
		]);
	}

	onFileRemoved(index: number) {
		this.uploadedFiles.update(files => {
			const result = [...files];
			const [removed] = result.splice(index, 1);

			if (removed?.isLocal) {
				URL.revokeObjectURL(removed.url);
			}

			return result;
		});
	}

	onFilesReordered(event: { fromIndex: number; toIndex: number; }) {
		this.uploadedFiles.update(files => {
			const result = [...files];

			const [file] = result.splice(event.fromIndex, 1);

			result.splice(event.toIndex, 0, file);

			return result;
		});
	}

	close() {
		this.isOpen.set(false);
	}

	canCreateWork(): boolean {
		return (
			this.title().trim().length > 0 &&
			this.style() !== '' &&
			this.description().trim().length > 0 &&
			this.uploadedFiles().length > 0
		);
	}

	onFilesChange(files: UploadedFile[]) {
		console.log(files)
	}

	createWork() {
		const style = this.style();

		if (!style || !this.canCreateWork()) {
			return;
		}

		this.createWorkEvent.emit({
			workData: {
				title: this.title(),
				style,
				description: this.description(),
				visible: this.visible()
			},
			files: this.uploadedFiles()
		});
	}

	toggle() {
		this.isOpen.update(value => !value);
	}

	visibilityChange(event: Event) {
		const toggler = event.target as HTMLElement & {
			active: boolean;
		};

		this.visible.set(toggler.active);
	}

	ngOnDestroy() {
		for (const file of this.uploadedFiles()) {
			if (file.isLocal) {
				URL.revokeObjectURL(file.url);
			}
		}
	}
}
