import { Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { updatePassword } from '../../api/users.api';


export function PasswordInfo() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async () => {
    const data = {
      current_password: currentPassword,
      password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      const response = await updatePassword(data);
      setError('');
    } catch (error) {
      setError(error.response.data.error);
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className='bg-white rounded border border-gray-100 p-3 mb-3'>
      <div className='text-xl font-bold pb-3'>Informations sur votre mot de passe</div>
      <div className='grid grid-cols-1 md:grid-cols-3 pb-4'>
        <div>
          <div className="mb-2">
            <Label htmlFor="current_password" value="Mot de passe actuel" className='font-semibold' />
          </div>
          <TextInput
            id="current_password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className='md:ps-2'>
          <div className="mb-2">
            <Label htmlFor="new_password" value="Nouveau mot de passe" className='font-semibold' />
          </div>
          <TextInput
            id="new_password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className='md:ps-2'>
          <div className="mb-2">
            <Label htmlFor="confirm_password" value="Confirmez le nouveau mot de passe" className='font-semibold' />
          </div>
          <TextInput
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div className='flex flex-col md:flex-row '>
        <div className='pe-4'>
          <div className='font-semibold pb-3'>Exigences relatives au mot de passe:</div>
          <button
            onClick={handleUpdatePassword}
            className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white mb-4 md:mb-0'>Update</button>
          {error && <div className='text-red-500 mt-2'>{error}</div>}
        </div>
        <div className='text-gray-500 text-sm pt-1'>
          <div>Assurez-vous que ces exigences soit remplies:</div>
          <div>Au moins 10 caractères</div>
          <div>Au moins 1 caractère minuscule</div>
          <div>Au moins 1 caractère spécial, par exemple : (! @ # ?)</div>
        </div>
      </div>
    </div>
  )
}
