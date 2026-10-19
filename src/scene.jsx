import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Stylized, provisional character. Replace the avatar group with a personalized
// rigged GLB after Carlos supplies his portrait. No claim of likeness is made.
function createWorkspace() {
  const group = new THREE.Group();
  const materials = {
    skin: new THREE.MeshStandardMaterial({ color: '#c88760', roughness: .6 }),
    hair: new THREE.MeshStandardMaterial({ color: '#161817', roughness: .85 }),
    shirt: new THREE.MeshStandardMaterial({ color: '#24332b', roughness: .92 }),
    pants: new THREE.MeshStandardMaterial({ color: '#242929', roughness: .9 }),
    shoe: new THREE.MeshStandardMaterial({ color: '#151918', roughness: .6 }),
    sole: new THREE.MeshStandardMaterial({ color: '#d7dccf', roughness: .7 }),
    metal: new THREE.MeshStandardMaterial({ color: '#48554b', metalness: .6, roughness: .35 }),
    desktop: new THREE.MeshStandardMaterial({ color: '#313b32', roughness: .7, metalness: .15 }),
    frame: new THREE.MeshStandardMaterial({ color: '#1d2420', roughness: .6, metalness: .5 }),
    keys: new THREE.MeshStandardMaterial({ color: '#8a998b', roughness: .55, metalness: .2 }),
    white: new THREE.MeshStandardMaterial({ color: '#ece9dd', roughness: .45 }),
    pupil: new THREE.MeshStandardMaterial({ color: '#1b221f', roughness: .2 }),
    accent: new THREE.MeshStandardMaterial({ color: '#b6f36a', emissive: '#527e24', emissiveIntensity: .15, roughness: .4 }),
    screen: new THREE.MeshStandardMaterial({ color: '#92ef88', emissive: '#6ef59a', emissiveIntensity: 1.6, roughness: .5, side: THREE.DoubleSide }),
  };
  function mesh(geometry, material, parent, position = [0, 0, 0], scale = [1, 1, 1]) {
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(...position); obj.scale.set(...scale);
    obj.castShadow = true; obj.receiveShadow = true; parent.add(obj); return obj;
  }
  function box(size, mat, parent, pos, radius = .04) { return mesh(new RoundedBoxGeometry(...size, 3, radius), mat, parent, pos); }
  function sphere(mat, parent, pos, scale) { return mesh(new THREE.SphereGeometry(1, 28, 20), mat, parent, pos, scale); }
  function limb(a, b, radius, mat, parent) {
    const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b), dir = to.clone().sub(from);
    const obj = mesh(new THREE.CapsuleGeometry(radius, Math.max(.01, dir.length() - radius * 2), 6, 12), mat, parent);
    obj.position.copy(from.clone().add(to).multiplyScalar(.5));
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return obj;
  }

  // Desk and seating: a compact, floating studio on a circular platform.
  const platform = mesh(new THREE.CylinderGeometry(2.6, 2.68, .13, 80), materials.frame, group, [0, -.02, .1]);
  const ring = mesh(new THREE.TorusGeometry(2.62, .013, 8, 100), materials.accent, group, [0, .06, .1]); ring.rotation.x = Math.PI / 2;
  const table = new THREE.Group(); group.add(table);
  box([3.35, .12, 1.35], materials.desktop, table, [0, 1.12, .45], .05);
  for (const x of [-1.28, 1.28]) {
    box([.09, 1.12, .9], materials.frame, table, [x, .57, .45], .03);
    box([.26, .045, 1.0], materials.frame, table, [x, .1, .45]);
  }
  box([1.02, .12, .85], materials.frame, group, [0, .67, -.8], .1);
  box([.82, .9, .14], materials.shirt, group, [0, 1.04, -1.17], .07);
  limb([0, .12, -.83], [0, .62, -.83], .075, materials.metal, group);
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5;
    limb([0, .14, -.83], [Math.cos(a) * .6, .12, -.83 + Math.sin(a) * .6], .028, materials.metal, group);
    sphere(materials.shoe, group, [Math.cos(a) * .6, .08, -.83 + Math.sin(a) * .6], [.065, .06, .065]);
  }

  const avatar = new THREE.Group(); group.add(avatar);
  sphere(materials.pants, avatar, [0, .84, -.67], [.4, .18, .33]);
  const torso = sphere(materials.shirt, avatar, [0, 1.26, -.74], [.47, .5, .29]); torso.rotation.x = .08;
  const collar = mesh(new THREE.TorusGeometry(.13, .055, 10, 24), materials.shirt, avatar, [0, 1.66, -.7]); collar.rotation.x = Math.PI / 2;
  limb([0, 1.62, -.69], [0, 1.82, -.65], .13, materials.skin, avatar);
  for (const side of [-1, 1]) {
    limb([side * .25, .83, -.65], [side * .32, .58, -.18], .15, materials.pants, avatar);
    limb([side * .32, .58, -.18], [side * .35, .2, -.05], .105, materials.pants, avatar);
    box([.28, .09, .48], materials.sole, avatar, [side * .35, .13, .03], .045);
    box([.27, .17, .45], materials.shoe, avatar, [side * .35, .21, .02], .07);
    for (let k = 0; k < 3; k++) box([.13, .013, .018], materials.white, avatar, [side * .35, .302, .01 + k * .05], .005);
  }

  const head = new THREE.Group(); head.position.set(0, 1.94, -.67); avatar.add(head);
  sphere(materials.skin, head, [0, .16, 0], [.37, .43, .34]);
  sphere(materials.skin, head, [0, -.015, .09], [.28, .25, .28]);
  for (const side of [-1, 1]) {
    sphere(materials.skin, head, [side * .355, .12, 0], [.068, .105, .06]);
    sphere(materials.skin, head, [side * .115, .06, .297], [.1, .065, .055]);
    sphere(materials.white, head, [side * .119, .092, .31], [.064, .055, .032]);
    sphere(materials.pupil, head, [side * .116, .083, .341], [.027, .032, .012]);
    sphere(materials.white, head, [side * .109, .098, .351], [.008, .009, .005]);
    const brow = box([.13, .023, .025], materials.hair, head, [side * .125, .174, .307], .011); brow.rotation.z = side * -.08;
  }
  sphere(materials.skin, head, [0, .03, .337], [.055, .069, .058]);
  const mouth = box([.09, .012, .012], materials.hair, head, [0, -.093, .314], .005);
  sphere(materials.hair, head, [0, .37, -.055], [.382, .27, .31]);
  for (let i = 0; i < 6; i++) {
    const tuft = sphere(materials.hair, head, [-.25 + i * .095, .43 + Math.sin(i * .6) * .045, .135], [.095, .18, .14]); tuft.rotation.z = -.45;
  }
  // Minimal hoodie details.
  for (const side of [-1, 1]) {
    limb([side * .09, 1.61, -.43], [side * .11, 1.34, -.42], .012, materials.white, avatar);
    limb([side * .42, 1.43, -.64], [side * .64, 1.22, -.4], .125, materials.shirt, avatar);
    limb([side * .64, 1.22, -.4], [side * .36, 1.19, .02], .094, materials.shirt, avatar);
  }
  const hands = [];
  for (const side of [-1, 1]) {
    const hand = new THREE.Group(); hand.position.set(side * .32, 1.22, .06); avatar.add(hand);
    sphere(materials.skin, hand, [0, 0, 0], [.096, .047, .125]);
    for (let i = 0; i < 4; i++) {
      const finger = box([.03, .028, .092], materials.skin, hand, [-.057 + i * .038, -.006, .096], .014);
      finger.rotation.x = -.07;
    }
    sphere(materials.skin, hand, [side * -.078, .0, .017], [.041, .033, .074]);
    hands.push(hand);
  }

  // Real geometry laptop, with the display aimed toward the character.
  const laptop = new THREE.Group(); table.add(laptop);
  box([1.32, .055, .83], materials.metal, laptop, [0, 1.215, .39], .025);
  box([1.03, .01, .34], materials.frame, laptop, [0, 1.249, .19], .015);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) box([.075, .014, .049], materials.keys, laptop, [-.46 + c * .092, 1.263, .055 + r * .071], .006);
  box([.25, .008, .17], materials.frame, laptop, [0, 1.247, .61], .012);
  const lid = new THREE.Group(); lid.position.set(0, 1.22, -.01); lid.rotation.x = -.16; laptop.add(lid);
  box([1.32, .85, .046], materials.metal, lid, [0, .41, 0], .026);
  box([1.21, .73, .012], materials.frame, lid, [0, .41, -.028], .018);
  box([1.12, .65, .007], materials.screen, lid, [0, .41, -.037], .012);
  // Small display code lines are actual screen geometry.
  for (let r = 0; r < 8; r++) box([.2 + (r % 3) * .13, .014, .009], materials.shirt, lid, [-.25 + (r % 2) * .05, .64 - r * .055, -.045], .003);
  const logo = box([.11, .11, .007], materials.accent, lid, [0, .42, .028], .022); logo.rotation.z = Math.PI / 4;
  const screenLight = new THREE.PointLight('#a3ffd1', 3.5, 2.4, 2); screenLight.position.set(0, 1.67, -.3); group.add(screenLight);

  // Coffee and a little plant make the workspace feel lived in.
  mesh(new THREE.CylinderGeometry(.12, .095, .25, 24), materials.white, table, [1.16, 1.3, .54]);
  mesh(new THREE.CylinderGeometry(.094, .094, .01, 24), materials.hair, table, [1.16, 1.43, .54]);
  const handle = mesh(new THREE.TorusGeometry(.08, .026, 8, 20), materials.white, table, [1.3, 1.3, .54]); handle.rotation.y = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(.15, .105, .23, 24), materials.frame, table, [-1.27, 1.3, .34]);
  for (let i = 0; i < 7; i++) {
    const angle = i * 2.4;
    const leaf = sphere(materials.accent, table, [-1.27 + Math.sin(angle) * .08, 1.52 + (i % 3) * .07, .34 + Math.cos(angle) * .06], [.055, .17, .03]);
    leaf.rotation.z = Math.sin(angle) * .5; leaf.rotation.x = Math.cos(angle) * .5;
  }
  return { group, head, hands, materials, screenLight, platform };
}

export default function DeveloperScene({ theme, reduced }) {
  const hostRef = useRef(null);
  const engineRef = useRef(null);
  const themeRef = useRef(theme);
  const reducedRef = useRef(reduced);
  const [failed, setFailed] = useState(false);
  useEffect(() => { themeRef.current = theme; engineRef.current?.setTheme(theme); }, [theme]);
  useEffect(() => { reducedRef.current = reduced; }, [reduced]);

  useEffect(() => {
    const host = hostRef.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
    camera.position.set(4.8, 3.7, 6.7); camera.lookAt(0, 1.05, 0);
    const model = createWorkspace(); scene.add(model.group);
    const ambient = new THREE.AmbientLight('#ecf6ed', .8); scene.add(ambient);
    const key = new THREE.DirectionalLight('#e3f3d8', 3); key.position.set(-3, 6, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 4; key.shadow.camera.bottom = -4; key.shadow.bias = -.001; scene.add(key);
    const rim = new THREE.DirectionalLight('#b6f36a', 3.5); rim.position.set(3, 4, -4); scene.add(rim);
    const fill = new THREE.DirectionalLight('#c4d3f5', .8); fill.position.set(3, 2, 5); scene.add(fill);
    const shadowGround = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ opacity: .25 }));
    shadowGround.rotation.x = -Math.PI / 2; shadowGround.position.y = -.095; shadowGround.receiveShadow = true; scene.add(shadowGround);

    function setTheme(next) {
      const dark = next === 'dark';
      ambient.intensity = dark ? .65 : 2.0;
      key.intensity = dark ? 2.3 : 3.4;
      rim.intensity = dark ? 4 : 1.5;
      fill.intensity = dark ? .55 : 1.5;
      model.screenLight.intensity = dark ? 5.5 : .35;
      model.materials.screen.emissiveIntensity = dark ? 2.2 : .5;
      renderer.toneMappingExposure = dark ? 1.05 : 1.2;
      model.materials.desktop.color.set(dark ? '#313b32' : '#9fae9b');
      model.materials.frame.color.set(dark ? '#1d2420' : '#526356');
    }
    setTheme(themeRef.current);
    engineRef.current = { setTheme };
    const pointer = new THREE.Vector2(), smooth = new THREE.Vector2();
    const move = e => { const bounds = host.getBoundingClientRect(); pointer.set((e.clientX - bounds.left) / bounds.width * 2 - 1, (e.clientY - bounds.top) / bounds.height * 2 - 1); };
    const leave = () => pointer.set(0, 0);
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
    const resize = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
    }); resize.observe(host);
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); observer.observe(host);
    const start = performance.now(); let frame;
    const animate = now => {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      const t = (now - start) / 1000;
      if (!reducedRef.current) {
        smooth.lerp(pointer, .04);
        model.group.rotation.y = -.12 + smooth.x * .15;
        model.head.rotation.y = smooth.x * .17;
        model.head.rotation.x = .08 + smooth.y * .025 + Math.sin(t * .7) * .018;
        model.hands.forEach((hand, i) => { hand.position.y = 1.22 + Math.max(0, Math.sin(t * 8 + i * 2.1)) * .018; hand.rotation.x = Math.sin(t * 7 + i) * .04; });
        model.screenLight.intensity = (themeRef.current === 'dark' ? 5.5 : .35) * (1 + Math.sin(t * 1.5) * .035);
      } else { model.group.rotation.y = -.12; model.head.rotation.set(.08, 0, 0); }
      renderer.render(scene, camera);
    }; frame = requestAnimationFrame(animate);
    const lose = e => { e.preventDefault(); setFailed(true); };
    renderer.domElement.addEventListener('webglcontextlost', lose);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave);
      renderer.domElement.removeEventListener('webglcontextlost', lose);
      const geometries = new Set(), materials = new Set();
      scene.traverse(o => { if (o.geometry) geometries.add(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => materials.add(m)); });
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
      renderer.dispose(); renderer.domElement.remove(); engineRef.current = null;
    };
  }, []);

  return <div ref={hostRef} className="webgl-host" role="img" aria-label="Personagem 3D provisório digitando em um notebook, com iluminação que acompanha o tema do site">{failed && <div className="scene-fallback"><img src="/workspace-fallback.png" alt="" width="1254" height="1254" fetchPriority="high" /></div>}</div>;
}
