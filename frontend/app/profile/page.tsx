'use client';

import React, { useEffect, useState } from 'react';
import AuthGuard from '../components/AuthGuard';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify';

interface UserProfile {
  name: string;
  profileImage?: string | null;
}

interface UpdateUserResponse {
  name: string;
}

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
        const response = await apiService.get<UserProfile>(
          `/users/${storedUserId}`,
        );

        const user = response.data;

        setUserName(user.name);
        setNewName(user.name);
        setProfileImage(user.profileImage || null);

        // Keep localStorage updated
        localStorage.setItem('userName', user.name);

        if (user.profileImage) {
          localStorage.setItem(
            'profileImage',
            user.profileImage,
          );
        }
      } catch (error) {
        console.error(
          'Failed to fetch profile:',
          error,
        );
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

      const response =
        await apiService.patch<UpdateUserResponse>(
          `/users/${userId}`,
          {
            name: newName.trim(),
          },
        );

      const updatedName = response.data.name;

      localStorage.setItem(
        'userName',
        updatedName,
      );

      setUserName(updatedName);
      setNewName(updatedName);
      setIsEditing(false);

      toast.success(
        'Profile updated successfully!',
      );
    } catch (error) {
      console.error(
        'Profile update error:',
        error,
      );

      toast.error(
        'Failed to update profile.',
      );
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
      toast.error(
        'Please select a valid image file.',
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        'Image size must be less than 5MB.',
      );
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append('file', file);

      formData.append(
        'upload_preset',
        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
      );

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!cloudinaryResponse.ok) {
        throw new Error(
          'Cloudinary upload failed',
        );
      }

      const cloudinaryData =
        await cloudinaryResponse.json();

      const imageUrl =
        cloudinaryData.secure_url;

      // Save image URL to database
      await apiService.patch(
        `/users/${userId}`,
        {
          profileImage: imageUrl,
        },
      );

      // Update UI
      setProfileImage(imageUrl);

      // Keep localStorage updated
      localStorage.setItem(
        'profileImage',
        imageUrl,
      );

      toast.success(
        'Profile image updated successfully!',
      );
    } catch (error) {
      console.error(
        'Image upload error:',
        error,
      );

      toast.error(
        'Failed to upload profile image.',
      );
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">

        {/* ================= PROFILE CARD ================= */}
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-5 shadow-xl sm:p-8">

          <div className="flex flex-col items-center">

            {/* ================= PROFILE IMAGE ================= */}
            <div className="relative mb-4">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white shadow-lg sm:h-28 sm:w-28 sm:text-4xl">
                  {userName
                    ? userName
                        .charAt(0)
                        .toUpperCase()
                    : 'U'}
                </div>
              )}

              {/* Change Image Button */}
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95 sm:h-9 sm:w-9"
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

            {/* ================= UPLOAD STATUS ================= */}
            {uploadingImage && (
              <p className="mb-3 text-xs font-medium text-blue-600 sm:text-sm">
                Uploading image...
              </p>
            )}

            {/* ================= TITLE ================= */}
            <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              User Profile
            </h1>

            <p className="mb-6 text-center text-xs text-gray-500 sm:text-sm">
              Manage your account information
            </p>

            {/* ================= USER INFORMATION ================= */}
            <div className="w-full space-y-3 sm:space-y-4">

              {/* Name */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400 sm:text-xs">
                  Full Name
                </p>

                {isEditing ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) =>
                      setNewName(
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="break-words text-sm font-medium text-gray-800 sm:text-base">
                    {userName ||
                      'Not Available'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400 sm:text-xs">
                  Email Address
                </p>

                <p className="break-all text-sm font-medium text-gray-800 sm:text-base">
                  {userEmail ||
                    'Not Available'}
                </p>
              </div>

              {/* Account Status */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400 sm:text-xs">
                  Account Status
                </p>

                <p className="flex items-center gap-2 text-sm font-bold text-green-600 sm:text-base">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  Active User
                </p>
              </div>
            </div>

            {/* ================= EDIT / SAVE ================= */}
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="mt-6 min-h-[48px] w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] sm:mt-8 sm:text-base"
              >
                Edit Profile
              </button>
            ) : (
              <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row">

                {/* Cancel */}
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="min-h-[48px] w-full rounded-xl bg-gray-200 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/2 sm:text-base"
                >
                  Cancel
                </button>

                {/* Save */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="min-h-[48px] w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/2 sm:text-base"
                >
                  {loading
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
