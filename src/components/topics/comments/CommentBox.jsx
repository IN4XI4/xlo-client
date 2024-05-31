import React, { useState } from 'react'
import Picker from '@emoji-mart/react'
import { FaTimes, FaLaugh, FaPaperPlane, } from 'react-icons/fa';
import { createComment } from '../../../api/blog.api';
import { Tooltip } from 'flowbite-react';


function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

export function CommentBox({ storyId, parentCommentId, setParentCommentId, replyingToText, setReplyingToText, onCommentSubmit }) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [askForHelp, setAskForHelp] = useState(false);
  const truncatedReplyingToText = replyingToText ? truncateText(replyingToText, 60) : '';

  const handleEmojiSelect = (emoji) => {
    setText(text => text + emoji.native);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(show => !show);
  };

  const handleCancelReply = () => {
    setParentCommentId(null);
    setReplyingToText('');
  };

  const handleSubmit = async () => {
    if (text.trim()) {
      const commentData = {
        story: storyId,
        comment_text: text,
        is_active: true,
        ask_for_help: askForHelp,
        ...(parentCommentId && { parent: parentCommentId })
      };

      try {
        await createComment(commentData);
        setText('');
        setErrors({});
        setParentCommentId(null);
        setReplyingToText('');
        onCommentSubmit();
        if (showEmojiPicker === true) {
          toggleEmojiPicker()
        }
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error al crear comentario', error);
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className='pt-4 pb-6'>
      <div className="flex justify-between pb-3">
        <div className='font-bold'>Your message</div>
        <div className='flex justify-center items-center text-gray-500 text-sm'>A note for extra info</div>
      </div>
      {replyingToText && (
        <div className="flex justify-between items-center p-2 text-sm text-white bg-[#3DB1FF] rounded-lg">
          Replying to: {truncatedReplyingToText}
          <FaTimes onClick={handleCancelReply} className="cursor-pointer" />
        </div>
      )}
      <div className='pt-1 flex items-end'>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write text here ..."
          className="w-full p-3 border-2 border-gray-300 rounded-t-lg"
          rows="7"
          id='commentArea'
        />
      </div>
      <div className='bg-gray-50 p-3 flex justify-between items-center rounded-b-lg border-b-2 border-l-2 border-r-2 border-gray-300'>
        <div className='flex flex-col md:flex-row md:items-center'>
          <button
            onClick={handleSubmit}
            className={`${text ? 'bg-[#3DB1FF]' : 'bg-gray-500 opacity-50 cursor-not-allowed'} flex py-2 px-3 rounded-lg items-center text-white mr-3`}
            disabled={!text}>
            <FaPaperPlane /><span className='ms-3'>Send message</span>
          </button>
          <div className='pt-2 md:pt-0'>
            <Tooltip content="Send this message to admins so they can help you" style="dark">
              <input
                type="checkbox"
                id="askForHelp"
                checked={askForHelp}
                onChange={(e) => setAskForHelp(e.target.checked)}
                className="mr-1 rounded cursor-pointer"
              />
              <label htmlFor="askForHelp">Ask for help!</label>
            </Tooltip>
          </div>
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
