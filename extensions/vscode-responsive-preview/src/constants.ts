export enum DEVICES {
	CUSTOM = "custom",
	MOBILE = "mobile",
	TABLET = "tablet",
	HD = "hd",
	FHD = "fhd",
}

export const BUNDLER_URL =
	process.env.BUNDLER_URL || "https://www.hackerrank.com/";

export const DEVICE_TO_NAME = Object({
	[DEVICES.CUSTOM]: "Custom",
	[DEVICES.MOBILE]: "Mobile",
	[DEVICES.TABLET]: "Tablet",
	[DEVICES.HD]: "Desktop (HD)",
	[DEVICES.FHD]: "Desktop (Full HD)",
});

export const DEVICE_TO_DIMENSIONS = Object.freeze({
	[DEVICES.MOBILE]: { w: 375, h: 812 },
	[DEVICES.TABLET]: { w: 768, h: 1024 },
	[DEVICES.HD]: { w: 1280, h: 720 },
	[DEVICES.FHD]: { w: 1920, h: 1080 },
});

export const RESIZER_THICKNESS = 6;
export const RESIZER_LENGTH = 48;
export const CORNER_RESIZER_SIZE = 8;

export const PADDING_HORIZONTAL = 2 * (8 + RESIZER_THICKNESS + 8);
export const PADDING_VERTICAL = 8 + RESIZER_THICKNESS + 8;

export const MAX_WIDTH = 9999;
export const MAX_HEIGHT = 9999;
export const MIN_HEIGHT = 0;
export const MIN_WIDTH = 0;

export const MAX_SCALE = 1;
