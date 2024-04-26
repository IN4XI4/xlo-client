import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/users.api';
import { login } from '../../api/base.api';


export function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [serverError, setServerError] = useState('');
  const onSubmit = async (data) => {
    try {
      const response = await resetPassword(data);

      if (response.status === 200 && response.data) {
        const loginData = {
          username: response.data.email,
          password: data.password,
        };
        const loginResponse = await login(loginData);
        if (loginResponse.data && loginResponse.data.token) {
          localStorage.setItem('token', loginResponse.data.token);
          navigate('/');
          window.location.reload();
        } else {
          setServerError('Password was reset successfully, but there was an issue with logging in.');
        }
      } else {
        setServerError('There was an issue with resetting your password. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          setServerError(errorData);
        } else if (errorData.non_field_errors) {
          setServerError(errorData.non_field_errors.join(' '));
        } else if (errorData.password) {
          setServerError(errorData.password.join(' '));
        } else if (errorData.detail) {
          setServerError(errorData.detail);
        } else {
          setServerError('An error occurred while trying to reset the password. Please try again.');
        }
      } else {
        setServerError('An error occurred while trying to reset the password. Please try again.');
      }
    }
  };

  return (
    <form className="grid grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white p-8 rounded-md shadow-md col-span-full xl:col-span-4">
        <div className="mb-4">
          <div className='pb-2'>
            <Label htmlFor="email" className="text-gray-900" value="Your code" />
          </div>
          <TextInput
            label="Your Code"
            placeholder="Enter your reset code"
            name="reset_code"
            {...register('reset_code', {
              required: "Reset code is required",
            })}
            color={errors.reset_code ? 'failure' : 'gray'}
            helpertext={errors.reset_code ? errors.reset_code.message : undefined}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <TextInput
            label="Password"
            placeholder="Enter password"
            name="password"
            type="password"
            {...register('password', {
              required: "Password is required",
            })}
            color={errors.password ? 'failure' : 'gray'}
            helpertext={errors.password ? errors.password.message : undefined}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password2" className="block text-sm font-medium text-gray-900 mb-2">Confirm password</label>
          <TextInput
            label="Confirm Password"
            placeholder="Confirm password"
            name="password2"
            type="password"
            {...register('password2', {
              required: "Password confirmation is required",
            })}
            color={errors.password2 ? 'failure' : 'gray'}
            helpertext={errors.password2 ? errors.password2.message : undefined}
          />
        </div>

        {serverError && (
          <p className="text-red-500 text-center">{serverError}</p>
        )}
        <div className="flex items-center mb-4">
          <div>
            <input id="accept_terms" type="checkbox" className="rounded" required />
            <label htmlFor="accept_terms" className="ml-2 text-sm">
              I accept the
              <span className="text-[#3DB1FF] font-semibold"> Terms of service and privacy</span>
            </label>
          </div>
        </div>
        <div >
          <Button type="submit" className='w-full bg-[#3DB1FF]'>Reset password</Button>
        </div>
      </div>
    </form>
  )
}
