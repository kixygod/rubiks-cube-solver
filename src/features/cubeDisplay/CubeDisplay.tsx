import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import * as THREE from "three";

type CubeDisplayProps = {
  cubeState: string[];
};

const CubeDisplay: React.FC<CubeDisplayProps> = ({ cubeState }) => {
  const groupRef = useRef<THREE.Group>(new THREE.Group());

  if (cubeState.length !== 54) {
    console.error("Ошибка: cubeState должен содержать ровно 54 элемента.");
    return null;
  }

  return (
    <Canvas camera={{ position: [6, 6, 6], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Cube groupRef={groupRef} cubeState={cubeState} />
    </Canvas>
  );
};

const Cube: React.FC<{
  groupRef: React.RefObject<THREE.Group>;
  cubeState: string[];
}> = ({ groupRef, cubeState }) => {
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const renderFace = (
    position: [number, number, number],
    rotation: [number, number, number],
    colors: string[],
    faceLabel: string
  ) => {
    return (
      <group position={position} rotation={rotation}>
        {colors.map((color, idx) => (
          <Box
            key={`${faceLabel}-${idx}`}
            position={[(idx % 3) - 1, 1 - Math.floor(idx / 3), 0]}
          >
            <meshStandardMaterial attach="material" color={color} />
          </Box>
        ))}
      </group>
    );
  };

  type Side = {
    position: [number, number, number];
    rotation: [number, number, number];
    colors: string[];
    label: string;
  };

  const sides: Side[] = [
    {
      position: [0, 1.5, 0],
      rotation: [Math.PI / 2, 0, 0],
      colors: cubeState.slice(0, 9),
      label: "Up",
    },
    {
      position: [0, -1.5, 0],
      rotation: [-Math.PI / 2, 0, 0],
      colors: cubeState.slice(45, 54),
      label: "Down",
    },
    {
      position: [-1.5, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      colors: cubeState.slice(9, 18),
      label: "Left",
    },
    {
      position: [1.5, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      colors: cubeState.slice(36, 45),
      label: "Right",
    },
    {
      position: [0, 0, 1.5],
      rotation: [0, 0, 0],
      colors: cubeState.slice(18, 27),
      label: "Front",
    },
    {
      position: [0, 0, -1.5],
      rotation: [0, Math.PI, 0],
      colors: cubeState.slice(27, 36),
      label: "Back",
    },
  ];

  return (
    <group ref={groupRef}>
      {sides.map((side) =>
        renderFace(side.position, side.rotation, side.colors, side.label)
      )}
    </group>
  );
};

export default CubeDisplay;
