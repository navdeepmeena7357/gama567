'use client';
import { BASE_URL } from '@/app/services/api';
import LoadingModal from '@/components/LoadingModal';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';
import { getTokenFromLocalStorage, getUserIdFromToken } from '@/utils/basic';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const validate = () => {
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!oldPassword) {
      newErrors.oldPassword = 'Old password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();
    console.log('Validation result:', isValid);

    if (isValid) {
      console.log('I am invoked');

      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/change_password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
            user_id: getUserIdFromToken(),
          }),
        });

        if (!response.ok) {
          showErrorToast('Failed to change password');
          throw new Error('Failed to change password');
        }

        const data = await response.json();
        console.log(data);
        if (data.status) {
          setConfirmPassword('');
          setOldPassword('');
          setNewPassword('');
          showSuccessToast(data.message);
        } else {
          showErrorToast(data.message);
        }
      } catch (error) {
        showErrorToast('Error changing password: ' + error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Validation failed');
    }
  };

  return (
    <>
      <TitleBar title="Change Password" />
      <LoadingModal isOpen={isLoading} />
      <Toaster position="bottom-center" reverseOrder={false} />
      <SafeArea>
        <div className="flex justify-center items-center bg-gray-100">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
              Change Password
            </h2>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                  errors.oldPassword
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                placeholder="Enter old password"
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm">{errors.oldPassword}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                  errors.newPassword
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                  errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-orange-500 hover:bg-orange-600 rounded-md transition duration-300"
            >
              Update Password
            </button>
          </form>
        </div>
      </SafeArea>
    </>
  );
};

export default ChangePassword;
