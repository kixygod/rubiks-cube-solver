import { useState } from "react";
import styles from "./Cube3D.module.css";

const COLORS = [
  "#FFFFFF",
  "#0045AD",
  "#B90000",
  "#FFD500",
  "#009B48",
  "#FF5900",
];

const CENTER_INDICES = [4, 13, 22, 31, 40, 49];

const LOCAL_STORAGE_KEY = "rubiks-cube-scramble";

const getRandomMove = () => {
  const moves = ["U", "D", "L", "R", "F", "B"];
  const directions = ["", "'", "2"];
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  const randomDirection =
    directions[Math.floor(Math.random() * directions.length)];
  return randomMove + randomDirection;
};

const generateScramble = (length = 15) => {
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

const applyMove = (cube: string[], move: string) => {
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
          // Front
          newCube[18] = newCube[9];
          newCube[19] = newCube[10];
          newCube[20] = newCube[11];

          // Right
          newCube[9] = newCube[45];
          newCube[10] = newCube[46];
          newCube[11] = newCube[47];

          // Back
          newCube[45] = newCube[36];
          newCube[46] = newCube[37];
          newCube[47] = newCube[38];

          // Left
          newCube[36] = temp[0];
          newCube[37] = temp[1];
          newCube[38] = temp[2];
        } else {
          // Front
          newCube[18] = newCube[36];
          newCube[19] = newCube[37];
          newCube[20] = newCube[38];

          // Left
          newCube[36] = newCube[45];
          newCube[37] = newCube[46];
          newCube[38] = newCube[47];

          // Back
          newCube[45] = newCube[9];
          newCube[46] = newCube[10];
          newCube[47] = newCube[11];

          // Right
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
          // Front
          newCube[24] = newCube[42];
          newCube[25] = newCube[43];
          newCube[26] = newCube[44];

          // Left
          newCube[42] = newCube[51];
          newCube[43] = newCube[52];
          newCube[44] = newCube[53];

          // Back
          newCube[51] = newCube[15];
          newCube[52] = newCube[16];
          newCube[53] = newCube[17];

          // Right
          newCube[15] = temp[0];
          newCube[16] = temp[1];
          newCube[17] = temp[2];
        } else {
          // Front
          newCube[24] = newCube[15];
          newCube[25] = newCube[16];
          newCube[26] = newCube[17];

          // Right
          newCube[15] = newCube[51];
          newCube[16] = newCube[52];
          newCube[17] = newCube[53];

          // Back
          newCube[51] = newCube[42];
          newCube[52] = newCube[43];
          newCube[53] = newCube[44];

          // Left
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
          // Up
          newCube[0] = newCube[53];
          newCube[3] = newCube[50];
          newCube[6] = newCube[47];

          // Back
          newCube[47] = newCube[33];
          newCube[50] = newCube[30];
          newCube[53] = newCube[27];

          // Down
          newCube[27] = newCube[18];
          newCube[30] = newCube[21];
          newCube[33] = newCube[24];

          // Front
          newCube[18] = temp[0];
          newCube[21] = temp[1];
          newCube[24] = temp[2];
        } else {
          // Up
          newCube[0] = newCube[18];
          newCube[3] = newCube[21];
          newCube[6] = newCube[24];

          // Front
          newCube[18] = newCube[27];
          newCube[21] = newCube[30];
          newCube[24] = newCube[33];

          // Down
          newCube[27] = newCube[53];
          newCube[30] = newCube[50];
          newCube[33] = newCube[47];

          // Back
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
          // Up
          newCube[2] = newCube[20];
          newCube[5] = newCube[23];
          newCube[8] = newCube[26];

          //Front
          newCube[20] = newCube[29];
          newCube[23] = newCube[32];
          newCube[26] = newCube[35];

          // Down
          newCube[29] = newCube[51];
          newCube[32] = newCube[48];
          newCube[35] = newCube[45];

          // Back
          newCube[45] = temp[2];
          newCube[48] = temp[1];
          newCube[51] = temp[0];
        } else {
          // Up
          newCube[2] = newCube[51];
          newCube[5] = newCube[48];
          newCube[8] = newCube[45];

          // Back
          newCube[45] = newCube[35];
          newCube[48] = newCube[32];
          newCube[51] = newCube[29];

          // Down
          newCube[29] = newCube[20];
          newCube[32] = newCube[23];
          newCube[35] = newCube[26];

          // Front
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
          // Up
          newCube[6] = newCube[44];
          newCube[7] = newCube[41];
          newCube[8] = newCube[38];

          // Left
          newCube[38] = newCube[27];
          newCube[41] = newCube[28];
          newCube[44] = newCube[29];

          // Down
          newCube[27] = newCube[15];
          newCube[28] = newCube[12];
          newCube[29] = newCube[9];

          // Right
          newCube[9] = temp[0];
          newCube[12] = temp[1];
          newCube[15] = temp[2];
        } else {
          // Up
          newCube[6] = newCube[9];
          newCube[7] = newCube[12];
          newCube[8] = newCube[15];

          // Right
          newCube[9] = newCube[29];
          newCube[12] = newCube[28];
          newCube[15] = newCube[27];

          // Down
          newCube[27] = newCube[38];
          newCube[28] = newCube[41];
          newCube[29] = newCube[44];

          // Left
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
          // Up
          newCube[0] = newCube[11];
          newCube[1] = newCube[14];
          newCube[2] = newCube[17];

          // Right
          newCube[11] = newCube[35];
          newCube[14] = newCube[34];
          newCube[17] = newCube[33];

          // Down
          newCube[33] = newCube[36];
          newCube[34] = newCube[39];
          newCube[35] = newCube[42];

          // Left
          newCube[36] = temp[2];
          newCube[39] = temp[1];
          newCube[42] = temp[0];
        } else {
          // Up
          newCube[0] = newCube[42];
          newCube[1] = newCube[39];
          newCube[2] = newCube[36];

          // Left
          newCube[36] = newCube[33];
          newCube[39] = newCube[34];
          newCube[42] = newCube[35];

          // Down
          newCube[33] = newCube[17];
          newCube[34] = newCube[14];
          newCube[35] = newCube[11];

          // Right
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

export const Cube3D = () => {
  const [cube, setCube] = useState<string[]>(() => {
    const newCube = new Array(54).fill("#000000");

    for (let i = 0; i < 9; i++) newCube[i] = "#FFFFFF";

    for (let i = 9; i < 18; i++) newCube[i] = "#0045AD";

    for (let i = 18; i < 27; i++) newCube[i] = "#B90000";

    for (let i = 27; i < 36; i++) newCube[i] = "#FFD500";

    for (let i = 36; i < 45; i++) newCube[i] = "#009B48";

    for (let i = 45; i < 54; i++) newCube[i] = "#FF5900";
    return newCube;
  });

  const [selectedColor, setSelectedColor] = useState<string>("#B90000");
  const [rotation, setRotation] = useState({ x: -22, y: -38, z: 0 });
  const [solution, setSolution] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(true);
  const [hoveredStickerIndex, setHoveredStickerIndex] = useState<number | null>(
    null
  );

  const handleMove = (move: string) => {
    setCube(applyMove(cube, move));
    setIsSolved(false);
  };

  const isCubeSolved = (cube: string[]) => {
    const faceRanges = [
      { start: 0, end: 9, center: 4 },
      { start: 9, end: 18, center: 13 },
      { start: 18, end: 27, center: 22 },
      { start: 27, end: 36, center: 31 },
      { start: 36, end: 45, center: 40 },
      { start: 45, end: 54, center: 49 },
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

  const handleStickerClick = (index: number) => {
    if (CENTER_INDICES.includes(index)) return;
    const newCube = [...cube];
    newCube[index] = selectedColor;
    setCube(newCube);
    setIsSolved(false);
  };

  const rotateCube = (axis: "x" | "y" | "z", angle: number) => {
    setRotation((prev) => ({
      ...prev,
      [axis]: prev[axis] + angle,
    }));
  };

  const getScrambleString = (cube: string[]) => {
    const colorMapping: Record<string, string> = {
      "#FFFFFF": "U",
      "#0045AD": "R",
      "#B90000": "F",
      "#FFD500": "D",
      "#009B48": "L",
      "#FF5900": "B",
    };

    const scramble = cube.map((color) => colorMapping[color]).join("");
    console.log("Generated scramble string:", scramble);
    return scramble;
  };

  const sendScrambleToBackend = async (cube: string[]) => {
    const scramble = getScrambleString(cube);

    if (scramble.length !== 54) {
      console.error("Invalid scramble string:", scramble);
      return;
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
        setSolution(data.solution);
      } else {
        console.error("Error solving cube:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleScrambleClick = () => {
    const scrambleMoves = generateScramble();
    console.log("Generated scramble moves:", scrambleMoves);

    let newCube = new Array(54).fill("#000000");
    for (let i = 0; i < 9; i++) newCube[i] = "#FFFFFF";
    for (let i = 9; i < 18; i++) newCube[i] = "#0045AD";
    for (let i = 18; i < 27; i++) newCube[i] = "#B90000";
    for (let i = 27; i < 36; i++) newCube[i] = "#FFD500";
    for (let i = 36; i < 45; i++) newCube[i] = "#009B48";
    for (let i = 45; i < 54; i++) newCube[i] = "#FF5900";

    scrambleMoves.forEach((move) => {
      console.log(`Performing move: ${move}`);
      newCube = applyMove(newCube, move);
    });

    setCube(newCube);
    setIsSolved(false);
  };

  const handleSolveClick = () => {
    if (isSolved || isCubeSolved(cube)) {
      alert("Кубик уже собран или не был изменён! Пожалуйста, запутайте его.");
    } else {
      sendScrambleToBackend(cube);
    }
  };

  const handleResetClick = () => {
    const newCube = new Array(54).fill("#000000");
    for (let i = 0; i < 9; i++) newCube[i] = "#FFFFFF";
    for (let i = 9; i < 18; i++) newCube[i] = "#0045AD";
    for (let i = 18; i < 27; i++) newCube[i] = "#B90000";
    for (let i = 27; i < 36; i++) newCube[i] = "#FFD500";
    for (let i = 36; i < 45; i++) newCube[i] = "#009B48";
    for (let i = 45; i < 54; i++) newCube[i] = "#FF5900";
    setCube(newCube);
    setIsSolved(true);
  };

  const handleSaveClick = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cube));
    alert("Скрамбл сохранён!");
  };

  const handleLoadClick = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 54) {
        setCube(parsed);
      } else {
        alert("Сохранённый скрамбл повреждён.");
      }
    } else {
      alert("Скрамбл не найден.");
    }
  };

  const renderFace = (start: number, faceClass: string) => (
    <div className={`${styles.face} ${styles[faceClass]}`}>
      {cube.slice(start, start + 9).map((color, idx) => {
        const index = start + idx;
        return (
          <div
            key={index}
            className={styles.sticker}
            style={{ backgroundColor: color }}
            onClick={() => handleStickerClick(index)}
            onMouseEnter={() => setHoveredStickerIndex(index)}
            onMouseLeave={() => setHoveredStickerIndex(null)}
          >
            {hoveredStickerIndex === index && selectedColor && (
              <div
                className={styles.colorIndicator}
                style={{ backgroundColor: selectedColor }}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.cubeWrapper}>
        <div
          className={styles.cube}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
          }}
        >
          {renderFace(0, "up")} {/* U: white */}
          {renderFace(9, "right")} {/* R: blue */}
          {renderFace(18, "front")} {/* F: red */}
          {renderFace(27, "down")} {/* D: yellow */}
          {renderFace(36, "left")} {/* L: green */}
          {renderFace(45, "back")} {/* B: orange */}
        </div>
      </div>
      <div className={styles.rotationButtons}>
        <button onClick={() => rotateCube("y", -90)}>Left</button>
        <button onClick={() => rotateCube("y", 90)}>Right</button>
        <button onClick={() => rotateCube("z", 180)}>Flip</button>
      </div>
      <div className={styles.controls}>
        {COLORS.map((color) => (
          <button
            key={color}
            className={styles.colorButton}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
      <div className={styles.actionsRow}>
        <button onClick={handleResetClick}>Сбросить</button>
        <button onClick={handleSaveClick}>Сохранить скрамбл</button>
        <button onClick={handleLoadClick}>Загрузить скрамбл</button>
        <button onClick={handleScrambleClick}>Скрамбл</button>
        <button onClick={handleSolveClick}>Найти решение</button>
      </div>
      <div className={styles.actionsRow}>
        <button onClick={() => handleMove("R")}>Move R</button>
        <button onClick={() => handleMove("L")}>Move L</button>
        <button onClick={() => handleMove("U")}>Move U</button>
        <button onClick={() => handleMove("D")}>Move D</button>
        <button onClick={() => handleMove("F")}>Move F</button>
        <button onClick={() => handleMove("B")}>Move B</button>
      </div>
      <div className={styles.actionsRow}>
        <button onClick={() => handleMove("R'")}>Move R'</button>
        <button onClick={() => handleMove("L'")}>Move L'</button>
        <button onClick={() => handleMove("U'")}>Move U'</button>
        <button onClick={() => handleMove("D'")}>Move D'</button>
        <button onClick={() => handleMove("F'")}>Move F'</button>
        <button onClick={() => handleMove("B'")}>Move B'</button>
      </div>
      <div className={styles.actionsRow}>
        <button onClick={() => handleMove("R2")}>Move R2</button>
        <button onClick={() => handleMove("L2")}>Move L2</button>
        <button onClick={() => handleMove("U2")}>Move U2</button>
        <button onClick={() => handleMove("D2")}>Move D2</button>
        <button onClick={() => handleMove("F2")}>Move F2</button>
        <button onClick={() => handleMove("B2")}>Move B2</button>
      </div>
      {solution && (
        <div className={styles.solution}>
          <h2>Решение:</h2>
          <p>{solution}</p>
        </div>
      )}
    </div>
  );
};
