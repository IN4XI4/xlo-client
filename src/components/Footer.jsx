import React from 'react';
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { MdInfoOutline, MdMailOutline } from 'react-icons/md';


export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white shadow w-full py-4 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
      <div className="grid grid-cols-6 justify-between items-center">
        <div className="col-span-6 md:col-span-2 pt-1 md:pt-0 text-center md:text-start text-gray-500 text-sm md:text-base order-3 md:order-1">
          &copy; {currentYear}, an inaxia project | All rights reserved
        </div>
        <div className="col-span-3 md:col-span-2 flex text-center justify-evenly items-center order-1 md:order-2">
          <div className="inline-flex items-center">
            <a href="mailto:contact@mixelo.io" className="flex items-center">
              <span className="text-gray-500 pr-1 cursor-pointer">Contact</span>
              <MdMailOutline className='text-xl text-gray-500 mr-4 cursor-pointer' />
            </a>
            <span className="text-gray-500 pr-1">Privacy</span>
            <MdInfoOutline className='text-xl text-gray-500' />
          </div>
        </div>
        <div className="col-span-3 md:col-span-2 flex justify-end items-center px-1 order-2 md:order-3">
          <div className="pr-4 md:pr-8 items-center">
            <a href="https://www.facebook.com/mixelo.community" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-gray-500" />
            </a>
          </div>
          <div className="pr-4 md:pr-8">
            <a href="https://www.instagram.com/mixelopro" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-gray-500" />
            </a>
          </div>
          <div className="pr-4 md:pr-8">
            <a href="https://www.linkedin.com/company/mixelo" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="text-gray-500" />
            </a>
          </div>
          <div className="">
            <a href="https://www.twitter.com/mixelopro" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-gray-500" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
