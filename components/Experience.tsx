import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
// @ts-ignore
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Center, Environment, OrbitControls, useProgress, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";


const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
};
/**
 * Main Scene component with lighting and camera setup.
 */
export default function Scene({ url, meshyModel = false }: { url: string | null, meshyModel ?: boolean  }) {
    return (
        <div className="relative w-full h-full">
            <Canvas className="w-full h-full bg-white rounded-md">
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 30, 10]} intensity={1.5} />
                <Environment preset="city" />
                <Suspense fallback={<LoaderOverlay />}>
                    <Center>
                        {
                            url && meshyModel ? <Model url={url} /> : url && <STLModel url={url} />
                        }
                    </Center>
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
}

/**
 * Loader Overlay using useProgress from drei
 */
function LoaderOverlay() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="p-4 text-background rounded-md flex flex-col items-center justify-center gap-2">
                <Image src="/loader.svg" width={24} height={24} alt="loader" className="animate-spin" />
                {Math.round(progress)}%
            </div>
        </Html>
    );
}

/**
 * Loads and renders an STL model from a given URL.
 */
function STLModel({ url }: { url: string }) {
    const geometry = useLoader(STLLoader, url);

    return (
        <mesh geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial color="gray" />
        </mesh>
    );
}
