import React, { useEffect, useState } from 'react'
import { getStoriesByTopic } from '../../api/blog.api';



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
        <div className='bg-white border rounded p-2 text-gray-500'>
            <div className='grid grid-cols-10'>
                <div className='col-span-7 flex'>
                    <button className='mr-3'>Stories</button>
                    <button className='text-[#3DB1FF] underline'>Latest</button>
                </div>
                <div>Replies</div>
                <div>Views</div>
                <div>Likes</div>
            </div>
        </div>
    )
}
