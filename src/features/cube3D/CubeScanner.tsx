import { useState, useEffect, useRef, useCallback } from 'react';

import { COLORS } from '@entities/cube/constants';
import { CubeState, Rotation } from '@entities/cube/types';
import { validateCubeColors } from '@shared/lib/validateCube';
import { useNavigate } from 'react-router-dom';

import { CubeFace, ColorPicker } from './ui';

import styles from './Cube3D.module.css';

const FACE_ORDER = ['up', 'right', 'front', 'down', 'left', 'back'];
const FACE_STARTS: Record<string, number> = {
  up: 0,
  right: 9,
  front: 18,
  down: 27,
  left: 36,
  back: 45,
};

const FACE_INSTRUCTIONS: Record<
  string,
  { front: string; up: string; right: string }
> = {
  front: { front: 'красный', up: 'белый', right: 'синий' },
  right: { front: 'синий', up: 'белый', right: 'оранжевый' },
  back: { front: 'оранжевый', up: 'белый', right: 'зеленый' },
  left: { front: 'зеленый', up: 'белый', right: 'красный' },
  up: { front: 'белый', up: 'оранжевый', right: 'синий' },
  down: { front: 'желтый', up: 'красный', right: 'синий' },
};

const CubeScanner = () => {
  const [cube, setCube] = useState<CubeState>(new Array(54).fill('#000000'));
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [rotation, setRotation] = useState<Rotation>({ x: -22, y: -38, z: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [confirmationMode, setConfirmationMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [detectedColors, setDetectedColors] = useState<string[]>(
    new Array(9).fill('#000000')
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    startWebcam();
    return () => stopWebcam();
  }, []);

  const detectColors = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Define 3x3 grid (assuming cube face occupies center 50% of video)
    const gridSize = Math.min(canvas.width, canvas.height) * 0.25;
    const startX = (canvas.width - gridSize * 3) / 2;
    const startY = (canvas.height - gridSize * 3) / 2;
    const cellSize = gridSize;

    const colors: string[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = startX + col * cellSize + cellSize / 2;
        const y = startY + row * cellSize + cellSize / 2;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = rgbToClosestColor(pixel[0], pixel[1], pixel[2]);
        colors.push(color);

        // Draw grid and color
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          startX + col * cellSize,
          startY + row * cellSize,
          cellSize,
          cellSize
        );
        ctx.fillStyle = color;
        ctx.fillRect(
          startX + col * cellSize + 10,
          startY + row * cellSize + 10,
          cellSize - 20,
          cellSize - 20
        );
      }
    }

    setDetectedColors(colors);
    console.log('Detected colors:', colors);
  }, []);

  useEffect(() => {
    if (isScanning && !confirmationMode) {
      const interval = setInterval(detectColors, 100);
      return () => clearInterval(interval);
    }
  }, [isScanning, confirmationMode, detectColors]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Не удалось получить доступ к веб-камере. Проверьте разрешения.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  };

  const rgbToClosestColor = (r: number, g: number, b: number): string => {
    const rgbToHex = (c: number) => {
      const hex = Math.round(c).toString(16).padStart(2, '0');
      return hex;
    };

    let minDistance = Infinity;
    let closestColor = COLORS[0];

    for (const color of COLORS) {
      const colorRgb = hexToRgb(color);
      const distance = Math.sqrt(
        (r - colorRgb.r) ** 2 + (g - colorRgb.g) ** 2 + (b - colorRgb.b) ** 2
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }

    return closestColor;
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const handleStop = () => {
    setConfirmationMode(true);
    setIsScanning(false); // Pause color detection
  };

  const handleConfirm = () => {
    const currentFace = FACE_ORDER[currentFaceIndex];
    const start = FACE_STARTS[currentFace];
    const newCube = [...cube];
    detectedColors.forEach((color, idx) => {
      newCube[start + idx] = color;
    });
    setCube(newCube);
    console.log(`Confirmed colors for ${currentFace}:`, detectedColors);

    if (currentFaceIndex < FACE_ORDER.length - 1) {
      setCurrentFaceIndex(currentFaceIndex + 1);
      setDetectedColors(new Array(9).fill('#000000'));
      setConfirmationMode(false);
      setIsScanning(true);
    } else {
      stopWebcam();
      const validation = validateCubeColors(newCube);
      if (validation.valid) {
        navigate('/', { state: { scannedCube: newCube } });
      } else {
        alert(`Ошибка валидации куба: ${validation.error}`);
        setCurrentFaceIndex(0);
        setCube(new Array(54).fill('#000000'));
        setConfirmationMode(false);
        startWebcam();
      }
    }
  };

  const handleRescan = () => {
    setDetectedColors(new Array(9).fill('#000000'));
    setConfirmationMode(false);
    setIsScanning(true);
  };

  const handleColorClick = (index: number) => {
    const newColors = [...detectedColors];
    newColors[index] = selectedColor;
    setDetectedColors(newColors);
  };

  const currentFace = FACE_ORDER[currentFaceIndex];
  const instructions = FACE_INSTRUCTIONS[currentFace];

  return (
    <div className={styles.container}>
      <h2>Сканирование кубика Рубика</h2>
      <div className={styles.instructions}>
        {!confirmationMode ? (
          <>
            <p>
              Держите кубик так, чтобы центр спереди был{' '}
              <strong>{instructions.front}</strong> (грань{' '}
              {currentFace.toUpperCase()}), центр сверху был{' '}
              <strong>{instructions.up}</strong>, и центр справа был{' '}
              <strong>{instructions.right}</strong>.
            </p>
            <p>
              Текущая грань для сканирования:{' '}
              <strong>{currentFace.toUpperCase()}</strong>. Нажмите "Стоп",
              чтобы зафиксировать цвета.
            </p>
          </>
        ) : (
          <>
            <p>
              Проверьте цвета для грани{' '}
              <strong>{currentFace.toUpperCase()}</strong>. Щелкните на клетку,
              чтобы изменить цвет с помощью палитры.
            </p>
            <p>
              Подтвердите цвета кнопкой "Да" или нажмите "Пересканировать",
              чтобы повторить сканирование.
            </p>
          </>
        )}
      </div>
      <div className={styles.scannerWrapper}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={styles.video}
          ></video>
          <canvas ref={canvasRef} className={styles.canvas}></canvas>
        </div>
        <div className={styles.cubeWrapper}>
          <div
            className={styles.cube}
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
            }}
          >
            <CubeFace
              start={FACE_STARTS[currentFace]}
              faceClass={currentFace}
              cube={cube}
              selectedColor=""
              hoveredStickerIndex={null}
              onStickerClick={() => {}}
              setHoveredStickerIndex={() => {}}
            />
          </div>
        </div>
      </div>
      {!confirmationMode ? (
        <button className={styles.actionButton} onClick={handleStop}>
          Стоп
        </button>
      ) : (
        <div className={styles.confirmationContainer}>
          <ColorPicker onColorSelect={setSelectedColor} />
          <div className={styles.confirmationGrid}>
            {detectedColors.map((color, idx) => (
              <div
                key={idx}
                className={styles.confirmationCell}
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(idx)}
              ></div>
            ))}
          </div>
          <div className={styles.confirmationButtons}>
            <button className={styles.actionButton} onClick={handleConfirm}>
              Да
            </button>
            <button className={styles.actionButton} onClick={handleRescan}>
              Пересканировать
            </button>
          </div>
        </div>
      )}
      {!confirmationMode && (
        <div className={styles.colorGrid}>
          {detectedColors.map((color, idx) => (
            <div
              key={idx}
              className={styles.colorCell}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CubeScanner;
