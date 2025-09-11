'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  CameraIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { formatPhone } from '@/utils/format'
import clsx from 'clsx'
import FileUpload from '@/components/ui/file-upload'

interface ProfileData {
  profilePicture?: string
  companyName: string
  mobileNumber: string
  emailAddress: string
  vatNumber: string
  registeredAddress: {
    line1: string
    line2?: string
    city: string
    postcode: string
    country: string
  }
}

const initialProfileData: ProfileData = {
  companyName: 'Timestack Ltd',
  mobileNumber: '+44 (0)20 7123 4567',
  emailAddress: 'admin@timestack.com',
  vatNumber: 'GB123456789',
  registeredAddress: {
    line1: '10B Berkeley St',
    line2: 'Mayfair',
    city: 'London',
    postcode: 'W1J 8DR',
    country: 'United Kingdom'
  }
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (field: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleAddressChange = (field: keyof ProfileData['registeredAddress']) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileData(prev => ({
      ...prev,
      registeredAddress: {
        ...prev.registeredAddress,
        [field]: e.target.value
      }
    }))
  }

  const handleSave = () => {
    // Here you would typically save to a backend or store
    console.log('Saving profile:', profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setProfileData(initialProfileData)
    setIsEditing(false)
  }

  const handleImageUpload = (files: File[]) => {
    if (files.length > 0) {
      setIsUploading(true)
      const file = files[0]
      // Simulate upload
      setTimeout(() => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setProfileData(prev => ({
            ...prev,
            profilePicture: event.target?.result as string
          }))
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }, 1000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and business details</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary flex items-center space-x-2"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              {isEditing ? (
                <div className="w-48">
                  <FileUpload
                    onChange={handleImageUpload}
                    accept="image/*"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024} // 5MB
                    existingImage={profileData.profilePicture}
                    disabled={isUploading}
                    className="w-full"
                  />
                  {isUploading && (
                    <div className="mt-2 text-sm text-gray-500 text-center">Uploading...</div>
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profileData.profilePicture ? (
                    <img
                      src={profileData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BuildingOfficeIcon className="w-4 h-4 inline mr-2" />
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={handleInputChange('companyName')}
                    className="form-input w-full"
                    placeholder="Enter company name"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{profileData.companyName}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="w-4 h-4 inline mr-2" />
                    Mobile Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.mobileNumber}
                      onChange={handleInputChange('mobileNumber')}
                      className="form-input w-full"
                      placeholder="Enter mobile number"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.emailAddress}
                      onChange={handleInputChange('emailAddress')}
                      className="form-input w-full"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.emailAddress}</p>
                  )}
                </div>
              </div>

              {/* VAT Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IdentificationIcon className="w-4 h-4 inline mr-2" />
                  VAT Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.vatNumber}
                    onChange={handleInputChange('vatNumber')}
                    className="form-input w-full"
                    placeholder="Enter VAT number"
                  />
                ) : (
                  <p className="text-gray-900 font-mono">{profileData.vatNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Address */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Registered Business Address
          </h3>
        </div>
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={profileData.registeredAddress.line1}
                    onChange={handleAddressChange('line1')}
                    className="form-input w-full"
                    placeholder="Enter address line 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={profileData.registeredAddress.line2}
                    onChange={handleAddressChange('line2')}
                    className="form-input w-full"
                    placeholder="Enter address line 2 (optional)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileData.registeredAddress.city}
                    onChange={handleAddressChange('city')}
                    className="form-input w-full"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={profileData.registeredAddress.postcode}
                    onChange={handleAddressChange('postcode')}
                    className="form-input w-full"
                    placeholder="Enter postcode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={profileData.registeredAddress.country}
                    onChange={handleAddressChange('country')}
                    className="form-input w-full"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-900">
              <p className="font-medium">{profileData.registeredAddress.line1}</p>
              {profileData.registeredAddress.line2 && (
                <p>{profileData.registeredAddress.line2}</p>
              )}
              <p>{profileData.registeredAddress.city}, {profileData.registeredAddress.postcode}</p>
              <p>{profileData.registeredAddress.country}</p>
            </div>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <p className="text-gray-900">Administrator</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <p className="text-gray-900">January 2024</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Login
              </label>
              <p className="text-gray-900">Today at 2:30 PM</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Status
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
