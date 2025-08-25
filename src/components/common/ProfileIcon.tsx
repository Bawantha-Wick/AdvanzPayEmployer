import React from 'react';
import { getProfileData } from '../../utils/profileUtils';

interface ProfileIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ name, size = 'md', className = '', onClick }) => {
  // Size configurations
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const { initials, colorClass } = getProfileData(name);
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`
        ${sizeClass}
        ${colorClass}
        rounded-full
        flex
        items-center
        justify-center
        text-white
        font-semibold
        cursor-pointer
        hover:opacity-80
        transition-opacity
        select-none
        border-2
        border-white
        ${className}
      `}
      onClick={onClick}
      title={name}
    >
      {initials}
    </div>
  );
};

export default ProfileIcon;
