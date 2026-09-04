import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { WorkEntity } from '../../../../../../models/work';
import { TATTOO_STYLES } from '../../../../../../models/tattooStyles';

@Component({
	selector: 'app-item-card',
	imports: [],
	templateUrl: './item-card.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemCard {
	work = input.required<WorkEntity>();

	visibilityChange = output<{ id: string; visible: boolean }>();
	openEditPopup = output<WorkEntity>();

	handleVisibilityChange(event: Event) {
		const { state } = (event as CustomEvent<{ state: boolean }>).detail;

		this.visibilityChange.emit({
			id: this.work().id,
			visible: state
		});
	}

	handleEditClick() {
		this.openEditPopup.emit(this.work());
	}

	getStyleLabel(style: string): string {
        return TATTOO_STYLES.find(
            item => item.value === style
        )?.label ?? style;
    }
}
