import React, { useState } from "react";
import CubeInput from "../features/cubeInput/CubeInput";
import CubeDisplay from "../features/cubeDisplay/CubeDisplay";

const MainPage: React.FC = () => {
  const [solution, setSolution] = useState<string | null>(null);
  const [cubeState, setCubeState] = useState<string[]>(
    new Array(54).fill("white")
  );

  const handleSolve = (solution: string) => {
    setSolution(solution);
    console.log("Solution:", solution);
  };

  const handleCubeChange = (newCube: string[]) => {
    setCubeState(newCube);
  };

  return (
    <div>
      <h1>Решение Кубика Рубика</h1>
      <CubeInput onSolve={handleSolve} onCubeChange={handleCubeChange} />{" "}
      {/* Передаем setCubeState */}
      <CubeDisplay cubeState={cubeState} /> {/* Передаем состояние кубика */}
      {solution && <div>Решение: {solution}</div>}
    </div>
  );
};

export default MainPage;
