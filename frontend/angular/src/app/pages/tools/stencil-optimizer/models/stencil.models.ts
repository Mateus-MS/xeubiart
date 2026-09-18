export interface SizeConfig {
    value: number;
    flipX: boolean;
    flipY: boolean;
}

export interface CropInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface UploadedImage {
    file: File;
    originalUrl: string;
    url: string;
    sizes: SizeConfig[];
    aspectRatio: number;
    cropBox?: CropInfo;
}
