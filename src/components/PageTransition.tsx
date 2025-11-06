import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    
    if (!container || !overlay) return;

    // Create sophisticated Pagani-style page transition
    const tl = gsap.timeline({
      onComplete: () => {
        // Smooth scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });

    // Sophisticated page transition inspired by Pagani website
    tl.set(overlay, { 
      opacity: 0,
      scaleX: 0,
      transformOrigin: 'center',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(10,10,10,0.99) 50%, rgba(0,0,0,0.98) 100%)'
    })
    
    // Elegant entrance of overlay
    .to(overlay, {
      opacity: 1,
      scaleX: 1,
      duration: 0.8,
      ease: 'power3.inOut',
    })
    
    // Subtle exit of current content
    .to(container, {
      opacity: 0,
      y: -20,
      scale: 0.98,
      filter: 'blur(4px)',
      duration: 0.5,
      ease: 'power2.inOut',
    }, '-=0.4')
    
    // Prepare new content
    .set(container, {
      opacity: 0,
      y: 20,
      scale: 0.98,
      filter: 'blur(4px)',
    })
    
    // Smooth entrance of new content
    .to(container, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out',
    })
    
    // Elegant exit of overlay
    .to(overlay, {
      scaleX: 0,
      transformOrigin: 'center',
      duration: 0.8,
      ease: 'power3.inOut',
    }, '-=0.5')
    
    .to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    });

  }, [location.pathname]);

  return (
    <>
      {/* Page transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.98) 100%)',
        }}
      />
      
      {/* Page content container */}
      <div ref={containerRef} className="min-h-screen">
        {children}
      </div>
    </>
  );
};

export default PageTransition;
