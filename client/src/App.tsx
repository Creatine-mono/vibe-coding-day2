import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { Game } from "./components/Game";
import { Environment } from "./components/Environment";
import { useFlightData } from "./lib/stores/useFlightData";

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  speedUp = 'speedUp',
  speedDown = 'speedDown',
  loop = 'loop',
  barrelRoll = 'barrelRoll',
  reverse = 'reverse',
}

const controls = [
  { name: Controls.forward, keys: ["ArrowUp"] },
  { name: Controls.back, keys: ["ArrowDown"] },
  { name: Controls.left, keys: ["ArrowLeft"] },
  { name: Controls.right, keys: ["ArrowRight"] },
  { name: Controls.speedUp, keys: ["KeyW"] },
  { name: Controls.speedDown, keys: ["KeyS"] },
  { name: Controls.loop, keys: ["KeyL"] },
  { name: Controls.barrelRoll, keys: ["KeyB"] },
  { name: Controls.reverse, keys: ["KeyR"] },
];

function App() {
  const { speed, altitude } = useFlightData();
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {!gameStarted ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)',
          fontFamily: 'Inter, sans-serif'
        }}>
          <h1 style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Flight Simulator
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '40px'
          }}>
            Experience the thrill of flying
          </p>
          <button
            onClick={handleStartGame}
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              padding: '20px 60px',
              backgroundColor: '#ff3333',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 51, 51, 0.4)',
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff5555';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 51, 51, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ff3333';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 51, 51, 0.4)';
            }}
          >
            Start Flight
          </button>
        </div>
      ) : (
        <>
          <KeyboardControls map={controls}>
            <Canvas
              shadows
              camera={{
                position: [0, 10, -30],
                fov: 60,
                near: 0.1,
                far: 2000
              }}
              gl={{
                antialias: true,
                powerPreference: "high-performance"
              }}
            >
              <color attach="background" args={["#87CEEB"]} />

              <Suspense fallback={null}>
                <Environment />
                <Game />
              </Suspense>
            </Canvas>
          </KeyboardControls>

          <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '15px',
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            minWidth: '200px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Flight Data:</div>
            <div>Speed: {Math.round(speed)} km/h</div>
            <div>Altitude: {Math.round(altitude)} m</div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '15px',
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}>Controls:</div>
            <div style={{ marginBottom: '4px' }}>↑ Pitch Down</div>
            <div style={{ marginBottom: '4px' }}>↓ Pitch Up</div>
            <div style={{ marginBottom: '4px' }}>← Roll Left</div>
            <div style={{ marginBottom: '4px' }}>→ Roll Right</div>
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
              <div style={{ marginBottom: '4px' }}>W - Increase Speed</div>
              <div style={{ marginBottom: '4px' }}>S - Decrease Speed</div>
              <div style={{ marginBottom: '4px' }}>R - Reverse (180° Turn)</div>
              <div style={{ marginBottom: '4px' }}>L - Loop-de-loop</div>
              <div>B - Barrel Roll</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
