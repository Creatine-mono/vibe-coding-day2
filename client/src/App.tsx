import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { Game } from "./components/Game";
import { Environment } from "./components/Environment";

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

const controls = [
  { name: Controls.forward, keys: ["ArrowUp"] },
  { name: Controls.back, keys: ["ArrowDown"] },
  { name: Controls.left, keys: ["ArrowLeft"] },
  { name: Controls.right, keys: ["ArrowRight"] },
];

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
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
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Free Flight Controls:</div>
        <div>↑ Arrow Up - Pitch Down</div>
        <div>↓ Arrow Down - Pitch Up</div>
        <div>← Arrow Left - Roll Left</div>
        <div>→ Arrow Right - Roll Right</div>
      </div>
    </div>
  );
}

export default App;
