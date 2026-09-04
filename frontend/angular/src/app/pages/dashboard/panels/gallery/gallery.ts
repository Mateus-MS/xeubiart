import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ItemPopup } from './components/item-popup/item-popup';
import { ItemCard } from './components/item-card/item-card';
import { GalleryService, VisibilityQueryMode } from '../../../../services/gallery.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UploadedFile } from '../../../../models/uploadedFile';
import { CreateWorkDTO, WorkEntity } from '../../../../models/work';

@Component({
	selector: 'app-gallery',
	imports: [ItemPopup, ItemCard],
	templateUrl: './gallery.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Gallery implements OnInit {
	private popup = viewChild(ItemPopup);

	private galleryService = inject(GalleryService);
	private destroyRef = inject(DestroyRef);
	
	works = this.galleryService.works;

	ngOnInit() {
        this.galleryService.loadWorks();

		this.galleryService.createWork$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.popup()?.close();
                this.galleryService.loadWorks();
            });
    }

	openChildPopup() {
		this.popup()?.open();
	}

	handleVisibilityStateChange(event: Event) {
		const { activeTab } = (event as CustomEvent<{ activeTab: VisibilityQueryMode }>).detail;

		this.galleryService.setVisibilityQueryMode(activeTab);

		this.galleryService.loadWorks();
	}

	handleUpdateVisibility(event: { id: string; visible: boolean }) {
		this.galleryService.updateWorkVisibility(event.id, event.visible);
	}

	handleCreateWork(event: {workData: CreateWorkDTO; files: UploadedFile[];}) {
		this.galleryService.createWork(event.workData, event.files)
			.subscribe({
				next: () => {
					this.popup()?.close();
					this.galleryService.loadWorks();
				},
				error: error => {
					console.error('Create work failed:', error);
				}
			});
	}

	handleOpenEditPopup(work: WorkEntity) {
		this.popup()?.open(work);
	}
}
