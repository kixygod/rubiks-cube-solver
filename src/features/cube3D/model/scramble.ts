import { initCube } from "../../../entities/cube/model";
import { CubeState } from "../../../entities/cube/types";

import { applyMove } from "./applyMove";

const getRandomMove = (): string => {
  const moves = ["U", "D", "L", "R", "F", "B"];
  const directions = ["", "'", "2"];
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  const randomDirection =
    directions[Math.floor(Math.random() * directions.length)];
  return randomMove + randomDirection;
};

export const generateScramble = (length = 15): string[] => {
  const scramble = [];
  let previousMove = "";

  for (let i = 0; i < length; i++) {
    let move = getRandomMove();
    while (move[0] === previousMove[0]) {
      move = getRandomMove();
    }
    scramble.push(move);
    previousMove = move;
  }

  return scramble;
};

export const applyScramble = (): CubeState => {
  const scrambleMoves = generateScramble();
  let newCube = initCube();
  scrambleMoves.forEach((move) => {
    newCube = applyMove(newCube, move);
  });
  return newCube;
};
