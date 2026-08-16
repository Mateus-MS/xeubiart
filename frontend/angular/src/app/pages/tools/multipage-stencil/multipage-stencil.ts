import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-multipage-stencil',
  imports: [],
  templateUrl: './multipage-stencil.html',
  styleUrl: './multipage-stencil.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MultipageStencil implements OnInit {
	constructor(private titleService: Title) {}

	ngOnInit(): void {
        this.titleService.setTitle('Xeubiart — Stencil em multiplas páginas');
	}

    onFilesChanged(event: Event) {
        const customEvent = event as CustomEvent<{ files: File[] }>;
        const files = customEvent.detail.files;

        console.log('Files received from web component:', files);
    }
}
