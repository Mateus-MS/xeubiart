export type TattooStyle =
	| 'fine-line'
	| 'blackwork'
	| 'floral'
	| 'red-trace'
	| 'authoral';

export interface WorkEntity {
    id: string;
    title: string;
    description: string;
    style: TattooStyle;
    photosURLs: string[];
    visible: boolean;
}

export interface CreateWorkDTO {
	title: string;
	description: string;
	style: TattooStyle;
	visible: boolean;
}