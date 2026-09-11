'use client';

import React, { useEffect, useState } from 'react';
import AuthGuard from '../components/AuthGuard';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [userName, setUserName] = useState<string | null>('');
  const [userEmail, setUserEmail] = useState<string | null>('');
  const [userId, setUserId] = useState<string | null>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load user profile from backend
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedUserId = localStorage.getItem('userId');

    setUserEmail(storedEmail);
    setUserId(storedUserId);

    const fetchUserProfile = async () => {
      if (!storedUserId) return;

      try {
        const response = await apiService.get(`/users/${storedUserId}`);

        const user = response.data;

        setUserName(user.name);
        setNewName(user.name);
        setProfileImage(user.profileImage || null);

        // Keep localStorage updated
        localStorage.setItem('userName', user.name);

        if (user.profileImage) {
          localStorage.setItem('profileImage', user.profileImage);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Edit profile
  const handleEdit = () => {
    setNewName(userName || '');
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setNewName(userName || '');
    setIsEditing(false);
  };

  // Save name
  const handleSave = async () => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    if (!userId) {
      toast.error('User ID not found.');
      return;
    }

    try {
      setLoading(true);

      const response = await apiService.patch(`/users/${userId}`, {
        name: newName.trim(),
      });

      const updatedName = response.data.name;

      localStorage.setItem('userName', updatedName);

      setUserName(updatedName);
      setNewName(updatedName);
      setIsEditing(false);

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Upload profile image
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!userId) {
      toast.error('User ID not found.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
      );

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryResponse.json();

      const imageUrl = cloudinaryData.secure_url;

      // Save image URL to database
      await apiService.patch(`/users/${userId}`, {
        profileImage: imageUrl,
      });

      // Update UI
      setProfileImage(imageUrl);

      // Keep localStorage updated
      localStorage.setItem('profileImage', imageUrl);

      toast.success('Profile image updated successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload profile image.');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="flex flex-col items-center">

            {/* Profile Image */}
            <div className="relative mb-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                  {userName
                    ? userName.charAt(0).toUpperCase()
                    : 'U'}
                </div>
              )}

              {/* Change Image Button */}
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all shadow-md"
                title="Change profile image"
              >
                +
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </div>

            {/* Upload Status */}
            {uploadingImage && (
              <p className="text-sm text-blue-600 font-medium mb-3">
                Uploading image...
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              User Profile
            </h1>

            <p className="text-gray-500 mb-6 text-sm">
              Manage your account information
            </p>

            {/* User Information */}
            <div className="w-full space-y-4">

              {/* Name */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                  Full Name
                </p>

                {isEditing ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {userName || 'Not Available'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                  Email Address
                </p>

                <p className="text-gray-800 font-medium">
                  {userEmail || 'Not Available'}
                </p>
              </div>

              {/* Account Status */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                  Account Status
                </p>

                <p className="text-green-600 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active User
                </p>
              </div>
            </div>

            {/* Edit / Save Buttons */}
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="mt-8 w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                Edit Profile
              </button>
            ) : (
              <div className="mt-8 w-full flex gap-3">

                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-1/2 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-1/2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
