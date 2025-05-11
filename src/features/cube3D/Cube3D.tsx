import { useState } from 'react';

import { initCube, isCubeSolved } from '@entities/cube/model';
import { CubeState, Rotation } from '@entities/cube/types';
import { ClockwiseIcon, CounterclockwiseIcon } from '@shared/assets/icons';
import { useNavigate } from 'react-router-dom';

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
import { ScrambleDisplay } from './ui/ScrambleDisplay';

import styles from './Cube3D.module.css';

interface ArrowProps {
  face: string;
  isVisible: boolean;
  isCounterclockwise: boolean;
}

const Arrow = ({ face, isVisible, isCounterclockwise }: ArrowProps) => {
  if (!isVisible) return null;

  const faceTransforms: Record<string, string> = {
    up: 'rotateX(90deg) translateZ(130px) translateX(20px)',
    right: 'rotateY(90deg) translateZ(130px)',
    front: 'translateZ(130px)',
    down: 'rotateX(-90deg) translateZ(130px) translateX(15px) translateY(-15px)',
    left: 'rotateY(-90deg) translateZ(130px)',
    back: 'rotateY(180deg) translateZ(130px)',
  };

  return (
    <div
      className={styles.faceArrow}
      style={{
        transform: faceTransforms[face],
      }}
    >
      {isCounterclockwise ? (
        <CounterclockwiseIcon width={120} height={120} fill="#ffffff" />
      ) : (
        <ClockwiseIcon width={120} height={120} fill="#ffffff" />
      )}
    </div>
  );
};

export const Cube3D = () => {
  const [cube, setCube] = useState<CubeState>(initCube());
  const [selectedColor, setSelectedColor] = useState<string>('#B90000');
  const [rotation, setRotation] = useState<Rotation>({ x: -22, y: -38, z: 0 });
  const [solution, setSolution] = useState<string | null>(null);
  const [scramble, setScramble] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(true);
  const [hoveredStickerIndex, setHoveredStickerIndex] = useState<number | null>(
    null
  );
  const [hoveredMove, setHoveredMove] = useState<string | null>(null);

  const navigate = useNavigate();

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
    const { cube: scrambledCube, scramble: scrambleMoves } = applyScramble();
    setCube(scrambledCube);
    setScramble(scrambleMoves.join(' '));
    setSolution(null);
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
    setSolution(null);
    setScramble(null);
    setIsSolved(true);
  };

  const handleSave = () => {
    saveScramble(cube);
  };

  const handleLoad = () => {
    const loadedCube = loadScramble();
    if (loadedCube) {
      setCube(loadedCube);
      setSolution(null);
      setScramble(null);
      setIsSolved(false);
    }
  };

  const handleShowSolution = () => {
    if (solution && scramble) {
      navigate('/solution-playback', {
        state: { initialCube: cube, solution },
      });
    }
  };

  const faceToMove: Record<string, string> = {
    up: 'U',
    right: 'R',
    front: 'F',
    down: 'D',
    left: 'L',
    back: 'B',
  };

  const faces = ['up', 'right', 'front', 'down', 'left', 'back'];

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
            hoveredMove={hoveredMove}
          />
          <CubeFace
            start={9}
            faceClass="right"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
            hoveredMove={hoveredMove}
          />
          <CubeFace
            start={18}
            faceClass="front"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
            hoveredMove={hoveredMove}
          />
          <CubeFace
            start={27}
            faceClass="down"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
            hoveredMove={hoveredMove}
          />
          <CubeFace
            start={36}
            faceClass="left"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
            hoveredMove={hoveredMove}
          />
          <CubeFace
            start={45}
            faceClass="back"
            cube={cube}
            selectedColor={selectedColor}
            hoveredStickerIndex={hoveredStickerIndex}
            onStickerClick={handleStickerClick}
            setHoveredStickerIndex={setHoveredStickerIndex}
            hoveredMove={hoveredMove}
          />
          {faces.map((face) => {
            const moveLetter = faceToMove[face];
            const isVisible = hoveredMove && hoveredMove.startsWith(moveLetter);
            const isCounterclockwise = isVisible && hoveredMove?.includes("'");
            return (
              <Arrow
                key={face}
                face={face}
                isVisible={!!isVisible}
                isCounterclockwise={!!isCounterclockwise}
              />
            );
          })}
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
        onHoverMove={setHoveredMove}
      />
      <div className={styles.displayContainer}>
        <ScrambleDisplay scramble={scramble} />
      </div>
      <div className={styles.displayContainer}>
        <SolutionDisplay solution={solution} />
        {solution && (
          <button className={styles.actionButton} onClick={handleShowSolution}>
            Показать решение
          </button>
        )}
      </div>
    </div>
  );
};
