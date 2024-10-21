import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';

const ParticleSystem = () => {
  const particlesRef = useRef();
  const particleCount = 1000; // Reduced particle count for less density

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      // Use spherical distribution for more even spread
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - 2 * Math.random());
      const r = 50 + Math.random() * 50; // Radius between 50 and 100
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [particleCount]);

  const colors = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push(0.5 + Math.random() * 0.5, 0, 0.5 + Math.random() * 0.5);
    }
    return new Float32Array(temp);
  }, [particleCount]);

  const [springs, api] = useSpring(() => ({
    scale: 1,
    config: { mass: 2, tension: 170, friction: 26 },
  }));

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Add subtle wave motion
      positions[i3 + 1] += Math.sin(time + positions[i3] * 0.1) * 0.1;

      // Wrap particles around the visible area
      const wrap = (value, min, max) => {
        if (value > max) return min;
        if (value < min) return max;
        return value;
      };

      positions[i3] = wrap(positions[i3], -100, 100);
      positions[i3 + 1] = wrap(positions[i3 + 1], -100, 100);
      positions[i3 + 2] = wrap(positions[i3 + 2], -100, 100);
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Animate scale based on mouse position
    const mouseX = (state.mouse.x + 1) / 2; // Normalize to 0-1
    api.start({ scale: 0.8 + mouseX * 0.4 });
  });

  return (
    <animated.points ref={particlesRef} scale={springs.scale}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.5} vertexColors transparent opacity={0.8} />
    </animated.points>
  );
};

const ParticleBackground = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
        <ParticleSystem />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
