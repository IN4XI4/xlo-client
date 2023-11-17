import React, { useEffect, useState } from 'react';
import { FaBell, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../api/users.api';
import { Avatar } from 'flowbite-react';


export function Navigation() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ data: {} });
    const [error, setError] = useState(null);
    
    useEffect(() => {
        loadUser();
    }, []);
    const token = localStorage.getItem("token");
    async function loadUser() {
        console.log("token", token);
        if (!token) {
            setError(new Error("No authentication token available."));
            return;
        }
        try {
            const res = await getUser();
            setUser(res.data);
        } catch (error) {
            setError(error);
            localStorage.removeItem("token");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };
    return (
        <div className="bg-white z-10 shadow p-4 fixed top-0 w-full flex justify-between items-center px-4 md:px-16 lg:px-32 xl:px-44">
            <div className="flex items-center space-x-4">
                <Link to="/">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="18" fill="#3DB1FF" />
                        <path d="M14.4631 26.6292C14.4631 26.6292 13.992 28.0707 12.2902 27.9162C10.5885 27.7618 10.048 25.4745 9.96034 24.8199C9.87269 24.1654 9.6901 22.3893 10.8697 17.1087C12.0529 11.8134 14.076 6.81602 14.076 6.81602C14.076 6.81602 14.3645 5.92613 15.3907 5.89671C16.1795 5.87464 16.5629 6.03276 16.5775 6.83073C16.5921 7.6287 16.0809 16.5902 17.9653 17.1528C19.8496 17.7155 22.395 8.76498 22.395 8.76498C22.395 8.76498 22.731 7.3529 23.7644 7.36026C24.2867 7.36394 24.4035 7.44851 24.5058 7.61767C24.6372 7.8383 24.5715 8.22809 24.3378 9.49675C23.79 12.457 23.1911 19.5026 23.6622 23.5439C24.1296 27.5853 26.1053 28.2067 26.1053 28.2067C26.1053 28.2067 25.5027 30.5712 23.1692 29.7034C20.3792 28.6627 20.7663 24.2353 20.7918 23.5329C20.8137 22.9556 21.3104 16.2887 22.2854 12.3099C22.2854 12.3099 19.8131 20.2565 17.0888 19.4695C14.3645 18.6826 14.5909 10.291 14.5909 10.291C14.5909 10.291 13.0608 16.2593 12.8636 22.312C12.7431 26.0592 14.4668 26.6218 14.4668 26.6218L14.4631 26.6292Z" fill="white" />
                    </svg>
                </Link>
                <span className="text-xl font-semibold">Mixelo</span>
                <span className="text-gray-500 hidden sm:block">Title</span>
            </div>
            <div className="flex items-center space-x-4">
                <FaBell size={20} color="currentColor" />
                <div className="flex items-center space-x-4">
                    {user && user.picture ? (
                        <Avatar img={user.picture} alt="Profile" rounded/>
                    ) : (
                        <FaUser size={20} color="currentColor" />
                    )}
                    <div className="border-l-2 border-gray-300 pl-4">
                        <button onClick={handleLogout} className="text-blue-300">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
