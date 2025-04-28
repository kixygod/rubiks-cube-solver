import { LOCAL_STORAGE_KEY } from '../../../entities/cube/constants';
import { CubeState } from '../../../entities/cube/types';

export const saveScramble = (cube: CubeState): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cube));
  alert('Скрамбл сохранён!');
};

export const loadScramble = (): CubeState | null => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length === 54) {
      return parsed;
    } else {
      alert('Сохранённый скрамбл повреждён.');
    }
  } else {
    alert('Скрамбл не найден.');
  }
  return null;
};
