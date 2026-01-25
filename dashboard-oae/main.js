import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js?module';

// -----------------------------
// Globals / State
// -----------------------------
let colorScaleMin = 0.46;
let colorScaleMax = 0.88;

let currentColormap = 'viridis';
let colormapReversed = false;

let hexMeshes = [];
let activeVar = localStorage.getItem('activeVar') || null;

// Raycast target group ref
let hexGroupRef = null;

// -----------------------------
// Units + Labels
// -----------------------------
const units = {
  eff: '(%)',
  salt: '(psu)',
  temp: '(°C)',
  alk: '(umol/kg)',
  dic: '(umol/kg)',
  net_removal: '(tCO₂/tCa(OH)₂)',
  net_cost: '($/CO₂)',
  Days_at_Sea: '(days)',
  ocean_emis: '(tCO₂/tCa(OH)₂)',
  ocean_cost: '($/tCa(OH)₂)',
  chem_eff: '(molCO₂/molAlk)',
  tot_eff_A001: '(tCO₂/tCa(OH)₂)',
  tot_eff_A01: '(tCO₂/tCa(OH)₂)',
  tot_eff_A1: '(tCO₂/tCa(OH)₂)',
  tot_eff_A10: '(tCO₂/tCa(OH)₂)',
  pr_eff_A001: '(%)',
  pr_eff_A01: '(%)',
  pr_eff_A1: '(%)',
  pr_eff_A10: '(%)',
};

const varLabels = {
  eff: 'Efficiency',
  salt: 'Salinity',
  temp: 'Temperature',
  alk: 'Alkalinity',
  dic: 'DIC',
  net_removal: 'Net Removal',
  net_cost: 'CDR Cost',
  ocean_emis: 'Ocean Emissions',
  ocean_cost: 'Ocean Cost',
  chem_eff: 'Chemical Efficiency',
  tot_eff_A001: 'CO₂ Removal',
  tot_eff_A01: 'CO₂ Removal',
  tot_eff_A1: 'CO₂ Removal',
  tot_eff_A10: 'CO₂ Removal',
  pr_eff_A001: 'Secondary Precipitation',
  pr_eff_A01: 'Secondary Precipitation',
  pr_eff_A1: 'Secondary Precipitation',
  pr_eff_A10: 'Secondary Precipitation',
};

// -----------------------------
// Colormaps
// -----------------------------
const cmapInterpolators = {
  viridis: (t) => chroma.scale('viridis')(t).hex(),
  inferno: (t) => d3.interpolateInferno(t),
  plasma: (t) => d3.interpolatePlasma(t),
  magma: (t) => d3.interpolateMagma(t),
  cividis: (t) => d3.interpolateCividis(t),
};

// UI: colormap select
document.getElementById('colormapSelect').addEventListener('change', (e) => {
  currentColormap = e.target.value;
  updateHexColors();
});

// UI: reverse colormap
document.getElementById('reverseColormapBtn').addEventListener('click', () => {
  colormapReversed = !colormapReversed;
  updateHexColors();
});

// -----------------------------
// Color mapping helpers
// -----------------------------
function getColorFromValue(v) {
  if (v == null || isNaN(v)) return null;

  const denom = (colorScaleMax - colorScaleMin);
  let t = denom === 0 ? 0.5 : THREE.MathUtils.clamp((v - colorScaleMin) / denom, 0, 1);
  if (colormapReversed) t = 1 - t;

  const hexString = cmapInterpolators[currentColormap](t);
  return new THREE.Color(hexString);
}

function updateColorbar() {
  if (!activeVar) return;

  document.getElementById('scaleMin').textContent = Number(colorScaleMin).toFixed(2);
  document.getElementById('scaleMax').textContent = Number(colorScaleMax).toFixed(2);
  document.getElementById('unitLabel').textContent = units[activeVar] || '';

  const bar = document.getElementById('scaleBar');
  const steps = 10;
  let colors = Array.from({ length: steps }, (_, i) =>
    cmapInterpolators[currentColormap](i / (steps - 1))
  );

  if (colormapReversed) colors.reverse();

  const gradient = colors
    .map((c, i) => `${c} ${(i / (steps - 1)) * 100}%`)
    .join(', ');

  bar.style.background = `linear-gradient(to right, ${gradient})`;
}

function updateHexColors() {
  if (!activeVar || !hexMeshes.length) return;

  const values = hexMeshes
    .map((m) => m.userData.properties?.[activeVar])
    .filter((v) => v != null && !isNaN(v));

  if (!values.length) return;

  colorScaleMin = Math.min(...values);
  colorScaleMax = Math.max(...values);

  updateColorbar();

  hexMeshes.forEach((mesh) => {
    const v = mesh.userData.properties?.[activeVar];
    if (v == null || isNaN(v)) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;
    const newCol = getColorFromValue(v);
    const attr = mesh.geometry.attributes.color;

    for (let i = 0; i < attr.count; i++) {
      attr.setXYZ(i, newCol.r, newCol.g, newCol.b);
    }
    attr.needsUpdate = true;
  });
}

// -----------------------------
// Layer buttons
// -----------------------------
function buildLayerButtons(variables) {
  const container = document.getElementById('layer-controls');
  container.innerHTML = '';

  const base = 'px-2 py-1 rounded text-sm';
  const activeCls = 'bg-blue-600 text-white';
  const inactiveCls = 'bg-gray-800 hover:bg-gray-700 text-gray-200';

  variables.forEach((name) => {
    const btn = document.createElement('button');
    btn.textContent = varLabels[name] || name;
    btn.dataset.var = name;

    btn.className = `${base} ${name === activeVar ? activeCls : inactiveCls}`;

    btn.addEventListener('click', () => {
      activeVar = name;
      localStorage.setItem('activeVar', activeVar);
      updateHexColors();

      container.querySelectorAll('button').forEach((b) => {
        const isActive = b.dataset.var === activeVar;
        b.className = `${base} ${isActive ? activeCls : inactiveCls}`;
      });
    });

    container.appendChild(btn);
  });
}

// -----------------------------
// Tooltip + click (no drag)
// -----------------------------
function setupHexTooltipPicking({ renderer, camera, canvasContainer }) {
  const raycaster = new THREE.Raycaster();
  const mouseNdc = new THREE.Vector2();

  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.background = 'rgba(0,0,0,0.8)';
  tooltip.style.border = '1px solid rgba(255,255,255,0.2)';
  tooltip.style.borderRadius = '8px';
  tooltip.style.padding = '8px 10px';
  tooltip.style.fontSize = '12px';
  tooltip.style.color = '#fff';
  tooltip.style.whiteSpace = 'nowrap';
  tooltip.style.transform = 'translate(10px, 10px)';
  tooltip.style.display = 'none';
  tooltip.style.zIndex = '30';
  canvasContainer.appendChild(tooltip);

  function hideTooltip() {
    tooltip.style.display = 'none';
  }

  function showTooltip(clientX, clientY, html) {
    const rect = canvasContainer.getBoundingClientRect();
    tooltip.style.left = `${clientX - rect.left}px`;
    tooltip.style.top = `${clientY - rect.top}px`;
    tooltip.innerHTML = html;
    tooltip.style.display = 'block';
  }

  function pickHexAndShowTooltip(e) {
    if (!hexGroupRef || !activeVar) {
      hideTooltip();
      return;
    }

    const rect = renderer.domElement.getBoundingClientRect();
    mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouseNdc, camera);

    const hits = raycaster.intersectObjects(hexGroupRef.children, true);
    if (!hits.length) {
      hideTooltip();
      return;
    }

    const mesh = hits[0].object;
    const props = mesh.userData?.properties;
    if (!props) {
      hideTooltip();
      return;
    }

    const v = props[activeVar];
    if (v == null || isNaN(v)) {
      hideTooltip();
      return;
    }

    const label = varLabels[activeVar] || activeVar;
    const unit = units[activeVar] || '';
    const vStr = Number(v).toFixed(4);

    // (feedback) pas de numéro d'hexagon
    showTooltip(
      e.clientX,
      e.clientY,
      `<div style="font-weight:600; margin-bottom:2px;">${label}</div>
       <div>${vStr} <span style="opacity:0.8;">${unit}</span></div>`
    );
  }

  // (feedback) click net uniquement (pas drag)
  let pointerIsDown = false;
  let didDrag = false;
  let downX = 0;
  let downY = 0;
  const DRAG_THRESHOLD_PX = 6;

  renderer.domElement.addEventListener('pointerdown', (e) => {
    pointerIsDown = true;
    didDrag = false;
    downX = e.clientX;
    downY = e.clientY;
  });

  renderer.domElement.addEventListener('pointermove', (e) => {
    if (!pointerIsDown) return;

    const dx = e.clientX - downX;
    const dy = e.clientY - downY;

    if ((dx * dx + dy * dy) > (DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX)) {
      didDrag = true;
      hideTooltip();
    }
  });

  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!pointerIsDown) return;
    pointerIsDown = false;

    if (didDrag) return;
    pickHexAndShowTooltip(e);
  });

  renderer.domElement.addEventListener('pointercancel', () => {
    pointerIsDown = false;
    didDrag = false;
    hideTooltip();
  });

  renderer.domElement.addEventListener('pointerleave', () => {
    pointerIsDown = false;
    didDrag = false;
    hideTooltip();
  });

  return { hideTooltip };
}

// -----------------------------
// Presets
// -----------------------------
let pricePresets = {};
fetch('./data/country_presets.json')
  .then((res) => res.json())
  .then((json) => { pricePresets = json; })
  .catch((err) => console.error('Impossible de charger country_presets.json:', err));

document.getElementById('country').addEventListener('change', (e) => {
  const code = e.target.value;
  const preset = pricePresets[code];

  if (code === 'CUSTOM') {
    document.getElementById('gasPrice').value = '';
    document.getElementById('fuelPrice').value = '';
    document.getElementById('elecPrice').value = '';
    document.getElementById('elecCIntensity').value = '';
    return;
  }

  if (!preset) return;

  document.getElementById('gasPrice').value = preset.gasPrice;
  document.getElementById('fuelPrice').value = preset.fuelPrice;
  document.getElementById('elecPrice').value = preset.elecPrice;
  document.getElementById('elecCIntensity').value = preset.elecCIntensity;
});

// -----------------------------
// Init 3D
// -----------------------------
async function init() {
  // Load shaders + textures
  const vertexShader = await fetch('./shaders/vertex.glsl').then((res) => res.text());
  const fragmentShader = await fetch('./shaders/fragment.glsl').then((res) => res.text());
  const atmosphereVertexShader = await fetch('./shaders/atmosphere_vertex.glsl').then((res) => res.text());
  const atmosphereFragmentShader = await fetch('./shaders/atmosphere_fragment.glsl').then((res) => res.text());

  const globeTexture = new THREE.TextureLoader().load('./data/uv_map.webp');
  const landMask = new THREE.TextureLoader().load('./data/land_mask.webp');

  const HEX_OFFSET = 0.003;
  const R = 5;
  const a = 200;

  const scene = new THREE.Scene();

  const canvasContainer = document.querySelector('#canvas-container');
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 2 * R;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('canvas'),
  });
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Globe
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(R, a, a),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { globeTexture: { value: globeTexture } },
    })
  );
  scene.add(sphere);

  // Continents overlay
  const mat = new THREE.MeshBasicMaterial({
    map: globeTexture,
    alphaMap: landMask,
    transparent: true,
    alphaTest: 0.5,
    depthWrite: false,
  });
  const continent = new THREE.Mesh(new THREE.SphereGeometry(R + 2 * HEX_OFFSET, a, a), mat);
  scene.add(continent);

  // Atmosphere
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(R, a, a),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
  );
  atmosphere.scale.set(1.05, 1.05, 1.05);
  scene.add(atmosphere);

  // Stars
  function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    sizeAttenuation: true,
    map: createStarTexture(),
    transparent: true,
    depthWrite: false,
    size: 1.5,
  });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    starVertices.push(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      -Math.random() * 2000
    );
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  scene.add(new THREE.Points(starGeometry, starMaterial));

  // Controls
 // Controls
const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = R + 0.3;   // rayon sphère + marge
controls.maxDistance = 6 * R;     // optionnel, limite le zoom out

controls.enableDamping = true;
controls.dampingFactor = 0.4;
controls.enableZoom = true;
controls.enablePan = true;

  // Tooltip picking (click net only)
  setupHexTooltipPicking({ renderer, camera, canvasContainer });

  // Rotation toggle
  let autoRotate = document.getElementById('toggleRotation').checked;
  document.getElementById('toggleRotation').addEventListener('change', (e) => {
    autoRotate = e.target.checked;
  });

  // Resize observer
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height, true);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  });
  resizeObserver.observe(canvasContainer);

  // Load hex overlay
  fetch('./data/hex_forcing_merged.geojson')
    .then((res) => res.json())
    .then((geojson) => {
      const hexGroup = new THREE.Group();
      hexMeshes = [];

      geojson.features.forEach((feat) => {
        const eff = feat.properties?.eff;
        if (eff === null || isNaN(eff)) return;

        const coords = feat.geometry.coordinates[0];
        const hexColor = getColorFromValue(eff);

        const positions = [];
        const colors = [];

        coords.forEach(([lon, lat]) => {
          const phi = (90 - lat) * Math.PI / 180;
          const theta = (-lon) * Math.PI / 180;

          positions.push(
            (R + HEX_OFFSET) * Math.sin(phi) * Math.cos(theta),
            (R + HEX_OFFSET) * Math.cos(phi),
            (R + HEX_OFFSET) * Math.sin(phi) * Math.sin(theta)
          );

          const col = new THREE.Color(hexColor);
          colors.push(col.r, col.g, col.b);
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const indices = [];
        for (let i = 1; i < coords.length - 1; i++) indices.push(0, i, i + 1);
        geometry.setIndex(indices);

        const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.visible = false;
        mesh.userData.properties = feat.properties;

        hexMeshes.push(mesh);
        hexGroup.add(mesh);
      });

      hexGroupRef = hexGroup;
      sphere.add(hexGroup);

      // Variables disponibles (numériques)
      const sampleProps = geojson.features?.[0]?.properties || {};
      const availableVars = Object.keys(sampleProps).filter((k) => typeof sampleProps[k] === 'number');

      // Choix activeVar robuste
      const saved = localStorage.getItem('activeVar');
      if (saved && availableVars.includes(saved)) {
        activeVar = saved;
      } else if (availableVars.includes('eff')) {
        activeVar = 'temp';
        localStorage.setItem('activeVar', activeVar);
      } else if (availableVars.length) {
        activeVar = availableVars[0];
        localStorage.setItem('activeVar', activeVar);
      }

      buildLayerButtons(availableVars);
      updateHexColors();
    })
    .catch((err) => console.error('Erreur chargement hex geojson:', err));

  // Animation
  function animate() {
    requestAnimationFrame(animate);

    controls.update();

    if (autoRotate) {
      sphere.rotation.y += 0.001;
      continent.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
  }

  animate();
}

init();

// -----------------------------
// Run model (API call)
// -----------------------------
document.getElementById('runModel').addEventListener('click', async () => {
  const outputEl = document.getElementById('modelOutput');
  const loaderEl = document.getElementById('modelLoader');
  const resultEl = document.getElementById('modelResult');

  const gp = parseFloat(document.getElementById('gasPrice').value);
  const fp = parseFloat(document.getElementById('fuelPrice').value);
  const ep = parseFloat(document.getElementById('elecPrice').value);
  const ei = parseFloat(document.getElementById('elecCIntensity').value);

  const cs = parseFloat(document.getElementById('CCS_cost').value);
  const ce = parseFloat(document.getElementById('CCS_eff').value) / 100;

  // hfoPrice: autorisé vide => défaut 620
  const hfRaw = document.getElementById('hfoPrice').value.trim();
  const hf = hfRaw === '' ? 620 : parseFloat(hfRaw);

  const ps = document.getElementById('precip_surface').value;
  const country = document.getElementById('country').value;

  const missing = [];
  if (isNaN(gp)) missing.push('Gas Price');
  if (isNaN(fp)) missing.push('Fuel Price');
  if (isNaN(ep)) missing.push('Electricity Price');
  if (isNaN(ei)) missing.push('Electricity Carbon Intensity');
  if (isNaN(cs)) missing.push('CCS Cost');
  if (isNaN(ce)) missing.push('CCS Efficiency');
  if (hfRaw !== '' && isNaN(hf)) missing.push('HFO Price');
  if (!ps) missing.push('Reactive Precipitation Area');
  if (!country) missing.push('Country');

  if (missing.length) {
    outputEl.classList.remove('hidden');
    loaderEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `<span class="text-red-400">Please add ${missing.join(', ')}</span>`;
    return;
  }

  const params = {
    gasPrice: gp,
    fuelPrice: fp,
    elecPrice: ep,
    elecCIntensity: ei,
    CCS_cost: cs,
    CCS_eff: ce,
    hfoPrice: hf,
    precip_surface: ps,
    country,
  };

  // Show loader
  outputEl.classList.remove('hidden');
  loaderEl.classList.remove('hidden');
  resultEl.classList.add('hidden');
  loaderEl.querySelector('span').textContent = 'Model is running…';

  try {
    // Local
    // const res = await fetch('http://127.0.0.1:8000/api/run-model', {

    // Render
    const res = await fetch('https://oae-dashboard-backend.onrender.com/api/run-model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.status === 422) {
      const err = await res.json();
      throw new Error(err.detail.map((e) => `${e.loc[1]}: ${e.msg}`).join('\n'));
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { landCost, landEmission, json_output } = await res.json();

    // Lookup properties by index
    const lookup = {};
    json_output.features.forEach((feat) => {
      lookup[feat.properties.index] = feat.properties;
    });

    // Update mesh userData
    hexMeshes.forEach((mesh) => {
      const idx = mesh.userData.properties.index;
      if (lookup[idx]) mesh.userData.properties = lookup[idx];
    });

    // Available numeric vars
    const sampleProps = json_output.features?.[0]?.properties || {};
    const availableVars = Object.keys(sampleProps).filter((k) => typeof sampleProps[k] === 'number');

    // Restore saved activeVar if possible
    const saved = localStorage.getItem('activeVar');
    if (saved && availableVars.includes(saved)) {
      activeVar = saved;
    } else {
      activeVar = availableVars[0];
      localStorage.setItem('activeVar', activeVar);
    }

    buildLayerButtons(availableVars);
    updateHexColors();

    resultEl.innerHTML = `
      <strong>Result:</strong><br>
      <span class="text-green-300">Land Emission: ${Number(landEmission).toFixed(2)} tCO₂/tCa(OH)₂</span><br>
      <span class="text-green-300">Land Cost: $${Number(landCost).toFixed(2)} /tCa(OH)₂</span><br>
    `;
  } catch (err) {
    resultEl.innerHTML = `<span class="text-red-400">Erreur : ${err.message}</span>`;
  } finally {
    loaderEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
  }
});
