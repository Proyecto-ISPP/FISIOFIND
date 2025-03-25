import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Componente del modelo anatómico
function AnatomicalModel({ url, selectedPart, onPartSelect, ...props }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  
  // Clonar el modelo para no modificar el original
  const model = React.useMemo(() => scene.clone(), [scene]);
  
  // Funcionalidades para seleccionar partes del modelo
  React.useEffect(() => {
    model.traverse((object) => {
      if (object.isMesh) {
        // Configuración inicial
        object.material.transparent = true;
        object.material.opacity = 1;
        
        // Resaltar parte seleccionada
        if (selectedPart && object.name === selectedPart) {
          object.material.emissive.set(0x0088ff);
          object.material.emissiveIntensity = 0.5;
        } else {
          object.material.emissive.set(0x000000);
          object.material.emissiveIntensity = 0;
        }
        
        // Hacer parte clickeable
        object.userData.clickable = true;
        object.userData.name = object.name;
      }
    });
  }, [model, selectedPart]);

  return (
    <group ref={groupRef} {...props}
      onClick={(e) => {
        if (e.object.userData.clickable) {
          e.stopPropagation();
          onPartSelect(e.object.userData.name);
        }
      }}
    >
      <primitive object={model} />
    </group>
  );
}

// Controles para modificar la visualización
function ViewControls({ toggleVisibility, resetView, toggleWireframe }) {
  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded shadow z-10">
      <button onClick={resetView} className="px-2 py-1 bg-blue-500 text-white rounded mr-2">
        Reset View
      </button>
      <button onClick={toggleWireframe} className="px-2 py-1 bg-gray-500 text-white rounded mr-2">
        Toggle Wireframe
      </button>
      <button onClick={toggleVisibility} className="px-2 py-1 bg-green-500 text-white rounded">
        Toggle Visibility
      </button>
    </div>
  );
}

// Componente de anotaciones
function Annotations({ selectedPart, annotations }) {
  if (!selectedPart || !annotations[selectedPart]) {
    return null;
  }
  
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-2">{selectedPart}</h3>
      <p>{annotations[selectedPart]}</p>
    </div>
  );
}

// Componente principal del visualizador anatómico
export default function AnatomicalViewer({ modelUrl, isShared = false, onShare }) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [wireframe, setWireframe] = useState(false);
  const [visibility, setVisibility] = useState({});
  
  // Ejemplo de anotaciones anatómicas
  const annotations = {
    "Spine": "La columna vertebral está compuesta de 33 vértebras y protege la médula espinal.",
    "LeftShoulder": "La articulación del hombro es una articulación esferoidea que permite movimiento en múltiples planos.",
    // Añadir más anotaciones según las partes de tu modelo
  };
  
  const resetView = () => {
    // Lógica para resetear la vista
  };
  
  const toggleWireframe = () => {
    setWireframe(!wireframe);
  };
  
  const toggleVisibility = () => {
    // Lógica para alternar visibilidad de partes
  };

  const handlePartSelect = (partName) => {
    setSelectedPart(partName);
    
    // Si está compartiendo, enviar esta selección a otros usuarios
    if (onShare) {
      onShare({
        type: 'select-part',
        partName: partName
      });
    }
  };

  return (
    <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <AnatomicalModel 
          url={modelUrl}
          selectedPart={selectedPart}
          onPartSelect={handlePartSelect}
          wireframe={wireframe}
        />
        
        <OrbitControls makeDefault />
      </Canvas>
      
      <ViewControls 
        toggleVisibility={toggleVisibility}
        resetView={resetView}
        toggleWireframe={toggleWireframe}
      />
      
      <Annotations selectedPart={selectedPart} annotations={annotations} />
      
      {!isShared && (
        <button 
          onClick={() => onShare?.({ type: 'share-model' })}
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded shadow"
        >
          Compartir modelo
        </button>
      )}
    </div>
  );
}