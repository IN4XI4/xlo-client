import { Checkbox, Datepicker, Label, Select, TextInput, Textarea } from 'flowbite-react'
import React from 'react'
import { FaCog, FaRegCircle, FaRegDotCircle, FaUser } from 'react-icons/fa'


export function EditProfile({ profileInfo }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3'>
      <div className='md:pe-2'>
        <div className='bg-white rounded px-3 py-4 flex items-center border border-gray-100 mb-3'>
          <div className='bg-gray-200 rounded-full flex items-center justify-center h-24 w-24'>
            {profileInfo.profile_picture ?
              <img src={profileInfo.profile_picture} alt="Profile" className="h-24 w-24 border-4 border-[#3DB1FF] rounded-full" /> :
              <FaUser className='text-xl' />
            }
          </div>
          <div className='ps-3'>
            <div className='font-bold'>{profileInfo.first_name} {profileInfo.last_name}</div>
            <div className='pb-3'>{profileInfo.email}</div>
            <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white flex items-center'>
              <span><FaCog /></span> <span className='ps-2'>Change picture</span>
            </button>
          </div>
        </div>
        <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
          <div className='font-bold pb-2 text-xl'>Select your color profile</div>
          <div className='flex justify-between'>
            <FaRegCircle className='text-[#3DB1FF]' />
            <FaRegCircle className='text-[#16ACDB]' />
            <FaRegCircle className='text-[#66E3E3]' />
            <FaRegCircle className='text-[#30B299]' />
            <FaRegCircle className='text-[#98DF3E]' />
            <FaRegCircle className='text-[#A6E1D5]' />
            <FaRegCircle className='text-[#FFBA0A]' />
            <FaRegCircle className='text-[#FF943D]' />
            <FaRegCircle className='text-[#FB7061]' />
            <FaRegCircle className='text-[#E27739]' />
            <FaRegCircle className='text-[#D85FA8]' />
            <FaRegCircle className='text-[#9B51E0]' />
          </div>
        </div>
        <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
          <div className='font-bold pb-2 text-xl'>Tell us something about you</div>
          <div className='font-semibold pb-2'>Your message</div>
          <Textarea className='mb-3' id="comment" placeholder="Write text here..." rows={7} />
          <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white'>Update</button>
        </div>
      </div>
      <div className='col-span-2 bg-white rounded border border-gray-100 mb-3 p-3'>
        <div className='font-bold pb-2 text-xl'>General information</div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='md:pe-3'>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="first_name" value="First name" />
            </div>
            <TextInput id="first_name" type="text" placeholder="Input text" className='mb-3' />
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="last_name" value="Last name" />
            </div>
            <TextInput id="last_name" type="text" placeholder="Input text" className='mb-3' />
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="profession" value="Profession" />
            </div>
            <TextInput id="profession" type="text" placeholder="Input text" className='mb-3' />
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="experience" value="Years of experience in your field" />
            </div>
            <Select id="experience" className='mb-3' >
              <option>1 to 3</option>
            </Select>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="linkedin" value="LinkedIn profile" />
            </div>
            <TextInput id="linkedin" type="text" placeholder="Input text" className='mb-3' />
          </div>
          <div>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="gender" value="Gender" />
            </div>
            <Select id="gender" className='mb-3'>
              <option>Female</option>
            </Select>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="birthday" value="Birthday" />
            </div>
            <Datepicker id='birthday' className='mb-3' />
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="country" value="Country" />
            </div>
            <Select id="country" className='mb-3' placeholder='asd'>
              <option>Colombia</option>
            </Select>
            <div className="mb-2">
              <Label className='font-semibold' htmlFor="website" value="Web site" />
            </div>
            <TextInput id="website" type="text" placeholder="Input text" className='mb-3' />
          </div>
        </div>
        <div className='flex flex-col md:flex-row  items-center pt-3'>
          <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white'>Update</button>
          <div className="flex items-center order-first md:order-none gap-2 ps-3 pb-3 md:pb-0">
            <Checkbox id="visible" className='mt-1' />
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
      </div>
    </div>
  )
}
