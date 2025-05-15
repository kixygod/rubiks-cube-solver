import { CENTER_INDICES } from '../../../entities/cube/constants';
import styles from '../Cube3D.module.css';

interface CubeFaceProps {
  start: number;
  faceClass: string;
  cube: string[];
  selectedColor: string;
  hoveredStickerIndex: number | null;
  onStickerClick: (index: number) => void;
  setHoveredStickerIndex: (index: number | null) => void;
  hoveredMove?: string | null;
}

export const CubeFace = ({
  start,
  faceClass,
  cube,
  selectedColor,
  hoveredStickerIndex,
  onStickerClick,
  setHoveredStickerIndex,
}: CubeFaceProps) => {
  return (
    <div className={`${styles.face} ${styles[faceClass]}`}>
      {cube.slice(start, start + 9).map((color, idx) => {
        const index = start + idx;
        return (
          <div
            key={index}
            className={styles.sticker}
            style={{ backgroundColor: color }}
            onClick={() =>
              !CENTER_INDICES.includes(index) && onStickerClick(index)
            }
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
};
