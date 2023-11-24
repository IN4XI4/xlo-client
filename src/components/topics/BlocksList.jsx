import React, { useEffect, useState } from 'react'
import { getBlocksByCard } from '../../api/blog.api';
import { FaRegBookmark, FaRegCommentDots, FaRegHeart, FaReply, FaUser } from 'react-icons/fa';


function NormalBlock({ content, color }) {
  return (
    <div className='mb-4'>
      <div className="p-4 bg-gray-50 shadow rounded-[2.5rem] border-[6px]" style={{ borderColor: color || "#3DB1FF" }}>
        {content}
      </div>
      <div className='flex justify-end space-x-2 items-center text-gray-500 py-2'>
        <div className='text-xl'>
          <FaRegHeart />
        </div>
        <div className='text-xl'>
          <FaRegBookmark />
        </div>
        <div className='text-xl'>
          <FaRegCommentDots />
        </div>
        <div className='text-xl'>
          <FaReply />
        </div>
        <div>
          Comment
        </div>
      </div>
    </div>
  );
}

function AttackBlock({ content, color, monster_image, monster_name }) {
  return (
    <div className='flex'>
      <div className='mb-4'>
        <div className='font-bold text-end text-gray-700'>
          {monster_name}
        </div>
        <div className="p-4 bg-gray-50 shadow rounded-[2.5rem] border-[6px] rounded-tr-lg" style={{ borderColor: color || "#3DB1FF" }}>
          {content}
        </div>
        <div className='flex justify-end space-x-2 items-center text-gray-500 py-2'>
          <div className='text-xl'>
            <FaRegHeart />
          </div>
          <div className='text-xl'>
            <FaRegBookmark />
          </div>
          <div className='text-xl'>
            <FaRegCommentDots />
          </div>
          <div className='text-xl'>
            <FaReply />
          </div>
          <div>
            Comment
          </div>
        </div>
      </div>
      <div className='pt-1'>
        {monster_image ? (
          <img
            src={monster_image}
            alt="Monster" className="h-14 w-14 rounded-full mx-3 border-[3px]"
            style={{ borderColor: color || "#3DB1FF" }} />
        ) : (
          <FaUser />
        )}
      </div>
    </div>
  );
}

function DefenseBlock({ content, color, mentor_image, mentor_name, mentor_job }) {
  return (
    <div className='flex'>
      <div className='flex-none pt-1'>
        {mentor_image ? (
          <img
            src={mentor_image}
            alt="Mentor" className="h-14 w-14 rounded-full mx-3 border-[3px]"
            style={{ borderColor: color || "#3DB1FF" }} />
        ) : (
          <FaUser />
        )}
      </div>
      <div className='mb-4'>
        <div className='font-bold text-gray-700 ps-1'>
          {mentor_name}
        </div>
        <div className='font-bold text-gray-700 pb-1 ps-1'>
          {mentor_job}
        </div>
        <div className="p-4 bg-gray-50 shadow rounded-[2.5rem] border-[6px] rounded-tl-lg" style={{ borderColor: color || "#3DB1FF" }}>
          {content}
        </div>
        <div className='flex justify-end space-x-2 items-center text-gray-500 py-2'>
          <div className='text-xl'>
            <FaRegHeart />
          </div>
          <div className='text-xl'>
            <FaRegBookmark />
          </div>
          <div className='text-xl'>
            <FaRegCommentDots />
          </div>
          <div className='text-xl'>
            <FaReply />
          </div>
          <div>
            Comment
          </div>
        </div>
      </div>
    </div>
  );
}
function getBlockComponent(block, card) {
  const blockType = block.block_type_name.toLowerCase();
  switch (blockType) {
    case 'attack':
      return <AttackBlock
        content={block.content}
        color={card.soft_skill_color}
        monster_image={card.soft_skill_monster_picture}
        monster_name={card.soft_skill_monster_name} />;
    case 'defense':
      return <DefenseBlock 
      content={block.content} 
      color={card.mentor_color}
      mentor_image={card.mentor_picture} 
      mentor_name={card.mentor_name}
      mentor_job={card.mentor_job}
       />;
    default:
      return <NormalBlock content={block.content} color={card.soft_skill_color} />;
  }
}

export function BlocksList({ card }) {
  console.log("card", card);
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (card) {
      loadBlocks(card);
    }
  }, [card]);

  async function loadBlocks(card) {
    try {
      const res = await getBlocksByCard(card.id);
      setBlocks(res.data.results);
      console.log(res.data.results);
    } catch (error) {
      setError(error);
    }
  }
  return (
    <div className='bg-white rounded-lg p-4 md:p-12'>
      {blocks.map((block, index) => (
        <React.Fragment key={index}>
          {getBlockComponent(block, card)}
        </React.Fragment>
      ))}
    </div>
  )
}
