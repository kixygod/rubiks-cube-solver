import styles from "../Cube3D.module.css";

interface RotationButtonsProps {
  onRotate: (axis: "x" | "y" | "z", angle: number) => void;
}

export const RotationButtons = ({ onRotate }: RotationButtonsProps) => {
  return (
    <div className={styles.rotationButtons}>
      <button onClick={() => onRotate("y", -90)}>Left</button>
      <button onClick={() => onRotate("y", 90)}>Right</button>
      <button onClick={() => onRotate("z", 180)}>Flip</button>
    </div>
  );
};
