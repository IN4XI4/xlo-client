import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Label, TextInput } from 'flowbite-react';
import { login } from '../../api/base.api';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const apiData = {
        username: data.email,
        password: data.password,
      };
      const response = await login(apiData);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        setServerError('Login was successful, but no token was received.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.non_field_errors) {
          setServerError(errorData.non_field_errors.join(' '));
        } else {
          setServerError('An error occurred while trying to log in. Please try again.');
        }
      } else {
        setServerError('An error occurred while trying to log in. Please try again.');
      }
    }
  };
  return (
    <form className="grid grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white p-8 rounded-md shadow-md col-span-full xl:col-span-4">
        <div className="text-3xl font-bold mb-4">Sign In</div>
        <div className="mb-4">
          <div className='pb-2'>
            <Label htmlFor="email" className="text-gray-900" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            {...register('email', {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address"
              }
            })}
            color={errors.email ? 'failure' : 'gray'}
            helpertext={errors.email ? errors.email.message : undefined} />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <TextInput
            id="password"
            type="password"
            name="password"
            placeholder="********"
            {...register('password', {
              required: "Password is required",
            })}
            color={errors.password ? 'failure' : 'gray'}
            helpertext={errors.password ? errors.password.message : undefined} />
          {serverError && (
            <p className="text-red-500 text-center">{serverError}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <input id="remember" type="checkbox" className="rounded" />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-00">Remember this device</label>
          </div>
          <Link to="/?view=forgotpassword" className="text-sm text-blue-500 hover:underline">Lost Password?</Link>
        </div>
        <div >
          <Button type="submit" className='w-full bg-[#3DB1FF]'>Login to your account</Button>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-900 font-bold">Not registered yet? </span>
          <Link to="/?view=register" className="text-sm text-blue-500 hover:underline">Create an account</Link>
        </div>
      </div>
    </form>
  )
}
