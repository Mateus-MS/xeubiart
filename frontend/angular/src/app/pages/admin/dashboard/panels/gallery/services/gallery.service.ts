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
    private page: number = 0;

    readonly  isLoading = signal<boolean>(false);
  	private hasMore = signal<boolean>(true);

    loadWorks() {
        if(!this.canRequest()) return;

        const visibility = this._visibilityQueryMode();

        this.isLoading.set(true);

        this.http.get<Page<WorkEntity>>(`/api/admin/works?page=${this.page}&size=12`, {
            params: visibility !== 'all'
                ? { visible: visibility === 'visible' }
                : {}
        }).subscribe({
            next: (response) => {
                this._works.update((currentWorks) => [...currentWorks, ...response.content]);

                this.isLoading.set(false);
                this.hasMore.set(!response.last);
                this.page ++;
                console.log("Next page queried will be: " + this.page)
            },
            error: (error) => {
                this.isLoading.set(false);
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

    canRequest():boolean{
        return this.hasMore() && !this.isLoading();
    }

    resetPage(){
        this.page = 0;
        this._works.set([]);
        this.isLoading.set(false);
        this.hasMore.set(true);
    }
}
