import React, { useState } from 'react';
import * as styles from './LoginPage.module.css';

import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import { translations } from '../model/i18n/translations';
const currentLanguage = 'en'; // 假设当前语言是中文，可以根据实际情况动态设置

const App = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleForm = () => {
    setIsActive(prev => !prev);
  };

  return (
    <section className={isActive ? `${styles.section} ${styles.active}` : styles.section}>
      <div className={isActive ? `${styles.container} ${styles.active}` : styles.container}>
        <SignInForm toggleForm={toggleForm} translations={translations[currentLanguage].signIn} />
        <SignUpForm toggleForm={toggleForm} translations={translations[currentLanguage].signUp} />
      </div>
    </section>
  );
};

export default App;