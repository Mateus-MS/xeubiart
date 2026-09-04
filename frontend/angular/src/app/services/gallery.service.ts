import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Page } from '../models/page';
import { CreateWorkDTO, WorkEntity } from '../models/work';
import { Subject } from 'rxjs';
import { UploadedFile } from '../models/uploadedFile';

export type VisibilityQueryMode = 'visible' | 'hidden' | 'all';

@Service()
export class GalleryService {
    private readonly _works = signal<WorkEntity[]>([]);
    readonly works = this._works.asReadonly();

    private readonly _visibilityQueryMode = signal<VisibilityQueryMode>('all');
    readonly visibilityQueryMode = this._visibilityQueryMode.asReadonly();

    private readonly _createWork = new Subject<void>();
    readonly createWork$ = this._createWork.asObservable();

    private http = inject(HttpClient);

    loadWorks() {
        const visibility = this._visibilityQueryMode();

        this.http.get<Page<WorkEntity>>('/api/work', {
            params: visibility !== 'all'
                ? { visible: visibility === 'visible' }
                : {}
        }).subscribe({
            next: (response) => {
                this._works.set(response.content);
            },
            error: (error) => {
                console.error('Error loading works:', error);
            }
        });
    }

    createWork(workData: CreateWorkDTO, files: UploadedFile[]) {
        const formData = new FormData();

        formData.append('title', workData.title);
        formData.append('style', workData.style);
        formData.append('description', workData.description);
        formData.append('visible', String(workData.visible));

        for (const item of files) {
            formData.append('images', item.file!, item.file!.name);
        }

        return this.http.post('/api/work', formData);
    }
    
    setVisibilityQueryMode(state: VisibilityQueryMode) {
        this._visibilityQueryMode.set(state);
    }

    updateWorkVisibility(id: string, visible: boolean) {
        const formData = new FormData();
        formData.append('visible', String(visible));

        this.http.patch(`/api/work/${id}`, formData).subscribe({
            next: () => {
                const updatedWorks = this._works().map(work =>
                    work.id === id
                        ? { ...work, visible }
                        : work
                );

                this._works.set(updatedWorks);
            },
            error: error => {
                console.error(
                    `Error updating visibility for work ${id}:`,
                    error
                );
            }
        });
    }
}
