'use client';

import React, { useState } from 'react';

const BookForm: React.FC = () => {
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching with:', { checkIn, checkOut, adults, kids });
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-50 px-4 py-4 flex flex-col gap-3 rounded-md border border-white  bg-white/10"
      style={{ fontFamily: '"Playfair Display", serif' }} // Luxury font
    >
      <form onSubmit={handleSearch} className="flex flex-row items-center gap-2 text-white">
        {/* Check-in Date */}
        <div className="flex flex-col text-xs flex-1">
          <label htmlFor="checkin" className="text-white text-sm mb-1">
            Check-in <abbr title="required" className="text-red-400">*</abbr>
          </label>
          <input
            id="checkin"
            name="checkin"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            className="text-sm bg-transparent border border-white rounded-md p-2 text-white placeholder-white focus:outline-none focus:border-[#F5A524] focus:ring-[#F5A524] w-full"
          />
        </div>

        {/* Divider */}
        <div className="border-l border-white h-8" />

        {/* Check-out Date */}
        <div className="flex flex-col text-xs flex-1">
          <label htmlFor="checkout" className="text-white text-sm mb-1">
            Check-out <abbr title="required" className="text-red-400">*</abbr>
          </label>
          <input
            id="checkout"
            name="checkout"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="text-sm bg-transparent border border-white rounded-md p-2 text-white placeholder-white focus:outline-none focus:border-[#F5A524] focus:ring-[#F5A524] w-full"
          />
        </div>

        {/* Adults Dropdown */}
        <div className="flex flex-col text-xs flex-1">
          <label htmlFor="adults" className="text-white text-sm mb-1">Adults</label>
          <select
            id="adults"
            name="adults"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="mt-1 bg-transparent border border-white text-white rounded-md shadow-sm focus:border-[#F5A524] focus:ring-[#F5A524] sm:text-sm p-2"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Kids Dropdown */}
        <div className="flex flex-col text-xs flex-1">
          <label htmlFor="kids" className="text-white text-sm mb-1">Children</label>
          <select
            id="kids"
            name="kids"
            value={kids}
            onChange={(e) => setKids(Number(e.target.value))}
            className="mt-1 bg-transparent border border-white text-white rounded-md shadow-sm focus:border-[#F5A524] focus:ring-[#F5A524] sm:text-sm p-2"
          >
            {Array.from({ length: 11 }, (_, i) => i).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-[#F5A524] hover:bg-[#e6951c] text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-lg self-end"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default BookForm;
