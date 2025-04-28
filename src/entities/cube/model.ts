import { COLORS, CENTER_INDICES } from "./constants";
import { CubeState } from "./types";

export const initCube = (): CubeState => {
  const newCube = new Array(54).fill("#000000");
  for (let i = 0; i < 9; i++) newCube[i] = COLORS[0];
  for (let i = 9; i < 18; i++) newCube[i] = COLORS[1];
  for (let i = 18; i < 27; i++) newCube[i] = COLORS[2];
  for (let i = 27; i < 36; i++) newCube[i] = COLORS[3];
  for (let i = 36; i < 45; i++) newCube[i] = COLORS[4];
  for (let i = 45; i < 54; i++) newCube[i] = COLORS[5];
  return newCube;
};

export const isCubeSolved = (cube: CubeState): boolean => {
  const faceRanges = [
    { start: 0, end: 9, center: CENTER_INDICES[0] },
    { start: 9, end: 18, center: CENTER_INDICES[1] },
    { start: 18, end: 27, center: CENTER_INDICES[2] },
    { start: 27, end: 36, center: CENTER_INDICES[3] },
    { start: 36, end: 45, center: CENTER_INDICES[4] },
    { start: 45, end: 54, center: CENTER_INDICES[5] },
  ];

  for (const { start, end, center } of faceRanges) {
    const centerColor = cube[center];
    for (let i = start; i < end; i++) {
      if (cube[i] !== centerColor) {
        return false;
      }
    }
  }
  return true;
};
