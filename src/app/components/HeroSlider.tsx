"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { motion } from 'framer-motion';
import BookForm from './BookForm';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigaction-menu"; // Typo preserved as in original

interface Slide {
  id: number;
  videoUrl: string;
  startTime?: number;
  title: string;
  description: string;
}

interface ComplexHeroLayoutProps {
  overlayOpacity?: number;
}

const slides: Slide[] = [
  {
    id: 1,
    videoUrl: '/01.mp4',
    title: 'STAY SMART',
    description: 'A modern business hotel in the heart of vizag - where comfort meets convenience for travelers corporates, and event guests.',
  },
  {
    id: 2,
    videoUrl: '/02.mp4',
    title: 'STAY CENTRAL',
    description: 'A modern business hotel in the heart of vizag - where comfort meets convenience for travelers corporates, and event guests.',
  },
  {
    id: 3,
    videoUrl: '/03.mp4',
    title: 'STAY LEMON PARK',
    description: 'A modern business hotel in the heart of vizag - where comfort meets convenience for travelers corporates, and event guests.',
  },
];

const ComplexHeroLayout: React.FC<ComplexHeroLayoutProps> = ({}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [prevSlideIndexState, setPrevSlideIndexState] = useState<number>(0);
  const [slideTransforms, setSlideTransforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, slides.length);
    videoRefs.current = videoRefs.current.slice(0, slides.length);
    setSlideTransforms(slides.map((_, index) => index === 0 ? 'translateX(0) translateY(0)' : 'translateX(100%) translateY(0)'));
    const loadTimer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const exitingSlideIndex = prevSlideIndexState;
    const enteringSlideIndex = currentSlide;
    videoRefs.current.forEach(ref => ref?.pause());
    const initialTransforms = slides.map((_, index) => {
      if (index === enteringSlideIndex) {
        if (enteringSlideIndex === 1 && exitingSlideIndex !== 1) return 'translateX(0) translateY(100%)';
        if (exitingSlideIndex === 1 && enteringSlideIndex !== 1) return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1)) ? 'translateX(100%) translateY(0)' : 'translateX(-100%) translateY(0)';
        if (enteringSlideIndex !== exitingSlideIndex) return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1)) ? 'translateX(100%) translateY(0)' : 'translateX(-100%) translateY(0)';
      }
      return 'translateX(0) translateY(0)';
    });
    const finalTransforms = slides.map((_, index) => {
      if (index === enteringSlideIndex) return 'translateX(0) translateY(0)';
      if (exitingSlideIndex === 1 && enteringSlideIndex !== 1) return 'translateX(0) translateY(-100%)';
      if (enteringSlideIndex === 1 && enteringSlideIndex !== 1) return 'translateX(-100%) translateY(0)';
      return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1)) ? 'translateX(-100%) translateY(0)' : 'translateX(100%) translateY(0)';
    });
    setSlideTransforms(initialTransforms);
    const element = slideRefs.current[enteringSlideIndex];
    if (element) element.offsetHeight;
    const transitionTimeout = setTimeout(() => {
      setSlideTransforms(finalTransforms);
      const enteringVideoRef = videoRefs.current[enteringSlideIndex];
      if (enteringVideoRef) {
        if (slides[enteringSlideIndex].startTime !== undefined) enteringVideoRef.currentTime = slides[enteringSlideIndex].startTime as number;
        enteringVideoRef.play().catch(console.error);
      }
    }, 50);
    return () => clearTimeout(transitionTimeout);
  }, [currentSlide, prevSlideIndexState, isLoading]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = useCallback(() => {
    setPrevSlideIndexState(currentSlide);
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide, isLoading]);

  const calculatedPrevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
  const calculatedNextSlideIndex = (currentSlide + 1) % slides.length;
  const currentSlideData = slides[currentSlide];

  // Common class for nav items to handle hover effects based on scroll state
  const navItemHoverClass = isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10';

  return (
    <motion.div
      className="relative w-full overflow-hidden h-screen rounded-lg shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <nav 
        className={`fixed top-0 left-0 right-0 z-30 p-4 md:px-8 transition-colors duration-300 ${isScrolled ? 'bg-white text-black shadow-md' : 'bg-transparent text-white border-b-1'}`}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <div className="hidden md:grid w-full grid-cols-3 items-center">
          <div className="flex justify-start">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className={`${navigationMenuTriggerStyle()} bg-transparent ${navItemHoverClass} ${isScrolled ? 'text-black hover:text-gray-700' : 'text-white'}`}>Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} bg-transparent ${navItemHoverClass} ${isScrolled ? 'text-black hover:text-gray-700' : 'text-white'}`}>Our Hotel</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4 bg-white text-black">
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">About Us</Link></li>
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">Services</Link></li>
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">Restaurant</Link></li>
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">Gallery</Link></li>
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">FAQ</Link></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} bg-transparent ${navItemHoverClass} ${isScrolled ? 'text-black hover:text-gray-700' : 'text-white'}`}>Rooms</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[220px] gap-3 p-4 bg-white text-black">
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">Superior</Link></li>
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">Executive King Room</Link></li>
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">Executive Twin Room</Link></li>
                      <li><Link href="#" className="block p-2 rounded hover:bg-gray-100">Suite Room</Link></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contact" className={`${navigationMenuTriggerStyle()} bg-transparent ${navItemHoverClass} ${isScrolled ? 'text-black hover:text-gray-700' : 'text-white'}`}>Contact</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex justify-center">
            <Image src="/logo.svg" alt="Logo" width={100} height={48} className="h-12 w-auto" />
          </div>
          <div className="flex items-center justify-end">
            <button className="bg-[#e6a745] border border-[#e6a745] text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-lg hover:bg-[#e6a745]/90">
              Book Now
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex w-full items-center justify-between">
          <div className={`${isMobileMenuOpen ? 'invisible' : 'visible'}`}>
            <Image src="/logo.svg" alt="Logo" width={90} height={40} className="h-10 w-auto" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle mobile menu">
            <span className={`text-3xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>
              {isMobileMenuOpen ? '×' : '≡'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed top-0 left-0 w-full h-full bg-white z-20 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-3xl font-bold text-black">×</span>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100%-80px)] space-y-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <a href="#" className="text-black text-xl font-bold hover:text-gray-700">Home</a>
          <a href="#" className="text-black text-xl font-bold hover:text-gray-700">Our Hotel</a>
          <a href="#" className="text-black text-xl font-bold hover:text-gray-700">Rooms</a>
          <a href="#" className="text-black text-xl font-bold hover:text-gray-700">Contact</a>
        </div>
      </div>

      {/* Video Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => { slideRefs.current[index] = el; }}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[1500ms] ease-in-out"
            style={{ transform: slideTransforms[index], pointerEvents: index === currentSlide ? 'auto' : 'none' }}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={slide.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay loop muted playsInline preload="auto"
            />
          </div>
        ))}
      </div>

      {/* Hero Text Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center h-full text-white p-4 text-center">
        <div className="relative w-full text-center mb-4 md:mb-8 overflow-hidden h-20 md:h-24">
          {[calculatedPrevSlideIndex, currentSlide, calculatedNextSlideIndex].map((slideIndex, index) => {
            const slide = slides[slideIndex];
            let positionClass = '', sizeClass = '', opacityClass = 'opacity-0';
            if (index === 0) {
              positionClass = 'left-[20%] transform -translate-x-1/2 hidden md:block';
              sizeClass = 'text-3xl md:text-2xl';
              opacityClass = 'opacity-70';
            } else if (index === 1) {
              positionClass = 'left-1/2 transform -translate-x-1/2';
              sizeClass = 'text-7xl';
              opacityClass = 'opacity-100';
            } else {
              positionClass = 'left-[80%] transform -translate-x-1/2 hidden md:block';
              sizeClass = 'text-3xl md:text-2xl';
              opacityClass = 'opacity-70';
            }
            return (
              <h1
                key={slide.id}
                className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out ${positionClass} ${sizeClass} ${opacityClass} ${index === 1 ? 'text-[#e6a745]' : 'text-white'}`}
                style={{ fontFamily: '"Playfair Display", serif', whiteSpace: 'nowrap' }}
              >{slide.title}</h1>
            );
          })}
        </div>
        <div className="text-center max-w-xs md:max-w-2xl mx-auto">
          <p className="text-sm md:text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>{currentSlideData.description}</p>
        </div>
      </div>

      <div className="">
        <BookForm />
      </div>
    </motion.div>
  );
};

export default ComplexHeroLayout;