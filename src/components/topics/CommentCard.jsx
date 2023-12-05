import React from 'react'
import { FaRegBookmark, FaRegCommentDots, FaRegHeart, FaReply, FaUser } from 'react-icons/fa';

const ActionIcons = () => (
    <div className='flex justify-end space-x-2 items-center text-gray-500'>
        <FaRegHeart className='text-xl' />
        <FaRegBookmark className='text-xl' />
        <FaRegCommentDots className='text-xl' />
        <FaReply className='text-xl' />
        <div>Comment</div>
    </div>
);

export function CommentCard({ comment }) {
    return (
        <div className='flex my-3 p-4 rounded-lg'>
            <div className='flex-none me-3'>
                {comment.user_picture ? (
                    <img src={comment.user_picture} alt="Mentor" className="h-12 w-12 rounded-full" />
                ) : <div className=' p-4 rounded-full bg-blue-50 text-gray-500'><FaUser /></div>}
            </div>
            <div className='flex-grow bg-[#F5FBFF] rounded-lg p-4'>
                <div className=''>
                    <div className="">
                        <span className='font-bold'>{comment.user_name}</span> <span className='text-gray-500'>{comment.formatted_created_time}</span>
                    </div>
                    <div className='pb-3 break-all'>
                        {comment.comment_text}
                    </div>
                    <ActionIcons />
                </div>
            </div>
        </div>
    )
}
