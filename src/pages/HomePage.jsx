import React from 'react'
import { Login } from '../components/Login'
import { Welcome } from '../components/Welcome';

export function HomePage() {
  const token = localStorage.getItem("token");
  // TODO: Validate if token is correct bringing all topics...
  const renderToken = () => (
    <>
      <div className="pt-24 md:pt-32 px-4 md:px-16 lg:px-32 xl:px-44">
        <div className='text-4xl'>All Topics</div>
      </div>
    </>
  );

  const renderNoToken = () => (
    <>
      <div className="grid grid-cols-2 pt-24 md:pt-32 px-4 md:px-16 lg:px-32 xl:px-44">
        <div className='col-span-2 md:col-auto pb-6 px-2'>
          <Welcome />
        </div>
        <div className='col-span-2 md:col-auto pb-8 sm:px-24 md:px-0'>
          <Login />
        </div>
      </div>
    </>
  );
  return (
    <div>
      {token ? renderToken() : renderNoToken()}
    </div>

  )
}
