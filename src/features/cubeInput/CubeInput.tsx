import React, { useState, useEffect } from "react";
import CubeDisplay from "../cubeDisplay/CubeDisplay";
import { validateCubeColors } from "../../shared/lib/validateCube";

const COLORS = ["white", "red", "blue", "green", "orange", "yellow"];
const LOCAL_STORAGE_KEY = "rubiks-cube-scramble";

const CENTER_COLOR_MAP: Record<number, string> = {
  4: "white",
  13: "green",
  22: "red",
  31: "blue",
  40: "orange",
  49: "yellow",
};

const nextColor = (current: string) => {
  const index = COLORS.indexOf(current);
  return COLORS[(index + 1) % COLORS.length];
};

type CubeInputProps = {
  onSolve: (solution: string) => void;
  onCubeChange: (cube: string[]) => void;
};

const CubeInput: React.FC<CubeInputProps> = ({ onSolve, onCubeChange }) => {
  const initialCube = new Array(54)
    .fill("white")
    .map((_, idx) => CENTER_COLOR_MAP[idx] ?? "white");

  const [cube, setCube] = useState<string[]>(initialCube);

  useEffect(() => {
    onCubeChange(cube);
  }, [cube, onCubeChange]);

  const handleChangeColor = (index: number) => {
    if (CENTER_COLOR_MAP[index]) return;
    const newCube = [...cube];
    newCube[index] = nextColor(cube[index]);
    setCube(newCube);
  };

  const handleSolve = () => {
    const result = validateCubeColors(cube);
    if (!result.valid) {
      alert(`Ошибка: ${result.error}`);
      return;
    }

    const solution = solveCube(cube);
    onSolve(solution);
  };

  const solveCube = (cube: string[]) => {
    console.log(cube);
    return "R U R' U' F R F' R' F R F' U R2 F2";
  };

  async function solveCubeRemote(cube: string[]): Promise<string> {
    const colorMapping: Record<string, string> = {
      yellow: "D",
      blue: "R",
      red: "F",
      orange: "B",
      white: "U",
      green: "L",
    };

    const ordered = [
      ...cube.slice(0, 9),
      ...cube.slice(27, 36),
      ...cube.slice(18, 27),
      ...cube.slice(45, 54),
      ...cube.slice(9, 18),
      ...cube.slice(36, 45),
    ];

    const cubeString = ordered.map((color) => colorMapping[color]).join("");

    const res = await fetch("http://localhost:5000/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cube: cubeString }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.solution;
  }

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cube));
    alert("Скрамбл сохранён!");
  };

  const handleLoad = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 54) {
        const fixed = parsed.map(
          (val: string, idx: number) => CENTER_COLOR_MAP[idx] ?? val
        );
        setCube(fixed);
        alert("Скрамбл загружен!");
      } else {
        alert("Сохранённый скрамбл повреждён.");
      }
    } else {
      alert("Скрамбл не найден.");
    }
  };

  const renderFace = (start: number, label: string) => (
    <div>
      <div style={{ fontWeight: "bold", marginBottom: 4 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 30px)" }}>
        {cube.slice(start, start + 9).map((color, idx) => {
          const absIdx = start + idx;
          return (
            <button
              key={absIdx}
              disabled={CENTER_COLOR_MAP[absIdx] !== undefined}
              style={{
                backgroundColor: color,
                width: 30,
                height: 30,
                border: "1px solid black",
                cursor: CENTER_COLOR_MAP[absIdx] ? "not-allowed" : "pointer",
              }}
              onClick={() => handleChangeColor(absIdx)}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <h2>Редактор сторон</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, auto)",
          gap: 10,
        }}
      >
        {renderFace(0, "U")}
        {renderFace(9, "L")}
        {renderFace(18, "F")}
        {renderFace(27, "R")}
        {renderFace(36, "B")}
        {renderFace(45, "D")}
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleSolve}>Решить кубик (тест)</button>
        <button
          onClick={async () => {
            const result = validateCubeColors(cube);
            if (!result.valid) {
              alert(`Ошибка: ${result.error}`);
              return;
            }

            try {
              const solution = await solveCubeRemote(cube);
              onSolve(solution);
            } catch (e: unknown) {
              if (e instanceof Error) {
                alert(`Ошибка при решении: ${e.message}`);
              } else {
                alert("Неизвестная ошибка");
              }
            }
          }}
          style={{ marginLeft: 10 }}
        >
          Решить кубик (Kociemba)
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleSave}>💾 Сохранить скрамбл</button>
        <button onClick={handleLoad} style={{ marginLeft: 10 }}>
          📂 Загрузить скрамбл
        </button>
      </div>

      <CubeDisplay cubeState={cube} />
    </div>
  );
};

export default CubeInput;
