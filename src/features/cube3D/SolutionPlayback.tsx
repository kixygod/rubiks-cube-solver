import { useState, useEffect } from 'react';

import { CubeState, Rotation } from '@entities/cube/types';
import { useLocation, useNavigate } from 'react-router-dom';

import { applyMove } from './model';
import { CubeFace, RotationButtons } from './ui';

import styles from './Cube3D.module.css';

const SolutionPlayback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialCube, solution } = location.state || {};

  const [cube, setCube] = useState<CubeState>(initialCube || []);
  const [rotation, setRotation] = useState<Rotation>({ x: -22, y: -38, z: 0 });
  const [moveIndex, setMoveIndex] = useState<number>(0);
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [pulseIndices, setPulseIndices] = useState<number[]>([]);

  useEffect(() => {
    if (solution) {
      const moves = solution.trim().split(' ');
      setSolutionMoves(moves);
      setCube(initialCube);
      setMoveIndex(0);
      setPulseIndices([]);
    }
  }, [solution, initialCube]);

  useEffect(() => {
    if (moveIndex === solutionMoves.length && solutionMoves.length > 0) {
      const timers: NodeJS.Timeout[] = [];
      solutionMoves.forEach((_, index) => {
        const timer = setTimeout(() => {
          setPulseIndices((prev) => [...prev, index]);
        }, index * 200); // 200ms delay between each move
        timers.push(timer);
      });
      return () => timers.forEach(clearTimeout); // Cleanup on unmount or moveIndex change
    } else {
      setPulseIndices([]); // Reset pulse animation if not at the end
    }
  }, [moveIndex, solutionMoves]);

  const applyMovesUpToIndex = (index: number) => {
    let currentCube = [...initialCube];
    for (let i = 0; i <= index; i++) {
      if (solutionMoves[i]) {
        currentCube = applyMove(currentCube, solutionMoves[i]);
      }
    }
    setCube(currentCube);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = Number(event.target.value);
    setMoveIndex(newIndex);
    applyMovesUpToIndex(newIndex);
  };

  const handleMoveClick = (index: number) => {
    setMoveIndex(index);
    applyMovesUpToIndex(index);
  };

  const handleRotate = (axis: 'x' | 'y' | 'z', angle: number) => {
    setRotation((prev) => ({
      ...prev,
      [axis]: prev[axis] + angle,
    }));
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!initialCube || !solution) {
    return (
      <div className={styles.container}>
        <h2>Ошибка: данные кубика или решения отсутствуют</h2>
        <button className={styles.actionButton} onClick={handleBack}>
          Вернуться
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Воспроизведение решения</h2>
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
            selectedColor=""
            hoveredStickerIndex={null}
            onStickerClick={() => {}}
            setHoveredStickerIndex={() => {}}
            hoveredMove={null}
          />
          <CubeFace
            start={9}
            faceClass="right"
            cube={cube}
            selectedColor=""
            hoveredStickerIndex={null}
            onStickerClick={() => {}}
            setHoveredStickerIndex={() => {}}
            hoveredMove={null}
          />
          <CubeFace
            start={18}
            faceClass="front"
            cube={cube}
            selectedColor=""
            hoveredStickerIndex={null}
            onStickerClick={() => {}}
            setHoveredStickerIndex={() => {}}
            hoveredMove={null}
          />
          <CubeFace
            start={27}
            faceClass="down"
            cube={cube}
            selectedColor=""
            hoveredStickerIndex={null}
            onStickerClick={() => {}}
            setHoveredStickerIndex={() => {}}
            hoveredMove={null}
          />
          <CubeFace
            start={36}
            faceClass="left"
            cube={cube}
            selectedColor=""
            hoveredStickerIndex={null}
            onStickerClick={() => {}}
            setHoveredStickerIndex={() => {}}
            hoveredMove={null}
          />
          <CubeFace
            start={45}
            faceClass="back"
            cube={cube}
            selectedColor=""
            hoveredStickerIndex={null}
            onStickerClick={() => {}}
            setHoveredStickerIndex={() => {}}
            hoveredMove={null}
          />
        </div>
      </div>
      <RotationButtons onRotate={handleRotate} />
      <div className={styles.solution}>
        <h3>
          Шаг {moveIndex + 1} из {solutionMoves.length + 1}
        </h3>
        <p>
          {solutionMoves[moveIndex]
            ? `Текущий ход: ${solutionMoves[moveIndex]}`
            : 'Успех!'}
        </p>
        <input
          type="range"
          min="0"
          max={solutionMoves.length}
          value={moveIndex}
          onChange={handleSliderChange}
          className={styles.solutionSlider}
        />
        <div className={styles.solutionMoves}>
          {solutionMoves.map((move, index) => (
            <span
              key={index}
              className={`${styles.solutionMove} ${
                index === moveIndex ? styles.activeMove : ''
              } ${index < moveIndex ? styles.completedMove : ''} ${
                pulseIndices.includes(index) ? styles.pulse : ''
              }`}
              onClick={() => handleMoveClick(index)}
              style={{ cursor: 'pointer' }}
            >
              {move}
            </span>
          ))}
        </div>
      </div>
      <button className={styles.actionButton} onClick={handleBack}>
        Вернуться
      </button>
    </div>
  );
};

export default SolutionPlayback;
