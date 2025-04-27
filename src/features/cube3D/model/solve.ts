import { COLORS } from "../../../entities/cube/constants";
import { CubeState } from "../../../entities/cube/types";

export const getScrambleString = (cube: CubeState): string => {
  const colorMapping: Record<string, string> = {
    [COLORS[0]]: "U",
    [COLORS[1]]: "R",
    [COLORS[2]]: "F",
    [COLORS[3]]: "D",
    [COLORS[4]]: "L",
    [COLORS[5]]: "B",
  };

  const scramble = cube.map((color) => colorMapping[color]).join("");
  console.log("Generated scramble string:", scramble);
  return scramble;
};

export const sendScrambleToBackend = async (
  cube: CubeState
): Promise<string | null> => {
  const scramble = getScrambleString(cube);

  if (scramble.length !== 54) {
    console.error("Invalid scramble string:", scramble);
    return null;
  }

  try {
    const response = await fetch("http://localhost:5000/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cube: scramble }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Solution:", data.solution);
      return data.solution;
    } else {
      console.error("Error solving cube:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
};
