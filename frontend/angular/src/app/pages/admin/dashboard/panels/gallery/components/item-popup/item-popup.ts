import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, output, signal } from '@angular/core';
import { VisibilityToggler } from '../visibility-toggler/visibility-toggler';
import { UiInputDirective } from '../../../../../../../directives/uiInputDirective';
import { FileUploadWrapper } from '../file-upload-wrapper/file-upload-wrapper';
import { UploadedFile } from '../../../../../../../models/uploadedFile';
import { TattooStyle, WorkEntity } from '../../../../../../../models/work';
import { TATTOO_STYLES } from '../../../../../../../models/tattooStyles';

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
	id: string = '';

	private initialState: {
		title: string;
		style: TattooStyle | '';
		description: string;
		visible: boolean;
		files: UploadedFile[];
	} | null = null;

	uploadedFiles = signal<UploadedFile[]>([]);

	submitWorkEvent = output<{
		isEditing: boolean;
		workData: Partial<WorkEntity>;
		files: UploadedFile[];
	}>();

	open(data?: WorkEntity) {
		this.isEditing = data !== undefined;
		this.isOpen.set(true);

		this.title.set(data?.title ?? '');
		this.style.set(data?.style ?? '');
		this.description.set(data?.description ?? '');
		this.visible.set(data?.visible ?? true);
		this.id = data?.id ?? '';

		const files: UploadedFile[] = (data?.photos ?? []).map(photo => ({
			id: photo.url,
			url: photo.url,
			isLocal: false
		}));

		this.uploadedFiles.set(files);

		if (this.isEditing) {
			this.initialState = {
				title: this.title(),
				style: this.style(),
				description: this.description(),
				visible: this.visible(),
				files: structuredClone(files)
			};
		} else {
			this.initialState = null;
		}
	}

	hasChanges(): boolean {
    	if (!this.isEditing || !this.initialState) {
			return false;
		}

		return (
			this.title() !== this.initialState.title ||
			this.style() !== this.initialState.style ||
			this.description() !== this.initialState.description ||
			this.visible() !== this.initialState.visible ||
			!this.areFilesEqual(this.uploadedFiles(), this.initialState.files)
		);
	}

	private areFilesEqual(current: UploadedFile[], initial: UploadedFile[]): boolean {
		if (current.length !== initial.length) {
			return false;
		}

		return current.every((file, index) => {
			return file.id === initial[index].id;
		});
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

	close(askConfirmation: boolean = false) {
		if (askConfirmation && this.hasChanges()) {
			const confirmed = window.confirm(
				'You have unsaved changes. Are you sure you want to close?'
			);

			if (!confirmed) {
				return;
			}
		}

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

	submitWork() {
		const style = this.style();

		if (!style || !this.canCreateWork()) {
			return;
		}

		this.submitWorkEvent.emit({
			isEditing: this.isEditing,
			workData: {
				id: this.id,
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
