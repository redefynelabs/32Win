"use client";
import React, { useState } from 'react'
import Link from 'next/link'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/datePicker'
import ContainerLayout from '@/layout/ContainerLayout';
import { ChevronLeft, Phone, Mail } from 'lucide-react';
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdAccountBalanceWallet } from "react-icons/md";
import { HiMiniArrowUpRight } from "react-icons/hi2";


const Page = () => {
  // Dummy data
  const [userData] = useState({
    username: 'Alexa Rawles',
    phoneNumber: '98xxxxxxxx',
    walletBalance: '500',
    email: 'alexarawles@gmail.com',
    avatar: '👩🏽',
    lastUpdated: '1 month ago'
  })

  const [formData, setFormData] = useState({
    firstName: 'Alexa',
    lastName: 'Rawles',
    gender: 'female',
    dob: '17-06-2025'
  })

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <ContainerLayout>
      <div className='flex flex-col gap-6 p-4 md:p-6 lg:p-8 mt-10'>
        {/* Back Button */}
        <Link href='/' className='flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors'>
          <ChevronLeft className='w-5 h-5' />
          <span className='text-base font-medium'>Back</span>
        </Link>

        {/* Main Card */}
        <div className='bg-white border border-primary/20 rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm'>

          {/* Header Section - Avatar, Name, Wallet */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-8 border-gray-100'>
            <div className='flex items-center gap-4'>
              {/* Avatar */}
              <div className='w-20 h-20 md:w-24 md:h-24 rounded-full  flex items-center justify-center text-4xl md:text-5xl'>
                {userData.avatar}
              </div>

              {/* Name and Phone */}
              <div className='flex flex-col '>
                <div className='flex items-center gap-4'>
                  <h1 className='text-xl md:text-2xl font-bold text-gray-900'>{userData.username}</h1>
                  <button className='text-red-500 hover:text-red-600 transition-colors'>
                    <FaRegPenToSquare className='w-6 h-6' />
                  </button>
                </div>
                <p className='text-[#959595] text-lg'>{userData.phoneNumber}</p>
              </div>
            </div>

            {/* Wallet */}
            <div className='flex items-center justify-center gap-3 px-6 py-3 border border-black/20 bg-primary/2 rounded-full'>
              <div className='flex items-center gap-1'>
                <span className='text-red-500 font-bold text-2xl'>RM</span>
                <span className='text-red-500 font-regular text-2xl'>{userData.walletBalance}</span>
              </div>
              <div className='w-10 h-10 rounded-lg flex items-center justify-center'>
                <MdAccountBalanceWallet className='w-7 h-7 text-primary' />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className='space-y-6 mb-8'>
            {/* First Row - First Name and Last Name */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Alexa"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full ${errors.firstName ? "border-red-500" : ""}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Rawles"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full ${errors.lastName ? "border-red-500" : ""}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Second Row - Gender and DOB */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full ${errors.gender ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>DOB</label>
                <DatePicker
                  name="dob"
                  placeholder="17-06-2025"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full ${errors.dob ? "border-red-500" : ""}`}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            {/* Phone Number */}
            <div>
              <h2 className='text-base font-bold text-gray-900 mb-4'>My Phone Number</h2>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0'>
                  <Phone className='w-5 h-5 text-red-500' />
                </div>
                <div className='flex flex-col'>
                  <p className='text-gray-900 font-medium'>{userData.phoneNumber}</p>
                  <p className='text-gray-500 text-sm'>{userData.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <h2 className='text-base font-bold text-gray-900 mb-4'>My email Address</h2>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0'>
                  <Mail className='w-5 h-5 text-red-500' />
                </div>
                <div className='flex flex-col'>
                  <p className='text-gray-900 font-medium break-all'>{userData.email}</p>
                  <p className='text-gray-500 text-sm'>{userData.lastUpdated}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Button */}
          <div className="flex flex-row items-center justify-center pt-6">
            <Link
              href="#"
              className="flex items-center justify-between gap-3 w-[400px] px-5 py-4 border border-black/20 bg-primary/2 rounded-full hover:border-red-500 hover:bg-red-50 transition-all duration-300 group"
            >
              <span className="text-red-500 font-medium text-lg">Go to Dashboard</span>
              <HiMiniArrowUpRight className="text-red-500 text-2xl" />
            </Link>
          </div>


        </div>
      </div>
    </ContainerLayout>
  )
}

export default Page