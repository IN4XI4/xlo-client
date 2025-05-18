import React from 'react'
import { Accordion } from "flowbite-react";
import { GrUpdate } from "react-icons/gr";

export function SpaceSettingsBox() {
  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold pb-3'>Space settings</div>
      <Accordion collapseAll>
        <Accordion.Panel>
          <Accordion.Title>The [categories & topics] related to the selected space</Accordion.Title>
          <Accordion.Content>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>The [notifications] related to the selected space</Accordion.Title>
          <Accordion.Content>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>The [danger-zone] related to the selected space</Accordion.Title>
          <Accordion.Content>
            <div>

            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
      <div className='pt-3 flex justify-end'>
        <button className='px-6 py-2 bg-[#3DB1FF] text-white rounded-lg flex items-center'>
          <GrUpdate /><span className='ps-2'>Update</span>
        </button>
      </div>
    </div>
  )
}
