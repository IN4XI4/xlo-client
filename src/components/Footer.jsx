import React from 'react';
import { FaTwitter, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';


export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white shadow w-full py-4 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className="grid grid-cols-6 justify-between items-center">
        <div className="col-span-6 md:col-span-2 text-center md:text-start text-gray-500">
          &copy; {currentYear} Inaxia Project | All Rights Reserved
        </div>
        <div className="col-span-3 md:col-span-2 flex text-center justify-evenly items-center">
          <div className="inline-flex items-center pt-2">
            <span className="text-stone-700 pr-2">Email Us</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
