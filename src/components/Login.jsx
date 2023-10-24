import React from 'react';
import { Button, Label, TextInput } from 'flowbite-react';

export function Login() {
  return (
    <form className="grid grid-cols-4">
      <div className="hidden lg:block"></div>
      <div className="bg-white p-8 rounded-md shadow-md col-span-full xl:col-span-3">
        <div className="text-3xl font-bold mb-4">Sign In</div>
        <div className="mb-4">
          <div className='pb-2'>
            <Label htmlFor="email" className="text-gray-900" value="Your email" />
          </div>
          <TextInput id="email" type="email" required placeholder="name@example.com" />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <TextInput id="password" type="password" placeholder="********" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <input id="remember" type="checkbox" className="rounded" />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-00">Remember this device</label>
          </div>
          <a href="#" className="text-sm text-blue-500 hover:underline">Lost Password?</a>
        </div>
        <div >
          <Button type="submit" className='w-full bg-[#3DB1FF]'>Login to your account</Button>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-900 font-bold">Not registered yet? </span>
          <a href="#" className="text-sm text-blue-500 hover:underline">Create an account</a>
        </div>
      </div>
    </form>
  )
}
