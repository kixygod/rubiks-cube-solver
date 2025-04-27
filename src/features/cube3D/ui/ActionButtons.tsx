import styles from "../Cube3D.module.css";

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
    ["R", "L", "U", "D", "F", "B"],
    ["R'", "L'", "U'", "D'", "F'", "B'"],
    ["R2", "L2", "U2", "D2", "F2", "B2"],
  ];

  return (
    <>
      <div className={styles.actionsRow}>
        <button onClick={onReset}>Сбросить</button>
        <button onClick={onSave}>Сохранить скрамбл</button>
        <button onClick={onLoad}>Загрузить скрамбл</button>
        <button onClick={onScramble}>Скрамбл</button>
        <button onClick={onSolve}>Найти решение</button>
      </div>
      {moves.map((moveSet, index) => (
        <div key={index} className={styles.actionsRow}>
          {moveSet.map((move) => (
            <button key={move} onClick={() => onMove(move)}>
              Move {move}
            </button>
          ))}
        </div>
      ))}
    </>
  );
};
