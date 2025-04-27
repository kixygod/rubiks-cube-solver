import styles from "../Cube3D.module.css";

interface SolutionDisplayProps {
  solution: string | null;
}

export const SolutionDisplay = ({ solution }: SolutionDisplayProps) => {
  if (!solution) return null;
  return (
    <div className={styles.solution}>
      <h2>Решение:</h2>
      <p>{solution}</p>
    </div>
  );
};
