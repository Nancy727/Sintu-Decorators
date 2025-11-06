import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  if (disabled) {
    return <span className={`inline-block ${className}`}>{text}</span>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Base text keeps the given color/styles */}
      <span aria-hidden="true">{text}</span>
      {/* Shiny overlay clipped to text */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-clip-text text-transparent animate-shine pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 60%)',
          backgroundSize: '200% 100%',
          willChange: 'background-position',
          WebkitBackgroundClip: 'text',
          animationDuration
        }}
      >
        {text}
      </span>
    </span>
  );
};

export default ShinyText;