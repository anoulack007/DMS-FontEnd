import React from 'react';
import { Button, ButtonProps, styled, keyframes } from '@mui/material';

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(50px);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) translateY(-10px);
  }
  70% {
    transform: scale(0.95) translateY(5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const AnimatedButtonStyled = styled(Button)<{ animationdelay?: string }>`
  animation: ${bounceIn} 0.8s ease-out;
  animation-delay: ${props => props.animationdelay || '0s'};
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }
`;

interface AnimatedButtonProps extends ButtonProps {
  animationDelay?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  animationDelay = '0s',
  children,
  ...buttonProps
}) => {
  return (
    <AnimatedButtonStyled animationdelay={animationDelay} {...buttonProps}>
      {children}
    </AnimatedButtonStyled>
  );
};