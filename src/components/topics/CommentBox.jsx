import React, { useState } from 'react'
import Picker from '@emoji-mart/react'
import { FaLaugh, FaPaperPlane, } from 'react-icons/fa';
import { createComment } from '../../api/blog.api';


export function CommentBox({ storyId, onCommentSubmit }) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEmojiSelect = (emoji) => {
    setText(text => text + emoji.native);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(show => !show);
  };

  const handleSubmit = async () => {
    if (text.trim()) {
      const commentData = {
        story: storyId,
        comment_text: text,
        is_active: true
      };

      try {
        await createComment(commentData);
        setText('');
        setErrors({});
        onCommentSubmit();
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error al crear comentario', error);
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className='py-6'>
      <div className="flex justify-between">
        <div className='font-bold'>Your message</div>
        <div className='flex justify-center items-center text-gray-500 text-sm'>A note for extra info</div>
      </div>
      <div className='pt-3 flex items-end'>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write text here ..."
          className="w-full p-3 border-2 border-gray-300 rounded-t-lg"
          rows="7"
        />
      </div>
      <div className='bg-gray-50 p-3 flex justify-between items-center rounded-b-lg border-b-2 border-l-2 border-r-2 border-gray-300'>
        <div>
          <button
            onClick={handleSubmit}
            className={`${text ? 'bg-[#3DB1FF]' : 'bg-gray-500 opacity-50 cursor-not-allowed'} flex py-2 px-3 rounded-lg items-center text-white`}
            disabled={!text}>
            <FaPaperPlane /><span className='ms-3'>Send message</span>
          </button>
        </div>
        <div className='flex items-center'>
          <button onClick={toggleEmojiPicker} className="text-gray-500">
            {showEmojiPicker ? '✖️' : <FaLaugh />}
          </button>
        </div>

      </div>
      {Object.keys(errors).length > 0 && (
        <div className='text-red-500 text-sm mt-2'>
          {Object.entries(errors).map(([key, value]) => (
            <p key={key}>{value}</p>
          ))}
        </div>
      )}
      <div className='flex justify-end py-1'>
        {showEmojiPicker && (
          <Picker
            onEmojiSelect={handleEmojiSelect}
            title="Pick your emoji…"
            emoji="point_up"
            emojiButtonRadius="80%"
            emojiButtonSize="26"
            emojiSize="20"
          />
        )}
      </div>
    </div>
  );
}
