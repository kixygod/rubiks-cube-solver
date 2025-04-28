import React from 'react';

import MainPage from './pages/MainPage';

import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <MainPage />
    </div>
  );
};

export default App;
