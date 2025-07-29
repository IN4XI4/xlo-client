import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Label, TextInput, Textarea } from 'flowbite-react';
import { FaRegCircle, FaDotCircle, FaSync } from 'react-icons/fa';
import { HiInformationCircle } from 'react-icons/hi';


import { getSpaceBySlug, updateSpace } from '../api/spaces.api';
import { getUserProfileColors } from '../api/users.api';
import { CurrentSpaceBox } from '../components/spaces/CurrentSpaceBox';
import { CurrentSpaceBoxOwner } from '../components/spaces/CurrentSpaceBoxOwner';
import { SpaceMembersBox } from '../components/spaces/SpaceMembersBox';
import { SpaceInfoBox } from '../components/spaces/SpaceInfoBox';
import { SpacesManagerBox } from '../components/spaces/SpacesManagerBox';
import { SpacesInvitationsBox } from '../components/spaces/SpacesInvitationsBox';
import { SpaceSettingsBox } from '../components/spaces/SpaceSettingsBox';
import { useUser } from '../context/UserContext';
import { InvitePeopleModal } from '../components/spaces/InvitePeopleModal';


export function SpacesPage() {
  const { slug } = useParams();
  const [spaceInfo, setSpaceInfo] = useState({});
  const [selectedSpaceColor, setSelectedSpaceColor] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [spaceColors, setSpaceColors] = useState([]);
  const [isSpaceLoaded, setIsSpaceLoaded] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('success');
  const { user } = useUser();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showInvitePeopleModal, setShowInvitePeopleModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentSpaceColor = spaceColors.find(color => color.id === selectedSpaceColor)?.color || '#3DB1FF';

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

  useEffect(() => {
    loadSpace();
    loadSpaceColors();
  }, [slug]);

  async function loadSpace() {
    if (slug) {
      try {
        setIsSpaceLoaded(false);
        const response = await getSpaceBySlug(slug);
        setSpaceInfo(response.data);
        setIsSpaceLoaded(true);
        setSelectedSpaceColor(response.data.color);
        setIsOwner(response.data.is_owner);
        setSpaceName(response.data.name || '');
        setSpaceDescription(response.data.description || '');
      } catch (error) {
        console.error("Error fetching space by slug:", error);
      }
    } else {
      setSpaceInfo({});
      setSelectedSpaceColor(null);
      setIsOwner(false);
      setSpaceColors([]);
      setIsSpaceLoaded(true);
    }
  }

  async function loadSpaceColors() {
    try {
      const response = await getUserProfileColors();
      setSpaceColors(response.data);
    } catch (error) {
      console.error("Error fetching space colors:", error);
    }
  }

  useEffect(() => {
    if (location.state?.spaceCreated) {
      setShowSuccessMessage(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSpaceColorChange = async (colorId) => {
    if (colorId === selectedSpaceColor) {
      return;
    }
    setSelectedSpaceColor(colorId);
    if (!spaceInfo || !spaceInfo.id) {
      console.error("User ID is missing");
      return;
    }
    const spaceId = spaceInfo.id;
    const updatedInfo = { color: colorId };
    try {
      await updateSpace(spaceId, updatedInfo);
    } catch (error) {
      console.error("Error al actualizar el color de perfil:", error);
      setSelectedSpaceColor(spaceInfo.color);
    }
  };

  const handleSpaceNameChange = (e) => {
    setSpaceName(e.target.value);
  };

  const handleSpaceDescriptionChange = (e) => {
    setSpaceDescription(e.target.value);
  };

  const updateSpaceData = async () => {
    if (!spaceInfo || !spaceInfo.id) {
      console.error("User ID is missing");
      return;
    }
    const spaceId = spaceInfo.id;
    const updatedInfo = { name: spaceName, description: spaceDescription };
    try {
      await updateSpace(spaceId, updatedInfo);
    } catch (error) {
      console.error("Error updating space data:", error);
    }
  };

  const openInvitePeopleModal = () => {
    setShowInvitePeopleModal(true);
  };

  const closeInvitePeopleModal = () => {
    setShowInvitePeopleModal(false);
  };

  return (
    <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      {alertMessage && (
        <Alert color={alertColor} icon={HiInformationCircle} className='mb-4'>
          <span className="font-medium">{alertMessage}</span>
        </Alert>
      )}
      {showSuccessMessage && (
        <Alert color="success" icon={HiInformationCircle} className='mb-4'>
          <span className="font-medium">Space created successfully!</span>
        </Alert>
      )}
      <div className='text-gray-900 font-bold text-2xl md:text-4xl pt-2 pb-6'>
        {spaceInfo.id ? `Welcome to ${spaceInfo.name} Space` : "Welcome to Mixelo Spaces"}
      </div>
      {isSpaceLoaded ? (
        <div>
          {isOwner ? (
            <div className='grid grid-cols-1 md:grid-cols-3'>
              <div className='md:pe-2'>
                <div>
                  <CurrentSpaceBoxOwner currentSpaceColor={currentSpaceColor} spaceInfo={spaceInfo} />

                  <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
                    <div className='font-bold pb-2 md:pb-4 text-xl'>Space ID</div>
                    <div className='flex space-x-2 items-center justify-between'>
                      <TextInput
                        id="space_id"
                        type="text"
                        value={`${spaceInfo.slug}:mixelo.io`}
                        disabled
                      />
                      <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white whitespace-nowrap'
                        onClick={() => openInvitePeopleModal()}>
                        Invite people
                      </button>
                    </div>
                  </div>
                  <SpaceMembersBox spaceInfo={spaceInfo} />
                </div>
              </div>
              <div className='col-span-2'>
                <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
                  <div className='font-bold pb-2 text-xl'>Name of this Space</div>
                  <div className="mb-2">
                    <Label className='font-semibold' htmlFor="space_name" value="Space name" />
                  </div>
                  <TextInput
                    id="space_name"
                    type="text"
                    placeholder="Space Name"
                    className='mb-3'
                    value={spaceName}
                    onChange={handleSpaceNameChange}
                  />
                  <div className='font-bold pb-2 text-xl'>Description of this Space</div>
                  <Textarea
                    className='mb-3'
                    id="comment"
                    placeholder="Write text here..."
                    rows={3}
                    value={spaceDescription}
                    onChange={handleSpaceDescriptionChange} />
                  <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white flex items-center'
                    onClick={updateSpaceData}>
                    <FaSync className='pe-1' /> Update
                  </button>
                </div>
                <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
                  <div className='font-bold pb-2 text-xl'>Select your space color</div>
                  <div className='flex justify-between'>
                    {spaceColors && spaceColors.map((color, index) => {
                      const isCurrentColor = color.id === selectedSpaceColor;
                      const Icon = isCurrentColor ? FaDotCircle : FaRegCircle;
                      return (
                        <Icon
                          key={index}
                          className='cursor-pointer'
                          style={{ color: color.color }}
                          onClick={() => handleSpaceColorChange(color.id)} />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='md:pe-2'>
                <CurrentSpaceBox currentSpaceColor={currentSpaceColor} spaceInfo={spaceInfo} />
              </div>
              <div>
                <SpaceMembersBox spaceInfo={spaceInfo} />
              </div>
            </div>
          )}
          <div className=''>
            <SpaceInfoBox spaceInfo={spaceInfo} />
          </div>
          <div className=''>
            <SpacesManagerBox onActionComplete={handleActionComplete} user={user} />
          </div>
          <div className=''>
            <SpacesInvitationsBox onActionComplete={handleActionComplete} />
          </div>
          {spaceInfo.is_member && (
            <div className=''>
              <SpaceSettingsBox spaceInfo={spaceInfo} onActionComplete={handleActionComplete} />
            </div>
          )}
        </div>
      ) : (
        <div className='text-center text-gray-500 py-10'>
          No space found with the given identification.
        </div>
      )}
      {showInvitePeopleModal && (
        <InvitePeopleModal
          spaceId={spaceInfo.id}
          onActionComplete={handleActionComplete}
          onCancel={closeInvitePeopleModal}
        />
      )}
    </div>
  )
}
