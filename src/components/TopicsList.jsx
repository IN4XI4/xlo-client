import React, { useState, useEffect } from 'react';
import { getTopics } from '../api/blog.api';

export function TopicsList() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTopics();
    }, []);
    async function loadTopics() {
        try {
            const res = await getTopics();
            setCategories(res.data.results);
            console.log(res.data.results);
        } catch (error) {
            setError(error);
        }
    }
    return (
        <div>TopicsList</div>
    )
}
