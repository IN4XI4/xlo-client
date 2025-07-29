import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

import { Alert } from 'flowbite-react';
import { FaPlus, FaSearch, FaUsers } from 'react-icons/fa'
import { HiInformationCircle } from 'react-icons/hi';
import { ImArrowUpLeft2 } from "react-icons/im";

import { ListSpaceMembers } from '../components/spaces/members/ListSpaceMembers';
import { getSpaceAdmins, getSpaceBySlug, getSpaceMembers, getSpacePendingRequests } from '../api/spaces.api';
import { InviteUsersModal } from '../components/spaces/members/InviteUsersModal';


export function SpaceMembersPage() {
  const { slug } = useParams();
  const [spaceId, setSpaceId] = useState({});
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showInviteUsersModal, setShowInviteUsersModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('success');

  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [memberType, setMemberType] = useState('standard');
  const [members, setMembers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const allowedTabs = [];
  if (isAdmin) allowedTabs.push("pending");
  if (isMember) allowedTabs.push("standard");
  if (isMember) allowedTabs.push("admin");

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchText(inputText);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    loadSpace();
  }, [slug]);

  useEffect(() => {
    if (memberType && isMember) {
      loadMembers(1);
    }
  }, [searchText, memberType]);

  useEffect(() => {
    if (currentPage > 1) {
      loadMembers(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const allowed = [];
    if (isAdmin) allowed.push("pending");
    if (isMember) allowed.push("standard");
    if (isMember) allowed.push("admin");

    if (!allowed.includes(memberType)) {
      setMemberType(allowed[0] || null);
    }
  }, [isOwner, isAdmin, isMember]);

  async function loadSpace() {
    if (slug) {
      try {
        const response = await getSpaceBySlug(slug);
        setSpaceId(response.data.id);
        setIsOwner(response.data.is_owner);
        setIsAdmin(response.data.is_owner || response.data.is_admin);
        setIsMember(response.data.is_owner || response.data.is_admin || response.data.is_member);
      } catch (error) {
        console.error("Error fetching space by slug:", error);
      }
    } else {
      setIsOwner(false);
      setIsAdmin(false);
      setIsMember(false);
    }
  }

  async function loadMembers(page) {
    try {
      let res;

      if (memberType === 'pending') {
        res = await getSpacePendingRequests(slug, searchText);
      } else if (memberType === 'admin') {
        res = await getSpaceAdmins(slug, searchText);
      } else {
        res = await getSpaceMembers(slug, searchText);
      }

      const results = res.data.results
      if (page === 1) {
        setMembers(results);
      } else {
        setMembers(prev => [...prev, ...results]);
      }

      setHasMore(!!res.data.next);
      if (page === 1) setCurrentPage(1);

    } catch (err) {
      console.error(err);
      setError(err);
      setHasMore(false);
    }
  }

  const openInviteUsersModal = () => {
    setShowInviteUsersModal(true);
  };

  const closeInviteUsersModal = () => {
    setShowInviteUsersModal(false);
  };

  const handleShowAlert = (message, color = 'success') => {
    setAlertMessage(message);

    setAlertColor(color);
    setTimeout(() => {
      setAlertMessage('');
    }, 7000);
  };

  const handleActionComplete = (message, color) => {
    handleShowAlert(message, color);
  };

  if (!isMember) {
    return (
      <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44 text-center text-gray-500">
        You do not have permission to view this space.
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      {alertMessage && (
        <Alert color={alertColor} icon={HiInformationCircle} className='mb-4'>
          <span className="font-medium">{alertMessage}</span>
        </Alert>
      )}
      <div className='flex items-center'>
        <div className='bg-[#3DB1FF] rounded-full p-2 md:p-3 me-3'><FaUsers className='text-3xl md:text-4xl text-white' /></div>
        <div className='text-[#3DB1FF] text-2xl md:text-3xl font-semibold'>Space members</div>
      </div>
      <div className='flex items-center border-b-4'>
        <Link to={`/spaces/${slug}/`} className='pe-2'>
          <button className="p-3 bg-gray-200 rounded-full border">
            <ImArrowUpLeft2 className='text-[#6B7280]' />
          </button>
        </Link>
        <div className='py-3 border-b relative w-full'>
          <input type="text"
            placeholder="Search by name"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded-full" />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setSearchText(inputText)} />
        </div>
      </div>
      <div className='py-3'>
        <div className='flex items-center space-x-3 md:space-x-6 font-semibold'>
          {allowedTabs.map(type => (
            <div
              key={type}
              className={`cursor-pointer ${memberType === type ? "text-[#3DB1FF]" : "text-gray-600"}`}
              onClick={() => setMemberType(type)}
            >
              {type === "pending" ? "Pending users" :
                type === "admin" ? "Admin users" :
                  "Standard users"}
            </div>
          ))}
        </div>
      </div>
      <div className='pb-3'>
        {isAdmin &&
          (<>
            <div className='flex items-center'>
              <div className='flex rounded-full items-center p-2 bg-[#3DB1FF] text-white cursor-pointer'
                onClick={() => openInviteUsersModal()}>
                <FaPlus />
              </div>
              <div className='ps-1 text-[#3DB1FF] font-semibold cursor-pointer' onClick={() => openInviteUsersModal()}>
                Invite new users
              </div>
            </div>
          </>)}
      </div>
      <ListSpaceMembers
        members={members}
        hasMore={hasMore}
        setCurrentPage={setCurrentPage}
        memberType={memberType}
        isAdmin={isAdmin}
        isOwner={isOwner}
        spaceId={spaceId}
      />
      {showInviteUsersModal && (
        <InviteUsersModal
          spaceId={spaceId}
          onActionComplete={handleActionComplete} 
          onCancel={closeInviteUsersModal}
        />
      )}
    </div>
  )
}
