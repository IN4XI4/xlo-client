import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Accordion } from "flowbite-react";
import { GrUpdate } from "react-icons/gr";
import { FaExplosion, FaLock, FaLockOpen } from "react-icons/fa6";
import { FaRocket } from 'react-icons/fa';

import { ConfirmationModal } from '../modals/ConfirmationModal';
import { SelectCategories } from './create/SelectCategories';
import { getTopicTags } from '../../api/base.api';
import { deleteSpace, leaveSpace, updateSpace } from '../../api/spaces.api';


export function SpaceSettingsBox({ spaceInfo, onActionComplete }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (allCategories.length === 0) {
      loadCategories();
    }
  }, []);

  useEffect(() => {
    if (spaceInfo?.category_ids?.length > 0) {
      setCategoryIds(spaceInfo.category_ids);
    }
  }, [spaceInfo]);

  useEffect(() => {
    if (spaceInfo?.access_type) {
      setIsPrivate(spaceInfo.access_type !== "free");
    }
  }, [spaceInfo]);

  const loadCategories = async () => {
    try {
      const response = await getTopicTags();
      setAllCategories(response.data.results);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const cancelAction = () => {
    setShowConfirmationModal(false);
  };

  const handleUpdateSpace = async () => {
    try {
      const payload = {
        access_type: isPrivate ? "private" : "free",
        categories: categoryIds,
      };
      await updateSpace(spaceInfo.id, payload);
      navigate(`/spaces/${spaceInfo.slug}`);
      window.scrollTo(0, 0);
      if (onActionComplete) {
        onActionComplete("Space settings updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error updating space:", error);
    }
  };

  const handleDeleteSpace = async () => {
    try {
      await deleteSpace(spaceInfo.id);
      setShowConfirmationModal(false);
      navigate("/spaces");
      window.scrollTo(0, 0);
      if (onActionComplete) {
        onActionComplete("Space Deleted successfully!", "success");
      }
    } catch (error) {
      console.error("Error deleting space:", error);
      setShowConfirmationModal(false);
    }
  };

  const handleLeaveSpace = async () => {
    try {
      await leaveSpace(spaceInfo.id);
      setShowConfirmationModal(false);
      navigate("/spaces");
      window.scrollTo(0, 0);
      if (onActionComplete) {
        onActionComplete("You have left this space successfully!", "success");
      }
    } catch (error) {
      console.error("Error leaving space:", error);
      setShowConfirmationModal(false);
    }
  };

  const updatePrivacy = (isPrivate) => {
    setIsPrivate(isPrivate);
  };

  const updateCategories = (newCategoryIds) => {
    setCategoryIds(newCategoryIds);
  };

  const modalMessage = actionType === "delete"
    ? "Are you sure you want to delete this space?"
    : "Are you sure you want to leave this space?";
  const confirmAction = actionType === "delete" ? handleDeleteSpace : handleLeaveSpace;

  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold pb-3'>Space settings</div>
      <Accordion collapseAll>
        {spaceInfo.is_owner ? (
          <Accordion.Panel>
            <Accordion.Title>The [type of space] related to this selected space</Accordion.Title>
            <Accordion.Content>
              <div className='justify-center pt-2 pb-3'>
                <div className='flex items-center justify-between text-sm mb-4'>
                  <div className={`flex w-24 py-1 items-center justify-center rounded text-white cursor-pointer
                    ${!isPrivate ? 'bg-[#3DB1FF]' : 'bg-gray-200'}`} onClick={() => updatePrivacy(false)}>
                    <FaLockOpen />
                    <span className='ps-2'>Public</span>
                  </div>
                  <div className='flex-grow ps-2 text-start text-gray-500'>Open to anyone, best for communities</div>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <div className={`flex w-24 py-1 items-center justify-center rounded text-white cursor-pointer
                    ${isPrivate ? 'bg-[#3DB1FF]' : 'bg-gray-200'}`} onClick={() => updatePrivacy(true)}>
                    <FaLock />
                    <span className='ps-2'>Private</span>
                  </div>
                  <div className='flex-grow ps-2 text-start text-gray-500'>Invite only, best for yourself or teams</div>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        ) : (<></>)}
        {spaceInfo.is_owner ? (
          <Accordion.Panel>
            <Accordion.Title>The [categories & topics] related to the selected space</Accordion.Title>
            <Accordion.Content>
              <div className=''>
                <SelectCategories
                  categories={allCategories}
                  selectedCategoryIds={categoryIds}
                  onChange={updateCategories}
                />
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        ) : (<></>)}
        <Accordion.Panel>
          <Accordion.Title>The [danger-zone] related to the selected space</Accordion.Title>
          <Accordion.Content>
            <div>
              <div className='font-semibold text-gray-500 pb-3'>Be careful, you can destroy everything.</div>
              {spaceInfo.is_owner ? (
                <div className='flex items-center flex-col md:flex-row'>
                  <div className='bg-[#FD4E3F] p-2 rounded-lg text-white flex min-w-fit items-center cursor-pointer'
                    onClick={() => {
                      setActionType("delete");
                      setShowConfirmationModal(true);
                    }}>
                    <FaExplosion /> <span className='ps-2'>Delete the space</span>
                  </div>
                  <div className='mt-2 md:mt-0 ps-3 text-gray-500'>
                    By pressing this button, you decide to delete this space, this will affect all users on the space!
                  </div>
                </div>) :
                (<div className='flex items-center flex-col md:flex-row'>
                  <div className='bg-[#F7A411] p-2 rounded-lg text-white flex items-center min-w-fit cursor-pointer'
                    onClick={() => {
                      setActionType("leave");
                      setShowConfirmationModal(true);
                    }}>
                    <FaRocket /> <span className='ps-2'>Leave the space</span>
                  </div>
                  <div className='mt-2 md:mt-0 ps-3 text-gray-500'>
                    By pressing this button, you decide to unsubscribe from this space, you will no longer be able to view the content it contains!
                  </div>
                </div>)}
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
      <div className='pt-3 flex justify-end'>
        <button className='px-6 py-2 bg-[#3DB1FF] text-white rounded-lg flex items-center'
          onClick={handleUpdateSpace}>
          <GrUpdate /><span className='ps-2'>Update</span>
        </button>
      </div>
      {showConfirmationModal && <ConfirmationModal
        onConfirm={confirmAction}
        onCancel={cancelAction}
        message={modalMessage}
        buttonColor={"#FD4E3F"}
      />}
    </div>
  )
}
