import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRotate,
} from '@shared/assets/icons';

import styles from '../Cube3D.module.css';

interface RotationButtonsProps {
  onRotate: (axis: 'x' | 'y' | 'z', angle: number) => void;
}

export const RotationButtons = ({ onRotate }: RotationButtonsProps) => {
  return (
    <div className={styles.rotationButtons}>
      <button
        className={styles.rotationButton}
        onClick={() => onRotate('y', -90)}
      >
        <ArrowLeftIcon width={32} height={32} />
      </button>
      <button
        className={styles.rotationButton}
        onClick={() => onRotate('z', 180)}
      >
        <ArrowRotate width={32} height={32} />
      </button>
      <button
        className={styles.rotationButton}
        onClick={() => onRotate('y', 90)}
      >
        <ArrowRightIcon width={32} height={32} />
      </button>
    </div>
  );
};
