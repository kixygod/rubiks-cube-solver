import { useState } from "react";
import styles from "./Cube3D.module.css";

const COLORS = [
  "#FFFFFF",
  "#FF5900",
  "#009B48",
  "#B90000",
  "#0045AD",
  "#FFD500",
];

const CENTER_INDICES = [4, 13, 22, 31, 40, 49];
const CENTER_COLORS = [
  "#FFFFFF",
  "#009B48",
  "#B90000",
  "#0045AD",
  "#FF5900",
  "#FFD500",
];

const LOCAL_STORAGE_KEY = "rubiks-cube-scramble";

export const Cube3D = () => {
  const [cube, setCube] = useState<string[]>(() => {
    const newCube = new Array(54).fill("white");
    CENTER_INDICES.forEach((centerIndex, centerIdx) => {
      const faceStart = centerIndex - 4;
      for (let i = 0; i < 9; i++) {
        newCube[faceStart + i] = CENTER_COLORS[centerIdx];
      }
    });
    return newCube;
  });

  const [selectedColor, setSelectedColor] = useState<string>("red");
  const [rotation, setRotation] = useState({ x: -22, y: -38, z: 0 });
  const [solution, setSolution] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(true);
  const [hoveredStickerIndex, setHoveredStickerIndex] = useState<number | null>(
    null
  );

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
      "#FF5900": "B",
      "#009B48": "L",
      "#B90000": "F",
      "#0045AD": "R",
      "#FFD500": "D",
    };

    const orderedCube = [
      ...cube.slice(0, 9),
      ...cube.slice(27, 36),
      ...cube.slice(18, 27),
      ...cube.slice(45, 54),
      ...cube.slice(9, 18),
      ...cube.slice(36, 45),
    ];

    const scramble = orderedCube.map((color) => colorMapping[color]).join("");
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

  const handleSolveClick = () => {
    if (isSolved) {
      alert("Кубик не запутан! Пожалуйста, измените его.");
    } else {
      sendScrambleToBackend(cube);
    }
  };

  const handleResetClick = () => {
    const newCube = new Array(54).fill("white");
    CENTER_INDICES.forEach((centerIndex, centerIdx) => {
      const faceStart = centerIndex - 4;
      for (let i = 0; i < 9; i++) {
        newCube[faceStart + i] = CENTER_COLORS[centerIdx];
      }
    });
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

  return (
    <div className={styles.container}>
      <div className={styles.cubeWrapper}>
        <div
          className={styles.cube}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
          }}
        >
          {renderFace(0, "up")}
          {renderFace(9, "left")}
          {renderFace(18, "front")}
          {renderFace(27, "right")}
          {renderFace(36, "back")}
          {renderFace(45, "down")}
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
        <button onClick={handleSolveClick}>Найти решение</button>
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
