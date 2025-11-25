import { useState, useEffect, useRef } from 'react';
import image747 from '../assets/images/image747.png';
import image748 from '../assets/images/image748.png';
import image749 from '../assets/images/image749.png';
import image750 from '../assets/images/image750.jpg';
import vectorIcon from '../assets/images/vector.svg';

const featuresData = [
  {
    step: '01/04',
    title: 'TAKE A PIC OF YOUR RECEIPT',
    titleLines: ['TAKE A PIC OF YOUR RECEIPT'],
    description: "Simply snap a photo of your grocery receipt. Kaaka's AI instantly recognizes and captures every ingredient you bought—no typing required.",
    image: image747
  },
  {
    step: '02/04',
    title: 'SCAN & EXTRACT INGREDIENTS',
    titleLines: ['SCAN &', 'EXTRACT', 'INGREDIENTS'],
    description: 'Your receipts are instantly scanned with AI to pull out every ingredient you bought. No typing. No manual sorting. Just clean, structured data ready for cooking.',
    image: image748
  },
  {
    step: '03/04',
    title: 'GET A SMART RECIPE',
    titleLines: ['GET A', 'SMART', 'RECIPE'],
    description: 'Our AI turns the extracted ingredients into personalized recipes. From quick meals to full dishes—see exactly what you can cook with what you already have.',
    image: image749
  },
  {
    step: '04/04',
    title: 'CHAT TO GENERATE YOUR LIST',
    titleLines: ['CHAT TO', 'GENERATE', 'YOUR LIST'],
    description: 'Tell the AI what you want to cook next, and it builds your grocery list instantly. Add missing items, compare options, and plan your next meal without stress.',
    image: image747
  }
];

export default function LandingPage() {
  const [activeNavSection, setActiveNavSection] = useState('hero');
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [footerVisible, setFooterVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorDotPos, setCursorDotPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const parallaxImageRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerContentRef = useRef<HTMLDivElement>(null);

  // Navigation scroll spy
  useEffect(() => {
    const handleNavScroll = () => {
      const scrollPosition = window.scrollY + 200;

      if (contactRef.current && scrollPosition >= contactRef.current.offsetTop) {
        setActiveNavSection('contact');
      } else if (containerRef.current && scrollPosition >= containerRef.current.offsetTop) {
        setActiveNavSection('how-it-works');
      } else {
        setActiveNavSection('hero');
      }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    return () => window.removeEventListener('scroll', handleNavScroll);
  }, []);

  // Parallax effect for footer image
  useEffect(() => {
    const handleParallaxScroll = () => {
      if (!parallaxImageRef.current) return;

      const rect = parallaxImageRef.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        // Move image upward as user scrolls down (negative value)
        const offset = (scrollProgress - 0.5) * 200; // Adjust 200 for more/less effect
        setParallaxOffset(offset);
      }
    };

    window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    handleParallaxScroll();

    return () => window.removeEventListener('scroll', handleParallaxScroll);
  }, []);

  // Intersection Observer for footer section
  useEffect(() => {
    if (!footerContentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFooterVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-50px'
      }
    );

    observer.observe(footerContentRef.current);

    return () => observer.disconnect();
  }, []);

  // Custom cursor movement (only for non-touch devices)
  useEffect(() => {
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      // Smooth follow for dot
      setTimeout(() => {
        setCursorDotPos({ x: e.clientX, y: e.clientY });
      }, 50);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set(prev).add(index));
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: '-50px'
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#060606] relative w-full" data-name="Kaaka landing page">
      {/* Custom Cursor - hidden on touch devices */}
      <div 
        className={`custom-cursor hidden md:block ${isHovering ? 'cursor-hover' : ''}`}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div 
        className="custom-cursor-dot hidden md:block"
        style={{
          left: `${cursorDotPos.x}px`,
          top: `${cursorDotPos.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Border frame - spans entire website with equal padding - hidden on mobile */}
      <div 
        className="hidden md:block absolute border-2 border-[rgba(255,255,255,0.15)] border-solid rounded-[38px] pointer-events-none" 
        style={{ 
          top: '75px', 
          bottom: '0',
          left: '20px',
          right: '20px',
          zIndex: 9999,
          animation: 'fadeIn 1s ease-out forwards',
          opacity: 0
        }} 
      />
      
      {/* Sticky Header */}
      <div 
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-[106px] py-4 sm:py-5 md:py-[25px] bg-[#060606]/90 backdrop-blur-sm z-[10000]"
        style={{
          animation: 'fadeInUp 0.6s ease-out forwards',
          opacity: 0
        }}
      >
        {/* Hamburger Menu Button - Mobile Only */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center items-center z-[10001] group"
          aria-label="Open menu"
        >
          <span className="w-full h-0.5 bg-white transition-all group-hover:bg-[#eb593a]"></span>
          <span className="w-full h-0.5 bg-white transition-all group-hover:bg-[#eb593a]"></span>
          <span className="w-full h-0.5 bg-white transition-all group-hover:bg-[#eb593a]"></span>
        </button>

        {/* Menu items on the left - Desktop Only */}
        <div className="hidden md:flex font-bold gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-center leading-none not-italic text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] tracking-[-0.8px] md:tracking-[-1.211px]">
          <button 
            onClick={() => scrollToSection(containerRef)}
            className={`transition-all duration-300 hover:text-[#eb593a] hover:scale-110 ${activeNavSection === 'how-it-works' ? 'text-[#eb593a]' : 'text-white'}`}
          >
            HOW IT WORKS
          </button>
          <button 
            onClick={() => window.open('#', '_blank')}
            className="text-white transition-all duration-300 hover:text-[#eb593a] hover:scale-110"
          >
            DOWNLOAD
          </button>
          <button 
            onClick={() => scrollToSection(contactRef)}
            className={`transition-all duration-300 hover:text-[#eb593a] hover:scale-110 ${activeNavSection === 'contact' ? 'text-[#eb593a]' : 'text-white'}`}
          >
            CONTACT
          </button>
        </div>
        
        {/* Logo on the right */}
        <button 
          onClick={() => scrollToSection(heroRef)}
          className="font-bold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-white tracking-[-1.211px] hover:text-[#eb593a] hover:scale-110 transition-all duration-300"
        >
          KAAKA
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#1a1a1a] z-[10002] transition-transform duration-500 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col h-full px-8 py-8">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#eb593a] rounded-full"></div>
              <span className="font-bold text-white text-[20px] tracking-[-1.211px]">KAAKA</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-[#eb593a] transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Title */}
          <div className="mb-8">
            <p className="text-white/50 text-[14px] font-['NB_International',sans-serif] mb-2">Menu</p>
            <div className="w-12 h-0.5 bg-[#eb593a]"></div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 flex flex-col gap-6">
            <button 
              onClick={() => {
                scrollToSection(heroRef);
                setMobileMenuOpen(false);
              }}
              className="text-white text-[32px] font-bold text-left hover:text-[#eb593a] transition-colors tracking-[-1.211px]"
            >
              Home
            </button>
            <button 
              onClick={() => {
                scrollToSection(containerRef);
                setMobileMenuOpen(false);
              }}
              className="text-white text-[32px] font-bold text-left hover:text-[#eb593a] transition-colors tracking-[-1.211px]"
            >
              How It Works
            </button>
            <button 
              onClick={() => {
                scrollToSection(contactRef);
                setMobileMenuOpen(false);
              }}
              className="text-white text-[32px] font-bold text-left hover:text-[#eb593a] transition-colors tracking-[-1.211px]"
            >
              Contact
            </button>
          </nav>

          {/* Social Media */}
          <div className="mb-8">
            <p className="text-white/50 text-[14px] font-['NB_International',sans-serif] mb-4">Social Media</p>
            <div className="flex gap-4">
              <button className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#eb593a] transition-colors">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#eb593a] transition-colors">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#eb593a] transition-colors">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-white/50 text-[14px] font-['NB_International',sans-serif] mb-3">Need help?</p>
            <button 
              onClick={() => window.open('#', '_blank')}
              className="w-full bg-[#eb593a] text-white font-bold text-[18px] py-4 rounded-xl hover:bg-[#d14a2a] transition-colors tracking-[-1.211px]"
            >
              Download App
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative bg-[#060606] min-h-screen w-full flex items-center justify-center pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] pb-8">
        <div className="flex flex-col gap-3 sm:gap-4 items-center justify-center max-w-[530px] mx-auto px-4 sm:px-6">
          <div 
            className="flex flex-col font-['NB_International',sans-serif] justify-center leading-none min-w-full not-italic relative text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] text-center text-white tracking-[-0.8px] sm:tracking-[-1px] lg:tracking-[-1.211px]"
            style={{
              animation: 'fadeInUp 0.8s ease-out forwards',
              opacity: 0
            }}
          >
            <p className="leading-[1.3] sm:leading-[1.2] whitespace-pre-wrap">Hey, I´m Kaaka</p>
          </div>
          <div 
            className="flex flex-col font-bold justify-center leading-none min-w-full not-italic relative text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] text-center text-white tracking-[-0.8px] sm:tracking-[-1px] lg:tracking-[-1.211px]"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.2s forwards',
              opacity: 0
            }}
          >
            <p className="leading-[1.2] sm:leading-[1.1] whitespace-pre-wrap">YOUR AI COOKING ASSISTANT</p>
          </div>
          <button 
            className="border border-[#eb593a] border-solid box-border flex gap-2 sm:gap-3 items-center justify-center px-3 sm:px-4 py-3 sm:py-4 rounded-xl hover:bg-[#eb593a]/20 hover:scale-105 active:scale-95 transition-all duration-300 mt-2"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.4s forwards',
              opacity: 0
            }}
          >
            <div className="relative shrink-0 w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[32px] md:h-[32px]">
              <img alt="" className="block max-w-none w-full h-full" src={vectorIcon} />
            </div>
            <div className="flex flex-col font-['NB_International',sans-serif] justify-center leading-none not-italic relative text-[16px] sm:text-[18px] md:text-[20px] text-center text-white tracking-[-0.8px] sm:tracking-[-1.211px]">
              <p className="leading-normal whitespace-pre-wrap">Download now</p>
            </div>
          </button>
          <div 
            className="border border-[#ffd197] border-solid box-border flex gap-[10px] items-center justify-center p-3 sm:p-4 rounded-2xl mt-2 hover:border-[#eb593a] hover:scale-105 transition-all duration-500"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.6s forwards',
              opacity: 0
            }}
          >
            <div className="h-[35vh] sm:h-[40vh] md:h-[45vh] relative shrink-0 w-[calc(35vh*0.46)] sm:w-[calc(40vh*0.46)] md:w-[calc(45vh*0.46)]">
              <img alt="" className="absolute inset-0 max-w-none object-center object-cover pointer-events-none w-full h-full rounded-lg" src={image747} />
            </div>
          </div>
        </div>

        {/* Social Icons - now within hero viewport */}
        <div className="hidden md:flex absolute flex-col gap-4 items-start right-[60px] lg:right-[105px] bottom-[80px] lg:bottom-[100px] w-[24px] z-20">
          {/* LinkedIn */}
          <button 
            className="relative shrink-0 w-6 h-6 hover:scale-125 hover:-rotate-6 transition-all duration-300" 
            aria-label="LinkedIn"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.8s forwards',
              opacity: 0
            }}
          >
            <svg className="w-full h-full fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
          {/* Instagram */}
          <button 
            className="relative shrink-0 w-6 h-6 hover:scale-125 hover:-rotate-6 transition-all duration-300" 
            aria-label="Instagram"
            style={{
              animation: 'fadeInUp 0.6s ease-out 1s forwards',
              opacity: 0
            }}
          >
            <svg className="w-full h-full fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
            </svg>
          </button>
          {/* TikTok */}
          <button 
            className="relative shrink-0 w-6 h-6 hover:scale-125 hover:-rotate-6 transition-all duration-300" 
            aria-label="TikTok"
            style={{
              animation: 'fadeInUp 0.6s ease-out 1.2s forwards',
              opacity: 0
            }}
          >
            <svg className="w-full h-full fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* How It Works Section - Static Layout */}
      <section
        ref={containerRef}
        className="w-full bg-[#2c2c2c]"
        style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        {featuresData.map((feature, index) => (
          <div key={feature.step}>
            <div 
              ref={(el) => (sectionRefs.current[index] = el)}
              className="min-h-screen py-12 sm:py-16 md:py-20"
              style={{
                opacity: visibleSections.has(index) ? 1 : 0,
                transform: visibleSections.has(index) ? 'translateY(0)' : 'translateY(50px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
              }}
            >
              <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-[184px] flex items-center justify-center min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)]">
                <div className={`flex flex-col lg:flex-row gap-8 sm:gap-10 items-center lg:items-start justify-center w-full max-w-7xl ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div 
                    className="flex flex-col gap-4 sm:gap-5 md:gap-6 items-start justify-center w-full lg:w-[526px]"
                    style={{
                      opacity: visibleSections.has(index) ? 1 : 0,
                      transform: visibleSections.has(index) ? 'translateX(0)' : index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)',
                      transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s'
                    }}
                  >
                    <p className="font-['NB_International',sans-serif] text-[20px] sm:text-[24px] md:text-[32px] lg:text-[40px] leading-[1.2] text-left text-white">
                      {feature.step}
                    </p>
                    <div>
                      <p className="font-bold text-[#eb593a] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[64px] leading-[1.1] sm:leading-[1.125] text-left">
                        {feature.titleLines.map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                    <p className="font-['NB_International',sans-serif] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-normal text-left text-white">
                      {feature.description}
                    </p>
                  </div>

                  <div 
                    className="relative w-full sm:w-auto flex items-center justify-center"
                    style={{
                      opacity: visibleSections.has(index) ? 1 : 0,
                      transform: visibleSections.has(index) ? 'scale(1) translateX(0)' : index % 2 === 0 ? 'scale(0.95) translateX(30px)' : 'scale(0.95) translateX(-30px)',
                      transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s'
                    }}
                  >
                    <div className="border border-[#eb593a] rounded-[16px] h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[70vh] w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px]" />
                    <div className="absolute top-1/2 -translate-y-1/2 flex justify-center w-full">
                      <div className="h-[calc(50vh-40px)] sm:h-[calc(55vh-45px)] md:h-[calc(60vh-50px)] lg:h-[calc(70vh-60px)] w-[140px] sm:w-[170px] md:w-[210px] lg:w-[240px] rounded-[16px] overflow-hidden">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {index < featuresData.length - 1 && (
              <div className="w-full px-[20px]">
                <div className="border-t-2 border-[rgba(255,255,255,0.15)]" />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Footer / Contact Section */}
      <div ref={contactRef} className="relative w-full pb-[75px] z-0">
        <div ref={parallaxImageRef} className="relative h-[400px] sm:h-[500px] md:h-[650px] lg:h-[831px] z-0 overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <img 
            alt="" 
            className="absolute inset-0 max-w-none object-center object-cover pointer-events-none w-full h-full" 
            src={image750}
            style={{
              transform: `translateY(${parallaxOffset}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        </div>
        <div ref={footerContentRef} className="relative bg-[#2c2c2c] min-h-[500px] sm:min-h-[600px] md:min-h-[735px] py-12 sm:py-16 md:py-20 lg:py-[111px]" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center max-w-[1144px] mx-auto px-6 sm:px-8 md:px-12">
            <div className="flex gap-6 sm:gap-8 items-start justify-center relative shrink-0 w-full">
              <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 items-center relative shrink-0 w-full max-w-[544px]">
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 items-center relative shrink-0 w-full">
                  <div className="flex flex-col gap-6 sm:gap-8 items-start relative shrink-0">
                    <div className="flex flex-col font-bold justify-center leading-none not-italic relative shrink-0 text-[#eb593a] text-[40px] sm:text-[56px] md:text-[72px] lg:text-[96px] text-center tracking-[-1.211px] w-full">
                      <p className="leading-[1.1] sm:leading-[1.05] whitespace-pre-wrap">Download Kaaka today</p>
                    </div>
                  </div>
                  <div className="flex flex-col font-['NB_International',sans-serif] justify-center leading-none not-italic relative shrink-0 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-white tracking-[-0.8px] sm:tracking-[-1.211px] w-full">
                    <p className="leading-normal whitespace-pre-wrap">Transform your grocery receipts into delicious recipes with AI. Download Kaaka and start cooking smarter today.</p>
                  </div>
                </div>
                <button className="border border-[#eb593a] border-solid box-border flex gap-3 sm:gap-4 items-center justify-center px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl hover:bg-[#eb593a]/20 hover:scale-105 active:scale-95 transition-all duration-300">
                  <div className="relative shrink-0 w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] md:w-[42px] md:h-[42px]">
                    <img alt="" className="block max-w-none w-full h-full" src={vectorIcon} />
                  </div>
                  <div className="flex flex-col font-['NB_International',sans-serif] justify-center leading-none not-italic relative text-[18px] sm:text-[20px] md:text-[24px] text-center text-white tracking-[-0.8px] sm:tracking-[-1.211px]">
                    <p className="leading-normal whitespace-pre-wrap">Download now</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-20 lg:gap-[148px] items-start justify-center px-6 sm:px-8 md:px-12 pt-8 sm:pt-10 md:pt-12">
          <div className="flex flex-col gap-1 items-start leading-none not-italic relative shrink-0 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-white tracking-[-0.8px] sm:tracking-[-1.211px] w-full md:w-auto">
            <div className="flex flex-col font-bold justify-center relative shrink-0 w-full">
              <p className="leading-[1.5] sm:leading-[2] whitespace-pre-wrap">KAAKA</p>
            </div>
            <div className="flex flex-col font-['NB_International',sans-serif] justify-center leading-normal relative shrink-0 w-full">
              <p className="mb-0">Turn your grocery shopping </p>
              <p>receipt into a recipe</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-start leading-none not-italic relative shrink-0 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-white tracking-[-0.8px] sm:tracking-[-1.211px] w-full md:w-auto">
            <div className="flex flex-col font-bold justify-center relative shrink-0 w-full">
              <p className="leading-[1.5] sm:leading-[2] whitespace-pre-wrap">EMAIL</p>
            </div>
            <div className="flex flex-col font-['NB_International',sans-serif] justify-center relative shrink-0 w-full break-all">
              <p className="leading-normal whitespace-pre-wrap">Support@kaaka.com</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-start leading-none not-italic relative shrink-0 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-white tracking-[-0.8px] sm:tracking-[-1.211px] w-full md:w-auto">
            <div className="flex flex-col font-bold justify-center relative shrink-0 w-full">
              <p className="leading-[1.5] sm:leading-[2] whitespace-pre-wrap">2025 KAAKA</p>
            </div>
            <div className="flex flex-col font-['NB_International',sans-serif] justify-center relative shrink-0 w-full">
              <p className="leading-normal whitespace-pre-wrap">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

