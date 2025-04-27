import { motion, AnimatePresence } from 'framer-motion';

import styles from '../Cube3D.module.css';

interface ScrambleDisplayProps {
  scramble: string | null;
}

export const ScrambleDisplay = ({ scramble }: ScrambleDisplayProps) => {
  return (
    <AnimatePresence>
      {scramble && (
        <motion.div
          className={styles.solution}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Сгенерированный скрамбл:</h2>
          <p>{scramble}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
