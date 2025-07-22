"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, UsersIcon, UserIcon, XIcon } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

const BookForm: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [errors, setErrors] = useState<{ checkIn?: string; checkOut?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // This state now tracks which specific popover is open: 'checkin', 'checkout', etc.
  const [activePopover, setActivePopover] = useState<'checkin' | 'checkout' | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // --- Form Validation and Submission ---

  const validateForm = () => {
    const newErrors: { checkIn?: string; checkOut?: string } = {};
    if (!selectedRange?.from) newErrors.checkIn = 'Required';
    if (!selectedRange?.to) newErrors.checkOut = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Searching with:', { 
        checkIn: selectedRange?.from ? format(selectedRange.from, 'yyyy-MM-dd') : null,
        checkOut: selectedRange?.to ? format(selectedRange.to, 'yyyy-MM-dd') : null,
        adults, 
        kids 
      });
      setIsSubmitting(false);
      setActivePopover(null); // Close any open popovers
    }, 1000);
  };

  // --- State and Effect Handlers ---

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle date range selection from calendar
  const handleDateSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    if (range?.from && range?.to) {
      setActivePopover(null); // Close calendar after selecting a full range
    }
  };

  // --- Helper Functions ---
  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return 'Select Date';
    return format(date, 'MMM dd');
  };

  // --- Custom Styles for DayPicker ---
  const dayPickerStyles = {
    root: {
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      color: 'white',
      boxShadow: '0 0 8px rgba(230, 167, 69, 0.3)',
    },
    caption_label: { color: 'white', fontSize: '0.875rem', fontWeight: 'bold' },
    nav_button: { 
      color: 'white', 
      borderRadius: '99px',
      transition: 'background-color 0.2s',
    },
    'nav_button:hover': {
        backgroundColor: 'rgba(230, 167, 69, 0.2)',
    },
    head_cell: { color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: 'normal' },
    day: { color: 'white', borderRadius: '99px' },
    day_today: { color: '#e6a745', fontWeight: 'bold' },
    day_selected: { 
      backgroundColor: '#e6a745', 
      color: 'black',
      borderRadius: '99px',
      fontWeight: 'bold',
    },
    day_range_middle: { 
      backgroundColor: 'rgba(230, 167, 69, 0.3)', 
      color: 'white',
      borderRadius: 0,
    },
    day_range_start: { backgroundColor: '#e6a745', color: 'black' },
    day_range_end: { backgroundColor: '#e6a745', color: 'black' },
    day_disabled: { color: 'rgba(255, 255, 255, 0.3)', cursor: 'not-allowed' },
  };

  // --- Render ---

  return (
    <motion.div
      ref={formRef}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 px-2 sm:px-3 py-2 flex flex-col gap-2 rounded-xl border border-white/20 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-lg w-[85vw] sm:w-[60vw] max-w-3xl shadow-[0_0_8px_rgba(230,167,69,0.3)]"
      style={{ fontFamily: '"Playfair Display", serif' }}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <form
        onSubmit={handleSearch}
        className="flex flex-row flex-wrap items-center justify-between gap-1.5 text-white"
        aria-label="Book Now Form"
      >
        {/* Date Inputs */}
        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-white text-xs font-medium mb-1 flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" /> Check-in
          </label>
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'checkin' ? null : 'checkin')}
            className={`p-1.5 text-xs text-left rounded-md w-full transition-colors duration-200 focus:outline-none
              ${activePopover === 'checkin'
                ? 'bg-[#e6a745]/20 border-[#e6a745] ring-1 ring-[#e6a745]'
                : 'bg-transparent border border-white/30 text-white'
              }`}
          >
            {formatDateForDisplay(selectedRange?.from)}
          </button>
        </div>

        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-white text-xs font-medium mb-1 flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" /> Check-out
          </label>
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'checkout' ? null : 'checkout')}
            className={`p-1.5 text-xs text-left rounded-md w-full transition-colors duration-200 focus:outline-none
              ${activePopover === 'checkout'
                ? 'bg-[#e6a745]/20 border-[#e6a745] ring-1 ring-[#e6a745]'
                : 'bg-transparent border border-white/30 text-white'
              }`}
          >
            {formatDateForDisplay(selectedRange?.to)}
          </button>
        </div>
        
        {/* Guest Selectors */}
        <div className="flex flex-col flex-1 min-w-[100px]">
          <label htmlFor="adults" className="text-white text-xs font-medium mb-1 flex items-center gap-1">
            <UsersIcon className="w-3.5 h-3.5" /> Adults
          </label>
          <select id="adults" name="adults" value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="bg-transparent border border-white/30 rounded-md p-1.5 text-xs text-white focus:outline-none focus:border-[#e6a745] focus:ring-1 focus:ring-[#e6a745] transition-colors w-full">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num} className="bg-black text-white">
                {num} {num === 1 ? 'Adult' : 'Adults'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label htmlFor="kids" className="text-white text-xs font-medium mb-1 flex items-center gap-1">
            <UserIcon className="w-3.5 h-3.5" /> Children
          </label>
          <select id="kids" name="kids" value={kids} onChange={(e) => setKids(Number(e.target.value))} className="bg-transparent border border-white/30 rounded-md p-1.5 text-xs text-white focus:outline-none focus:border-[#e6a745] focus:ring-1 focus:ring-[#e6a745] transition-colors w-full">
            {Array.from({ length: 6 }, (_, i) => i).map((num) => (
              <option key={num} value={num} className="bg-black text-white">
                {num} {num === 1 ? 'Child' : 'Children'}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end h-full">
          <motion.button type="submit" className="bg-gradient-to-r from-[#e6a745] to-[#d1941a] hover:from-[#d1941a] hover:to-[#b87c16] text-white font-bold py-1.5 px-6 rounded-lg transition duration-300 shadow-md flex items-center justify-center" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label="Search for availability">
            {isSubmitting ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Search'}
          </motion.button>
        </div>
      </form>
      
      {/* Popover for Calendar */}
      <AnimatePresence>
        {(activePopover === 'checkin' || activePopover === 'checkout') && (
          <motion.div
            className="absolute bottom-full left-0 mb-2 z-60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={handleDateSelect}
              disabled={{ before: new Date() }}
              numberOfMonths={2}
              classNames={dayPickerStyles}
              defaultMonth={selectedRange?.from || new Date()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default BookForm;