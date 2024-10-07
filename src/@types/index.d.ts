declare module '*.gif';
declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
declare module '*.webp';

interface Status {
	complete: boolean;
	error: boolean;
}

type ImageCount = {
	gif: number;
	jpg: number;
	png: number;
	svg: number;
	webp: number;
};

type ImageRecord = {
	key: string;
	image: HTMLImageElement;
};
