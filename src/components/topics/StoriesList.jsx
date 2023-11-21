import React, { useEffect, useState } from 'react'
import { getStoriesByTopic } from '../../api/blog.api';
import { FaAngleDown, FaRegSquare} from 'react-icons/fa';


export function StoriesList({ topicId }) {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (topicId) {
            loadStories();
        }
    }, [topicId]);

    async function loadStories() {
        try {
            console.log("topic id", topicId);
            const res = await getStoriesByTopic(topicId);
            setStories(res.data.results);
            console.log("ress", res.data.results);
        } catch (error) {
            setError(error);
        }
    }
    return (
        <div className='bg-white border rounded p-3 text-gray-500'>
            <div className='grid grid-cols-10 pb-3'>
                <div className='col-span-7 flex'>
                    <button className='mr-3'>Stories</button>
                    <button className='text-[#3DB1FF] underline'>Latest</button>
                </div>
                <div className='flex justify-center items-center'>Replies <span><FaAngleDown /></span></div>
                <div className='flex justify-center items-center'>Views <span><FaAngleDown /></span></div>
                <div className='flex justify-center items-center'>Likes <span><FaAngleDown /></span></div>
            </div>
            {stories.map((story, index) => (
                <div key={index} className='grid grid-cols-10 py-3'>
                    <div className='col-span-7 bg-gray-50 p-3 rounded-lg'>
                        <div className='font-bold text-black text-xl'>{story.title}</div>
                        <div className='flex justify-between'>
                            <div className='text-sm'>{story.subtitle}</div>
                            <div className='flex'>
                                {story.card_colors.map((color, colorIndex) => (
                                    <div key={colorIndex} className="pe-1" style={{ color: color|| "#3DB1FF" }}>
                                        <FaRegSquare />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='text-center text-[#3DB1FF] self-center'>{story.comments_count}</div>
                    <div className='text-center text-[#3DB1FF] self-center'>{story.views_count}</div>
                    <div className='text-center text-[#3DB1FF] self-center'>{story.likes_count}</div>
                </div>
            ))}
            {error && <p className='text-red-500'>Error loading stories: {error.message}</p>}
        </div>
    )
}
