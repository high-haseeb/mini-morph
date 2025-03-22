import { useState, useEffect, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { Center, Environment, Loader, OrbitControls } from "@react-three/drei";

interface ModelData {
    vertices: number[];
    indices?: number[];
}

/**
 * Fetches and renders a model from a given URL.
 */
function CustomModel({ url }: { url: string }) {
    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

    useEffect(() => {
        async function fetchModel() {
            try {
                const response = await fetch(url);
                const text = await response.text();

                // Parse the JavaScript object from the response text
                const modelData: ModelData = eval(`(${text})`);

                if (modelData.vertices) {
                    const geom = new THREE.BufferGeometry();
                    const vertices = new Float32Array(modelData.vertices);
                    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

                    // If the model contains indices (faces), set them
                    if (modelData.indices) {
                        geom.setIndex(new THREE.BufferAttribute(new Uint16Array(modelData.indices), 1));
                    }

                    setGeometry(geom);
                }
            } catch (error) {
                console.error("Error loading model:", error);
            }
        }

        fetchModel();
    }, [url]);

    return geometry ? (
        <mesh geometry={geometry}>
            <meshStandardMaterial color="orange" wireframe />
        </mesh>
    ) : <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
        </mesh>;
}

/**
 * Main Scene component with lighting and camera setup.
 */
export default function Scene({ url }: { url: string | null }) {
    return (
        <>
            <Loader />
            <Canvas camera={{ position: [0, 10, 50], fov: 45 }} className="w-full h-full">
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <Environment preset="city" />
                <Center>
                    {
                        url && <STLModel url={url} />
                    }
                </Center>
                <OrbitControls />
            </Canvas>
        </>
    );
}


/**
 * Loads and renders an STL model from a given URL.
 */
function STLModel({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
