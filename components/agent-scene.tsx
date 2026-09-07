'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { parts, type PartId } from '@/lib/agent-content';

export type SceneCommand = { type: 'reset' | 'in' | 'out'; id: number };
type Props = { active: PartId; exploded: boolean; rotate: boolean; labels: boolean; command: SceneCommand | null; onSelect: (chapter: number) => void };

export default function AgentScene(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  const [failed, setFailed] = useState(false);
  useEffect(() => { latest.current = props; }, [props]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Agent 3D 结构模型，可拖动旋转、滚轮缩放，点击组件查看章节');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .07;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 28;
    controls.minPolarAngle = .35;
    controls.maxPolarAngle = Math.PI - .35;
    controls.autoRotateSpeed = .28;
    controls.target.set(0, .35, 0);
    const fit = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    fit();
    const distance = Math.max(11.8, 6.1 / Math.tan(THREE.MathUtils.degToRad(21)) / camera.aspect);
    camera.position.set(0, 2.2, distance);
    controls.update();
    controls.saveState();
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    scene.add(new THREE.AmbientLight('#b9c4ed', 1.5));
    const light = new THREE.DirectionalLight('#dce9ff', 3);
    light.position.set(-4, 7, 5);
    scene.add(light);
    const accentLight = new THREE.PointLight('#987bff', 30, 20);
    accentLight.position.set(0, 1, 4);
    scene.add(accentLight);
    const world = new THREE.Group();
    scene.add(world);
    const nodeMaterials: THREE.Material[] = [];
    const glowTextures: THREE.Texture[] = [];
    const makeGlow = (color: string, size: number, opacity: number) => {
      const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, '#ffffff'); gradient.addColorStop(.12, color); gradient.addColorStop(.4, color + '55'); gradient.addColorStop(1, color + '00');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
      const texture = new THREE.CanvasTexture(canvas); glowTextures.push(texture);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity });
      const sprite = new THREE.Sprite(material); sprite.scale.setScalar(size); return sprite;
    };
    const line = (points: THREE.Vector3[], color: string, opacity: number, parent: THREE.Object3D = world) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
      const object = new THREE.Line(geometry, material); parent.add(object); return object;
    };
    const ring = (radius: number, color: string, opacity: number, parent: THREE.Object3D = world) => {
      const points = Array.from({ length: 161 }, (_, i) => new THREE.Vector3(Math.cos(i / 160 * Math.PI * 2) * radius, 0, Math.sin(i / 160 * Math.PI * 2) * radius));
      return line(points, color, opacity, parent);
    };
    // The grid is a spatial reference for this software architecture, not a physical device.
    const grid = new THREE.GridHelper(24, 48, '#33394e', '#171d2b');
    grid.position.y = -3.4;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = .32;
    scene.add(grid);
    for (const radius of [2.2, 4.9, 5.2, 6.2]) { const r = ring(radius, '#7884b4', .14); r.position.y = -3.36; }
    const guard = ring(5.15, '#7399b9', .3); guard.rotation.z = .13; guard.rotation.x = Math.PI / 2.8;
    const guardOuter = ring(5.23, '#7399b9', .10); guardOuter.rotation.copy(guard.rotation);
    const core = new THREE.Group();
    core.userData.chapter = 3; world.add(core);
    const coreGlow = makeGlow('#9b75ff', 5.4, .18); core.add(coreGlow);
    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.24, 3), new THREE.MeshPhysicalMaterial({ color: '#29233e', emissive: '#482d88', emissiveIntensity: .6, transparent: true, opacity: .42, roughness: .24, metalness: .25, depthWrite: false }));
    coreMesh.userData.chapter = 3; core.add(coreMesh);
    const meshWire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.29, 2)), new THREE.LineBasicMaterial({ color: '#a791ed', transparent: true, opacity: .25 }));
    core.add(meshWire);
    const neural = new THREE.Group(); core.add(neural);
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 190; i++) {
      const y = 1 - i / 189 * 2; const r = Math.sqrt(1 - y * y); const a = i * 2.399963;
      nodes.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(1.3));
    }
    const dotsGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    neural.add(new THREE.Points(dotsGeo, new THREE.PointsMaterial({ color: '#ddceff', size: .036, transparent: true, opacity: .9, sizeAttenuation: true })));
    const edgeVertices: number[] = [];
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => { if (a.distanceTo(b) < .39) edgeVertices.push(...a.toArray(), ...b.toArray()); }));
    const edges = new THREE.BufferGeometry(); edges.setAttribute('position', new THREE.Float32BufferAttribute(edgeVertices, 3));
    neural.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#cab0ff', transparent: true, opacity: .36 })));
    for (let i = 0; i < 3; i++) {
      const r = ring(1.57 + i * .09, '#b8a1ff', .55, core);
      r.rotation.set(.65 + i * .74, .2 + i, .7 + i * .5);
    }
    const coreLight = makeGlow('#d6bfff', .6, .6); core.add(coreLight);
    const labels: { element: HTMLButtonElement; object: THREE.Object3D; offset: THREE.Vector3; part: PartId }[] = [];
    const addLabel = (object: THREE.Object3D, id: PartId, label: string, en: string, color: string, chapter: number, offset: THREE.Vector3) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'node-label';
      button.style.setProperty('--node-color', color);
      button.innerHTML = `<span class="node-label-name">${label}</span><span class="node-label-en">${en}</span>`;
      button.setAttribute('aria-label', `查看${label}讲解`);
      button.addEventListener('click', () => latest.current.onSelect(chapter));
      host.appendChild(button); labels.push({ element: button, object, offset, part: id });
    };
    addLabel(core, 'core', '大语言模型', 'LLM · 决策核心', '#c7b4ff', 3, new THREE.Vector3(0, -.28, 1.4));
    const satellites = parts.map((part, index) => {
      const group = new THREE.Group(); group.userData.chapter = part.lesson; group.position.fromArray(part.position); world.add(group);
      const color = new THREE.Color(part.color);
      const solidMaterial = new THREE.MeshStandardMaterial({ color: color.clone().multiplyScalar(.28), emissive: color, emissiveIntensity: .2, metalness: .65, roughness: .3, transparent: true, opacity: .9 });
      const edgeMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: .75 });
      const innerMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .58 });
      nodeMaterials.push(solidMaterial, edgeMaterial, innerMaterial);
      const addBox = (w: number, h: number, d: number, x: number, y: number, z: number, filled = false) => {
        const geometry = new RoundedBoxGeometry(w, h, d, 2, .04);
        const mesh = new THREE.Mesh(geometry, filled ? innerMaterial : solidMaterial); mesh.position.set(x, y, z); mesh.userData.chapter = part.lesson; group.add(mesh);
        const border = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial); border.position.copy(mesh.position); group.add(border);
      };
      if (part.id === 'memory') {
        for (let i = 0; i < 3; i++) {
          const mesh = new THREE.Mesh(new THREE.CylinderGeometry(.46, .46, .2, 32), solidMaterial); mesh.position.y = (i - 1) * .29; mesh.userData.chapter = part.lesson; group.add(mesh);
          const r = ring(.47, part.color, .65, group); r.position.y = (i - 1) * .29 + .1;
        }
      } else if (part.id === 'context' || part.id === 'output') {
        for (let i = 0; i < 3; i++) addBox(.69, .61, .12, i * .1 - .1, i * .075 - .075, -i * .17);
        for (let i = 0; i < 3; i++) line([new THREE.Vector3(-.21, .14 - .14 * i, .08), new THREE.Vector3(.1 + (i % 2) * .12, .14 - .14 * i, .08)], part.color, .8, group);
      } else if (part.id === 'planner') {
        addBox(.25, .22, .25, 0, .32, 0, true);
        for (let i = -1; i <= 1; i++) { addBox(.2, .2, .2, i * .33, -.2, 0); line([new THREE.Vector3(0, .2, 0), new THREE.Vector3(i * .33, -.12, 0)], part.color, .7, group); }
      } else if (part.id === 'tools') {
        addBox(.76, .52, .45, 0, 0, 0);
        addBox(.29, .2, .08, 0, .33, 0);
        line([new THREE.Vector3(-.16, .07, .24), new THREE.Vector3(-.05, 0, .24), new THREE.Vector3(-.16, -.08, .24)], part.color, .9, group);
        line([new THREE.Vector3(.05, -.08, .24), new THREE.Vector3(.19, -.08, .24)], part.color, .9, group);
      } else if (part.id === 'retrieval') {
        for (let i = 0; i < 3; i++) addBox(.18, .58 + (i % 2) * .13, .37, (i - 1) * .25, 0, 0);
      } else if (part.id === 'reflection') {
        const r = ring(.4, part.color, .9, group); r.rotation.x = Math.PI / 2;
        addBox(.19, .19, .19, .4, 0, 0, true); addBox(.13, .13, .13, -.4, 0, 0, true);
      } else {
        addBox(.74, .52, .19, 0, 0, 0);
        const g = new THREE.ConeGeometry(.15, .23, 3); const arrow = new THREE.Mesh(g, innerMaterial); arrow.rotation.z = -Math.PI / 2; arrow.position.set(0, 0, .16); group.add(arrow);
      }
      const base = ring(.64, part.color, .23, group); base.position.y = -.49;
      const glow = makeGlow(part.color, 1.5, .12); group.add(glow);
      addLabel(group, part.id, part.label, part.en, part.color, part.lesson, new THREE.Vector3(0, -.67, .25));
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), group.position.clone());
      const connection = line(Array.from({ length: 36 }, () => new THREE.Vector3()), part.color, .24);
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(.045, 8, 8), new THREE.MeshBasicMaterial({ color: part.color })); world.add(pulse);
      const pulseGlow = makeGlow(part.color, .32, .65); pulse.add(pulseGlow);
      return { part, group, curve, connection, pulse, index, solidMaterial, edgeMaterial, innerMaterial, glow };
    });
    const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2(); let down = { x: 0, y: 0 };
    const pointerDown = (event: PointerEvent) => { down = { x: event.clientX, y: event.clientY }; };
    const pick = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects([coreMesh, ...satellites.map(x => x.group)], true).find(x => x.object instanceof THREE.Mesh);
      if (hit) { let node: THREE.Object3D | null = hit.object; while (node) { if (typeof node.userData.chapter === 'number') { latest.current.onSelect(node.userData.chapter); break; } node = node.parent; } }
    };
    renderer.domElement.addEventListener('pointerdown', pointerDown); renderer.domElement.addEventListener('pointerup', pick);
    const contextLost = (event: Event) => { event.preventDefault(); setFailed(true); };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const project = new THREE.Vector3(); const worldPos = new THREE.Vector3(); const curvePoint = new THREE.Vector3();
    let lastCommand = -1; let lastTime = 0; let elapsed = 0; let frame = 0; let lastActive: PartId | null = null;
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, .05); lastTime = time;
      if (document.hidden) return;
      if (!reduced.matches) elapsed += dt;
      const p = latest.current;
      if (p.command && p.command.id !== lastCommand) {
        lastCommand = p.command.id;
        if (p.command.type === 'reset') controls.reset();
        else { const offset = camera.position.clone().sub(controls.target); const length = THREE.MathUtils.clamp(offset.length() * (p.command.type === 'in' ? .85 : 1.18), controls.minDistance, controls.maxDistance); camera.position.copy(controls.target).add(offset.setLength(length)); }
      }
      controls.autoRotate = p.rotate && !reduced.matches;
      controls.update(dt);
      neural.rotation.y = elapsed * .09; meshWire.rotation.y = -elapsed * .025;
      const amount = 1 - Math.exp(-dt * 6);
      const all = p.active === 'all';
      satellites.forEach(s => {
        const selected = all || p.active === s.part.id;
        const target = new THREE.Vector3(...s.part.position).multiplyScalar(p.exploded ? 1.23 : 1);
        target.y += Math.sin(elapsed * .55 + s.index) * .035;
        s.group.position.lerp(target, amount);
        s.group.scale.lerp(new THREE.Vector3().setScalar(!all && selected ? 1.17 : 1), amount);
        s.solidMaterial.opacity = selected ? .9 : .24; s.edgeMaterial.opacity = selected ? .8 : .21; s.innerMaterial.opacity = selected ? .7 : .25;
        s.glow.material.opacity = selected ? .14 : .035;
        s.curve.v0.copy(s.group.position.clone().normalize().multiplyScalar(1.4));
        s.curve.v1.copy(s.group.position).multiplyScalar(.52); s.curve.v1.z += .75;
        s.curve.v2.copy(s.group.position);
        const positions = s.connection.geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < 36; i++) { s.curve.getPoint(i / 35, curvePoint); positions.setXYZ(i, curvePoint.x, curvePoint.y, curvePoint.z); }
        positions.needsUpdate = true;
        s.connection.geometry.computeBoundingSphere();
        s.connection.material.opacity = selected ? .43 : .08;
        const fraction = (elapsed * .16 + s.index * .13) % 1;
        s.pulse.position.copy(s.curve.getPoint(s.index < 4 ? 1 - fraction : fraction)); s.pulse.visible = selected;
      });
      guard.material.opacity = p.active === 'guardrails' ? .95 : .22;
      guardOuter.material.opacity = p.active === 'guardrails' ? .5 : .08;
      coreMesh.material.emissiveIntensity = p.active === 'core' ? 1.2 : .55;
      coreGlow.material.opacity = all || p.active === 'core' ? .21 : .12;
      const w = host.clientWidth; const h = host.clientHeight;
      world.updateMatrixWorld(true);
      for (const label of labels) {
        label.object.getWorldPosition(worldPos); worldPos.add(label.offset); project.copy(worldPos).project(camera);
        const x = (project.x * .5 + .5) * w; const y = (-project.y * .5 + .5) * h;
        label.element.style.transform = `translate(-50%, 0) translate(${x}px, ${y}px)`;
        label.element.style.visibility = p.labels && project.z < 1 && Math.abs(project.x) < 1.08 && Math.abs(project.y) < 1.03 ? 'visible' : 'hidden';
        label.element.style.opacity = all || p.active === label.part ? '1' : '.45';
        if (p.active !== lastActive) label.element.classList.toggle('node-selected', p.active === label.part);
      }
      lastActive = p.active;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', pointerDown); renderer.domElement.removeEventListener('pointerup', pick); renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>(nodeMaterials);
      scene.traverse(object => { const item = object as THREE.Mesh; if (item.geometry) geometries.add(item.geometry); if (item.material) (Array.isArray(item.material) ? item.material : [item.material]).forEach(m => materials.add(m)); });
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); glowTextures.forEach(t => t.dispose());
      renderer.dispose(); renderer.domElement.remove(); labels.forEach(l => l.element.remove());
    };
  }, []);

  return <>
    <div ref={hostRef} className={`three-scene${failed ? ' scene-unavailable' : ''}`} />
    {failed && <div className="scene-fallback"><span>3D 视图暂不可用</span><p>请启用浏览器图形加速并刷新。你仍可以选择组件、阅读全部讲解。</p><div>{parts.map(p => <button key={p.id} onClick={() => props.onSelect(p.lesson)} style={{ color: p.color }}>{p.label}</button>)}</div></div>}
  </>;
}
