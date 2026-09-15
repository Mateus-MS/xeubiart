import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ItemPopup } from './components/item-popup/item-popup';
import { ItemCard } from './components/item-card/item-card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GalleryService, VisibilityQueryMode } from './services/gallery.service';
import { WorkEntity } from '../../../../../models/work';
import { UploadedFile } from '../../../../../models/uploadedFile';

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
		this.galleryService.updateWorkVisibility(event.id, event.visible)?.subscribe({
			next: () => {
				this.galleryService.loadWorks();
			},
			error: error => {
				console.error('Visibility update failed', error);
			}
		});
	}

	handleSubmitWork(event: {isEditing: boolean; workData: Partial<WorkEntity>; files: UploadedFile[];}) {
		if(event.isEditing){
			this.galleryService.updateWork(event.workData.id ?? '', event.workData, event.files).subscribe({
				next: () => {
					this.popup()?.close();
					this.galleryService.loadWorks();
				},
				error: error => {
					console.error('Update failed', error);
				}
			});
		}else{
			this.galleryService.createWork(event.workData, event.files).subscribe({
				next: () => {
					this.popup()?.close();
					this.galleryService.loadWorks();
				},
				error: error => {
					console.error('Update failed', error);
				}
			});
		}
	}

	handleOpenEditPopup(work: WorkEntity) {
		console.log("Work ID: ", work.id)
		this.popup()?.open(work);
	}
}
