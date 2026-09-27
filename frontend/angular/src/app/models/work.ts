export type TattooStyle =
	| 'fine-line'
	| 'blackwork'
	| 'floral'
	| 'red-trace'
	| 'authoral';

export interface PhotoEntity {
	url: string;
	width: number;
	height: number;
}

export interface WorkEntity {
    id: string;
    title: string;
    description: string;
    style: TattooStyle;
    photos: PhotoEntity[];
	thumbnail: PhotoEntity;
    visible: boolean;
}

export interface CreateWorkDTO {
	title: string;
	description: string;
	style: TattooStyle;
	visible: boolean;
}