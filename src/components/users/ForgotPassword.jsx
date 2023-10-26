import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Label, TextInput } from 'flowbite-react';

export function ForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm();
    const onSubmit = async (data) => {

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
                <div >
                    <Button type="submit" className='w-full bg-[#3DB1FF]'>Recover password</Button>
                </div>
            </div>
        </form>
    )
}
