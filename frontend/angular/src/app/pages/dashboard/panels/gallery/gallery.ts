import { Component, CUSTOM_ELEMENTS_SCHEMA, viewChild } from '@angular/core';
import { ItemPopup } from './frags/item-popup/item-popup';

@Component({
	selector: 'app-gallery',
	imports: [ItemPopup],
	templateUrl: './gallery.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Gallery {
	popup = viewChild(ItemPopup);

	openChildPopup() {
		this.popup()?.open();
	}

	handleVisibilityStateChange(event: Event){
		console.log(event)
	}
}
