import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Page } from '../../../../../../models/page';
import { WorkEntity } from '../../../../../../models/work';
import { Subject } from 'rxjs';
import { UploadedFile } from '../../../../../../models/uploadedFile';

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

        this.http.get<Page<WorkEntity>>('/api/admin/works', {
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

    createWork(workData: Partial<WorkEntity>, files: UploadedFile[]) {
        const formData = new FormData();

        formData.append('title', workData.title ?? '');
        formData.append('style', workData.style ?? '');
        formData.append('description', workData.description ?? '');
        formData.append('visible', String(workData.visible ?? true));

        for (const item of files) {
            formData.append('images', item.file!, item.file!.name);
        }

        return this.http.post('/api/works', formData);
    }
    
    setVisibilityQueryMode(state: VisibilityQueryMode) {
        this._visibilityQueryMode.set(state);
    }

    updateWork(id: string, workData: Partial<WorkEntity>, files: UploadedFile[]) {
        const formData = new FormData();

        // Append the files order so backend can maintain the order of uploaded files
        const photos = files.map(file => {
            if (file.isLocal) {
                return {
                    type: 'new',
                    value: file.id
                };
            }

            return {
                type: 'existing',
                value: file.id
            };
        });

        const data = {
            ...workData,
            photos
        };

        formData.append(
            'data',
            new Blob(
                [JSON.stringify(data)],
                { type: 'application/json' }
            )
        );

        for (const item of files) {
            if(item.isLocal && item.file && item.id){
                formData.append('images', item.file, `${item.id}__${item.file.name}`);
            }
        }

        return this.http.patch(`/api/works/${id}`, formData);
    }

    updateWorkVisibility(id: string, visible: boolean) {
        const formData = new FormData();

        const data = { visible };

        formData.append(
            'data',
            new Blob(
                [JSON.stringify(data)],
                { type: 'application/json' }
            )
        );

        return this.http.patch(`/api/works/${id}`, formData);
    }
}
