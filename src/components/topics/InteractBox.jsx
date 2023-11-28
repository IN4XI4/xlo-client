import React from 'react'
import { FaPlus, FaRegBell, FaReply, FaShare, FaSyncAlt, FaUserEdit } from 'react-icons/fa';

export function InteractBox() {
    return (
        <div className='flex items-center justify-center md:px-16 lg:px-24 mt-2 mb-4 space-x-3 py-3'>
            <div className='w-12 h-12 p-2 bg-white text-sm rounded-lg text-gray-500 flex flex-col items-center'>
                <div>
                    <FaRegBell />
                </div>
                <span> Notify</span>
            </div>
            <div className='w-12 h-12 p-2 bg-white rounded-lg text-sm text-gray-500 flex flex-col items-center'>
                <div>
                    <FaSyncAlt className='' />
                </div>
                Recall
            </div>
            <div className='w-12 h-12 p-2 bg-white rounded-lg text-sm text-gray-500 flex flex-col items-center'>
                <div>
                    <FaShare className='' />
                </div>
                Share
            </div>
            <div className='w-12 h-12 p-2 bg-white rounded-lg text-sm text-gray-500 flex flex-col items-center'>
                <div>
                    <FaUserEdit className='' />
                </div>
                <span className='text-[0.7rem]'>Contact</span>
            </div>
            <div className='w-12 h-12 p-2 bg-white rounded-lg text-sm text-gray-500 flex flex-col items-center'>
                <div>
                    <FaPlus className='' />
                </div>
                Create
            </div>
            <div className='p-3 text-white text-xl bg-[#3db1ff] rounded-full border-2 border-[#43ADCC]'>
                <FaReply />
            </div>
        </div>
    )
}
