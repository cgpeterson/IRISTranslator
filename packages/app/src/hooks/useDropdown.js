import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing dropdown state with click-outside detection
 * @returns {Object} - Dropdown state and handlers
 */
export function useDropdown() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (category) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  return {
    openDropdown,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
  };
}
