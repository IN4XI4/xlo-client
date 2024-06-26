import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/users.api';
import { login } from '../../api/base.api';


export function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      password2: ''
    }
  });
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    data.username = data.email
    try {
      const response = await registerUser(data);
      try {
        const loginResponse = await login({
          username: data.email,
          password: data.password
        });
        localStorage.setItem('token', loginResponse.data.token);
        navigate('/');
        window.location.reload();

      } catch (loginError) {
        console.error('Login error:', loginError);
        setServerError('Registration successful, but login failed. Please try logging in.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'An error occurred during registration.';
      if (error.response && error.response.data) {
        errorMessage = extractErrorMessage(error.response.data);
      }
      setServerError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  const extractErrorMessage = (errorData) => {
    if (errorData.non_field_errors) {
      return errorData.non_field_errors.join(' ');
    }
    const firstErrorKey = Object.keys(errorData)[0];
    return errorData[firstErrorKey].join(' ');
  };
  return (
    <form className="grid grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white p-8 rounded-md shadow-md col-span-full xl:col-span-4">
        <div className="text-3xl font-bold mb-4">Create your free account</div>
        <div className="mb-4">
          <div className='pb-2'>
            <Label htmlFor="email" className="text-gray-900" value="Your email" />
          </div>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) =>
              <TextInput
                {...field}
                placeholder="Email"
                type="email"
                color={errors.email ? 'failure' : 'gray'}
                helperText={errors.email?.message}
              />
            }
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field }) =>
              <TextInput
                {...field}
                placeholder="Password"
                type="password"
                color={errors.password ? 'failure' : 'gray'}
                helperText={errors.password?.message}
              />
            }
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password2" className="block text-sm font-medium text-gray-900 mb-2">Confirm password</label>
          <Controller
            name="password2"
            control={control}
            rules={{
              required: "Confirm Password is required",
              validate: (value) => {
                return (
                  value === '' ||
                  value === getValues().password ||
                  "Passwords must match"
                );
              },
            }}
            render={({ field }) =>
              <TextInput
                {...field}
                placeholder="Confirm Password"
                type="password"
                color={errors.password2 ? 'failure' : 'gray'}
                helperText={errors.password2?.message}
              />
            }
          />
        </div>

        {serverError && (
          <p className="text-red-500 text-center">{serverError}</p>
        )}
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className='rounded' required />
            <Label htmlFor="accept">
              I accept the
              <span className="text-[#3DB1FF] font-semibold"> Terms of service and privacy</span>
            </Label>
          </div>
        </div>
        <div >
          <Button type="submit" className='w-full bg-[#3DB1FF]'>Create account</Button>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-900 font-bold">Already have an account? </span>
          <Link to="" className="text-sm text-blue-500 hover:underline">Login</Link>
        </div>
      </div>
    </form>
  )
}
