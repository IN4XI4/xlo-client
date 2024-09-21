import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { FileInput, TextInput, Textarea } from 'flowbite-react';
import { FaDotCircle, FaRegCircle } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

import { createMentor } from '../../api/base.api';


export function CreateMentorModal({ onClose, onMentorCreated }) {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const [message, setMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const profileColors = [
    { id: 1, color: '#3DB1FF' },
    { id: 2, color: '#66E3E3' },
    { id: 3, color: '#30B299' },
    { id: 4, color: '#98DF3E' },
    { id: 5, color: '#FFBA0A' },
    { id: 5, color: '#FB7061' },
    { id: 5, color: '#D85FA8' },
    { id: 5, color: '#9B51E0' }
  ];
  const [selectedProfileColor, setSelectedProfileColor] = useState(profileColors[0].color);

  useEffect(() => {
    setValue('color', profileColors[0].color);
  }, [setValue]);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleColorSelect = (color) => {
    setSelectedProfileColor(color);
    setValue('color', color);
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('job', data.job);
    formData.append('color', data.color);
    formData.append('profile', data.profile);

    if (data.picture && data.picture[0]) {
      formData.append('picture', data.picture[0]);
    }
    try {
      await createMentor(formData);
      reset()
      setMessage({ type: 'success', text: 'Mentor successfully created!' });
      if (onMentorCreated) {
        await onMentorCreated();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating this mentor. Try it again later.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="mt-24 mx-auto border w-5/6 md:w-1/2 lg:w-1/3 2xl:w-1/4 shadow-lg rounded-md bg-white py-3 px-4"
        onClick={handleModalClick}>
        <div className='pb-3 font-bold text-xl flex justify-between'>
          <div>
            CREATE A MENTOR
          </div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onClose}>
            <FaXmark className='text-2xl' />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className='mb-2'>
            <label className="block pb-2 font-bold">Name</label>
            <TextInput
              placeholder='Insert a name for your Mentor'
              type="text"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
          </div>
          <div className="mb-2">
            <label className="block pb-2 font-bold">Job</label>
            <TextInput
              placeholder='Insert a job for your Mentor'
              type="text"
              {...register("job", { required: "Job is required" })}
            />
            {errors.job && <span className="text-red-500">{errors.job.message}</span>}
          </div>

          <div className="mb-2">
            <label className="block pb-2 font-bold">Color</label>
            <div className='flex justify-between'>
              {profileColors.map((colorObj, index) => {
                const isCurrentColor = colorObj.color === selectedProfileColor;
                const Icon = isCurrentColor ? FaDotCircle : FaRegCircle;
                return (
                  <Icon
                    key={index}
                    className='cursor-pointer'
                    style={{ color: colorObj.color }}
                    onClick={() => handleColorSelect(colorObj.color)} />
                );
              })}
            </div>
          </div>
          <div className="mb-2">
            <label className="block pb-2 font-bold">Profile</label>
            <Textarea
              rows={4}
              {...register("profile")}
            ></Textarea>
          </div>
          <div className="mb-3">
            <label className="block pb-2 font-bold">Picture</label>
            <FileInput
              type="file"
              accept="image/png, image/jpeg, image/gif"
              {...register("picture")}
              onChange={handlePictureChange}
            />
          </div>
          {previewImage && (
            <div className="mb-3">
              <img src={previewImage} alt="Selected file preview" className="rounded-full" style={{ aspectRatio: '1 / 1' }} />
            </div>
          )}
          <div className="flex justify-end">
            <button type="submit" className="bg-[#3DB1FF] text-white px-4 py-2 rounded-lg">
              Create
            </button>
          </div>
          {message && (
            <div className={`my-2 text-end ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
