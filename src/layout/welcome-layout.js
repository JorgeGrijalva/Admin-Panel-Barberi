import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { shallowEqual } from 'react-redux';
import installationService from '../services/installation';
import Loading from '../components/loading';

export const WelcomeLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const menuActive = useSelector((list) => list.menu.activeMenu, shallowEqual);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    installationService
      .checkInitFile()
      .then(() => navigate('/'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    <Loading />;
  }

  if (user) {
    return <Navigate to={`/${menuActive ? menuActive.url : ''}`} replace />;
  }

  return children;
};
