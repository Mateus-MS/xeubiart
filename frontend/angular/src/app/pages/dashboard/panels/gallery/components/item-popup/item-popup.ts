import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, OnDestroy, signal } from '@angular/core';
import { VisibilityToggler } from '../visibility-toggler/visibility-toggler';
import { UiInputDirective } from '../../../../../../directives/uiInputDirective';
import { FileUploadWrapper } from '../file-upload-wrapper/file-upload-wrapper';

export const TATTOO_STYLES = [
    { value: 'fine-line', label: 'Fine Line' },
    { value: 'blackwork', label: 'Blackwork' },
    { value: 'floral', label: 'Floral' },
    { value: 'red-trace', label: 'Red Trace' },
    { value: 'authoral', label: 'Autorais' },
] as const;

export type TattooStyle = typeof TATTOO_STYLES[number]['value'];

@Component({
	selector: 'app-item-popup',
	imports: [VisibilityToggler, UiInputDirective, FileUploadWrapper],
	templateUrl: './item-popup.html',
	styleUrl: './item-popup.css',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemPopup {
	tattooStyles = TATTOO_STYLES;
	isOpen = signal<boolean>(false);

	title = signal('');
	style = signal<TattooStyle | ''>('');
	description = signal('');

	

	constructor() {
		effect(() => {
			console.log({
				title: this.title(),
				style: this.style(),
				description: this.description(),
			});
		});
	}

	open() {
		this.isOpen.set(true);
	}

	close() {
		this.isOpen.set(false);
	}

	makeRequest(){
		console.log()
	}

	toggle() {
		this.isOpen.update(value => !value);
	}
}
