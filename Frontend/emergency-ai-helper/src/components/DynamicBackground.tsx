import { useEffect, useState, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const DynamicBackground = () => {
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 30,
      speedX: (Math.random() - 0.5) * 0.02,
      speedY: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(initialParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: ((p.x + p.speedX + 100) % 100),
          y: ((p.y + p.speedY + 100) % 100),
        }))
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Layer */}
      <div 
        className="absolute inset-0 animated-gradient opacity-60"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Wave Layer 1 */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[60vh] wave-layer-1"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      />

      {/* Wave Layer 2 */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[50vh] wave-layer-2"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Floating Particles/Orbs */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full blur-3xl bg-ai-glow"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%) translateY(${scrollY * (0.05 + particle.id * 0.01)}px)`,
            transition: "transform 0.1s linear",
          }}
        />
      ))}

      {/* Central Glow Orb with Parallax */}
      <div 
        className="absolute top-1/4 left-1/2 w-[600px] h-[600px] rounded-full blur-[120px] bg-primary/10 animate-pulse-glow"
        style={{
          transform: `translate(-50%, -50%) translateY(${scrollY * 0.2}px)`,
        }}
      />

      {/* Secondary Glow Orb */}
      <div 
        className="absolute top-3/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] bg-ai-secondary/10 animate-pulse-glow-delayed"
        style={{
          transform: `translateY(${scrollY * 0.25}px)`,
        }}
      />

      {/* Mesh Grid Overlay */}
      <div 
        className="absolute inset-0 mesh-grid opacity-[0.02]"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      />
    </div>
  );
};

export default DynamicBackground;
