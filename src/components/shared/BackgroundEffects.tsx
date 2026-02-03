import { useEffect, useRef } from 'react';

export function LightBeams() {
  return (
    <div className="light-beams">
      <div className="light-beam" />
      <div className="light-beam" />
      <div className="light-beam" />
      <div className="light-beam" />
    </div>
  );
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Circuit nodes
    const nodes: { x: number; y: number; connections: number[] }[] = [];
    const nodeCount = Math.floor((canvas.width * canvas.height) / 40000);

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: []
      });
    }

    // Find connections
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 150 && node.connections.length < 3) {
            node.connections.push(j);
          }
        }
      });
    });

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.005;

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(j => {
          const other = nodes[j];
          const pulse = Math.sin(time + i * 0.5) * 0.5 + 0.5;
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time + i * 0.3) * 0.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * pulse})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

export function NoiseOverlay() {
  return <div className="noise-overlay" />;
}

export function GradientOrb({ 
  className = '', 
  size = 400 
}: { 
  className?: string; 
  size?: number;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)`,
      }}
    />
  );
}
