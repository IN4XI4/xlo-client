import React, { useState } from 'react'
import { FaRegCircleXmark } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import { sendEmailInvitations } from '../../api/spaces.api';


export function InvitePeopleModal({ spaceId, onActionComplete, onCancel }) {

  const [inputText, setInputText] = useState('');
  const [addedEmails, setAddedEmails] = useState([]);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleAddEmail = () => {
    const email = inputText.trim();
    if (email && validateEmail(email) && !addedEmails.includes(email)) {
      setAddedEmails((prev) => [...prev, email]);
      setInputText('');
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (email) => {
    setAddedEmails((prev) => prev.filter((item) => item !== email));
  };

  const validateEmail = (email) => {
    // Validación básica de email
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSendInvites = async () => {
    if (addedEmails.length === 0) return;
    try {
      await sendEmailInvitations(spaceId, { emails: addedEmails });
      setAddedEmails([]);
      onActionComplete('Invitation emails are being sent!')
      onCancel();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50" onClick={onCancel}>
      <div className="bg-white px-3 md:px-4 py-4 rounded-lg shadow-lg text-center w-11/12 md:w-1/3 my-3 overflow-y-auto
      flex flex-col items-between"
        onClick={handleModalClick}>
        <div className='flex justify-between pb-3 md:pb-4 border-b'>
          <div className='flex-1 text-[#43B29D] font-semibold'>
            Share invite
          </div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onCancel}>
            <FaRegCircleXmark className='text-2xl' />
          </div>
        </div>
        <div className='border bg-gray-50 rounded-lg text-start text-gray-500 text-sm p-3 md:p-4 m-3 md:m-6'>
          <div className='font-semibold'>Join me on mixelo</div>
          <div>Hey, follow our stories on Mixelo!</div>
          <div>
            Connect to: → https://mixelo.io/ and create an account.
          </div>
          <div>
            Once you're in, look for our space using this link: → https://mixelo.io/space-url/.
          </div>
        </div>
        <div className='py-2 w-full'>
          <input type="text"
            placeholder="Enter friend's email"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded-full" />
        </div>
        <div className='flex items-center py-2'>
          <div className='p-2 text-white text-sm bg-[#3DB1FF] rounded-full' onClick={handleAddEmail}>
            <FaPlus />
          </div>
          <div className='ps-2 text-[#3DB1FF] cursor-pointer' onClick={handleAddEmail}> Add email</div>
        </div>
        <div className='flex flex-wrap text-sm text-gray-500 py-2'>
          {addedEmails.map((email, index) => {
            return (
              <div key={index}
                className='px-3 rounded-full border border-[#3DB1FF] my-1 py-1 me-1 flex justify-between items-center'>
                <div>
                  {email}
                </div>
                <FaRegCircleXmark className='ms-2 text-base cursor-pointer text-[#3DB1FF]'
                  onClick={() => handleRemoveEmail(index)} />
              </div>
            )
          })}
        </div>
        <div className='flex justify-end items-center'>
          <div className='bg-[#3DB1FF] px-4 md:px-6 py-2 rounded-full text-white cursor-pointer text-sm'
          onClick={addedEmails.length > 0 ? handleSendInvites : undefined}>
            SEND INVITE
          </div>
        </div>
      </div>
    </div>
  )
}
