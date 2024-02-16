import React, { useState } from 'react'
import { FaRegStar } from 'react-icons/fa'
import { ComingSoonModal } from '../ComingSoonModal'


export function RateStory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };
    return (
        <div className='flex flex-col items-center text-gray-500 mb-4 border-b-4 border-[#D9D9D9] pb-4'>
            <div className='pb-1'>
                Évaluation de l'histoire
            </div>
            <div className='flex space-x-1 text-xl cursor-pointer'>
                {[...Array(5)].map((_, i) => (
                    <FaRegStar key={i} onClick={openModal} />
                ))}
            </div>
            {isModalOpen && <ComingSoonModal
                title="Evaluation de l’histoire"
                context="La fonctionnalité d’évaluation des histoires sera prochainement disponible."
                onClose={() => setIsModalOpen(false)} />}
        </div>
    )
}
