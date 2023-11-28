import React, { useEffect, useState } from 'react'
import { getBlocksByCard } from '../../api/blog.api';
import { FaRegBookmark, FaRegCommentDots, FaRegHeart, FaReply, FaUser } from 'react-icons/fa';


const ActionIcons = () => (
  <div className='flex justify-end space-x-2 items-center text-gray-500 py-2'>
    <FaRegHeart className='text-xl' />
    <FaRegBookmark className='text-xl' />
    <FaRegCommentDots className='text-xl' />
    <FaReply className='text-xl' />
    <div>Comment</div>
  </div>
);

const ImageContainer = ({ image, color }) => (
  image ? (
    <div className='mb-3'>
      <img src={image} alt="Block" className=" max-w-full rounded-lg p-2 border-[6px]" style={{ borderColor: color || "#3DB1FF" }} />
    </div>
  ) : null
);

const BlockContainer = ({ children, color }) => (
  <div className='mb-3'>
    <div className="p-4 bg-gray-50 shadow rounded-[2.5rem] border-[6px]" style={{ borderColor: color || "#3DB1FF" }}>
      {children}
    </div>
    <ActionIcons />
  </div>
);

function NormalBlock({ content, image, color }) {
  return (
    <div>
      <BlockContainer color={color}>{content}</BlockContainer>
      <ImageContainer image={image} color={color} />
    </div>
  )
  return;
}

function AttackBlock({ content, color, image, monster_image, monster_name }) {
  return (
    <div className='flex'>
      <BlockContainer color={color}>
        <div className='font-bold text-end text-gray-700'>{monster_name}</div>
        {content}
      </BlockContainer>
      <div className='flex-none pt-1'>
        {monster_image ? (
          <img src={monster_image} alt="Monster" className="h-14 w-14 rounded-full mx-3 border-[3px]" style={{ borderColor: color }} />
        ) : <FaUser />}
      </div>
      <ImageContainer image={image} color={color} />
    </div>
  );
}

function DefenseBlock({ content, image, color, mentor_image, mentor_name, mentor_job }) {
  return (
    <div className='flex'>
      <div className='flex-none pt-1'>
        {mentor_image ? (
          <img src={mentor_image} alt="Mentor" className="h-14 w-14 rounded-full mx-3 border-[3px]" style={{ borderColor: color }} />
        ) : <FaUser />}
      </div>
      <BlockContainer color={color}>
        <div className='font-bold text-gray-700 ps-1'>{mentor_name}</div>
        <div className='font-bold text-gray-700 pb-1 ps-1'>{mentor_job}</div>
        {content}
      </BlockContainer>
      <ImageContainer image={image} color={color} />
    </div>
  );
}

function getBlockComponent(block, card) {
  const props = { content: block.content, image: block.image, color: card.soft_skill_color };
  console.log("props", props);
  switch (block.block_type_name.toLowerCase()) {
    case 'attack':
      return <AttackBlock {...props} monster_image={card.soft_skill_monster_picture} monster_name={card.soft_skill_monster_name} />;
    case 'defense':
      return <DefenseBlock {...props} mentor_image={card.mentor_picture} mentor_name={card.mentor_name} mentor_job={card.mentor_job} />;
    default:
      return <NormalBlock {...props} />;
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
    <div className='bg-white rounded-lg p-4 md:p-8 lg:p-12'>
      {blocks.map((block, index) => (
        <React.Fragment key={index}>
          {getBlockComponent(block, card)}
        </React.Fragment>
      ))}
    </div>
  )
}
