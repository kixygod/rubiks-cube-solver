import { useState, useEffect, useRef, useCallback } from 'react';

import { COLORS, CENTER_INDICES } from '@entities/cube/constants';
import { CubeState, Rotation } from '@entities/cube/types';
import { validateCubeColors } from '@shared/lib/validateCube';
import { useNavigate } from 'react-router-dom';

import { CubeFace, ColorPicker, RotationButtons } from './ui';

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
  const [cube, setCube] = useState<CubeState>(new Array(54).fill('#808080'));
  const [previewCube, setPreviewCube] = useState<CubeState>(() => {
    const initial = new Array(54).fill('#808080');
    CENTER_INDICES.forEach((idx, i) => {
      initial[idx] = COLORS[i];
    });
    return initial;
  });
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [rotation, setRotation] = useState<Rotation>({ x: -22, y: -38, z: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [confirmationMode, setConfirmationMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [detectedColors, setDetectedColors] = useState<string[]>(
    new Array(9).fill('#808080')
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    startWebcam();
    return stopWebcam;
  }, []);

  const hexToRgb = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }, []);

  const rgbToClosestColor = useCallback(
    (r: number, g: number, b: number) => {
      let min = Infinity;
      let closest = COLORS[0];
      for (const color of COLORS) {
        const { r: cr, g: cg, b: cb } = hexToRgb(color);
        const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
        if (dist < min) {
          min = dist;
          closest = color;
        }
      }
      return closest;
    },
    [hexToRgb]
  );

  const detectColors = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const gridSize = Math.min(canvas.width, canvas.height) * 0.25;
    const startX = (canvas.width - gridSize * 3) / 2;
    const startY = (canvas.height - gridSize * 3) / 2;
    const colors: string[] = [];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = startX + col * gridSize + gridSize / 2;
        const y = startY + row * gridSize + gridSize / 2;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = rgbToClosestColor(pixel[0], pixel[1], pixel[2]);
        colors.push(color);
      }
    }
    setDetectedColors(colors);

    ctx.save();
    ctx.globalAlpha = 0.7;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = startX + col * gridSize;
        const y = startY + row * gridSize;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, gridSize, gridSize);
        ctx.fillStyle = colors[row * 3 + col];
        ctx.fillRect(x + 10, y + 10, gridSize - 20, gridSize - 20);
      }
    }
    ctx.restore();
  }, [rgbToClosestColor]);

  useEffect(() => {
    if (isScanning && !confirmationMode) {
      const id = setInterval(detectColors, 100);
      return () => clearInterval(id);
    }
  }, [isScanning, confirmationMode, detectColors]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch {
      alert('Не удалось получить доступ к веб-камере.');
    }
  };

  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsScanning(false);
  };

  const handleStop = () => {
    setConfirmationMode(true);
    setIsScanning(false);
  };

  const handleConfirm = () => {
    const currentFace = FACE_ORDER[currentFaceIndex];
    const start = FACE_STARTS[currentFace];
    const newCube = [...cube];
    const newPreview = [...previewCube];
    detectedColors.forEach((c, i) => {
      newCube[start + i] = c;
      newPreview[start + i] = c;
    });
    setCube(newCube);
    setPreviewCube(newPreview);
    if (currentFaceIndex < FACE_ORDER.length - 1) {
      setCurrentFaceIndex((i) => i + 1);
      setDetectedColors(new Array(9).fill('#808080'));
      setConfirmationMode(false);
      setIsScanning(true);
    } else {
      stopWebcam();
      const validation = validateCubeColors(newCube);
      if (validation.valid) {
        navigate('/', { state: { scannedCube: newCube } });
      } else {
        alert(`Ошибка валидации куба: ${validation.error}`);
        window.location.reload();
      }
    }
  };

  const handleRescan = () => {
    setDetectedColors(new Array(9).fill('#808080'));
    setConfirmationMode(false);
    setIsScanning(true);
  };

  const handleColorClick = (i: number) => {
    setDetectedColors((prev) => {
      const copy = [...prev];
      copy[i] = selectedColor;
      return copy;
    });
  };

  const handleRotate = (axis: 'x' | 'y' | 'z', angle: number) => {
    setRotation((p) => ({ ...p, [axis]: p[axis] + angle }));
  };

  const handleBack = () => {
    navigate('/');
  };

  const currentFace = FACE_ORDER[currentFaceIndex];
  const instructions = FACE_INSTRUCTIONS[currentFace];

  return (
    <div className={styles.container}>
      <h2 style={{ textAlign: 'center' }}>Сканирование кубика Рубика</h2>
      <button className={styles.actionButton} onClick={handleBack}>
        Вернуться
      </button>
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
        <div className={styles.videoBox}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={styles.surface}
          ></video>
          <canvas ref={canvasRef} className={styles.surface}></canvas>
        </div>
        <div className={styles.cubeContainer}>
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
                cube={previewCube}
                selectedColor=""
                hoveredStickerIndex={null}
                onStickerClick={() => {}}
                setHoveredStickerIndex={() => {}}
              />
              <CubeFace
                start={9}
                faceClass="right"
                cube={previewCube}
                selectedColor=""
                hoveredStickerIndex={null}
                onStickerClick={() => {}}
                setHoveredStickerIndex={() => {}}
              />
              <CubeFace
                start={18}
                faceClass="front"
                cube={previewCube}
                selectedColor=""
                hoveredStickerIndex={null}
                onStickerClick={() => {}}
                setHoveredStickerIndex={() => {}}
              />
              <CubeFace
                start={27}
                faceClass="down"
                cube={previewCube}
                selectedColor=""
                hoveredStickerIndex={null}
                onStickerClick={() => {}}
                setHoveredStickerIndex={() => {}}
              />
              <CubeFace
                start={36}
                faceClass="left"
                cube={previewCube}
                selectedColor=""
                hoveredStickerIndex={null}
                onStickerClick={() => {}}
                setHoveredStickerIndex={() => {}}
              />
              <CubeFace
                start={45}
                faceClass="back"
                cube={previewCube}
                selectedColor=""
                hoveredStickerIndex={null}
                onStickerClick={() => {}}
                setHoveredStickerIndex={() => {}}
              />
            </div>
          </div>
          <RotationButtons onRotate={handleRotate} />
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
