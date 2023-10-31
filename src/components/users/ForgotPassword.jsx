import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Label, TextInput } from 'flowbite-react';
import { lostPassword } from '../../api/users.api';


export function ForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const onSubmit = async (data) => {
        try {
            const response = await lostPassword(data);
            if (response.status === 200) {
                setMessage('Reset code sent to email.');
                setError('');
            } else {
                setError('There was an issue sending the reset code.');
                setMessage('');
            }
        } catch (err) {
            setError('There was an error sending the reset code.');
            setMessage('');
        }
    };
    return (
        <form className="grid grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="hidden lg:block"></div>
            <div className="bg-white p-8 rounded-md shadow-md col-span-full xl:col-span-3">
                <div className="mb-4">
                    <div className='pb-2'>
                        <Label htmlFor="email" className="text-gray-900" value="Your email" />
                    </div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        {...register('email', {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        color={errors.email ? 'failure' : 'gray'}
                        helpertext={errors.email ? errors.email.message : undefined} />
                </div>
                {message && <p className="text-green-500 text-center">{message}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div >
                    <Button type="submit" className='w-full bg-[#3DB1FF]'>Recover password</Button>
                </div>
            </div>
        </form>
    )
}
