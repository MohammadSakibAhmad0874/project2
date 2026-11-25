import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface StoryScrollState {
  progress: number;
  chapter: number;
  loomMood?: 'gold' | 'indigo' | 'terracotta';
  spinBoost?: number;
}

interface StoryCanvas3DProps {
  scrollStateRef: React.MutableRefObject<StoryScrollState>;
  variant?: 'hero' | 'banner';
  className?: string;
}

function detectSoftwareGl(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl =
      (probeCanvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (probeCanvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    let isSoft = false;
    if (ext) {
      const rendererName = String(
        gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || ''
      ).toLowerCase();
      isSoft =
        rendererName.includes('swiftshader') ||
        rendererName.includes('llvmpipe') ||
        rendererName.includes('software');
    }
    const loseExt = gl.getExtension('WEBGL_lose_context');
    if (loseExt) loseExt.loseContext();
    return isSoft;
  } catch {
    return true;
  }
}

/**
 * Procedural fine 2x2 silk twill weave + travertine stone mineral normal maps.
 */
function createAtelierTextures(maxAniso: number) {
  const size = 256;

  // 1. Vertical Silk Drapery Normal & Roughness Maps
  const silkNormalData = new Uint8Array(size * size * 4);
  const silkHeights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const twill = Math.sin((x + y) * 0.785398) * 0.55;
      const warp = Math.sin(x * 1.15) * 0.25;
      const weft = Math.sin(y * 0.85) * 0.2;
      silkHeights[y * size + x] = twill + warp + weft;
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const ym = (y - 1 + size) % size;
      const yp = (y + 1) % size;
      const dx = (silkHeights[y * size + xp] - silkHeights[y * size + xm]) * 1.3;
      const dy = (silkHeights[yp * size + x] - silkHeights[ym * size + x]) * 1.3;
      const len = Math.hypot(-dx, -dy, 1.0);
      const idx = (y * size + x) * 4;
      silkNormalData[idx] = Math.round(((-dx / len) * 0.5 + 0.5) * 255);
      silkNormalData[idx + 1] = Math.round(((-dy / len) * 0.5 + 0.5) * 255);
      silkNormalData[idx + 2] = Math.round(((1.0 / len) * 0.5 + 0.5) * 255);
      silkNormalData[idx + 3] = 255;
    }
  }

  const silkNormalMap = new THREE.DataTexture(silkNormalData, size, size, THREE.RGBAFormat);
  silkNormalMap.wrapS = THREE.RepeatWrapping;
  silkNormalMap.wrapT = THREE.RepeatWrapping;
  silkNormalMap.repeat.set(16, 18);
  silkNormalMap.anisotropy = Math.min(8, maxAniso);
  silkNormalMap.needsUpdate = true;

  // 2. Travertine Limestone Architectural Albedo & Roughness
  const stoneCanvas = document.createElement('canvas');
  stoneCanvas.width = size;
  stoneCanvas.height = size;
  const sctx = stoneCanvas.getContext('2d');
  if (sctx) {
    sctx.fillStyle = '#1C1D22';
    sctx.fillRect(0, 0, size, size);
    // Horizontal sedimentary limestone mineral bands
    for (let y = 0; y < size; y += 2) {
      const band = Math.sin(y * 0.17) * 0.5 + Math.cos(y * 0.43) * 0.5;
      const alpha = Math.max(0, band * 0.045);
      sctx.fillStyle = `rgba(218, 202, 174, ${alpha.toFixed(3)})`;
      sctx.fillRect(0, y, size, 2);
    }
  }
  const stoneMap = new THREE.CanvasTexture(stoneCanvas);
  stoneMap.colorSpace = THREE.SRGBColorSpace;
  stoneMap.wrapS = THREE.RepeatWrapping;
  stoneMap.wrapT = THREE.RepeatWrapping;
  stoneMap.repeat.set(6, 2);
  stoneMap.anisotropy = Math.min(8, maxAniso);

  // 3. Soft Architectural Gobo Sunbeam Texture
  const goboCanvas = document.createElement('canvas');
  goboCanvas.width = 256;
  goboCanvas.height = 256;
  const gctx = goboCanvas.getContext('2d');
  if (gctx) {
    const grad = gctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.28, 'rgba(255,244,218,0.85)');
    grad.addColorStop(0.5, 'rgba(255,238,200,0.95)');
    grad.addColorStop(0.72, 'rgba(240,218,175,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 256, 256);
  }
  const goboMap = new THREE.CanvasTexture(goboCanvas);
  goboMap.colorSpace = THREE.SRGBColorSpace;

  return { silkNormalMap, stoneMap, goboMap };
}

export function StoryCanvas3D({
  scrollStateRef,
  variant = 'hero',
  className = '',
}: StoryCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = false;

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = 0x111215;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.055);

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 60);
    camera.position.set(0, 0.25, 8.2);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.75;
    pmremGenerator.dispose();

    // Chiaroscuro Atelier Lighting (Natural Courtyard Window Key + Architectural Rim)
    const hemiLight = new THREE.HemisphereLight(0xf3ead8, 0x0f1014, 0.42);
    scene.add(hemiLight);

    const windowKeyLight = new THREE.DirectionalLight(0xfae8c8, 2.4);
    windowKeyLight.position.set(6.0, 5.5, 5.0);
    scene.add(windowKeyLight);

    const architecturalRim = new THREE.DirectionalLight(0x8c98ad, 1.1);
    architecturalRim.position.set(-5.5, 2.0, -2.5);
    scene.add(architecturalRim);

    const showcaseSpot = new THREE.SpotLight(0xe5cfa1, 26, 24, Math.PI * 0.24, 0.78, 1.3);
    showcaseSpot.position.set(2.2, 4.4, 5.2);
    scene.add(showcaseSpot);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const { silkNormalMap, stoneMap, goboMap } = createAtelierTextures(maxAniso);

    // -------------------------------------------------------------
    // 1. ARCHITECTURAL FLUTED TRAVERTINE COLONNADE BACKDROP
    // -------------------------------------------------------------
    const wallSegX = isSoftwareGl ? 96 : 180;
    const wallGeo = new THREE.PlaneGeometry(24, 11, wallSegX, 4);
    const wallPos = wallGeo.attributes.position;
    for (let i = 0; i < wallPos.count; i++) {
      const x = wallPos.getX(i);
      // Gentle curved apse + crisp concave architectural flutes
      const curvatureZ = -(x * x) * 0.018;
      const fluteCycle = Math.abs(Math.sin(x * 2.45));
      const fluteDepth = -Math.pow(fluteCycle, 0.65) * 0.14;
      wallPos.setZ(i, curvatureZ + fluteDepth);
    }
    wallGeo.computeVertexNormals();

    const wallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x212227),
      map: stoneMap,
      roughness: 0.72,
      metalness: 0.08,
      envMapIntensity: 0.65,
    });
    const flutedWall = new THREE.Mesh(wallGeo, wallMat);
    flutedWall.position.set(0, 0.2, -3.2);
    scene.add(flutedWall);

    // Diagonal sunlit gobo wash across the fluted architectural wall
    const goboGeo = new THREE.PlaneGeometry(16, 10);
    const goboMat = new THREE.MeshBasicMaterial({
      map: goboMap,
      color: 0xdcc59b,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sunGobo = new THREE.Mesh(goboGeo, goboMat);
    sunGobo.position.set(1.2, 0.6, -2.55);
    scene.add(sunGobo);

    // -------------------------------------------------------------
    // 2. ARCHITECTURAL BRUSHED-BRASS GALLERY TRACK & PLINTH FLOOR
    // -------------------------------------------------------------
    const brassMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xcab385),
      metalness: 0.94,
      roughness: 0.24,
      envMapIntensity: 1.45,
    });

    const railGeo = new THREE.CylinderGeometry(0.022, 0.022, 12.5, 24);
    const overheadRail = new THREE.Mesh(railGeo, brassMat);
    overheadRail.rotation.z = Math.PI * 0.5;
    overheadRail.position.set(1.8, 3.35, -0.95);
    scene.add(overheadRail);

    // Grounded Dark Slate Plinth Floor (anchors the atelier room)
    const floorGeo = new THREE.PlaneGeometry(24, 12);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x131418),
      roughness: 0.42,
      metalness: 0.12,
      clearcoat: 0.28,
      clearcoatRoughness: 0.45,
    });
    const atelierFloor = new THREE.Mesh(floorGeo, floorMat);
    atelierFloor.rotation.x = -Math.PI * 0.5;
    atelierFloor.position.set(0, -2.55, -0.5);
    scene.add(atelierFloor);

    // -------------------------------------------------------------
    // 3. VERTICAL TAILOR'S PLEATED MULBERRY SILK CURTAIN
    //    (Pinched at brass rail, relaxing downward with gravity pleats)
    // -------------------------------------------------------------
    const drapeUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };

    const drapeSegX = isSoftwareGl ? 96 : 168;
    const drapeSegY = isSoftwareGl ? 54 : 96;
    const drapeGeo = new THREE.PlaneGeometry(8.4, 6.6, drapeSegX, drapeSegY);

    const drapeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x2a2723),
      normalMap: silkNormalMap,
      normalScale: new THREE.Vector2(0.4, 0.4),
      roughness: 0.34,
      metalness: 0.05,
      sheen: 1.0,
      sheenRoughness: 0.26,
      sheenColor: new THREE.Color(0xe6d2ab),
      anisotropy: 0.78,
      anisotropyRotation: Math.PI * 0.5,
      side: THREE.DoubleSide,
    });

    drapeMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = drapeUniforms.uTime;
      shader.uniforms.uScroll = drapeUniforms.uScroll;
      shader.uniforms.uPointer = drapeUniforms.uPointer;

      shader.vertexShader =
        `
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uPointer;

        vec3 curtainDisplace(vec3 p) {
          // Normalize y from top brass track (+3.3 -> 0) to floor hem (-3.3 -> 1)
          float drop = clamp((3.3 - p.y) / 6.6, 0.0, 1.0);
          float breeze = uTime * 0.42 + uScroll * 1.4;

          // Tight tailor pleats at top header opening cleanly into deep gravity folds
          float pleatTight = sin(p.x * 2.85 + 0.3) * 0.24;
          float pleatSweep = sin(p.x * 1.25 - drop * 0.8 + breeze * 0.35) * (0.28 + drop * 0.38);
          float hemSway = sin(breeze * 0.65 + p.x * 0.55) * (0.04 + drop * 0.26);
          float cursorPush = exp(-length((p.xy - vec2(uPointer.x * 3.2, uPointer.y * 2.2)) * 0.36)) * (0.12 + drop * 0.22);

          // Gentle crescent gather around right studio portrait
          float curveZ = sin(p.x * 0.28) * 0.45;
          float zOffset = pleatTight + pleatSweep + hemSway + cursorPush + curveZ;
          // Subtle X taper at top pinch
          float xOffset = p.x * (0.94 + drop * 0.08);
          return vec3(xOffset, p.y, p.z + zOffset);
        }
        ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>
        float fdEps = 0.04;
        vec3 cCenter = curtainDisplace(position);
        vec3 cRight = curtainDisplace(position + vec3(fdEps, 0.0, 0.0));
        vec3 cUp = curtainDisplace(position + vec3(0.0, fdEps, 0.0));
        objectNormal = normalize(cross(cRight - cCenter, cUp - cCenter));
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        transformed = curtainDisplace(position);
        `
      );
    };

    const silkCurtain = new THREE.Mesh(drapeGeo, drapeMat);
    silkCurtain.position.set(variant === 'banner' ? 2.4 : 2.85, 0.15, -1.15);
    silkCurtain.rotation.y = -0.22;
    scene.add(silkCurtain);

    // Subtle Secondary Linen Sheer Curtain Layer behind left/center
    const sheerGeo = new THREE.PlaneGeometry(7.2, 6.6, Math.round(drapeSegX * 0.7), Math.round(drapeSegY * 0.7));
    const sheerMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xcabfa9),
      normalMap: silkNormalMap,
      normalScale: new THREE.Vector2(0.25, 0.25),
      roughness: 0.48,
      metalness: 0.02,
      sheen: 0.9,
      sheenRoughness: 0.35,
      sheenColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
    });
    sheerMat.onBeforeCompile = drapeMat.onBeforeCompile;

    const sheerCurtain = new THREE.Mesh(sheerGeo, sheerMat);
    sheerCurtain.position.set(variant === 'banner' ? -2.2 : 0.45, 0.15, -1.95);
    sheerCurtain.rotation.y = 0.14;
    scene.add(sheerCurtain);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const glCtx = renderer.getContext();
    const gl2 =
      typeof WebGL2RenderingContext !== 'undefined' && glCtx instanceof WebGL2RenderingContext
        ? glCtx
        : null;

    let rafId = 0;
    let disposed = false;
    let prevNow = performance.now();
    let elapsed = 0;
    let dampedScroll = 0;

    function afterDraw(cb: () => void) {
      if (isSoftwareGl && gl2) {
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (sync) {
          gl2.flush();
          const check = () => {
            if (disposed) {
              gl2.deleteSync(sync);
              return;
            }
            const status = gl2.clientWaitSync(sync, 0, 0);
            if (status === gl2.TIMEOUT_EXPIRED) {
              rafId = requestAnimationFrame(check);
            } else {
              gl2.deleteSync(sync);
              rafId = requestAnimationFrame(cb);
            }
          };
          rafId = requestAnimationFrame(check);
          return;
        }
      }
      rafId = requestAnimationFrame(cb);
    }

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - prevNow) / 1000));
      prevNow = now;
      elapsed += dt;

      if (!contextLost) {
        const state = scrollStateRef.current;
        dampedScroll = THREE.MathUtils.damp(dampedScroll, state.progress, 3.2, dt);
        pointer.x = THREE.MathUtils.damp(pointer.x, pointer.targetX, 2.6, dt);
        pointer.y = THREE.MathUtils.damp(pointer.y, pointer.targetY, 2.6, dt);

        drapeUniforms.uTime.value = elapsed;
        drapeUniforms.uScroll.value = dampedScroll;
        drapeUniforms.uPointer.value.set(pointer.x, pointer.y);

        // Cinema dolly camera tracking + subtle key-light studio sweep
        const camX = pointer.x * 0.26 + Math.sin(dampedScroll * Math.PI * 0.5) * 0.35;
        const camY = (variant === 'banner' ? 0.1 : 0.25) + pointer.y * 0.12 - dampedScroll * 0.25;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, camX, 2.8, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 2.8, dt);
        camera.lookAt(0.35, 0.05, -1.6);

        showcaseSpot.position.x = 2.0 + pointer.x * 1.45 + Math.sin(elapsed * 0.3) * 0.4;
        sunGobo.position.x = 1.2 + pointer.x * 0.35 + dampedScroll * 0.5;

        renderer.render(scene, camera);
      }

      afterDraw(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      wallGeo.dispose();
      wallMat.dispose();
      goboGeo.dispose();
      goboMat.dispose();
      railGeo.dispose();
      brassMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      drapeGeo.dispose();
      drapeMat.dispose();
      sheerGeo.dispose();
      sheerMat.dispose();
      silkNormalMap.dispose();
      stoneMap.dispose();
      goboMap.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, [scrollStateRef, variant]);

  if (webglUnavailable) {
    return (
      <div
        aria-hidden="true"
        className={`w-full h-full bg-gradient-to-br from-[#111215] via-[#1B1C21] to-[#26221B] ${className}`}
      />
    );
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`w-full h-full relative ${className}`}
    />
  );
}
