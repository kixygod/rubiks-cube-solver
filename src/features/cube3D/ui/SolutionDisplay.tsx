import { motion, AnimatePresence } from 'framer-motion';

import styles from '../Cube3D.module.css';

interface SolutionDisplayProps {
  solution: string | null;
}

export const SolutionDisplay = ({ solution }: SolutionDisplayProps) => {
  return (
    <AnimatePresence>
      {solution && (
        <motion.div
          className={styles.solution}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Решение:</h2>
          <p>{solution}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
