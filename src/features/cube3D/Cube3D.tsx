import { useState } from 'react';

import { initCube, isCubeSolved } from '@entities/cube/model';
import { CubeState, Rotation } from '@entities/cube/types';

import {
  applyMove,
  applyScramble,
  loadScramble,
  saveScramble,
  sendScrambleToBackend,
} from './model';
import {
  ActionButtons,
  ColorPicker,
  CubeFace,
  RotationButtons,
  SolutionDisplay,
} from './ui';

import styles from './Cube3D.module.css';

export const Cube3D = () => {
  const [cube, setCube] = useState<CubeState>(initCube);
  const [selectedColor, setSelectedColor] = useState<string>('#B90000');
  const [rotation, setRotation] = useState<Rotation>({ x: -22, y: -38, z: 0 });
  const [solution, setSolution] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(true);
  const [hoveredStickerIndex, setHoveredStickerIndex] = useState<number | null>(
    null
  );

  const handleMove = (move: string) => {
    setCube(applyMove(cube, move));
    setIsSolved(false);
  };

  const handleStickerClick = (index: number) => {
    const newCube = [...cube];
    newCube[index] = selectedColor;
    setCube(newCube);
    setIsSolved(false);
  };

  const handleRotate = (axis: 'x' | 'y' | 'z', angle: number) => {
    setRotation((prev) => ({
      ...prev,
      [axis]: prev[axis] + angle,
    }));
  };

  const handleScramble = () => {
    const newCube = applyScramble();
    setCube(newCube);
    setIsSolved(false);
  };

  const handleSolve = async () => {
    if (isSolved || isCubeSolved(cube)) {
      alert('Кубик уже собран или не был изменён! Пожалуйста, запутайте его.');
    } else {
      const solution = await sendScrambleToBackend(cube);
      if (solution) setSolution(solution);
    }
  };

  const handleReset = () => {
    setCube(initCube());
    setIsSolved(true);
  };

  const handleSave = () => {
    saveScramble(cube);
  };

  const handleLoad = () => {
    const loadedCube = loadScramble();
    if (loadedCube) {
      setCube(loadedCube);
      setIsSolved(false);
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
          <CubeFace
            start={0}
            faceClass="up"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
          />
          <CubeFace
            start={9}
            faceClass="right"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
          />
          <CubeFace
            start={18}
            faceClass="front"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
          />
          <CubeFace
            start={27}
            faceClass="down"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
          />
          <CubeFace
            start={36}
            faceClass="left"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
          />
          <CubeFace
            start={45}
            faceClass="back"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
          />
        </div>
      </div>
      <RotationButtons onRotate={handleRotate} />
      <ColorPicker onColorSelect={setSelectedColor} />
      <ActionButtons
        onReset={handleReset}
        onSave={handleSave}
        onLoad={handleLoad}
        onScramble={handleScramble}
        onSolve={handleSolve}
        onMove={handleMove}
      />
      <SolutionDisplay solution={solution} />
    </div>
  );
};
