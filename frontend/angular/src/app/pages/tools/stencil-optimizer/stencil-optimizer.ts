import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-stencil-optimizer',
  imports: [],
  templateUrl: './stencil-optimizer.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StencilOptimizer {
    selectedTab: string = 'Imagens';

    handleTabChange(event: Event) {
		const customEvent = event as CustomEvent;

		console.log('Selected Tab:', customEvent.detail.activeTab);

		this.selectedTab = customEvent.detail.activeTab;
    }
}
