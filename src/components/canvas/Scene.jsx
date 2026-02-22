import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TorusKnot, Stars, Sparkles, useTexture, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

function ParticleField() {
    const { gravityMode } = useStore();
    const sparklesRef = useRef(null);
    const starsRef = useRef(null);
    const { viewport, mouss, pointer } = useThree();

    // Responsive particle count
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useFrame((state, delta) => {
        // Parallax drift based on normalized mouse position (pointer)
        if (starsRef.current) {
            starsRef.current.rotation.x += delta * 0.02 + pointer.y * 0.005;
            starsRef.current.rotation.y += delta * 0.02 + pointer.x * 0.005;
        }

        if (sparklesRef.current) {
            const gGroup = sparklesRef.current;

            // Gravity logic applied to the entire group or individual particles if accessible
            // Since <Sparkles> generates instanced meshes, creating true particle physics per particle
            // is complex purely through the Drei abstraction without custom shaders.
            // We will emulate the pull by scaling the entire group down towards [0,0,0]
            if (gravityMode) {
                gGroup.scale.x = THREE.MathUtils.lerp(gGroup.scale.x, 0.1, delta * 5);
                gGroup.scale.y = THREE.MathUtils.lerp(gGroup.scale.y, 0.1, delta * 5);
                gGroup.scale.z = THREE.MathUtils.lerp(gGroup.scale.z, 0.1, delta * 5);
            } else {
                // Spring outward (overshoot slightly then settle to 1)
                gGroup.scale.x = THREE.MathUtils.lerp(gGroup.scale.x, 1, delta * 2);
                gGroup.scale.y = THREE.MathUtils.lerp(gGroup.scale.y, 1, delta * 2);
                gGroup.scale.z = THREE.MathUtils.lerp(gGroup.scale.z, 1, delta * 2);
            }
        }
    });

    return (
        <group>
            <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <group ref={sparklesRef}>
                <Sparkles
                    count={isMobile ? 1000 : 3000}
                    scale={20}
                    size={2}
                    speed={0.4}
                    opacity={0.5}
                    color="#C9A84C"
                />
                <Sparkles
                    count={isMobile ? 500 : 1500}
                    scale={20}
                    size={1}
                    speed={0.2}
                    opacity={0.3}
                    color="#6E3AFF"
                />
            </group>
        </group>
    );
}

function CenterGeometry() {
    const meshRef = useRef(null);
    const { gravityMode } = useStore();

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;

            const targetScale = gravityMode ? 0.5 : 1;
            // Springy scale interpolation
            meshRef.current.scale.setScalar(
                THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * (gravityMode ? 5 : 2))
            );
        }
    });

    return (
        <TorusKnot ref={meshRef} args={[2, 0.6, 256, 64]} position={[0, 0, -5]}>
            {/* 
        Using standard MeshPhysicalMaterial as requested.
        transmission: 1 implies glass material. 
      */}
            <meshPhysicalMaterial
                transmission={1}
                roughness={0.1}
                thickness={2}
                ior={1.5}
                iridescence={1}
                iridescenceIOR={1.3}
                color="#ffffff"
            />
        </TorusKnot>
    );
}

export default function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#C9A84C" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#6E3AFF" />

            <ParticleField />
            <CenterGeometry />

            <EffectComposer disableNormalPass>
                <Bloom
                    luminanceThreshold={0.2}
                    mipmapBlur
                    intensity={1.5}
                />
            </EffectComposer>
        </>
    );
}
