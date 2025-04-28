import styles from '../Cube3D.module.css';

interface ActionButtonsProps {
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  onScramble: () => void;
  onSolve: () => void;
  onMove: (move: string) => void;
}

export const ActionButtons = ({
  onReset,
  onSave,
  onLoad,
  onScramble,
  onSolve,
  onMove,
}: ActionButtonsProps) => {
  const moves = [
    ['F', 'R', 'U', 'B', 'L', 'D'],
    ["F'", "R'", "U'", "B'", "L'", "D'"],
  ];

  return (
    <>
      <div className={styles.movesColumn}>
        {moves.map((moveSet, index) => (
          <div key={index} className={styles.movesRow}>
            {moveSet.map((move) => (
              <button
                key={move}
                className={styles.moveButton}
                onClick={() => onMove(move)}
              >
                {move}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.actionsRow}>
        <button className={styles.actionButton} onClick={onReset}>
          Сбросить
        </button>
        <button className={styles.actionButton} onClick={onSave}>
          Сохранить скрамбл
        </button>
        <button className={styles.actionButton} onClick={onLoad}>
          Загрузить скрамбл
        </button>
        <button className={styles.actionButton} onClick={onScramble}>
          Запутать кубик
        </button>
        <button className={styles.actionButton} onClick={onSolve}>
          Найти решение
        </button>
      </div>
    </>
  );
};
