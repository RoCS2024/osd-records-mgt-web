import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from '../styles/UnifiedDropdown.module.css';

const UnifiedDropdown = ({
  options,
  selectedValue,
  onChange,
  placeholder = 'Select an option',
  isSearchable = false,
  renderOption = (option) => option.label || option,
  getOptionValue = (option) => option.value || option,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = isSearchable
    ? options.filter((option) =>
        renderOption(option).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    onChange(getOptionValue(option));
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button type="button" className={styles.dropdownButton} onClick={toggleDropdown}>
        {selectedValue
          ? renderOption(options.find((option) => getOptionValue(option) === selectedValue))
          : placeholder}
        <FaChevronDown className={styles.dropdownIcon} />
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {isSearchable && (
            <input
              type="text"
              className={styles.dropdownSearch}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          <ul className={styles.dropdownOptions}>
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className={styles.dropdownOption}
                onClick={() => handleSelect(option)}
              >
                {renderOption(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UnifiedDropdown;

