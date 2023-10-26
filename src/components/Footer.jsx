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
            <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg" className='pr-1'>
              <path d="M12.5 9H1.5C1.23478 9 0.98043 8.89464 0.792893 8.70711C0.605357 8.51957 0.5 8.26522 0.5 8C0.5 7.73478 0.605357 7.48043 0.792893 7.29289C0.98043 7.10536 1.23478 7 1.5 7H12.5C12.7652 7 13.0196 7.10536 13.2071 7.29289C13.3946 7.48043 13.5 7.73478 13.5 8C13.5 8.26522 13.3946 8.51957 13.2071 8.70711C13.0196 8.89464 12.7652 9 12.5 9Z" fill="#1F2A37" />
              <path d="M8.5 13C8.30225 13 8.10895 12.9413 7.94454 12.8314C7.78013 12.7215 7.65199 12.5654 7.57632 12.3827C7.50065 12.2 7.48085 11.9989 7.51942 11.805C7.55798 11.611 7.65319 11.4329 7.793 11.293L11.086 8L7.793 4.707C7.69749 4.61475 7.62131 4.50441 7.5689 4.3824C7.51649 4.2604 7.4889 4.12918 7.48775 3.9964C7.48659 3.86362 7.5119 3.73194 7.56218 3.60905C7.61246 3.48615 7.68671 3.3745 7.7806 3.2806C7.8745 3.18671 7.98615 3.11246 8.10905 3.06218C8.23194 3.0119 8.36362 2.9866 8.4964 2.98775C8.62918 2.9889 8.7604 3.01649 8.8824 3.0689C9.00441 3.12131 9.11475 3.19749 9.207 3.293L13.2071 7.29289C13.3946 7.48043 13.5 7.73478 13.5 8C13.5 8.26522 13.3946 8.51957 13.2071 8.70711L9.207 12.707C9.01951 12.8946 8.76519 12.9999 8.5 13Z" fill="#1F2A37" />
              <path d="M15.5 16H12.5C12.2348 16 11.9804 15.8946 11.7929 15.7071C11.6054 15.5196 11.5 15.2652 11.5 15C11.5 14.7348 11.6054 14.4804 11.7929 14.2929C11.9804 14.1054 12.2348 14 12.5 14H15.5C15.7652 14 16.0196 13.8946 16.2071 13.7071C16.3946 13.5196 16.5 13.2652 16.5 13V3C16.5 2.73478 16.3946 2.48043 16.2071 2.29289C16.0196 2.10536 15.7652 2 15.5 2H12.5C12.2348 2 11.9804 1.89464 11.7929 1.70711C11.6054 1.51957 11.5 1.26522 11.5 1C11.5 0.734784 11.6054 0.48043 11.7929 0.292893C11.9804 0.105357 12.2348 0 12.5 0H15.5C16.2956 0 17.0587 0.316071 17.6213 0.87868C18.1839 1.44129 18.5 2.20435 18.5 3V13C18.5 13.7956 18.1839 14.5587 17.6213 15.1213C17.0587 15.6839 16.2956 16 15.5 16Z" fill="#1F2A37" />
            </svg>
            <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.5 0H2.5C1.96957 0 1.46086 0.224761 1.08579 0.624839C0.710714 1.02492 0.5 1.56754 0.5 2.13333V13.8667C0.5 14.4325 0.710714 14.9751 1.08579 15.3752C1.46086 15.7752 1.96957 16 2.5 16H18.5C19.0304 16 19.5391 15.7752 19.9142 15.3752C20.2893 14.9751 20.5 14.4325 20.5 13.8667V2.13333C20.5 1.56754 20.2893 1.02492 19.9142 0.624839C19.5391 0.224761 19.0304 0 18.5 0ZM17.953 2.13333L10.543 8.83627L3.056 2.13333H17.953ZM2.5 13.8667V4.42133L9.3 10.5013C9.64214 10.7758 10.0589 10.9237 10.487 10.9227C10.9415 10.9208 11.3829 10.7604 11.744 10.4661L18.5 4.42133V13.8667H2.5Z" fill="#1F2A37" />
            </svg>
          </div>
        </div>
        <div className="col-span-3 md:col-span-2 flex justify-center md:justify-end pt-2 px-1">
          <div className="pr-8">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-stone-700" />
            </a>
          </div>
          <div className="pr-8">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-stone-700" />
            </a>
          </div>
          <div className="">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="text-stone-700" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
