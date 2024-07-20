import React, { useEffect, useState } from 'react'
import { deleteLike, getMyRecallBlocksSparked, likeSomething } from '../api/blog.api';
import InfiniteScroll from 'react-infinite-scroll-component';
import MarkdownRenderer from '../components/MardownRenderer';
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";
import { ActionIcons } from '../components/topics/ActionIcons';
import { MonsterMentorProfileModal } from '../components/topics/MonsterMentorProfileModal';


export function SparkedRecallBlocksPage() {
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showActionIcons, setShowActionIcons] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [importanceOrder, setImportanceOrder] = useState('');
  const [createdTimeOrder, setCreatedTimeOrder] = useState('');
  const blockContentTypeId = 12;

  useEffect(() => {
    setImportanceOrder(getRandomImportanceValue());
    setCreatedTimeOrder(getRandomCreatedValue());
  }, []);

  useEffect(() => {
    if (importanceOrder && createdTimeOrder) {
      loadBlocks(currentPage);
    }
  }, [importanceOrder, createdTimeOrder, currentPage]);

  function getRandomImportanceValue() {
    const orderValues = ['importance_level', '-importance_level',];
    return orderValues[Math.floor(Math.random() * orderValues.length)];
  }
  function getRandomCreatedValue() {
    const orderValues = ['created_time', '-created_time'];
    return orderValues[Math.floor(Math.random() * orderValues.length)];
  }
  

  async function loadBlocks(page) {
    try {
      const res = await getMyRecallBlocksSparked(page, importanceOrder, createdTimeOrder);
      if (page === 1) {
        setBlocks(res.data.results);
      } else {
        setBlocks(prevStories => [...prevStories, ...res.data.results]);
      }

      setHasMore(!!res.data.next);
      if (page === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      setError(error);
      setHasMore(false);
    }
  }

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Action
  const handleToggleActionIcons = (blockId) => {
    setShowActionIcons(prevState => ({
      ...prevState,
      [blockId]: !prevState[blockId]
    }));
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      })
      .catch((error) => {
        console.error('Error copying content to clipboard', error);
      });
  };

  const handleLikeClick = async (blockId, userHasLiked) => {
    try {
      if (typeof userHasLiked === 'number') {
        await deleteLike(userHasLiked);
        updateBlockLikeState(blockId, false);
      } else {
        const data = {
          liked: true,
          content_type: blockContentTypeId,
          object_id: blockId,
          is_active: true
        };
        const response = await likeSomething(data);
        updateBlockLikeState(blockId, response.data.id);
      }
    } catch (error) {
      console.error("Error processing like/unlike:", error);
    }
  };

  const updateBlockLikeState = (blockId, likeState) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.block.id === blockId ? { ...block, block: { ...block.block, user_has_liked: likeState } } : block
      )
    );
  };

  return (
    <div className='pb-20 pt-24 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44'>
      <div className='text-xl font-semibold'>Welcome to the block recall</div>
      <div className='text-gray-500 truncate'>All your block content are located here...</div>
      <InfiniteScroll
        dataLength={blocks.length}
        next={() => setCurrentPage(prevPage => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        className='bg-white rounded-md border py-4 px-2 my-4'
        endMessage={
          <p>
            <b>You have seen it all...</b>
          </p>
        }
      >
        {blocks.map((block, index) => (
          <div key={index} className='pb-10'>
            {block.block.block_type_name === "ATTACK" ? (
              <div className='pb-1 flex justify-end items-center'>
                <div className='text-end text-sm md:text-base'>
                  <div className='font-bold'>{block.block.soft_skill_monster_name}</div>
                  <div className='text-gray-500'>{block.block.soft_skill_name}</div>
                </div>
                <div className=''>
                  {block.block.soft_skill_monster_picture ? (
                    <img src={block.block.soft_skill_monster_picture} alt="Monster"
                      className="h-10 w-10 md:h-14 md:w-14 rounded-full ms-2 border-[3px] cursor-pointer"
                      style={{ borderColor: block.block.soft_skill_color }}
                      onClick={() => openModal(
                        {
                          image: block.block.soft_skill_monster_picture,
                          name: block.block.soft_skill_monster_name,
                          profile: block.block.soft_skill_monster_profile,
                          color: block.block.soft_skill_color,
                          soft_skill_name: block.block.soft_skill_name,
                          soft_skill_description: block.block.soft_skill_description,
                          soft_skill_logo: block.block.soft_skill_logo,
                          isMonster: true
                        }
                      )} />
                  ) : (<div></div>)}
                </div>
              </div>
            ) : block.block.block_type_name === "DEFENSE" ? (
              <div className='pb-1 flex items-center'>
                <div className=''>
                  {block.block.mentor_picture ? (
                    <img src={block.block.mentor_picture} alt="Mentor"
                      className="h-10 w-10 md:h-14 md:w-14 rounded-full me-2 border-[3px] cursor-pointer"
                      onClick={() => openModal(
                        {
                          image: block.block.mentor_picture,
                          name: block.block.mentor_name,
                          job: block.block.mentor_job,
                          profile: block.block.mentor_profile,
                          color: block.block.mentor_color,
                          isMonster: false
                        }
                      )}
                      style={{ borderColor: block.block.mentor_color }} />
                  ) : <></>}
                </div>
                <div className='text-sm md:text-base'>
                  <div className='font-bold'>{block.block.mentor_name}</div>
                  <div className='text-gray-500'>{block.block.mentor_job}</div>
                </div>
              </div>
            ) : (<></>)}
            <div className={`flex items-center ${block.block.block_type_name === "DEFENSE" ? "ps-10" : ""}`}>
              <div className='flex-grow bg-gray-50 rounded-2xl border-[4px] p-4'
                style={{
                  borderColor:
                    block.block.block_type_name === "DEFENSE"
                      ? (block.block.mentor_color || "#3DB1FF")
                      : (block.block.soft_skill_color || "#3DB1FF")
                }}>
                <div className=''> <MarkdownRenderer content={block.block.content} /></div>
                <div className={`py-3 flex justify-center ${block.block.image ? "border-t-2" : ""}`}>
                  {block.block.image ?
                    (<div><img className='rounded-lg md:max-h-[500px]' src={block.block.image} alt="" /></div>)
                    : (<div></div>)}</div>
              </div>
              <div>
                <div className='flex items-center'>
                  {showActionIcons[block.block.id] ?
                    <BsDot className="text-2xl cursor-pointer text-gray-500" onClick={() => handleToggleActionIcons(block.block.id)} /> :
                    <BsThreeDotsVertical className="text-2xl cursor-pointer text-gray-500 px-0" onClick={() => handleToggleActionIcons(block.block.id)} />}
                </div>
              </div>
            </div>
            {showActionIcons[block.block.id] &&
              <ActionIcons hasLiked={block.block.user_has_liked}
                onLikeClick={() => handleLikeClick(block.block.id, block.block.user_has_liked)} isCopied={isCopied}
                copyToClipboard={() => copyToClipboard(block.block.content)} userHasRecalled={block.block.user_has_recalled} block_id={block.block.id}
                onRecallUpdate={() => { }} hideBookmarkAndReply={true} />
            }
          </div>
        ))}
      </InfiniteScroll>
      {isModalOpen && <MonsterMentorProfileModal
        image={modalData.image}
        name={modalData.name}
        job={modalData.job}
        profile={modalData.profile}
        color={modalData.color}
        onClose={closeModal}
        soft_skill_name={modalData.soft_skill_name}
        soft_skill_description={modalData.soft_skill_description}
        soft_skill_logo={modalData.soft_skill_logo}
        isMonster={modalData.isMonster}
      />}
    </div>
  )
}