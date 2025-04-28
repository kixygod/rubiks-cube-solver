import { CubeState } from "../../../entities/cube/types";

export const applyMove = (cube: CubeState, move: string): CubeState => {
  const newCube = [...cube];

  const rotateFace = (faceStart: number, clockwise: boolean = true) => {
    const temp = [
      newCube[faceStart + 0],
      newCube[faceStart + 1],
      newCube[faceStart + 2],
      newCube[faceStart + 3],
      newCube[faceStart + 4],
      newCube[faceStart + 5],
      newCube[faceStart + 6],
      newCube[faceStart + 7],
      newCube[faceStart + 8],
    ];
    if (clockwise) {
      newCube[faceStart + 0] = temp[6];
      newCube[faceStart + 1] = temp[3];
      newCube[faceStart + 2] = temp[0];
      newCube[faceStart + 3] = temp[7];
      newCube[faceStart + 4] = temp[4];
      newCube[faceStart + 5] = temp[1];
      newCube[faceStart + 6] = temp[8];
      newCube[faceStart + 7] = temp[5];
      newCube[faceStart + 8] = temp[2];
    } else {
      newCube[faceStart + 0] = temp[2];
      newCube[faceStart + 1] = temp[5];
      newCube[faceStart + 2] = temp[8];
      newCube[faceStart + 3] = temp[1];
      newCube[faceStart + 4] = temp[4];
      newCube[faceStart + 5] = temp[7];
      newCube[faceStart + 6] = temp[0];
      newCube[faceStart + 7] = temp[3];
      newCube[faceStart + 8] = temp[6];
    }
  };

  let baseMove = move;
  let isPrime = false;
  let times = 1;

  if (move.includes("'")) {
    baseMove = move.replace("'", "");
    isPrime = true;
  } else if (move.includes("2")) {
    baseMove = move.replace("2", "");
    times = 2;
  }

  for (let i = 0; i < times; i++) {
    switch (baseMove) {
      case "U": {
        rotateFace(0, !isPrime);
        const temp = [newCube[18], newCube[19], newCube[20]];
        if (!isPrime) {
          newCube[18] = newCube[9];
          newCube[19] = newCube[10];
          newCube[20] = newCube[11];
          newCube[9] = newCube[45];
          newCube[10] = newCube[46];
          newCube[11] = newCube[47];
          newCube[45] = newCube[36];
          newCube[46] = newCube[37];
          newCube[47] = newCube[38];
          newCube[36] = temp[0];
          newCube[37] = temp[1];
          newCube[38] = temp[2];
        } else {
          newCube[18] = newCube[36];
          newCube[19] = newCube[37];
          newCube[20] = newCube[38];
          newCube[36] = newCube[45];
          newCube[37] = newCube[46];
          newCube[38] = newCube[47];
          newCube[45] = newCube[9];
          newCube[46] = newCube[10];
          newCube[47] = newCube[11];
          newCube[9] = temp[0];
          newCube[10] = temp[1];
          newCube[11] = temp[2];
        }
        break;
      }
      case "D": {
        rotateFace(27, !isPrime);
        const temp = [newCube[24], newCube[25], newCube[26]];
        if (!isPrime) {
          newCube[24] = newCube[42];
          newCube[25] = newCube[43];
          newCube[26] = newCube[44];
          newCube[42] = newCube[51];
          newCube[43] = newCube[52];
          newCube[44] = newCube[53];
          newCube[51] = newCube[15];
          newCube[52] = newCube[16];
          newCube[53] = newCube[17];
          newCube[15] = temp[0];
          newCube[16] = temp[1];
          newCube[17] = temp[2];
        } else {
          newCube[24] = newCube[15];
          newCube[25] = newCube[16];
          newCube[26] = newCube[17];
          newCube[15] = newCube[51];
          newCube[16] = newCube[52];
          newCube[17] = newCube[53];
          newCube[51] = newCube[42];
          newCube[52] = newCube[43];
          newCube[53] = newCube[44];
          newCube[42] = temp[0];
          newCube[43] = temp[1];
          newCube[44] = temp[2];
        }
        break;
      }
      case "L": {
        rotateFace(36, !isPrime);
        const temp = [newCube[0], newCube[3], newCube[6]];
        if (!isPrime) {
          newCube[0] = newCube[53];
          newCube[3] = newCube[50];
          newCube[6] = newCube[47];
          newCube[47] = newCube[33];
          newCube[50] = newCube[30];
          newCube[53] = newCube[27];
          newCube[27] = newCube[18];
          newCube[30] = newCube[21];
          newCube[33] = newCube[24];
          newCube[18] = temp[0];
          newCube[21] = temp[1];
          newCube[24] = temp[2];
        } else {
          newCube[0] = newCube[18];
          newCube[3] = newCube[21];
          newCube[6] = newCube[24];
          newCube[18] = newCube[27];
          newCube[21] = newCube[30];
          newCube[24] = newCube[33];
          newCube[27] = newCube[53];
          newCube[30] = newCube[50];
          newCube[33] = newCube[47];
          newCube[47] = temp[2];
          newCube[50] = temp[1];
          newCube[53] = temp[0];
        }
        break;
      }
      case "R": {
        rotateFace(9, !isPrime);
        const temp = [newCube[2], newCube[5], newCube[8]];
        if (!isPrime) {
          newCube[2] = newCube[20];
          newCube[5] = newCube[23];
          newCube[8] = newCube[26];
          newCube[20] = newCube[29];
          newCube[23] = newCube[32];
          newCube[26] = newCube[35];
          newCube[29] = newCube[51];
          newCube[32] = newCube[48];
          newCube[35] = newCube[45];
          newCube[45] = temp[2];
          newCube[48] = temp[1];
          newCube[51] = temp[0];
        } else {
          newCube[2] = newCube[51];
          newCube[5] = newCube[48];
          newCube[8] = newCube[45];
          newCube[45] = newCube[35];
          newCube[48] = newCube[32];
          newCube[51] = newCube[29];
          newCube[29] = newCube[20];
          newCube[32] = newCube[23];
          newCube[35] = newCube[26];
          newCube[20] = temp[0];
          newCube[23] = temp[1];
          newCube[26] = temp[2];
        }
        break;
      }
      case "F": {
        rotateFace(18, !isPrime);
        const temp = [newCube[6], newCube[7], newCube[8]];
        if (!isPrime) {
          newCube[6] = newCube[44];
          newCube[7] = newCube[41];
          newCube[8] = newCube[38];
          newCube[38] = newCube[27];
          newCube[41] = newCube[28];
          newCube[44] = newCube[29];
          newCube[27] = newCube[15];
          newCube[28] = newCube[12];
          newCube[29] = newCube[9];
          newCube[9] = temp[0];
          newCube[12] = temp[1];
          newCube[15] = temp[2];
        } else {
          newCube[6] = newCube[9];
          newCube[7] = newCube[12];
          newCube[8] = newCube[15];
          newCube[9] = newCube[29];
          newCube[12] = newCube[28];
          newCube[15] = newCube[27];
          newCube[27] = newCube[38];
          newCube[28] = newCube[41];
          newCube[29] = newCube[44];
          newCube[38] = temp[2];
          newCube[41] = temp[1];
          newCube[44] = temp[0];
        }
        break;
      }
      case "B": {
        rotateFace(45, !isPrime);
        const temp = [newCube[0], newCube[1], newCube[2]];
        if (!isPrime) {
          newCube[0] = newCube[11];
          newCube[1] = newCube[14];
          newCube[2] = newCube[17];
          newCube[11] = newCube[35];
          newCube[14] = newCube[34];
          newCube[17] = newCube[33];
          newCube[33] = newCube[36];
          newCube[34] = newCube[39];
          newCube[35] = newCube[42];
          newCube[36] = temp[2];
          newCube[39] = temp[1];
          newCube[42] = temp[0];
        } else {
          newCube[0] = newCube[42];
          newCube[1] = newCube[39];
          newCube[2] = newCube[36];
          newCube[36] = newCube[33];
          newCube[39] = newCube[34];
          newCube[42] = newCube[35];
          newCube[33] = newCube[17];
          newCube[34] = newCube[14];
          newCube[35] = newCube[11];
          newCube[11] = temp[0];
          newCube[14] = temp[1];
          newCube[17] = temp[2];
        }
        break;
      }
      default:
        console.warn(`Unknown move: ${baseMove}`);
        break;
    }
  }

  return newCube;
};
