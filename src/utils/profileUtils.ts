/**
 * Utility functions for profile-related operations
 */

/**
 * Extract initials from a full name (first 3 letters)
 * @param fullName - The full name to extract initials from
 * @returns String containing up to 3 initials
 */
export const getProfileInitials = (fullName: string): string => {
  if (!fullName || fullName.trim() === '') return 'U';

  const cleanName = fullName.trim().toUpperCase();

  // If name has spaces, take first letter of each word (up to 3)
  const words = cleanName.split(/\s+/);
  if (words.length > 1) {
    return words
      .slice(0, 3)
      .map((word) => word.charAt(0))
      .join('');
  }

  // If single word, take first 3 characters
  return cleanName.substring(0, 3);
};

/**
 * Generate a consistent color class based on name
 * @param fullName - The full name to generate color for
 * @returns Tailwind CSS background color class
 */
export const getProfileColor = (fullName: string): string => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'];

  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < fullName.length; i++) {
    hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Generate profile data including initials and color
 * @param fullName - The full name to process
 * @returns Object containing initials and color class
 */
export const getProfileData = (fullName: string) => ({
  initials: getProfileInitials(fullName),
  colorClass: getProfileColor(fullName)
});
