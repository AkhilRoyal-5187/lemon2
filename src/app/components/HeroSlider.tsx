// components/ComplexHeroLayout.tsx
"use client"; // This directive is needed in Next.js App Router for client-side hooks

import React, { useState, useEffect, useRef, useCallback } from 'react'; // Import useCallback, useEffect, useRef, useState
import Image from 'next/image'; // Import Next.js Image component

// Imports for integrated components (assuming these are used elsewhere or will be added back)
// import { BsCalendar, BsChevronDown } from 'react-icons/bs'; // Icons for datepicker and dropdown
// import DatePicker from 'react-datepicker'; // DatePicker component
// import 'react-datepicker/dist/react-datepicker.css'; // DatePicker styles
// import '../style/datepicker.css'; // Custom datepicker styles (ensure this path is correct)
import { motion, useAnimation } from 'framer-motion'; // Import motion and useAnimation for loading animation
// import { useInView } from 'react-intersection-observer'; // Hook to check if element is in view
// import { Menu } from '@headlessui/react'; // Headless UI Menu for dropdowns

// Assuming these are external or defined elsewhere (if you are using the BookForm component)
import BookForm from './BookForm'; // Adjust the import path as needed
// import { useRoomContext } from '../context/RoomContext'; // Assuming this context exists
// import { adultsList } from '../constants/data'; // Assuming this constant exists
// Assuming kidsList and handleCheck are also from RoomContext or similar source


// Removed ChevronLeftIcon, ChevronRightIcon import as buttons are removed
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Example icons, install @heroicons/react
// Removed import for Bars3Icon and XMarkIcon

// Note: To use the luxury font (Playfair Display), add this link to your main layout or page's <head>:
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">


// Define the type for a single slide object
interface Slide {
  id: number;
  videoUrl: string; // Using local video URL/path
  startTime?: number; // Made start time optional as it was removed from the provided data
  title: string;
  description: string;
  // You could add other properties like imageUrl if needed as a fallback
}

// Define the type for the component's props
interface ComplexHeroLayoutProps {
  overlayOpacity?: number; // This prop is no longer used, but kept for type compatibility
}

// Define your slide data using the Slide interface
const slides: Slide[] = [
  {
    id: 1,
    // Use a placeholder local video path - replace with your actual video path
    videoUrl: '/01.mp4', // Example local video path
    // startTime: 36, // Removed start time from data as it was not in the provided data
    title: 'Stay Smartt',
    description: 'A modern business hotel in the heart of vizag - where comfort meets convenience for travelers corporates, and event guests.',
  },
  {
    id: 2,
    // Use a placeholder local video path - replace with your actual video path
    videoUrl: '/02.mp4', // Example local video path
    // startTime: 96, // Removed start time from data
    title: 'Stay Central',
    description: 'A modern business hotel in the heart of vizag - where comfort meets convenience for travelers corporates, and event guests.',
  },
  {
    id: 3,
    // Use a placeholder local video path - replace with your actual video path
    videoUrl: '/03.mp4', // Example local video path
    // startTime: 118, // Removed start time from data
    title: 'Stay Lemon Park',
    description: 'A modern business hotel in the heart of vizag - where comfort meets convenience for travelers corporates, and event guests.',
  },
];

const ComplexHeroLayout: React.FC<ComplexHeroLayoutProps> = ({
  // overlayOpacity is no longer used to control the overlay div
  // overlayOpacity = 0, // Default value is not relevant anymore
}) => {
  // State with type annotations
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  // Keep prevSlideIndex as state
  const [prevSlideIndexState, setPrevSlideIndexState] = useState<number>(0); // Renamed state variable to avoid conflict

  // State to manage the transform of each slide (opacity is no longer managed here for fading)
  // slideTransforms is an array of strings
  const [slideTransforms, setSlideTransforms] = useState<string[]>([]);

  // Removed contentAnimating state as description will be fixed
  // const [contentAnimating, setContentAnimating] = useState<boolean>(false);

  // State to control the visibility of the hero section after loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State to manage which dropdown is open (for hover effect on desktop)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // State to manage the scroll state for navigation bar background change
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // State to manage the mobile menu open/closed state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);


  // Ref to store slide elements for forcing reflow
  // Initialize with an empty array
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Ref to store video elements to control playback
  // Initialize with an empty array
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Removed form animation controls as we are animating the main container
  // const formControls = useAnimation();
  // const [formRef, formInView] = useInView({
  //   threshold: 0.2, // Adjust as needed
  // });

  // Removed effect for form animation


  // Effect to initialize refs and handle initial loading state on mount
  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, slides.length);
    videoRefs.current = videoRefs.current.slice(0, slides.length);

     // Set initial transforms after refs are potentially created
     setSlideTransforms(slides.map((_, index) => index === 0 ? 'translateX(0) translateY(0)' : 'translateX(100%) translateY(0)'));

     // Simulate loading delay and then show the hero section
     // In a real application, you might wait for specific resources to load
     const loadTimer = setTimeout(() => {
        setIsLoading(false); // Set loading to false to trigger fade-in
     }, 500); // Adjust delay as needed (e.g., 0ms for immediate, or more to simulate loading)

     return () => clearTimeout(loadTimer); // Cleanup the timer

  }, []); // Run only once on mount


  // Effect to handle slide transitions when currentSlide changes
  useEffect(() => {
    // Don't run transitions if still loading
    if (isLoading) return;

    // Use the state variable for the exiting slide index
    const exitingSlideIndex = prevSlideIndexState;
    const enteringSlideIndex = currentSlide;

    // Pause all videos
    videoRefs.current.forEach(ref => {
        if (ref) { // Check if ref exists (it's HTMLVideoElement | null)
            ref.pause();
        }
    });

    // Calculate initial and final states for transforms
    const initialTransforms = slides.map((_, index) => {
      if (index === enteringSlideIndex) {
        // Initial position for the entering slide
        if (enteringSlideIndex === 1 && exitingSlideIndex !== 1) {
          return 'translateX(0) translateY(100%)'; // Slide 1 enters from bottom
        } else if (exitingSlideIndex === 1 && enteringSlideIndex !== 1) {
           // When exiting slide 1, the entering slide comes horizontally
            return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1))
             ? 'translateX(100%) translateY(0)' // Enter from right
             : 'translateX(-100%) translateY(0)'; // Enter from left
        } else if (enteringSlideIndex !== exitingSlideIndex) {
           // Other horizontal entries
           return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1))
             ? 'translateX(100%) translateY(0)' // Enter from right
             : 'translateX(-100%) translateY(0)'; // Enter from left
        }
      }
      // For slides that are not entering or exiting, their initial state doesn't matter as they are hidden
      return 'translateX(0) translateY(0)';
    });


    const finalTransforms = slides.map((_, index) => {
      if (index === enteringSlideIndex) {
        return 'translateX(0) translateY(0)'; // Final position is at origin
      } else if (exitingSlideIndex === 1 && enteringSlideIndex !== 1) {
         // Final position for the exiting slide
         return 'translateX(0) translateY(-100%)'; // Slide 1 exits upwards
      } else if (enteringSlideIndex === 1 && enteringSlideIndex !== 1) {
          // When entering slide 1, the exiting slide slides left
          return 'translateX(-100%) translateY(0)';
      }
       // Default horizontal exit
       return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1))
         ? 'translateX(-100%) translateY(0)'
         : 'translateX(100%) translateY(0)';
    });


    // Apply initial state
    setSlideTransforms(initialTransforms);


    // Force reflow - needed for CSS transition to work from initial state
    // Accessing offsetHeight is one way to force reflow. This is intentional.
    const element = slideRefs.current[enteringSlideIndex];
    if (element) { // Check if element exists (it's HTMLDivElement | null)
        // Accessing offsetHeight forces a reflow, necessary for CSS transitions
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        element.offsetHeight; // Fix for Expected an assignment or function call...
    }

    // Apply final state after a small delay to allow reflow and transition to start
    const transitionTimeout = setTimeout(() => {
      setSlideTransforms(finalTransforms);

      // Play the video of the entering slide and set current time
      const enteringVideoRef = videoRefs.current[enteringSlideIndex];
      if (enteringVideoRef) { // Check if enteringVideoRef exists (it's HTMLVideoElement | null)
          // Check if startTime exists on the slide data before setting currentTime
          if (slides[enteringSlideIndex].startTime !== undefined) {
             enteringVideoRef.currentTime = slides[enteringSlideIndex].startTime as number; // Set start time
          }
          enteringVideoRef.play().catch(error => {
              // Autoplay might be blocked, handle accordingly (e.g., show a play button)
              console.error("Autoplay failed:", error);
          });
      }

    }, 50); // Small delay

    return () => clearTimeout(transitionTimeout); // Cleanup timeout

  }, [currentSlide, prevSlideIndexState, isLoading]); // Use prevSlideIndexState in dependencies


  // Effect to handle scroll for navigation bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Run only once on mount


  // Function to go to the next slide (wrapped in useCallback)
  const nextSlide = useCallback(() => {
    // Update the previous slide index state before updating the current slide
    setPrevSlideIndexState(currentSlide);
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, [currentSlide, slides.length]); // Added slides.length to dependencies


  // Auto-play functionality
  useEffect(() => {
    // Only start auto-play if not loading
    if (isLoading) return;

    const interval = setInterval(nextSlide, 8000); // Change slide every 8 seconds
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [nextSlide, isLoading]); // Add nextSlide and isLoading to dependencies

  // Calculate indices for previous, current, and next slides using the currentSlide state
  const calculatedPrevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
  const calculatedNextSlideIndex = (currentSlide + 1) % slides.length;

  const currentSlideData = slides[currentSlide];
  

  return (
    // Use motion.div for the main container to enable animations
    // Removed invisible/visible classes as motion handles visibility via opacity
    <motion.div
        className={`relative w-full overflow-hidden h-screen rounded-lg shadow-xl`}
        initial={{ opacity: 0 }} // Initial state: hidden
        animate={{ opacity: isLoading ? 0 : 1 }} // Animate to visible when isLoading is false
        transition={{ duration: 0.8, ease: "easeOut" }} // Animation duration and easing
    > {/* Changed height to h-screen and added visibility classes */}

      {/* Navigation Bar */}
      {/* Positioned absolutely at the top, above the overlay and content */}
      {/* Added conditional classes for background and text color on scroll */}
      <nav className={`fixed top-0 left-0 right-0 z-30 p-4 md:px-8 flex items-center justify-between transition-colors duration-300 ${isScrolled ? 'bg-white text-black shadow-md' : 'bg-transparent text-white'}`}>
        {/* Left Section: Navigation Links (Hidden on small screens) */}
        <div className="hidden md:flex items-center space-x-6">
           {/* Home Link */}
           <a href="#" className={`text-[#F7B750] text-lg font-semibold hover:opacity-70 transition duration-300 relative group-hover:underline group-hover:decoration-[#F7B750] group-hover:decoration-2 ${isScrolled ? 'text-black' : 'text-[#F7B750]'}`}>Home</a>
          <div
            className="relative group"
            onMouseEnter={() => setOpenDropdown('hotel')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {/* Added underline classes and conditional text color */}
            <a href="#" className={`text-lg font-semibold hover:opacity-70 transition duration-300 relative group-hover:underline group-hover:decoration-[#F7B750] group-hover:decoration-2 ${isScrolled ? 'text-black' : 'text-[#F7B750]'}`}>Our Hotel</a>
            {/* Animated Dropdown for Our Hotel */}
            <div
              className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
                openDropdown === 'hotel' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">About Us</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Amenities</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Gallery</a>
            </div>
          </div>
          <div
             className="relative group"
             onMouseEnter={() => setOpenDropdown('rooms')}
             onMouseLeave={() => setOpenDropdown(null)}
          >
            {/* Added underline classes and conditional text color */}
            <a href="#" className={`text-lg font-semibold hover:opacity-70 transition duration-300 relative group-hover:underline group-hover:decoration-[#F7B750] group-hover:decoration-2 ${isScrolled ? 'text-black' : 'text-[#F7B750]'}`}>Rooms</a> {/* Corrected color class */}
             {/* Animated Dropdown for Rooms */}
             <div
               className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
                 openDropdown === 'rooms' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
               }`}
             >
               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Room Types</a>
               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Special Offers</a>
             </div>
          </div>
           {/* Added underline classes and conditional text color */}
           <a href="#" className={`text-lg font-semibold hover:opacity-70 transition duration-300 relative group-hover:underline group-hover:decoration-[#F7B750] group-hover:decoration-2 ${isScrolled ? 'text-black' : 'text-[#F7B750]'}`}>Contact</a>
        </div>

        {/* Center Section: Logo */}
        {/* Adjusted positioning for responsiveness */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 ${isMobileMenuOpen ? 'hidden' : 'block'}`}> {/* Hide logo when mobile menu is open */}
          {/* Replace with your actual logo image path */}
          {/* Replaced img with Image component */}
          <Image src="/logo.svg" alt="Logo" width={100} height={48} className="h-10 md:h-12 w-auto" /> {/* Example logo size, added width/height */} {/* Corrected md:h-18 back to md:h-12 */}
        </div>

        {/* Right Section: Book Now Button and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
           {/* Book Now Button */}
           <button
             className="bg-[#F7B750] hover:bg-[#e6a745] text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-lg"
             onClick={() => { /* Add your booking logic here */ }}
           >
             Book Now
           </button>

           {/* Mobile Menu Button (Visible on small screens) */}
           <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
               {/* Replaced icon with text */}
               {isMobileMenuOpen ? (
                   <span className={`text-2xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>&times;</span> // Simple X
               ) : (
                   <span className={`text-2xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>&#x2261;</span> // Hamburger
               )}
           </button>
        </div>
      </nav>

      {/* Mobile Menu (Hidden by default, slides in from top) */}
      <div className={`fixed top-0 left-0 w-full bg-white z-20 transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex justify-end p-4">
               <button onClick={() => setIsMobileMenuOpen(false)}>
                    {/* Replaced icon with text */}
                   <span className="text-2xl font-bold text-black">&times;</span> {/* Simple X */}
               </button>
          </div>
          <div className="flex flex-col items-center py-8 space-y-4">
              {/* Mobile Menu Links */}
              <a href="#" className="text-black text-lg font-semibold hover:text-gray-700 transition duration-300">Home</a>
              {/* Simplified mobile dropdowns for demonstration */}
              <a href="#" className="text-black text-lg font-semibold hover:text-gray-700 transition duration-300">Our Hotel</a>
              <a href="#" className="text-black text-lg font-semibold hover:text-gray-700 transition duration-300">Rooms</a>
              <a href="#" className="text-black text-lg font-semibold hover:text-gray-700 transition duration-300">Contact</a>
          </div>
      </div>


      {/* Slide Container - Slides are now absolute positioned */}
      <div className="relative w-full h-full"> {/* Changed to relative and full height */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            // Assign ref directly with explicit type for 'el'
            ref={(el: HTMLDivElement | null) => { slideRefs.current[index] = el; }}
            // Added opacity class based on current slide, removed duration from here
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transform: slideTransforms[index], // Use state for transform
              // Opacity is now controlled by the className
              pointerEvents: index === currentSlide ? 'auto' : 'none', // Only current slide is interactive
            }}
          >
            {/* Video Element (always rendered now) */}
            {/* Using local video tag */}
            <video
              // Assign ref directly with explicit type for 'el'
              ref={(el: HTMLVideoElement | null) => { videoRefs.current[index] = el; }}
              src={slide.videoUrl} // Use local video URL
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay // Autoplay
              loop // Loop
              muted // Muted (required for autoplay in many browsers)
              playsInline // Plays inline on iOS
              preload="auto" // Preload video
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

        {/* Content Container (positioned over the current slide) */}
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center h-full text-white p-4 text-center`}> {/* Added text-center for mobile */}
            {/* Hero Titles Container */}
            {/* Adjusted height for potentially taller titles on mobile */}
            <div className="relative w-full text-center mb-4 md:mb-8 overflow-hidden h-20 md:h-24"> {/* Adjusted height and margin-bottom for responsiveness */}
                {/* Render previous, current, and next titles */}
                {[calculatedPrevSlideIndex, currentSlide, calculatedNextSlideIndex].map((slideIndex, index) => { // Use calculated indices
                    const slide = slides[slideIndex]; // Get slide data using the index

                    // Determine the position and size based on the index relative to the current slide in the displayed array
                    let positionClass = '';
                    let sizeClass = '';
                    let opacityClass = 'opacity-0'; // Default to hidden

                    if (index === 0) { // Previous slide title
                        // Position slightly to the left of center, hide on small screens
                        positionClass = 'left-[20%] transform -translate-x-1/2 hidden md:block'; // Adjusted position, added hidden and md:block
                        sizeClass = 'text-xl md:text-2xl';
                        opacityClass = 'opacity-70'; // Slightly visible
                    } else if (index === 1) { // Current slide title
                        // Centered, responsive size
                        positionClass = 'left-1/2 transform -translate-x-1/2';
                        sizeClass = 'text-3xl md:text-6xl'; // Adjusted size for mobile
                        opacityClass = 'opacity-100'; // Fully visible
                    } else { // Next slide title
                        // Position slightly to the right of center, hide on small screens
                        positionClass = 'left-[80%] transform -translate-x-1/2 hidden md:block'; // Adjusted position, added hidden and md:block
                        sizeClass = 'text-xl md:text-2xl';
                        opacityClass = 'opacity-70'; // Slightly visible
                    }

                    return (
                        <h1
                            key={slide.id}
                            className={`absolute top-1/2 -translate-y-1/2 font-bold transition-all duration-700 ease-in-out ${positionClass} ${sizeClass} ${opacityClass}`} // Added transition classes
                            style={{ fontFamily: '"Playfair Display", serif', whiteSpace: 'nowrap' }} // Prevent wrapping
                        >
                            {slide.title}
                        </h1>
                    );
                })}
            </div>

            {/* Description (fixed) */}
            {/* Ensure description is centered and wraps on smaller screens */}
            <div className={`text-center max-w-xs md:max-w-2xl mx-auto`}> {/* Added max-w-xs and mx-auto for centering on small screens */}
                {/* Removed background and opacity classes from text */}
                {/* Applied luxury font */}
                <p className="text-sm md:text-xl inline-block" style={{ fontFamily: '"Playfair Display", serif' }}>{currentSlideData.description}</p> {/* Adjusted text size for mobile */}
                {/* Placeholder for a call-to-action link */}
                {/* <a href="#" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">Learn More</a> */}
            </div>
        </div>

        {/* Booking Form */}
        {/* Render the BookForm component directly */}
        {/* BookForm component now handles its own responsive fixed positioning */}
        <div className=''>
          <BookForm />

        </div>

      {/* Scroll Hint (Optional) */}
      {/* This would typically be a separate element positioned at the bottom */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white z-10">
        <span>Scroll down</span>
        <div className="w-6 h-10 border-2 border-white rounded-full mx-auto mt-2 animate-bounce">
            <div className="w-1 h-3 bg-white rounded-full mx-auto mt-1"></div>
        </div>
      </div> */}
    </motion.div>
  );
};

export default ComplexHeroLayout;
