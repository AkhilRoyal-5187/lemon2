"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from "next/link";
// import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
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
} from "./ui/navigaction-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

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

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const exitingSlideIndex = prevSlideIndexState;
    const enteringSlideIndex = currentSlide;

    videoRefs.current.forEach(ref => {
      if (ref) {
        ref.pause();
      }
    });

    const initialTransforms = slides.map((_, index) => {
      if (index === enteringSlideIndex) {
        if (enteringSlideIndex === 1 && exitingSlideIndex !== 1) {
          return 'translateX(0) translateY(100%)';
        } else if (exitingSlideIndex === 1 && enteringSlideIndex !== 1) {
          return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1))
            ? 'translateX(100%) translateY(0)'
            : 'translateX(-100%) translateY(0)';
        } else if (enteringSlideIndex !== exitingSlideIndex) {
          return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1))
            ? 'translateX(100%) translateY(0)'
            : 'translateX(-100%) translateY(0)';
        }
      }
      return 'translateX(0) translateY(0)';
    });

    const finalTransforms = slides.map((_, index) => {
      if (index === enteringSlideIndex) {
        return 'translateX(0) translateY(0)';
      } else if (exitingSlideIndex === 1 && enteringSlideIndex !== 1) {
        return 'translateX(0) translateY(-100%)';
      } else if (enteringSlideIndex === 1 && enteringSlideIndex !== 1) {
        return 'translateX(-100%) translateY(0)';
      }
      return (currentSlide > prevSlideIndexState || (currentSlide === 0 && prevSlideIndexState === slides.length - 1))
        ? 'translateX(-100%) translateY(0)'
        : 'translateX(100%) translateY(0)';
    });

    setSlideTransforms(initialTransforms);

    const element = slideRefs.current[enteringSlideIndex];
    if (element) {
      element.offsetHeight;
    }

    const transitionTimeout = setTimeout(() => {
      setSlideTransforms(finalTransforms);

      const enteringVideoRef = videoRefs.current[enteringSlideIndex];
      if (enteringVideoRef) {
        if (slides[enteringSlideIndex].startTime !== undefined) {
          enteringVideoRef.currentTime = slides[enteringSlideIndex].startTime as number;
        }
        enteringVideoRef.play().catch(error => {
          console.error("Autoplay failed:", error);
        });
      }

    }, 50);

    return () => clearTimeout(transitionTimeout);

  }, [currentSlide, prevSlideIndexState, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const nextSlide = useCallback(() => {
    setPrevSlideIndexState(currentSlide);
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide, isLoading]);

  const calculatedPrevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
  const calculatedNextSlideIndex = (currentSlide + 1) % slides.length;

  const currentSlideData = slides[currentSlide];

  function ListItem({
    title,
    children,
    href,
    ...props
  }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
      <li {...props}>
        <NavigationMenuLink asChild>
          <Link href={href}>
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }

  return (
    <motion.div
      className={`relative w-full overflow-hidden h-screen rounded-lg shadow-xl`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <nav className={`fixed top-0 left-0 right-0 z-30 p-4 md:px-8 flex items-center justify-between transition-colors duration-300 ${isScrolled ? 'bg-white text-black shadow-md' : 'bg-transparent text-white'}`}>
        <div className="hidden md:flex items-center">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={isScrolled ? 'text-black hover:text-gray-700' : 'text-white '}>Home</NavigationMenuTrigger>
                
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={isScrolled ? 'text-black hover:text-gray-700' : 'text-white ml-2'}>Our Hotel</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#">About Us</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Services</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Restraunt</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Menu</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Gallery</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">FAQ</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Blog</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={isScrolled ? 'text-black hover:text-gray-700' : 'text-white ml-2'}>Rooms</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#">Superior</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Executive King Room</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Executive Twin Room</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Suit Room</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="#" className={isScrolled ? 'text-black hover:text-gray-700' : 'text-white ml-2'}>Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className={`absolute left-1/2 transform -translate-x-1/2 ${isMobileMenuOpen ? 'hidden' : 'block'}`}>
          <Image src="/logo.svg" alt="Logo" width={100} height={48} className="h-10 md:h-12 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <button
              className="bg-[#e6a745] border border-[#e6a745] text-white  py-2 px-6 rounded-2xl transition duration-300 shadow-lg flex items-center hover:bg-[#fff7e6]"
              onClick={() => { }}
            >
              <span>Book Now</span>
            </button>
            
          </div>
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <span className={`text-2xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>×</span>
            ) : (
              <span className={`text-2xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>≡</span>
            )}
          </button>
        </div>
      </nav>
      <div className={`fixed top-0 left-0 w-full bg-white z-20 transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-2xl font-bold text-black">×</span>
          </button>
        </div>
        <div className="flex flex-col items-center py-8 space-y-4 bg-black">
          <a href="#" className="text-black bg-black text-lg font-semibold hover:text-gray-700 transition duration-300">Home</a>
          <a href="#" className="text-black bg-black text-lg font-semibold hover:text-gray-700 transition duration-300">Our Hotel</a>
          <a href="#" className="text-black bg-black text-lg font-semibold hover:text-gray-700 transition duration-300">Rooms</a>
          <a href="#" className="text-black bg-black text-lg font-semibold hover:text-gray-700 transition duration-300">Contact</a>
        </div>
      </div>
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el: HTMLDivElement | null) => { slideRefs.current[index] = el; }}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transform: slideTransforms[index],
              pointerEvents: index === currentSlide ? 'auto' : 'none',
            }}
          >
            <video
              ref={(el: HTMLVideoElement | null) => { videoRefs.current[index] = el; }}
              src={slide.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
      <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center h-full text-white p-4 text-center`}>
  <div className="relative w-full text-center mb-4 md:mb-8 overflow-hidden h-20 md:h-24">
    {[calculatedPrevSlideIndex, currentSlide, calculatedNextSlideIndex].map((slideIndex, index) => {
      const slide = slides[slideIndex];
      let positionClass = '';
      let sizeClass = '';
      let opacityClass = 'opacity-0';
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
        >
          {slide.title}
        </h1>
      );
    })}
  </div>
  <div className={`text-center max-w-xs md:max-w-2xl mx-auto`}>
    <p className="text-sm md:text-xl inline-block" style={{ fontFamily: '"Playfair Display", serif' }}>{currentSlideData.description}</p>
  </div>
</div>
      <div className=''>
        <BookForm />
      </div>
    </motion.div>
  );
};

export default ComplexHeroLayout;