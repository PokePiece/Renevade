'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import ClickableNode from './ClickableNode';
import RiftInstance from './RiftInstance';
import * as THREE from "three";
import Link from 'next/link';
import { Sky } from '@react-three/drei';
import BasicMovement from '@/components/BasicMovement'
import Avatar from '@/components/Avatar'
import SurAvatar from './SurAvatar';
import ChatOverlay from './ChatOverlay';
import { Text } from '@react-three/drei'
import InfoText from './InfoText';


export default function CanvasWrapper() {

    const [avatarPos, setAvatarPos] = useState<[number, number, number]>([0, 0, 0]);
    const [controlMode, setControlMode] = useState<'avatar' | 'free' | 'freehidden'>('avatar');
    const [isChatting, setIsChatting] = useState(false)
    const [chatActive, setChatActive] = useState(false)

    const [avatarSpeech, setAvatarSpeech] = useState<string | null>(null);
    const [surSpeech, setSurSpeech] = useState<string | null>(null);


    const [followingSur, setFollowingSur] = useState(false);
    const lastSurPos = useRef<[number, number, number]>([avatarPos[0] - 1, avatarPos[1], avatarPos[2] - 1])
    const [surPos, setSurPos] = useState<[number, number, number]>([0, 0, -3])

    const [showRift, setShowRift] = useState<boolean>(true);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setControlMode('free');
            if (e.key.toLowerCase() === 'x') setControlMode('avatar');
            if (e.key === 'Tab') setControlMode('freehidden')
            if (e.key === 'c' && !isChatting) {
                setChatActive(prev => !prev)
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isChatting]);

    if (followingSur) {
        lastSurPos.current = [avatarPos[0], avatarPos[1], avatarPos[2] - 5]
    }

    function SurFollower() {
        useFrame(() => {
            if (!followingSur) return;

            const target: [number, number, number] = [
                avatarPos[0] + 2,
                avatarPos[1],
                avatarPos[2] - 2,
            ];
            const speed = 0.05;

            setSurPos(([x, y, z]) => [
                x + (target[0] - x) * speed,
                y + (target[1] - y) * speed,
                z + (target[2] - z) * speed,
            ]);
        });

        return null;
    }

    const toggleRift = () => {
        console.log("Toggled")
        setShowRift(prev => !prev)
    }


    return (
        <>
            <Canvas
                //Default pos 5, 5, 5 fov 75
                camera={{ position: [0, 3, 10], fov: 75 }}
                style={{ width: '100%', height: '100%' }}
            >
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[500, 500]} />
                    <meshStandardMaterial color="#aaa" />
                </mesh>

                {(controlMode === 'free' || controlMode === 'freehidden') && <BasicMovement />}
                {(controlMode === 'free' || controlMode === 'avatar') && (
                    <Avatar
                        position={avatarPos}
                        setAvatarPos={setAvatarPos}
                        active={controlMode === 'avatar' && !isChatting}
                        text={avatarSpeech}
                    />
                )}

                <mesh position={[0, 2.5, -10]} castShadow>
                    <boxGeometry args={[10, 5, 1]} />
                    <meshStandardMaterial color="#999" />
                </mesh>

                <Sky
                    distance={450000}
                    sunPosition={[0, 1, 0]}
                    inclination={0}       // Horizon-centered light
                    azimuth={0.25}
                    mieCoefficient={0.005}
                    mieDirectionalG={0.8}
                    rayleigh={0.5}
                    turbidity={2}
                />

                <color attach="background" args={["#144d86"]} />
                <fog attach="fog" args={["#134d86", 10, 200]} />

                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 20, 5]} intensity={0.8} castShadow />



                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 7.5]} intensity={1} />



                    <mesh position={new THREE.Vector3(0, 1, 0)}>
                        <boxGeometry />
                        <meshStandardMaterial color="#0077ff" />
                    </mesh>



                </Suspense>
                <ClickableNode
                    position={[3, 0.3, 0]}
                    title="What is Webtrix?"
                    onClick={() => toggleRift()}
                />
                {showRift &&
                    <>

                        <RiftInstance
                            center={new THREE.Vector3(0, 1, 0)}
                            height={3}
                            offset={new THREE.Vector3(-10, 1, 0)}
                            rotation={[0, 1, 0]}
                        />
                        <Suspense fallback={null}>
                            <Text
                                position={new THREE.Vector3(-10, 6, 0)}
                                anchorX="center"
                                anchorY="middle"
                                color="black"
                                fontSize={0.4}
                                onClick={() => window.location.href = 'http://localhost:3000'}

                            >
                                ⚫ Exit Webspace
                            </Text>
                        </Suspense>
                    </>


                }


                <SurAvatar
                    position={surPos}
                    active={followingSur}
                    onClick={() => setFollowingSur(!followingSur)}
                    text={surSpeech}
                />
                <SurFollower />
                <InfoText />

            </Canvas>
            {chatActive && (
                <ChatOverlay
                    isChatting={isChatting}
                    setIsChatting={setIsChatting}
                    onUserMessage={(msg) => {
                        setAvatarSpeech(msg);
                        setTimeout(() => setAvatarSpeech(null), 3000);
                    }}
                    onAiMessage={(msg) => {
                        setSurSpeech(msg);
                        setTimeout(() => setSurSpeech(null), 3000);
                    }}
                />
            )}
        </>
    );
}
