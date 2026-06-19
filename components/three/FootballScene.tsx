"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import Football from "./Football";

interface FootballSceneProps {
  reducedMotion?: boolean;
  className?: string;
}

export default function FootballScene({
  reducedMotion = false,
  className = "",
}: FootballSceneProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [lowDetail, setLowDetail] = useState(false);

  useEffect(() => {
    const check = () => setLowDetail(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    });
  };

  return (
    <div
      className={`h-full w-full ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setMouse({ x: 0, y: 0 })}
    >
      <Canvas
        shadows
        dpr={lowDetail ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0.9, 2.8], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} color="#F8FFF4" />
          <directionalLight
            castShadow
            intensity={1.4}
            position={[3, 6, 4]}
            color="#FFFFFF"
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            intensity={0.35}
            position={[-4, 2, -2]}
            color="#ECF5E8"
          />
          <pointLight intensity={0.25} position={[0, 3, 1]} color="#F8FFF4" />
          <Football
            reducedMotion={reducedMotion}
            lowDetail={lowDetail}
            mouse={mouse}
          />
          {/* Subtle pitch shadow — no grid clutter */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
          >
            <circleGeometry args={[1.1, 64]} />
            <meshStandardMaterial
              color="#0A0E0A"
              roughness={1}
              transparent
              opacity={0.6}
            />
          </mesh>
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.55}
            scale={2.2}
            blur={2.8}
            far={1.4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
