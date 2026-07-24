import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { googleLogin } from '../../api/users.api';
import { checkNewDay } from '../../utils/checkNewDay';

export function GoogleLoginButton({ onError, onSuccess }) {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        ReactGA.event('login', { method: 'google' });
        if (onSuccess) {
          onSuccess();
        } else {
          checkNewDay();
          navigate('/');
          window.location.reload();
        }
      } else {
        onError?.('Login was successful, but no token was received.');
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        onError?.('Your Google account email is not verified, so we cannot sign you in.');
      } else if (status === 401) {
        onError?.('We could not validate your Google sign-in. Please try again.');
      } else {
        onError?.('An error occurred while trying to sign in with Google. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        text="continue_with"
        onSuccess={handleSuccess}
        onError={() => onError?.('An error occurred while trying to sign in with Google. Please try again.')}
      />
    </div>
  );
}
