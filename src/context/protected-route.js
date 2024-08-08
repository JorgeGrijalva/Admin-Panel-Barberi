import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth, shallowEqual);

  if (!user) {
    return <Navigate to='/login' replace />;
  }
  return children;
};
