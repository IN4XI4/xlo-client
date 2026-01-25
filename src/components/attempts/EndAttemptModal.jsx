import React from 'react'
import { Button, Modal } from 'flowbite-react';


export function EndAttemptModal(props) {
  const { openModal, setOpenModal, onEndAttempt, userResponses } = props;
  return (
    <Modal show={openModal === 'endAttempt'} onClose={() => setOpenModal(undefined)}>
      <Modal.Header className='py-2'></Modal.Header>
      <Modal.Body>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Are you sure you want to end this attempt? Make sure you have reviewed your answers as you will not be able to change them once the attempt has been submitted.
        </p>
      </Modal.Body>
      <Modal.Footer className='flex items-center justify-center'>
        <Button className='bg-[#3DB1FF]' onClick={() => {
          setOpenModal(undefined);
          onEndAttempt(userResponses);
        }}>Yes, finish attempt</Button>
        <Button color="gray" onClick={() => setOpenModal(undefined)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
