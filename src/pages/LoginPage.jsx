import React, { useState, useEffect } from 'react';
import { Login } from '../components/users/Login'
import { ForgotPassword } from '../components/users/ForgotPassword';
import { Register } from '../components/users/Register';
import { ResetPassword } from '../components/users/ResetPassword';
import { Welcome } from '../components/Welcome';
import { useLocation } from 'react-router-dom';

export function LoginPage() {
  const location = useLocation();
  const getViewFromQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('view') || 'login';
  };
  const [currentView, setCurrentView] = useState(getViewFromQuery());
  useEffect(() => {
    setCurrentView(getViewFromQuery());
  }, [location.search]);
  let viewComponent;

  switch (currentView) {
    case 'register':
      viewComponent = <Register />;
      break;
    case 'forgotpassword':
      viewComponent = <ForgotPassword />;
      break;
    case 'resetpassword':
      viewComponent = <ResetPassword />;
      break;
    case 'login':
    default:
      viewComponent = <Login />;
      break;
  }

  return (
    <div className="grid lg:grid-cols-5 pt-24 md:pt-32 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
      <div className='lg:col-span-3 pb-6 px-4'>
        <Welcome />
      </div>
      <div className='lg:col-span-2 pb-8 sm:px-24 md:px-0 xl:px-4'>
        {viewComponent}
      </div>
    </div>
  );
};