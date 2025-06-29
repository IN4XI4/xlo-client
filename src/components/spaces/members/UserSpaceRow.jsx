import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { FaXmark, FaCheck } from "react-icons/fa6";
import { acceptRequestJoinSpace, makeAdmin, makeMember, rejectRequestJoinSpace } from '../../../api/spaces.api';


export function UserSpaceRow({ spaceId, member, memberType, isOwner }) {

  const hasProfileInfo = member.first_name || member.last_name || member.profession;
  const [actionDone, setActionDone] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [hideRow, setHideRow] = useState(false);

  const handleMakeAdmin = async () => {
    try {
      await makeAdmin(spaceId, { user_id: member.id });
      setActionDone(true);
      setTimeout(() => setHideRow(true), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMakeStandard = async () => {
    try {
      await makeMember(spaceId, { user_id: member.id });
      setActionDone(true);
      setTimeout(() => setHideRow(true), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await acceptRequestJoinSpace(member.request_id);
      setAccepted(true);
      setTimeout(() => setHideRow(true), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await rejectRequestJoinSpace(member.request_id);
      setDeclined(true);
      setTimeout(() => setHideRow(true), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`flex justify-between items-center transition-opacity duration-500 ease-in-out 
      ${hideRow ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
      <div className='flex items-center truncate'>
        <div className='rounded-full flex items-center justify-center h-14 w-14 flex-shrink-0'>
          {member.profile_picture ? (
            <img src={member.profile_picture}
              alt="Profile"
              className="h-10 w-10 border-2 rounded-full cursor-pointer"
            />
          ) : (
            <div className={"h-10 w-10 cursor-pointer p-2 bg-[#3DB1FF] text-white rounded-full flex items-center justify-center"}>
              <FaUser />
            </div>
          )}
        </div>
        <div className='text-sm text-gray-500 truncate'>
          {hasProfileInfo && (
            <div className='truncate'>
              {[member.first_name, member.last_name].filter(Boolean).join(' ')}
              {member.profession ? ` | ${member.profession}` : ''}
            </div>
          )}
          <div>{member.email}</div>
        </div>
      </div>
      <div className=''>
        {memberType === 'standard' && isOwner && (
          <div onClick={handleMakeAdmin} className="bg-[#5B0FFE] text-white font-semibold w-32 h-6 items-center 
          flex justify-center text-sm px-3 rounded-full transition-transform cursor-pointer">
            {actionDone ? (<FaCheck />) : (<>Make admin</>)}
          </div>
        )}
        {memberType === 'admin' && isOwner && (
          <div onClick={handleMakeStandard} className="bg-[#3DB1FF] whitespace-nowrap text-white w-32 h-6 font-semibold 
          flex items-center justify-center text-sm px-3 rounded-full transition-transform cursor-pointer" >
            {actionDone ? (<FaCheck />) : (<>Make standard</>)}
          </div>
        )}
        {memberType === 'pending' && (
          <div className="space-y-2 pb-3">
            <div onClick={handleAcceptRequest}
              className="bg-[#43B29D] text-white font-semibold text-sm px-3 w-28 h-6 rounded-full flex items-center 
              justify-center cursor-pointer transition-transform">
              {accepted ? (<FaCheck />) : (<><FaCheck className="mr-2" />Accept</>)}
            </div>
            <div onClick={handleDeclineRequest}
              className="bg-[#FD4E3F] text-white font-semibold text-sm px-3 w-28 h-6 rounded-full flex items-center 
              justify-center cursor-pointer transition-transform">
              {declined ? (<FaCheck />) : (<><FaXmark className="mr-2" />Decline</>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
