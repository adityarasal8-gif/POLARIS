import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface StationMarker {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  color: string;
  role: string;
}

const STATIONS: StationMarker[] = [
  { id: 'maitri', name: 'Maitri Station', region: 'Antarctica', lat: -70.7667, lon: 11.7333, color: '#38BDF8', role: 'Atmospheric & Geomagnetic' },
  { id: 'bharati', name: 'Bharati Station', region: 'Antarctica', lat: -69.4072, lon: 76.1872, color: '#22C7A8', role: 'Oceanography & Satellite' },
  { id: 'himadri', name: 'Himadri Station', region: 'Arctic', lat: 78.9242, lon: 11.9286, color: '#6EC5E9', role: 'Fjord & Teleconnections' },
  { id: 'himansh', name: 'Himansh Hub', region: 'Himalaya', lat: 32.4000, lon: 77.6000, color: '#E7A93B', role: 'Cryosphere & Glacier Mass' },
  { id: 'india_hub', name: 'NCPOR Goa (HQ)', region: 'India', lat: 15.3991, lon: 73.8052, color: '#FFFFFF', role: 'National Command Center' },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createArcCurve(p1: THREE.Vector3, p2: THREE.Vector3, altitude = 1.35): THREE.CubicBezierCurve3 {
  const distance = p1.distanceTo(p2);
  const mid = p1.clone().add(p2).multiplyScalar(0.5);
  const midLength = mid.length();
  mid.normalize().multiplyScalar(midLength + distance * 0.25 * altitude);
  return new THREE.CubicBezierCurve3(p1, mid, mid, p2);
}

export const PolarGlobe3D: React.FC<{ onSelectStation?: (id: string) => void }> = ({ onSelectStation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredStation, setHoveredStation] = useState<StationMarker | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    // Position camera to emphasize Southern Hemisphere and Indian Ocean vantage
    camera.position.set(0, -2.4, 4.2);
    camera.lookAt(0, -0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 1.8;

    // 2. Base Sphere with deep navy gradient
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x071A2B,
      emissive: 0x051320,
      specular: 0x1d3f5e,
      shininess: 25,
      transparent: true,
      opacity: 0.95,
      wireframe: false,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // 3. Latitude & Longitude Coordinate Grid Rings
    const gridMat = new THREE.LineBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.14 });
    for (let lat = -80; lat <= 80; lat += 20) {
      const radius = GLOBE_RADIUS * Math.cos((lat * Math.PI) / 180);
      const y = GLOBE_RADIUS * Math.sin((lat * Math.PI) / 180);
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(radius * Math.cos(theta), y, radius * Math.sin(theta)));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.Line(ringGeo, gridMat);
      globeGroup.add(ring);
    }

    // Longitude Meridians
    for (let lon = 0; lon < 360; lon += 45) {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const rad = (lon * Math.PI) / 180;
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI - Math.PI / 2;
        const x = GLOBE_RADIUS * Math.cos(phi) * Math.sin(rad);
        const y = GLOBE_RADIUS * Math.sin(phi);
        const z = GLOBE_RADIUS * Math.cos(phi) * Math.cos(rad);
        points.push(new THREE.Vector3(x, y, z));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.Line(ringGeo, gridMat);
      globeGroup.add(ring);
    }

    // 4. Polar Atmosphere Glow Layer
    const glowGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // 5. Starfield Dust Particles
    const particlesCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      const r = GLOBE_RADIUS * (1.1 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.022,
      color: 0x6EC5E9,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // 6. Station Markers & Pins
    const stationMeshes: { mesh: THREE.Mesh; station: StationMarker }[] = [];
    const indiaPos = latLonToVector3(15.3991, 73.8052, GLOBE_RADIUS);

    STATIONS.forEach((st) => {
      const pos = latLonToVector3(st.lat, st.lon, GLOBE_RADIUS);

      // Pin Head
      const pinGeo = new THREE.SphereGeometry(st.id === 'india_hub' ? 0.05 : 0.042, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(st.color) });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      // Pulse Ring
      const pulseGeo = new THREE.RingGeometry(0.045, 0.075, 32);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(st.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.copy(pos.clone().multiplyScalar(1.005));
      pulseMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(pulseMesh);

      stationMeshes.push({ mesh: pinMesh, station: st });

      // Animated Arcs from India HQ to Polar Stations
      if (st.id !== 'india_hub') {
        const curve = createArcCurve(indiaPos, pos, 1.25);
        const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.009, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(st.color),
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });
        const arc = new THREE.Mesh(tubeGeo, tubeMat);
        globeGroup.add(arc);
      }
    });

    // 7. Lighting
    const dirLight = new THREE.DirectionalLight(0xEAF4F7, 1.8);
    dirLight.position.set(4, 3, 5);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x0B2538, 1.4);
    scene.add(ambientLight);

    // Initial globe orientation to show India and Antarctica
    globeGroup.rotation.y = 1.35;
    globeGroup.rotation.x = 0.35;

    // 8. Raycaster for Hover Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 9. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Slow, majestic rotation (subtle and dignified)
      globeGroup.rotation.y += delta * 0.07;

      // Raycast for hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stationMeshes.map(s => s.mesh));

      if (intersects.length > 0) {
        const found = stationMeshes.find(s => s.mesh === intersects[0].object);
        if (found) {
          setHoveredStation(found.station);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredStation(null);
        container.style.cursor = 'default';
      }

      // Gentle pulsing of station markers
      stationMeshes.forEach(({ mesh }, idx) => {
        const scale = 1 + 0.18 * Math.sin(elapsedTime * 3 + idx);
        mesh.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#071A2B]/40 to-[#0B2538]/60 border border-[#6EC5E9]/15">
      {/* Three.js Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Scientific Badge (Top Left) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none bg-[#071A2B]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#6EC5E9]/20 text-xs">
        <div className="flex items-center space-x-2 text-[#38BDF8] font-mono font-semibold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-[#22C7A8] animate-ping" />
          <span>Interactive Polar Space Telemetry</span>
        </div>
        <p className="text-[11px] text-[#94A3B8] mt-0.5 font-mono">
          VANTAGE: SOUTHERN AXIS • ANTARCTICA ↔ INDIA ARCS
        </p>
      </div>

      {/* Program Pillar Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center space-x-3 bg-[#071A2B]/85 backdrop-blur-md px-4 py-2 rounded-lg border border-[#6EC5E9]/15 text-[11px] text-[#94A3B8] font-mono">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span>Maitri</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22C7A8]" />
          <span>Bharati</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#6EC5E9]" />
          <span>Himadri</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E7A93B]" />
          <span>Himansh</span>
        </span>
      </div>

      {/* Hover Card Tooltip */}
      {hoveredStation && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-[#071A2B]/95 backdrop-blur-xl border border-[#38BDF8]/40 px-4 py-3 rounded-xl shadow-2xl text-left w-56 animate-fade-in"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#38BDF8] font-bold">
              {hoveredStation.region}
            </span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredStation.color }} />
          </div>
          <h4 className="text-white font-semibold text-sm mt-0.5">{hoveredStation.name}</h4>
          <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{hoveredStation.role}</p>
          <div className="mt-2 pt-2 border-t border-[#6EC5E9]/15 flex items-center justify-between text-[11px] text-[#38BDF8]">
            <span className="font-mono">
              {hoveredStation.lat > 0 ? `${hoveredStation.lat.toFixed(1)}°N` : `${Math.abs(hoveredStation.lat).toFixed(1)}°S`}
            </span>
            <span className="font-medium underline">Explore Station →</span>
          </div>
        </div>
      )}
    </div>
  );
};
