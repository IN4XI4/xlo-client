import { Checkbox, Label, Select, TextInput, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { FaCog, FaRegCircle, FaDotCircle, FaUser } from 'react-icons/fa'
import { getCountries, getUserExperience, getUserGenders, getUserProfileColors, updateUser } from '../../api/users.api';


export function EditProfile({ profileInfo }) {
  const [profileColors, setProfileColors] = useState([]);
  const [selectedProfileColor, setSelectedProfileColor] = useState(null);
  const [biography, setBiography] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [linkedInProfile, setLinkedInProfile] = useState('');
  const [website, setWebsite] = useState('');
  const [profession, setProfession] = useState('');
  const [experience, setExperience] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [birthday, setBirthday] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [updateBioSuccess, setUpdateBioSuccess] = useState(false);
  const [updateInfoSuccess, setUpdateInfoSuccess] = useState(false);

  useEffect(() => {
    setBiography(profileInfo.biography || '');
  }, [profileInfo.biography]);

  useEffect(() => {
    if (profileInfo) {
      setFirstName(profileInfo.first_name || '');
      setLastName(profileInfo.last_name || '');
      setProfession(profileInfo.profession || '');
      setLinkedInProfile(profileInfo.linkedin_profile || '');
      setWebsite(profileInfo.website || '');
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo && profileInfo.experience) {
      setSelectedExperience(profileInfo.experience);
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo && profileInfo.gender) {
      setSelectedGender(profileInfo.gender);
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo && profileInfo.birthday) {
      setBirthday(profileInfo.birthday);
    } else {
      setBirthday('');
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo && profileInfo.profile_color) {
      setSelectedProfileColor(profileInfo.profile_color);
    }
  }, [profileInfo]);

  useEffect(() => {
    if (profileInfo && profileInfo.show_info) {
      setShowInfo(profileInfo.show_info);
    }
  }, [profileInfo]);

  useEffect(() => {
    loadProfileColors();
    loadExperience();
    loadGenders();
    loadCountries();
  }, []);

  const MAX_FILE_SIZE = 4 * 1024 * 1024;
  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > MAX_FILE_SIZE) {
        alert("The file is too large. Maximum allowed size: 4 MB.");
        return;
      }
      let reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("profile_picture", file);

      try {
        if (!profileInfo || !profileInfo.id) {
          console.error("User ID is missing");
          return;
        }
        const userId = profileInfo.id;
        const response = await updateUser(userId, formData);
        const newProfilePictureUrl = response.data.profile_picture;
        const event = new CustomEvent('profilePictureUpdated', { detail: newProfilePictureUrl });
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Error al actualizar la imagen:", error);
      }
    }
  };

  const handleClickChangePicture = () => {
    document.getElementById('profile-picture-input').click();
  };

  const handleBiographyChange = (event) => {
    setBiography(event.target.value);
  };


  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleProfessionChange = (e) => {
    setProfession(e.target.value);
  };

  const handleLinkedInChange = (e) => {
    setLinkedInProfile(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  const handleBirthdayChange = (event) => {
    setBirthday(event.target.value);
  };

  const handleProfileColorChange = async (colorId) => {
    if (colorId === selectedProfileColor) {
      return;
    }
    setSelectedProfileColor(colorId);
    if (!profileInfo || !profileInfo.id) {
      console.error("User ID is missing");
      return;
    }
    const userId = profileInfo.id;
    const updatedInfo = { profile_color: colorId };
    try {
      await updateUser(userId, updatedInfo);
    } catch (error) {
      console.error("Error al actualizar el color de perfil:", error);
      setSelectedProfileColor(profileInfo.profile_color);
    }
  };

  const handleUpdateBiography = async () => {
    if (!profileInfo || !profileInfo.id) {
      console.error("User ID is missing");
      return;
    }

    const updatedInfo = {
      biography: biography,
    };

    try {
      const response = await updateUser(profileInfo.id, updatedInfo);
      setUpdateBioSuccess(true);
      setTimeout(() => setUpdateBioSuccess(false), 5000);
    } catch (error) {
      console.error("Error al actualizar la biografía:", error);
      setUpdateBioSuccess(false);
    }
  };

  const handleUpdateGeneralInfo = async () => {
    if (!profileInfo || !profileInfo.id) {
      console.error("User ID is missing");
      return;
    }
    let updatedInfo = {
      first_name: firstName,
      last_name: lastName,
      gender: selectedGender,
      profession: profession,
      experience: selectedExperience,
      website: website,
      linkedin_profile: linkedInProfile,
      show_info: showInfo
    };
    if (birthday) {
      updatedInfo = { ...updatedInfo, birthday: birthday };
    }
    if (selectedCountry) {
      updatedInfo = { ...updatedInfo, country: selectedCountry };
    }

    try {
      await updateUser(profileInfo.id, updatedInfo);
      setUpdateInfoSuccess(true);
      setTimeout(() => setUpdateInfoSuccess(false), 5000);
    } catch (error) {
      console.error("Error al actualizar la información general:", error);
      setUpdateInfoSuccess(false);
    }
  };

  async function loadProfileColors() {
    try {
      const res = await getUserProfileColors();
      setProfileColors(res.data);
      if (profileInfo && profileInfo.profile_color) {
        setSelectedProfileColor(profileInfo.profile_color);
      }
    } catch (error) {
      setError(error);
    }
  }

  async function loadExperience() {
    try {
      const res = await getUserExperience();
      setExperience(res.data);
    } catch (error) {
      setError(error);
    }
  }

  async function loadGenders() {
    try {
      const res = await getUserGenders();
      setGenders(res.data);
    } catch (error) {
      setError(error);
    }
  }

  async function loadCountries() {
    try {
      const res = await getCountries();
      setCountries(res.data);
    } catch (error) {
      setError(error);
    }
  }
  useEffect(() => {
    if (Object.keys(countries).length && profileInfo && profileInfo.country) {
      const countryEntry = Object.entries(countries).find(([code, name]) => name === profileInfo.country);
      if (countryEntry) {
        setSelectedCountry(countryEntry[0]);
      }
    }
  }, [countries, profileInfo]);

  const countryOptions = Object.entries(countries).map(([code, name]) => ({ code, name }));
  const currentProfileColor = profileColors.find(color => color.id === selectedProfileColor)?.color || '#3DB1FF';
  return (
    <div className='grid grid-cols-1 md:grid-cols-3'>
      <div className='md:pe-2'>
        <div className='bg-white rounded px-3 py-4 flex items-center border border-gray-100 mb-3'>
          <div className='bg-gray-100 rounded-full flex items-center justify-center h-24 w-24'>
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" className="h-24 w-24 border-4 rounded-full" style={{ borderColor: currentProfileColor }} />
            ) : profileInfo.profile_picture ? (
              <img src={profileInfo.profile_picture} alt="Profile" className="h-24 w-24 border-4 rounded-full" style={{ borderColor: currentProfileColor }} />
            ) : (
              <FaUser className='text-4xl' style={{ color: currentProfileColor }} />
            )}
          </div>
          <div className='ps-3'>
            <div className='font-bold'>{profileInfo.first_name} {profileInfo.last_name}</div>
            <div>{profileInfo.email}</div>
            <div className='pb-3 text-gray-500'>{profileInfo.user_level_display.level_name}</div>
            <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white flex items-center'
              onClick={handleClickChangePicture}>
              <span><FaCog /></span> <span className='ps-2'>Change picture</span>
            </button>
            <input
              type="file"
              id="profile-picture-input"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
        </div>
        <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
          <div className='font-bold pb-2 text-xl'>Select your profile color</div>
          <div className='flex justify-between'>
            {profileColors && profileColors.map((color, index) => {
              const isCurrentColor = color.id === selectedProfileColor;
              const Icon = isCurrentColor ? FaDotCircle : FaRegCircle;
              return (
                <Icon
                  key={index}
                  className='cursor-pointer'
                  style={{ color: color.color }}
                  onClick={() => handleProfileColorChange(color.id)} />
              );
            })}
          </div>
        </div>
        <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
          <div className='font-bold pb-2 text-xl'>Tell us something about you</div>
          <div className='font-semibold pb-2'>Your message</div>
          <Textarea
            className='mb-3'
            id="comment"
            placeholder="Write text here..."
            rows={7}
            value={biography}
            onChange={handleBiographyChange} />
          <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white'
            onClick={handleUpdateBiography}
          >
            Update
          </button>
          {updateBioSuccess && <div className="text-green-500 mt-2">Updated successfully!</div>}
        </div>
      </div>
      <div className='col-span-2 bg-white rounded border border-gray-100 mb-3 p-3'>
        <div className='font-bold pb-2 text-xl'>General information</div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='md:pe-3'>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="first_name" value="First name" />
            </div>
            <TextInput
              id="first_name"
              type="text"
              placeholder="First Name"
              className='mb-3'
              value={firstName}
              onChange={handleFirstNameChange}
            />
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="last_name" value="Last name" />
            </div>
            <TextInput
              id="last_name"
              type="text"
              placeholder="Last Name"
              className='mb-3'
              value={lastName}
              onChange={handleLastNameChange}
            />
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="profession" value="Profession" />
            </div>
            <TextInput
              id="profession"
              type="text"
              placeholder="Profession"
              className='mb-3'
              value={profession}
              onChange={handleProfessionChange}
            />
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="experience" value="Years of experience in your field" />
            </div>
            <Select
              id="experience"
              className='mb-3'
              value={selectedExperience || ""}
              onChange={(e) => setSelectedExperience(e.target.value)}>
              <option value="" disabled>Select Experience</option>
              {experience && experience.map((exp, index) => (
                <option key={exp.id} value={exp.id}>
                  {exp.experience}
                </option>
              ))}
            </Select>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="linkedin" value="LinkedIn profile" />
            </div>
            <TextInput
              id="linkedin"
              type="text"
              placeholder="Input text"
              className='mb-3'
              value={linkedInProfile}
              onChange={handleLinkedInChange}
            />
          </div>
          <div>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="gender" value="Gender" />
            </div>
            <Select
              id="gender"
              className='mb-3'
              value={selectedGender || ""}
              onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="" disabled>Select Gender</option>
              {genders && genders.map((gender, index) => (
                <option key={gender.id} value={gender.id}>
                  {gender.gender}
                </option>
              ))}
            </Select>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="birthday" value="Birthday" />
            </div>
            <input type="date"
              onChange={handleBirthdayChange}
              value={birthday}
              id="birthday"
              className='mb-3 rounded-l-md border border-gray-300 bg-gray-50 w-full rounded-lg text-gray-900 text-sm'
            />
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="country" value="Country" />
            </div>
            <Select
              id="country"
              className='mb-3'
              value={selectedCountry || ""}
              onChange={(e) => setSelectedCountry(e.target.value)}>
              <option value="" disabled>Select Country</option>
              {countryOptions && countryOptions.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="website" value="Web site" />
            </div>
            <TextInput
              id="website"
              type="text"
              placeholder="Input text"
              className='mb-3'
              value={website}
              onChange={handleWebsiteChange} />
          </div>
        </div>
        <div className='flex flex-col md:flex-row  items-center pt-3'>
          <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white'
            onClick={handleUpdateGeneralInfo}>
            Update
          </button>
          <div className="flex items-center order-first md:order-none gap-2 ps-3 pb-3 md:pb-0">
            <Checkbox
              id="visible"
              className='mt-1'
              checked={showInfo}
              onChange={(e) => setShowInfo(e.target.checked)} />
            <div className=''>
              <div className='font-semibold'>
                Make my “General information” visible for the all Mixelo community
              </div>
              <div className='text-sm text-gray-500'>
                Those information will not be transmitted to anyone for any purpose!
              </div>
            </div>
          </div>
        </div>
        {updateInfoSuccess && <div className="text-green-500 mt-2">Updated successfully!</div>}
      </div>
    </div>
  )
}
