import React, { useEffect, useState } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { Select, ToggleSwitch, Tooltip } from 'flowbite-react'
import { BsInfoCircleFill } from "react-icons/bs";
import { FaPlus } from 'react-icons/fa';

import { getMentors, getSoftSkills } from '../../api/base.api';
import { CREATOR_LEVEL_3 } from '../../globals';
import { CreateMentorModal } from '../create_stories/CreateMentorModal';
import { AddToSpaceModal } from '../create_stories/add_to_space/AddToSpaceModal';
import { InfoModal } from '../modals/InfoModal';
import { INFO_OPTIONS } from './StoryOptionsInfo';


function LabelWithInfo({ label, required = false, infoContent = "" }) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="flex items-center gap-1 font-semibold pb-1">
      <span>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
      <BsInfoCircleFill
        onClick={() => setShowInfo(true)}
        className="w-3 h-3 text-[#1C64F2] cursor-pointer"
      />
      {showInfo && (
        <InfoModal
          title={label}
          context={infoContent}
          onClose={() => setShowInfo(false)}
        />
      )}
    </div>
  )
}

export function StoryOptions({ initialData, control, errors, setValue, userLevel, onSoftSkillSelected = () => { },
  onMentorSelected = () => { }, }) {
  const [softSkills, setSoftSkills] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [showCreateMentorButton, setSshowCreateMentorButton] = useState(false);
  const [showCreateMentorModal, setShowCreateMentorModal] = useState(false);
  const [showAddToSpaceModal, setShowAddToSpaceModal] = useState(false);
  const [addedSpaceIds, setAddedSpaceIds] = useState([]);

  const softSkillId = useWatch({ control, name: 'globalSoftSkill' });
  const mentorId = useWatch({ control, name: 'globalMentor' });


  useEffect(() => {
    if (initialData?.spaces) {
      setAddedSpaceIds(initialData.spaces);
    }
  }, [initialData]);


  const openCreateMentorModal = () => {
    setShowCreateMentorModal(true);
  };

  const closeCreateMentorModal = () => {
    setShowCreateMentorModal(false);
  };

  const openAddToSpaceModal = () => {
    setShowAddToSpaceModal(true);
  };

  const closeAddToSpaceModal = () => {
    setShowAddToSpaceModal(false);
  };

  const handleConfirmAddToSpace = (addedSpaces) => {
    const spaceIds = addedSpaces.map((s) => s.id);
    setValue("spaces", spaceIds);
    setAddedSpaceIds(spaceIds);

  };

  useEffect(() => {
    loadSoftSkillsAndMentors();
  }, []);

  const isPrivate = useWatch({
    control,
    name: 'is_private',
  });

  useEffect(() => {
    if (userLevel >= CREATOR_LEVEL_3) {
      setSshowCreateMentorButton(true)
    }
  }, [])

  useEffect(() => {
    if (softSkills.length && softSkillId) {
      const obj = softSkills.find(s => s.id === Number(softSkillId)) || null;
      onSoftSkillSelected(obj);
    }
  }, [softSkills, softSkillId, onSoftSkillSelected]);

  useEffect(() => {

    if (mentors.length && mentorId) {
      const obj = mentors.find(m => m.id === Number(mentorId)) || null;
      onMentorSelected(obj);
    }
  }, [mentors, mentorId, onMentorSelected]);

  const loadSoftSkillsAndMentors = async (updateMentorsOnly = false) => {
    try {
      if (!updateMentorsOnly) {
        const softSkillsRes = await getSoftSkills();
        setSoftSkills(softSkillsRes.data.results);
      }
      const mentorsRes = await getMentors();

      setMentors(mentorsRes.data.results);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  return (
    <div className='bg-[#E3F4FF] rounded-lg p-3 grid grid-cols-2 md:grid-cols-4 gap-3'>
      <div className=''>
        <LabelWithInfo label="Life moments" infoContent={INFO_OPTIONS.life_moments}  />
        <Controller
          control={control}
          name="life_moments"
          rules={{ required: false }}
          render={({ field }) => (
            <Select {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}>
              <option value="">Unspecified Age</option>
              <option value="1">Aged 5 to 10</option>
              <option value="2">Aged 10 to 15</option>
              <option value="3">Aged 15 to 20</option>
              <option value="4">Aged 20 to 30</option>
              <option value="5">Aged 30 to 40</option>
              <option value="6">Aged 40 to 50</option>
              <option value="7">Aged 50 to 60</option>
              <option value="8">Aged 60 to 70</option>
              <option value="9">Aged 70 and more</option>
            </Select>
          )}
        />
        {errors.life_moments && <p className="text-red-500">{errors.life_moments.message}</p>}
      </div>
      <div className=''>
        <LabelWithInfo label="Story Identities" infoContent={INFO_OPTIONS.story_identities} />
        <Controller
          control={control}
          name="story_identities"
          rules={{ required: false }}
          render={({ field }) => (
            <Select {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}>
              <option value="">Unspecified Identity</option>
              <option value="1">Instinctive Identity</option>
              <option value="2">Emotional Identity</option>
              <option value="3">Mental Identity</option>
            </Select>
          )}
        />
        {errors.story_identities && <p className="text-red-500">{errors.story_identities.message}</p>}
      </div>
      <div className=''>
        <LabelWithInfo label="Difficulty levels" infoContent={INFO_OPTIONS.difficulty_levels} />
        <Controller
          control={control}
          name="difficulty_level"
          rules={{ required: false }}
          render={({ field }) => (
            <Select {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}>
              <option value="">Unspecified Difficulty</option>
              <option value="1">Beginner</option>
              <option value="2">Amateur</option>
              <option value="3">Intermediate</option>
              <option value="4">Professional</option>
              <option value="5">Expert</option>
            </Select>
          )}
        />
        {errors.difficulty_level && <p className="text-red-500">{errors.difficulty_level.message}</p>}
      </div>
      <div className=''>
        <LabelWithInfo label="Language" infoContent={INFO_OPTIONS.languages} />
        <Controller
          control={control}
          name="language"
          rules={{ required: false }}
          render={({ field }) => (
            <Select {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}>
              <option value="">Unspecified Language</option>
              <option value="EN">English</option>
              <option value="FR">French</option>
              <option value="ES">Spanish</option>
              <option value="DE">German</option>
              <option value="IT">Italian</option>
              <option value="PT">Portuguese</option>
              <option value="OT">Other</option>
            </Select>
          )}
        />
        {errors.difficulty_level && <p className="text-red-500">{errors.difficulty_level.message}</p>}
      </div>
      <div className=''>
        <LabelWithInfo label="Skills" required infoContent={INFO_OPTIONS.skills} />
        <div className=''>
          <Controller
            control={control}
            name="globalSoftSkill"
            rules={{ required: 'Soft Skill is required' }}
            render={({ field }) => (
              <Select {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const id = e.target.value === '' ? '' : Number(e.target.value);
                  field.onChange(id);
                  const obj = softSkills.find(s => s.id === id) || null;
                  onSoftSkillSelected(obj);
                }}>
                <option value="" disabled>Select Skill</option>
                {softSkills.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </Select>
            )}
          />
          {errors.globalSoftSkill &&
            <p className="text-red-500">A skill is required.</p>}
        </div>
      </div>
      <div className='flex justify-center md:items-center flex-col md:flex-row space-y-2 md:space-y-0'>
        <div className='flex md:items-center md:justify-center pe-2'>
          <div className='pe-4'>Is private</div>
          <Controller
            name="is_private"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                color="cyan"
                checked={field.value}
                onChange={(checked) => {
                  setValue('is_private', checked);
                  if (checked) {
                    setValue('free_access', false);
                  }
                }}
              />
            )}
          />
        </div>
        {!isPrivate && (
          <div className='flex md:items-center md:justify-center'>
            <div className='pe-4'>
              <Tooltip content="Public Url">Free Access</Tooltip>
            </div>
            <Controller
              name="free_access"
              control={control}
              render={({ field }) => (
                <ToggleSwitch
                  color="cyan"
                  checked={field.value}
                  onChange={(checked) => setValue('free_access', checked)}
                />
              )}
            />
          </div>
        )}
      </div>
      <div className='flex flex-col pb-4'>
        <div className='font-semibold flex items-center pb-1'>
          <LabelWithInfo label="Mentor" required infoContent={INFO_OPTIONS.mentors} />
        </div>
        <div className='flex items-center space-x-2'>
          {showCreateMentorButton &&
            <Tooltip content="Create a new mentor">
              <button type="button"
                className='bg-[#1C64F2] p-2 rounded-full text-white flex items-center'
                onClick={() => openCreateMentorModal()}>
                <FaPlus />
              </button>
            </Tooltip>
          }
          <Controller
            control={control}
            name={`globalMentor`}
            rules={{ required: 'Mentor is required' }}
            render={({ field }) => (
              <Select {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const id = e.target.value === '' ? '' : Number(e.target.value);
                  field.onChange(id);
                  const obj = mentors.find(m => m.id === id) || null;
                  onMentorSelected(obj);
                }}>
                <option value="" disabled>Select Mentor</option>
                {mentors.map(mentor => (
                  <option key={mentor.id} value={mentor.id}>{mentor.name} - {mentor.job}</option>
                ))}
              </Select>
            )}
          />
        </div>
        {errors.globalMentor &&
          <p className="text-red-500">A mentor is required.</p>}
      </div>
      <div className=''>
        <div className='pb-1'>
          <LabelWithInfo label="Spaces" infoContent={INFO_OPTIONS.spaces} />
        </div>
        <div className='rounded-full bg-[#1C64F2] px-4 py-3 text-sm text-white cursor-pointer text-center'
          onClick={() => openAddToSpaceModal()}>
          ADD TO SPACE
        </div>
      </div>
      {showCreateMentorModal &&
        <CreateMentorModal onClose={closeCreateMentorModal} onMentorCreated={() => loadSoftSkillsAndMentors(true)} />}
      {showAddToSpaceModal && <AddToSpaceModal
        onCancel={closeAddToSpaceModal}
        onConfirm={handleConfirmAddToSpace}
        initialAddedSpaceIds={addedSpaceIds}
      />}
    </div>
  )
}
