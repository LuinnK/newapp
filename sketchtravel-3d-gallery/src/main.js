import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { products } from "./products.js";

/* =========================================================
 *  GALLERY GRID
 * =======================================================*/
const cardsEl = document.getElementById("cards");

products.forEach((p, i) => {
  const card = document.createElement("article");
  card.className = "card";
  card.style.animationDelay = `${i * 60}ms`;
  card.innerHTML = `
    <span class="card-cta">XEM 3D</span>
    <div class="card-media"><img src="${p.image}" alt="${p.title}" loading="lazy" /></div>
    <div class="card-body">
      <h3>${p.title}</h3>
      <span>${p.subtitle}</span>
    </div>`;
  card.addEventListener("click", () => openViewer(i));

  // subtle 3D tilt following the pointer
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });

  cardsEl.appendChild(card);
});

/* =========================================================
 *  3D VIEWER (Three.js)
 * =======================================================*/
const viewerEl = document.getElementById("viewer");
const galleryEl = document.getElementById("gallery");
const canvas = document.getElementById("scene");
const loaderEl = document.getElementById("loader");
const vTitle = document.getElementById("vTitle");
const vDesc = document.getElementById("vDesc");
const autoBtn = document.getElementById("autoBtn");

let renderer, scene, camera, controls, cardMesh;
let current = 0;
let autoRotate = true;
let initialized = false;
let loadGeneration = 0;
const loader = new THREE.TextureLoader();

function initScene() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  // Lighting
  scene.add(new THREE.AmbientLight(0x8891c8, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd9b871, 1.2);
  rim.position.set(-5, 2, -4);
  scene.add(rim);
  const fill = new THREE.PointLight(0x4a5cc0, 0.8, 30);
  fill.position.set(0, -3, 4);
  scene.add(fill);

  // Ambient star field
  scene.add(makeStars());

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 3.2;
  controls.maxDistance = 9;
  controls.rotateSpeed = 0.9;
  controls.zoomSpeed = 0.8;
  controls.addEventListener("start", () => setAuto(false));

  window.addEventListener("resize", onResize);
  animate();
  initialized = true;
}

function makeStars() {
  const g = new THREE.BufferGeometry();
  const n = 400;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 2] = -6 - Math.random() * 20;
  }
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({
    color: 0xd9b871,
    size: 0.05,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });
  return new THREE.Points(g, m);
}

/* ---- Build the framed 3D card for a product ---- */
function buildCard(product, texture) {
  const img = texture.image;
  const aspect = img.width / img.height;
  const H = 4;
  const W = H * aspect;
  const D = 0.12;

  const geo = new THREE.BoxGeometry(W, H, D, 1, 1, 1);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const front = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.55,
    metalness: 0.12,
  });
  const back = new THREE.MeshStandardMaterial({
    map: makeBackTexture(product, aspect),
    roughness: 0.7,
    metalness: 0.1,
  });
  const edge = new THREE.MeshStandardMaterial({
    color: 0xd9b871,
    roughness: 0.35,
    metalness: 0.7,
  });

  // Box material order: +x, -x, +y, -y, +z(front), -z(back)
  const mats = [edge, edge, edge, edge, front, back];
  const mesh = new THREE.Mesh(geo, mats);
  return mesh;
}

/* ---- Generate a decorative back face on a canvas ---- */
function makeBackTexture(product, aspect) {
  const w = 640;
  const h = Math.round(w / aspect);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#141b45");
  grad.addColorStop(1, "#0b1030");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(217,184,113,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  ctx.fillStyle = "#d9b871";
  ctx.textAlign = "center";
  ctx.font = "600 30px 'Cormorant Garamond', serif";
  ctx.fillText("ARTISTIC VISION", w / 2, h * 0.2);

  ctx.fillStyle = "#e8ecff";
  ctx.font = "italic 64px 'Dancing Script', cursive";
  ctx.fillText("Sketchtravel", w / 2, h * 0.5);

  ctx.fillStyle = "#97a0d0";
  ctx.font = "500 26px 'Inter', sans-serif";
  ctx.fillText(product.title, w / 2, h * 0.66);
  ctx.font = "300 20px 'Inter', sans-serif";
  ctx.fillText(product.subtitle, w / 2, h * 0.72);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function loadProduct(index) {
  current = (index + products.length) % products.length;
  const product = products[current];
  const generation = ++loadGeneration;
  vTitle.textContent = product.title;
  vDesc.textContent = product.description;
  loaderEl.hidden = false;

  loader.load(product.image, (texture) => {
    // Ignore stale loads: a newer navigation superseded this one.
    if (generation !== loadGeneration) {
      texture.dispose();
      return;
    }
    if (cardMesh) {
      cardMesh.geometry.dispose();
      cardMesh.material.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
      scene.remove(cardMesh);
    }
    cardMesh = buildCard(product, texture);
    scene.add(cardMesh);
    // reset framing
    camera.position.set(0, 0, 6);
    controls.target.set(0, 0, 0);
    controls.update();
    loaderEl.hidden = true;
    setAuto(true);
  });
}

function setAuto(on) {
  autoRotate = on;
  autoBtn.setAttribute("aria-pressed", String(on));
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (autoRotate && cardMesh) cardMesh.rotation.y += 0.006;
  controls.update();
  renderer.render(scene, camera);
}

/* =========================================================
 *  NAVIGATION
 * =======================================================*/
function openViewer(index) {
  viewerEl.hidden = false;
  galleryEl.style.display = "none";
  document.querySelector(".topbar").style.display = "none";
  if (!initialized) initScene();
  onResize();
  loadProduct(index);
}

function closeViewer() {
  viewerEl.hidden = true;
  galleryEl.style.display = "";
  document.querySelector(".topbar").style.display = "";
}

document.getElementById("backBtn").addEventListener("click", closeViewer);
document.getElementById("prevBtn").addEventListener("click", () => loadProduct(current - 1));
document.getElementById("nextBtn").addEventListener("click", () => loadProduct(current + 1));
autoBtn.addEventListener("click", () => setAuto(!autoRotate));

window.addEventListener("keydown", (e) => {
  if (viewerEl.hidden) return;
  if (e.key === "Escape") closeViewer();
  if (e.key === "ArrowRight") loadProduct(current + 1);
  if (e.key === "ArrowLeft") loadProduct(current - 1);
});
