import React from 'react';
import { TextField, TextFieldProps, styled, keyframes } from '@mui/material';

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const AnimatedTextField = styled(TextField)<{ animationdelay?: string; direction?: 'left' | 'right' }>`
  animation: ${props => props.direction === 'right' ? slideInRight : slideInLeft} 0.6s ease-out;
  animation-delay: ${props => props.animationdelay || '0s'};
  animation-fill-mode: both;
`;

interface AnimatedTextFieldProps {
  animationDelay?: string;
  direction?: 'left' | 'right';
}

export const AnimatedFormField: React.FC<AnimatedTextFieldProps & Omit<TextFieldProps, keyof AnimatedTextFieldProps>> = ({
  animationDelay = '0s',
  direction = 'left',
  ...textFieldProps
}) => {
  return (
    <AnimatedTextField
      animationdelay={animationDelay}
      direction={direction}
      {...textFieldProps}
    />
  );
};