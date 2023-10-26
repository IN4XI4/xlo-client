import React, { useState, useEffect } from 'react';
import { Login } from '../components/users/Login'
import { ForgotPassword } from '../components/users/ForgotPassword';
import { Register } from '../components/users/Register';
import { ResetPassword } from '../components/users/ResetPassword';
import { Welcome } from '../components/Welcome';
import { useLocation } from 'react-router-dom';

export function HomePage() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const getViewFromQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('view') || 'login';
  };
  const [currentView, setCurrentView] = useState(getViewFromQuery());
  useEffect(() => {
    setCurrentView(getViewFromQuery());
  }, [location.search]);

  // TODO: Validate if token is correct bringing all topics...
  const renderToken = () => (
    <>
      <div className="pt-24 md:pt-32 px-4 md:px-16 lg:px-32 xl:px-44">
        <div className='text-4xl'>All Topics</div>
      </div>
    </>
  );

  const renderNoToken = () => {
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
      <div className="grid grid-cols-2 pt-24 md:pt-32 px-4 md:px-16 lg:px-32 xl:px-44">
        <div className='col-span-2 md:col-auto pb-6 px-2'>
          <Welcome />
        </div>
        <div className='col-span-2 md:col-auto pb-8 sm:px-24 md:px-0'>
          {viewComponent}
        </div>
      </div>
    );
  };
  return (
    <div>
      {token ? renderToken() : renderNoToken()}
    </div>

  )
}
