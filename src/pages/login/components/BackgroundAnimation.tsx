import React from 'react';
import { Box, styled, keyframes } from '@mui/material';

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(2deg); }
  66% { transform: translateY(-4px) rotate(-1deg); }
`;

const slowDrift = keyframes`
  0% { 
    transform: translateX(-100px) rotate(0deg); 
    opacity: 0; 
  }
  5% { opacity: 0.3; }
  50% { 
    opacity: 0.6; 
    transform: translateX(50vw) rotate(180deg); 
  }
  95% { opacity: 0.3; }
  100% { 
    transform: translateX(calc(100vw + 100px)) rotate(360deg); 
    opacity: 0; 
  }
`;

const subtlePulse = keyframes`
  0%, 100% { 
    opacity: 0.4; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.05); 
  }
`;

const gridSlide = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-40px); }
`;

const sparkle = keyframes`
  0%, 100% { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2); 
  }
`;

const waveMove = keyframes`
  0% { transform: translateX(-100%) scaleY(1); }
  50% { transform: translateX(0%) scaleY(1.1); }
  100% { transform: translateX(100%) scaleY(1); }
`;

const BackgroundContainer = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 40%, #f1f5f9 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.06) 0%, transparent 40%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    pointer-events: none;
  }
`;

const GridOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + 40px);
  height: 100%;
  background-image: 
    linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: ${gridSlide} 8s linear infinite;
  opacity: 0.3;
`;

const MinimalElement = styled(Box)<{ 
  size?: number; 
  delay?: number; 
  left?: string;
  top?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}>`
  position: absolute;
  left: ${props => props.left || '0%'};
  top: ${props => props.top || '0%'};
  width: ${props => props.size || 32}px;
  height: ${props => props.size || 32}px;
  background: ${props => {
    switch(props.variant) {
      case 'primary': return 'rgba(59, 130, 246, 0.2)';
      case 'secondary': return 'rgba(139, 92, 246, 0.2)';
      case 'accent': return 'rgba(16, 185, 129, 0.2)';
      default: return 'rgba(148, 163, 184, 0.2)';
    }
  }};
  border: 2px solid ${props => {
    switch(props.variant) {
      case 'primary': return 'rgba(59, 130, 246, 0.3)';
      case 'secondary': return 'rgba(139, 92, 246, 0.3)';
      case 'accent': return 'rgba(16, 185, 129, 0.3)';
      default: return 'rgba(148, 163, 184, 0.3)';
    }
  }};
  border-radius: 12px;
  animation: 
    ${gentleFloat} 12s ease-in-out infinite,
    ${subtlePulse} 8s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(71, 85, 105, 0.8);
  font-weight: 600;
  backdrop-filter: blur(2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const DriftingText = styled(Box)<{ 
  delay?: number; 
  top?: string;
  size?: 'small' | 'medium' | 'large';
}>`
  position: absolute;
  top: ${props => props.top || '50%'};
  left: -150px;
  color: rgba(100, 116, 139, 0.5);
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '10px';
      case 'large': return '16px';
      default: return '13px';
    }
  }};
  font-weight: 500;
  animation: ${slowDrift} 30s linear infinite;
  animation-delay: ${props => props.delay || 0}s;
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
  letter-spacing: 0.5px;
`;

const GeometricShape = styled(Box)<{ 
  delay?: number; 
  left?: string;
  top?: string;
  shape?: 'circle' | 'square' | 'triangle' | 'diamond';
  variant?: 'primary' | 'secondary' | 'accent';
}>`
  position: absolute;
  left: ${props => props.left || '0%'};
  top: ${props => props.top || '0%'};
  width: ${props => props.shape === 'triangle' ? '0' : '20px'};
  height: ${props => props.shape === 'triangle' ? '0' : '20px'};
  
  ${props => props.shape === 'circle' && `
    background: ${props.variant === 'primary' ? 'rgba(59, 130, 246, 0.2)' : 
                 props.variant === 'secondary' ? 'rgba(139, 92, 246, 0.2)' : 
                 'rgba(16, 185, 129, 0.2)'};
    border-radius: 50%;
    border: 2px solid ${props.variant === 'primary' ? 'rgba(59, 130, 246, 0.3)' : 
                        props.variant === 'secondary' ? 'rgba(139, 92, 246, 0.3)' : 
                        'rgba(16, 185, 129, 0.3)'};
  `}
  
  ${props => props.shape === 'square' && `
    background: ${props.variant === 'primary' ? 'rgba(59, 130, 246, 0.2)' : 
                 props.variant === 'secondary' ? 'rgba(139, 92, 246, 0.2)' : 
                 'rgba(16, 185, 129, 0.2)'};
    border-radius: 4px;
    border: 2px solid ${props.variant === 'primary' ? 'rgba(59, 130, 246, 0.3)' : 
                        props.variant === 'secondary' ? 'rgba(139, 92, 246, 0.3)' : 
                        'rgba(16, 185, 129, 0.3)'};
  `}
  
  ${props => props.shape === 'triangle' && `
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 18px solid ${props.variant === 'primary' ? 'rgba(59, 130, 246, 0.25)' : 
                                props.variant === 'secondary' ? 'rgba(139, 92, 246, 0.25)' : 
                                'rgba(16, 185, 129, 0.25)'};
  `}
  
  ${props => props.shape === 'diamond' && `
    background: ${props.variant === 'primary' ? 'rgba(59, 130, 246, 0.2)' : 
                 props.variant === 'secondary' ? 'rgba(139, 92, 246, 0.2)' : 
                 'rgba(16, 185, 129, 0.2)'};
    transform: rotate(45deg);
    border: 2px solid ${props.variant === 'primary' ? 'rgba(59, 130, 246, 0.3)' : 
                        props.variant === 'secondary' ? 'rgba(139, 92, 246, 0.3)' : 
                        'rgba(16, 185, 129, 0.3)'};
  `}
  
  animation: 
    ${gentleFloat} 15s ease-in-out infinite,
    ${subtlePulse} 10s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
  backdrop-filter: blur(1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SparkleElement = styled(Box)<{
  delay?: number;
  left?: string;
  top?: string;
}>`
  position: absolute;
  left: ${props => props.left || '0%'};
  top: ${props => props.top || '0%'};
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(59, 130, 246, 0.6) 100%);
  border-radius: 50%;
  animation: ${sparkle} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
`;

const WaveElement = styled(Box)<{
  delay?: number;
  top?: string;
}>`
  position: absolute;
  top: ${props => props.top || '0%'};
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(59, 130, 246, 0.3) 25%, 
    rgba(139, 92, 246, 0.3) 50%, 
    rgba(16, 185, 129, 0.3) 75%, 
    transparent 50%
  );
  animation: ${waveMove} 20s linear infinite;
  animation-delay: ${props => props.delay || 0}s;
`;

export const AnimatedBackground: React.FC = () => {
  const techTerms = [
    'Digital Transformation', 'Cloud Architecture', 'Data Analytics', 
    'Secure Storage', 'API Integration', 'Machine Learning',
    'Workflow Automation', 'Real-time Sync', 'Advanced Security',
    'Document Management', 'Business Intelligence', 'Scalable Solutions'
  ];

  const iconSymbols = ['📊', '🔐', '☁️', '⚡', '🚀', '💎', '🔄', '📈'];
  const codeSymbols = ['{ }', '< />', '[ ]', '( )', '=> ', '&&', '||', '++'];

  return (
    <BackgroundContainer>
      <GridOverlay />
      
      {/* Wave Elements */}
      {[...Array(4)].map((_, i) => (
        <WaveElement
          key={`wave-${i}`}
          delay={i * 5}
          top={`${20 + i * 20}%`}
        />
      ))}

      {/* Enhanced Tech Icons */}
      {iconSymbols.map((icon, i) => (
        <MinimalElement
          key={`icon-${i}`}
          size={36}
          delay={i * 1.8}
          left={`${8 + (i * 11)}%`}
          top={`${15 + Math.sin(i * 0.8) * 25}%`}
          variant={i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent'}
        >
          {icon}
        </MinimalElement>
      ))}

      {/* Rich Drifting Terms */}
      {techTerms.map((term, i) => (
        <DriftingText
          key={`term-${i}`}
          delay={i * 2.5}
          top={`${10 + (i * 7)}%`}
          size={i % 3 === 0 ? 'large' : i % 3 === 1 ? 'medium' : 'small'}
        >
          {term}
        </DriftingText>
      ))}

      {/* Enhanced Geometric Shapes */}
      {[...Array(12)].map((_, i) => (
        <GeometricShape
          key={`shape-${i}`}
          delay={i * 1.5}
          left={`${5 + Math.random() * 85}%`}
          top={`${5 + Math.random() * 85}%`}
          shape={i % 4 === 0 ? 'circle' : i % 4 === 1 ? 'square' : i % 4 === 2 ? 'triangle' : 'diamond'}
          variant={i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent'}
        />
      ))}

      {/* Code Elements */}
      {codeSymbols.map((symbol, i) => (
        <MinimalElement
          key={`code-${i}`}
          size={28}
          delay={i * 2.2}
          left={`${65 + (i * 5)}%`}
          top={`${25 + Math.cos(i * 0.7) * 30}%`}
          variant={i % 3 === 0 ? 'accent' : i % 3 === 1 ? 'primary' : 'secondary'}
        >
          {symbol}
        </MinimalElement>
      ))}

      {/* Sparkle Effects */}
      {[...Array(20)].map((_, i) => (
        <SparkleElement
          key={`sparkle-${i}`}
          delay={i * 0.5}
          left={`${Math.random() * 100}%`}
          top={`${Math.random() * 100}%`}
        />
      ))}
    </BackgroundContainer>
  );
};