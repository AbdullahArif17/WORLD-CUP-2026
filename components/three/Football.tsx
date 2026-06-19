"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createFacetedBallGeometry } from "./createBallTexture";

interface FootballProps {
  reducedMotion?: boolean;
  lowDetail?: boolean;
  mouse: { x: number; y: number };
}

const MAX_TILT = (12 * Math.PI) / 180;
const ROTATION_SPEED = (Math.PI * 2) / 22;

export default function Football({
  reducedMotion = false,
  lowDetail = false,
  mouse,
}: FootballProps) {
  const groupRef = useRef<THREE.Group>(null);
  const detail = lowDetail ? 1 : 2;

  const geometry = useMemo(
    () => createFacetedBallGeometry(0.58, detail),
    [detail]
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      groupRef.current.rotation.y += ROTATION_SPEED * delta;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    }

    const targetX = mouse.y * MAX_TILT;
    const targetZ = -mouse.x * MAX_TILT;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetZ,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.62, 0]}>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          flatShading
          roughness={0.28}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}
