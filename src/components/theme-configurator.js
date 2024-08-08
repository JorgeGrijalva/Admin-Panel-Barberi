import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import React, { useEffect, useContext } from 'react';
import { Context } from '../context/context';

export default function ThemeConfigurator() {
  const { darkTheme, setDarkTheme } = useContext(Context);
  const handleToggle = () => setDarkTheme(!darkTheme);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkTheme]);

  return (
    <span className='icon-button mx-2' onClick={handleToggle}>
      {darkTheme ? (
        <BsSunFill style={{ fontSize: 20 }} />
      ) : (
        <BsMoonFill style={{ fontSize: 20 }} />
      )}
    </span>
  );
}
