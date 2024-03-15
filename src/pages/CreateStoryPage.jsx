import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { getMentors, getSoftSkills } from '../api/base.api';
import { createStoryFull, getBlockTypes } from '../api/blog.api';
import { FileInput, Select, TextInput, Textarea } from 'flowbite-react';
import { getUser } from '../api/users.api';
import { Navigate, useNavigate, useParams } from 'react-router-dom';


export function CreateStoryPage() {
  const { id: topicId } = useParams();
  const navigate = useNavigate();
  const [isCreator, setIsCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [softSkills, setSoftSkills] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [blockTypes, setBlockTypes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});

  const { control, register, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      cards: [{
        cardTitle: '',
        selectedSoftSkill: '',
        selectedMentor: '',
        blocks: [{ content: '', blockType: '' }]
      }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards"
  });

  useEffect(() => {
    const loadSoftSkillsAndMentors = async () => {
      try {
        const softSkillsRes = await getSoftSkills();
        const mentorsRes = await getMentors();
        setSoftSkills(softSkillsRes.data.results);
        setMentors(mentorsRes.data.results);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadSoftSkillsAndMentors();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const blockTypesRes = await getBlockTypes();
        setBlockTypes(blockTypesRes.data.results);
      } catch (error) {
        console.error("Error loading block types:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadUserMe = async () => {
      try {
        setIsLoading(true);
        const response = await getUser();
        setIsCreator(response.data.is_creator);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserMe();
  }, []);

  function updateImagePreviewsForCards(imagePreviews, cardIndexToRemove) {
    const newImagePreviews = {};
    Object.keys(imagePreviews).forEach(key => {
      const match = key.match(/^cards\.(\d+)\.blocks\.(\d+)\.image$/);
      if (match) {
        const [_, cardIndex, blockIndex] = match.map(Number);
        if (cardIndex > cardIndexToRemove) {
          const newKey = `cards.${cardIndex - 1}.blocks.${blockIndex}.image`;
          newImagePreviews[newKey] = imagePreviews[key];
        } else if (cardIndex < cardIndexToRemove) {
          newImagePreviews[key] = imagePreviews[key];
        }
      }
    });
    return newImagePreviews;
  }

  function updateImagePreviewsForBlocks(imagePreviews, cardIndex, blockIndexToRemove) {
    const newImagePreviews = {};
    Object.keys(imagePreviews).forEach(key => {
      const match = key.match(/^cards\.(\d+)\.blocks\.(\d+)\.image$/);
      if (match) {
        const [_, matchedCardIndex, blockIndex] = match.map(Number);
        if (matchedCardIndex === cardIndex) {
          if (blockIndex > blockIndexToRemove) {
            const newKey = `cards.${cardIndex}.blocks.${blockIndex - 1}.image`;
            newImagePreviews[newKey] = imagePreviews[key];
          } else if (blockIndex < blockIndexToRemove) {
            newImagePreviews[key] = imagePreviews[key];
          }
        } else {
          newImagePreviews[key] = imagePreviews[key];
        }
      }
    });
    return newImagePreviews;
  }

  const handleRemoveBlock = (cardIndex, blockIndex) => {
    const currentCards = getValues('cards');
    currentCards[cardIndex].blocks.splice(blockIndex, 1);
    setValue('cards', currentCards);

    const updatedImagePreviews = updateImagePreviewsForBlocks(imagePreviews, cardIndex, blockIndex);
    setImagePreviews(updatedImagePreviews);
  };

  const handleRemoveCard = (cardIndex) => {
    const currentCards = [...getValues('cards')];
    currentCards.splice(cardIndex, 1);
    setValue('cards', currentCards);

    const updatedImagePreviews = updateImagePreviewsForCards(imagePreviews, cardIndex);
    setImagePreviews(updatedImagePreviews);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    // Agregar campos de texto
    formData.append('title', data.title);
    formData.append('subtitle', data.subtitle);
    formData.append('topic', topicId);

    data.cards.forEach((card, cardIndex) => {
      const cardPrefix = `cards[${cardIndex}]`;

      formData.append(`${cardPrefix}.cardTitle`, card.cardTitle);
      formData.append(`${cardPrefix}.selectedSoftSkill`, card.selectedSoftSkill);
      formData.append(`${cardPrefix}.selectedMentor`, card.selectedMentor);

      card.blocks.forEach((block, blockIndex) => {
        const blockPrefix = `${cardPrefix}.blocks[${blockIndex}]`;

        formData.append(`${blockPrefix}.content`, block.content);
        formData.append(`${blockPrefix}.blockType`, block.blockType);

        if (block.image && block.image.length > 0) {
          formData.append(`${blockPrefix}.image`, block.image[0]);
        }
      });
    });
    try {
      const response = await createStoryFull(formData);
      setIsSubmitError(false);
      navigate(`/topic/${topicId}`, { state: { storyCreated: true } });
    } catch (error) {
      console.error("Error creating story:", error.response?.data || error.message);
      setSubmitMessage('Failed to create story. Please try again.');
      setIsSubmitError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="pt-20 md:pt-24 px-4 md:px-16 lg:px-32 xl:px-44">Loading...</div>;
  }

  if (!isCreator) {
    return <Navigate to="/" />;
  }
  return (
    <div className="pt-20 md:pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-2xl md:text-4xl font-extrabold pb-6'>
        Create story
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-3 rounded-lg'>
        <div className='pb-2'>
          <div className='pb-1'>
            <label className="text-gray-900" htmlFor="title">Title</label>
          </div>
          <TextInput id="title" {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
        <div className='pb-4'>
          <div className='pb-1'>
            <label className="text-gray-900" htmlFor="subtitle">Subtitle</label>
          </div>
          <TextInput id="subtitle" {...register('subtitle', { required: 'Subtitle is required' })} />
          {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className='border p-3 rounded-lg mb-2'>
            <div className='text-xl md:text-2xl font-semibold text-gray-500 pb-3'>Card {index + 1}</div>
            <div className='pb-1'>
              <label className="text-gray-900">Card Title</label>
            </div>
            <div className='pb-2'>
              <TextInput {...register(`cards.${index}.cardTitle`, { required: 'Card title is required' })} />
              {errors.cards?.[index]?.cardTitle && <p className="text-red-500">{errors.cards[index].cardTitle.message}</p>}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-2'>
              <div className='pb-2'>
                <div className='pb-1'>
                  <label className="text-gray-900">Soft Skill</label>
                </div>
                <Controller
                  control={control}
                  name={`cards.${index}.selectedSoftSkill`}
                  rules={{ required: 'Soft Skill is required' }}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="" disabled>Select Soft Skill</option> {/* Opción inicial vacía */}
                      {softSkills.map(skill => (
                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.cards?.[index]?.selectedSoftSkill && <p className="text-red-500">A soft skill selection is required.</p>}
              </div>
              <div className='pb-3'>
                <div className='pb-1'>
                  <label className="text-gray-900">Mentor</label>
                </div>
                <Controller
                  control={control}
                  name={`cards.${index}.selectedMentor`}
                  rules={{ required: 'Mentor is required' }}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="" disabled>Select Mentor</option> {/* Opción inicial vacía */}
                      {mentors.map(mentor => (
                        <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.cards?.[index]?.selectedMentor && <p className="text-red-500">A mentor selection is required.</p>}
              </div>
            </div>
            <div className='grid md:grid-cols-2 gap-x-2'>
              {field.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="border p-3 rounded-lg mb-2">
                  <div className='text-xl md:text-2xl font-semibold text-gray-500 pb-3'>Block {blockIndex + 1}</div>
                  <div className='pb-2'>
                    <div className='pb-2'>
                      <label className="text-gray-900">Block Type</label>
                    </div>
                    <Controller
                      control={control}
                      name={`cards.${index}.blocks.${blockIndex}.blockType`}
                      rules={{ required: 'Block type is required' }}
                      render={({ field }) => (
                        <Select {...field}>
                          <option value="">Select Block Type</option>
                          {blockTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.cards?.[index]?.blocks?.[blockIndex]?.blockType && <p className="text-red-500">Block type selection is required.</p>}
                  </div>
                  <div className="pb-2">
                    <div className='pb-2'>
                      <label className="text-gray-900">Image</label>
                    </div>
                    <div className="relative">
                      {/* Input de archivo oculto pero funcional */}
                      <FileInput
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        className='opacity-0 absolute w-full h-full'
                        {...register(`cards.${index}.blocks.${blockIndex}.image`)}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreviews(prev => ({ ...prev, [`cards.${index}.blocks.${blockIndex}.image`]: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {/* Botón personalizado que aparece en lugar del FileInput */}
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-3 py-2 rounded-md"
                        onClick={() => document.querySelector(`input[name='cards.${index}.blocks.${blockIndex}.image']`).click()}
                      >
                        Select image
                      </button>
                    </div>
                    {imagePreviews[`cards.${index}.blocks.${blockIndex}.image`] && (
                      <div className='py-2 flex justify-center'>
                        <img
                          src={imagePreviews[`cards.${index}.blocks.${blockIndex}.image`]}
                          alt="Preview"
                          className='w-3/4 rounded-lg'
                        />
                      </div>
                    )}
                  </div>
                  <div className='pb-2'>
                    <div className='pb-2'>
                      <label className="text-gray-900">Block Content</label>
                    </div>
                    <Textarea {...register(`cards.${index}.blocks.${blockIndex}.content`,
                      { required: 'Block content is required' })}
                      className="mb-2"
                      rows="4"></Textarea>
                    {errors.cards?.[index]?.blocks?.[blockIndex]?.content && <p className="text-red-500">{errors.cards[index].blocks[blockIndex].content.message}</p>}
                  </div>

                  {field.blocks.length > 1 && (
                    <button type="button" onClick={() => handleRemoveBlock(index, blockIndex)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md">Remove Block</button>
                  )}
                </div>
              ))}
            </div>
            <div className='flex justify-end pb-4'>
              <button type="button" onClick={() => {
                const currentCards = getValues(`cards`);
                currentCards[index].blocks.push({ content: '', blockType: '' });
                setValue(`cards`, currentCards);
              }} className="bg-green-500 text-white px-3 py-2 rounded-md">+ Add Block</button>
            </div>
            {fields.length > 1 && (
              <div className='pb-1 flex justify-end'>
                <button type="button"
                  className='bg-red-500 px-3 py-2 rounded-lg text-white'
                  onClick={() => handleRemoveCard(index)} >Remove Card</button>
              </div>
            )}
          </div>
        ))}
        <div className='pb-4 flex justify-end'>
          <button type="button" className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white'
            onClick={() => append({ cardTitle: '', selectedSoftSkill: '', selectedMentor: '', blocks: [{ content: '', blockType: '' }] })}>
            + Add Card
          </button>
        </div>
        <div>
          <button type="submit" className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white w-full'>Submit Story</button>
        </div>
        {submitMessage && (
          <div className={`mt-4 text-center ${isSubmitError ? 'text-red-500' : 'text-green-500'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  )
}
