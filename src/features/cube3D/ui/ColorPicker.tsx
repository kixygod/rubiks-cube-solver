import { COLORS } from "../../../entities/cube/constants";
import styles from "../Cube3D.module.css";

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
}

export const ColorPicker = ({ onColorSelect }: ColorPickerProps) => {
  return (
    <div className={styles.controls}>
      {COLORS.map((color) => (
        <button
          key={color}
          className={styles.colorButton}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};
