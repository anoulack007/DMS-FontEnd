import React, { useEffect, useRef } from "react";

// Types
interface MousePosition {
  x: number;
  y: number;
}

interface HexagonParticle {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  glowIntensity: number;
  color: string;
  pulsePhase: number;
  drift: { x: number; y: number };
  velocity: { x: number; y: number };
  originalSize: number;
}

interface GeometricShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'hex' | 'cube' | 'diamond' | 'circuit';
  color: string;
  glowIntensity: number;
  velocity: { x: number; y: number };
  originalSize: number;
}

// Animated Background Component
const HexagonalAnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const hexagonsRef = useRef<HexagonParticle[]>([]);
  const shapesRef = useRef<GeometricShape[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Colors matching the image style
    const colors = [
      '#00ffff', // Cyan
      '#0080ff', // Blue
      '#8000ff', // Purple
      '#ff00ff', // Magenta
      '#00ff80', // Green-cyan
      '#ffffff', // White
      '#ff0080', // Pink
      '#80ff00', // Lime
    ];

    // Initialize hexagonal particles (increased count and smaller sizes)
    const initializeHexagons = (): void => {
      hexagonsRef.current = [];
      for (let i = 0; i < 40; i++) { // Increased from 20 to 40
        const size = Math.random() * 20 + 10; // Smaller sizes: 10-30 instead of 20-60
        hexagonsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          originalSize: size,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.6 + 0.2,
          glowIntensity: Math.random() * 0.8 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulsePhase: Math.random() * Math.PI * 2,
          drift: {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
          },
          velocity: { x: 0, y: 0 },
        });
      }
    };

    // Initialize geometric shapes (increased count and smaller sizes)
    const initializeShapes = (): void => {
      shapesRef.current = [];
      const types: Array<'hex' | 'cube' | 'diamond' | 'circuit'> = ['hex', 'cube', 'diamond', 'circuit'];
      
      for (let i = 0; i < 30; i++) { // Increased from 15 to 30
        const size = Math.random() * 30 + 15; // Smaller sizes: 15-45 instead of 30-90
        shapesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          originalSize: size,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          opacity: Math.random() * 0.4 + 0.1,
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          glowIntensity: Math.random() * 0.6 + 0.3,
          velocity: { x: 0, y: 0 },
        });
      }
    };

    // Draw hexagon
    const drawHexagon = (x: number, y: number, size: number, rotation: number): void => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    };

    // Draw cube (isometric)
    const drawCube = (x: number, y: number, size: number, rotation: number): void => {
      const s = size * 0.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Top face
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.866, -s * 0.5);
      ctx.lineTo(s * 0.866, s * 0.5);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.866, s * 0.5);
      ctx.lineTo(-s * 0.866, -s * 0.5);
      ctx.closePath();
      
      ctx.restore();
    };

    // Draw diamond
    const drawDiamond = (x: number, y: number, size: number, rotation: number): void => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.7, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.7, 0);
      ctx.closePath();
      ctx.restore();
    };

    // Draw circuit pattern
    const drawCircuit = (x: number, y: number, size: number, rotation: number): void => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.lineWidth = 2;
      
      // Circuit lines
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(-size * 0.3, 0);
      ctx.lineTo(-size * 0.3, -size * 0.5);
      ctx.lineTo(size * 0.3, -size * 0.5);
      ctx.lineTo(size * 0.3, 0);
      ctx.lineTo(size, 0);
      
      // Circuit nodes
      ctx.arc(-size * 0.3, 0, 3, 0, Math.PI * 2);
      ctx.moveTo(size * 0.3 + 3, 0);
      ctx.arc(size * 0.3, 0, 3, 0, Math.PI * 2);
      
      ctx.restore();
    };

    // Update particles with bouncing effect
    const updateParticles = (): void => {
      const time = Date.now() * 0.001;
      
      hexagonsRef.current.forEach(hex => {
        hex.rotation += hex.rotationSpeed;
        
        // Mouse interaction with bouncing effect
        const dx = mouseRef.current.x - hex.x;
        const dy = mouseRef.current.y - hex.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) { // Interaction radius
          const force = (120 - distance) / 120;
          const angle = Math.atan2(dy, dx);
          
          // Bouncing force - repel from mouse
          const bounceForce = force * 3;
          hex.velocity.x -= Math.cos(angle) * bounceForce;
          hex.velocity.y -= Math.sin(angle) * bounceForce;
          
          // Size increase when near mouse
          hex.size = hex.originalSize * (1 + force * 0.5);
          hex.glowIntensity = Math.min(1, hex.glowIntensity + force * 0.8);
          hex.rotationSpeed += (Math.random() - 0.5) * 0.05 * force;
        } else {
          // Return to original size
          hex.size = hex.originalSize;
        }
        
        // Apply velocity with damping
        hex.x += hex.velocity.x + hex.drift.x;
        hex.y += hex.velocity.y + hex.drift.y;
        hex.velocity.x *= 0.95; // Damping
        hex.velocity.y *= 0.95;
        
        // Pulse effect
        hex.glowIntensity = 0.5 + Math.sin(time * 2 + hex.pulsePhase) * 0.3;
        
        // Boundary wrapping
        if (hex.x < -50) hex.x = canvas.width + 50;
        if (hex.x > canvas.width + 50) hex.x = -50;
        if (hex.y < -50) hex.y = canvas.height + 50;
        if (hex.y > canvas.height + 50) hex.y = -50;
      });

      shapesRef.current.forEach(shape => {
        shape.rotation += shape.rotationSpeed;
        
        // Mouse interaction for shapes with bouncing
        const dx = mouseRef.current.x - shape.x;
        const dy = mouseRef.current.y - shape.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          const angle = Math.atan2(dy, dx);
          
          // Bouncing effect
          const bounceForce = force * 2;
          shape.velocity.x -= Math.cos(angle) * bounceForce;
          shape.velocity.y -= Math.sin(angle) * bounceForce;
          
          // Size and glow changes
          shape.size = shape.originalSize * (1 + force * 0.3);
          shape.glowIntensity = Math.min(1, shape.glowIntensity + force * 0.5);
        } else {
          // Return to original size
          shape.size = shape.originalSize;
          shape.glowIntensity = Math.max(0.3, shape.glowIntensity - 0.01);
        }
        
        // Apply velocity with damping
        shape.x += shape.velocity.x;
        shape.y += shape.velocity.y;
        shape.velocity.x *= 0.92;
        shape.velocity.y *= 0.92;
        
        // Boundary wrapping
        if (shape.x < -50) shape.x = canvas.width + 50;
        if (shape.x > canvas.width + 50) shape.x = -50;
        if (shape.y < -50) shape.y = canvas.height + 50;
        if (shape.y > canvas.height + 50) shape.y = -50;
      });
    };

    // Draw connections
    const drawConnections = (): void => {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < hexagonsRef.current.length; i++) {
        for (let j = i + 1; j < hexagonsRef.current.length; j++) {
          const hex1 = hexagonsRef.current[i];
          const hex2 = hexagonsRef.current[j];
          const dx = hex1.x - hex2.x;
          const dy = hex1.y - hex2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) { // Reduced connection distance for more particles
            ctx.globalAlpha = (150 - distance) / 150 * 0.2;
            ctx.beginPath();
            ctx.moveTo(hex1.x, hex1.y);
            ctx.lineTo(hex2.x, hex2.y);
            ctx.stroke();
          }
        }
      }
    };

    // Render function
    const render = (): void => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f0f23');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      drawConnections();

      // Draw hexagonal particles
      hexagonsRef.current.forEach(hex => {
        ctx.save();
        
        // Glow effect
        ctx.shadowColor = hex.color;
        ctx.shadowBlur = hex.glowIntensity * 15;
        ctx.globalAlpha = hex.opacity;
        
        // Outer glow
        ctx.strokeStyle = hex.color;
        ctx.lineWidth = 1.5;
        drawHexagon(hex.x, hex.y, hex.size, hex.rotation);
        ctx.stroke();
        
        // Inner fill with reduced opacity
        ctx.globalAlpha = hex.opacity * 0.15;
        ctx.fillStyle = hex.color;
        drawHexagon(hex.x, hex.y, hex.size * 0.7, hex.rotation);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw geometric shapes
      shapesRef.current.forEach(shape => {
        ctx.save();
        
        ctx.shadowColor = shape.color;
        ctx.shadowBlur = shape.glowIntensity * 12;
        ctx.globalAlpha = shape.opacity;
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1.2;

        switch (shape.type) {
          case 'hex':
            drawHexagon(shape.x, shape.y, shape.size * 0.5, shape.rotation);
            ctx.stroke();
            break;
          case 'cube':
            drawCube(shape.x, shape.y, shape.size * 0.4, shape.rotation);
            ctx.stroke();
            break;
          case 'diamond':
            drawDiamond(shape.x, shape.y, shape.size * 0.3, shape.rotation);
            ctx.stroke();
            break;
          case 'circuit':
            ctx.strokeStyle = shape.color;
            drawCircuit(shape.x, shape.y, shape.size * 0.25, shape.rotation);
            ctx.stroke();
            break;
        }
        
        ctx.restore();
      });

      // Add more floating particles
      const time = Date.now() * 0.001;
      for (let i = 0; i < 80; i++) { // Increased from 50 to 80
        const x = (Math.sin(time * 0.5 + i * 0.1) * 100) + (canvas.width / 2) + (i * 15) % canvas.width;
        const y = (Math.cos(time * 0.3 + i * 0.1) * 50) + (canvas.height / 2) + (i * 12) % canvas.height;
        
        // Mouse interaction for floating particles
        const dx = mouseRef.current.x - x;
        const dy = mouseRef.current.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let size = 1.5;
        let alpha = 0.4;
        
        if (distance < 80) {
          const force = (80 - distance) / 80;
          size += force * 2;
          alpha += force * 0.4;
        }
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = colors[i % colors.length];
        ctx.shadowColor = colors[i % colors.length];
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // Animation loop
    const animate = (): void => {
      updateParticles();
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent): void => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Initialize and start animation
    initializeHexagons();
    initializeShapes();
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default HexagonalAnimatedBackground;