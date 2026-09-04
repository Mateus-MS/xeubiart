import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';

@Component({
	selector: 'app-visibility-toggler',
	imports: [],
	templateUrl: './visibility-toggler.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisibilityToggler {
    isActive = input(true);

    isActiveChange = output<boolean>();

    onTogglerChange(event: Event) {
        const toggler = event.target as HTMLElement & {
            active: boolean;
        };

        this.isActiveChange.emit(toggler.active);
    }
}