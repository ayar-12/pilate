import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function FluidShape() {
  const { scene } = useGLTF('/models/fluid-shape.glb');
  return <primitive object={scene} scale={2} />;
}

export default function AnimatedBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }}
    >
      <ambientLight intensity={1} />
      <FluidShape />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
