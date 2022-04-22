import {
  MAX_HEIGHT,
  MAX_WIDTH,
  MIN_HEIGHT,
  MIN_WIDTH,
  MAX_SCALE,
} from "./constants";

export const clamp = (min: number, max: number, value: number) => {
  return Math.min(max, Math.max(min, value));
};

export const clampWidth = (width: number) => {
  return clamp(MIN_WIDTH, MAX_WIDTH, width);
};

export const clampHeight = (height: number) => {
  return clamp(MIN_HEIGHT, MAX_HEIGHT, height);
};

export const clampScale = (scale: number) => {
  return clamp(0, MAX_SCALE, scale);
};
