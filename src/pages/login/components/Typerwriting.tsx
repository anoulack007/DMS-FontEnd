import React, { useState, useEffect } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface TypewriterTextProps extends Omit<TypographyProps, 'children'> {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 100,
  delay = 0,
  onComplete,
  ...typographyProps
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    const timer = setTimeout(() => {
      let currentIndex = 0;
      setDisplayText('');
      setIsComplete(false);

      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay, onComplete]);

  return (
    <Typography {...typographyProps}>
      {displayText}
      {!isComplete && (
        <span
          style={{
            animation: 'blink 1s infinite',
            marginLeft: '2px',
          }}
        >
          |
        </span>
      )}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </Typography>
  );
};