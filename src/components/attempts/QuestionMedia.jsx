import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

export function QuestionMedia({ image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!image) return null;

  return (
    <>
      <div className="flex justify-center mt-3 mb-1 lg:mt-0 lg:flex-shrink-0 lg:justify-end">
        <img
          src={image}
          alt=""
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:max-w-xs max-h-72 lg:w-72 lg:max-w-none lg:max-h-72 xl:w-80 xl:max-h-80 2xl:w-96 2xl:max-h-96 object-cover rounded-lg cursor-pointer"
        />
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          >
            <IoClose />
          </div>
          <img
            src={image}
            alt=""
            onClick={(event) => event.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
}
