import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
	selector: 'app-visibility-toggler',
	imports: [],
	templateUrl: './visibility-toggler.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisibilityToggler {
  	isActive = true;

	onTogglerChange(event: Event) {
        const toggler = event.target as HTMLElement & {
            active: boolean;
        };

        this.isActive = toggler.active;
    }
}
