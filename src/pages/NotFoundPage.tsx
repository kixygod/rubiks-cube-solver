import { useNavigate } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Страница не найдена</p>
      <button className={styles.actionButton} onClick={handleBack}>
        Вернуться на главную
      </button>
    </div>
  );
};

export default NotFoundPage;
