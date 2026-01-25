import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js?module';


let colorScaleMin = 0.46;
let colorScaleMax = 0.88;

let currentColormap = 'viridis';
let colormapReversed = false;


const units = {
    eff:   '(%)',
    salt:  '(psu)',
    temp:  '(°C)',
    alk:   '(umol/kg)',
    dic:   '(umol/kg)',
    net_removal:    '(tCO2/tCa(OH)2)',
    net_cost:       '($/tCO2)',
    Days_at_Sea:    '(days)',
    ocean_emis:     '(tCO2/tCa(OH)2)',
    ocean_cost:     '($/tCa(OH)2)',
    chem_eff:       '(molCO2/molAlk)',
    tot_eff_A001:   '(tCO2/tCa(OH)2)',
    tot_eff_A01:    '(tCO2/tCa(OH)2)',
    tot_eff_A1:     '(tCO2/tCa(OH)2)',
    tot_eff_A10:    '(tCO2/tCa(OH)2)',
    pr_eff_A001:    '(%)',
    pr_eff_A01:     '(%)',
    pr_eff_A1:      '(%)',
    pr_eff_A10:     '(%)',
  };

const cmapInterpolators = {
   viridis: t => chroma.scale('viridis')(t).hex(),
   inferno: t => d3.interpolateInferno(t),
   plasma:  t => d3.interpolatePlasma(t),
   magma:   t => d3.interpolateMagma(t),
   cividis: t => d3.interpolateCividis(t)
 };

document.getElementById('colormapSelect').addEventListener('change', e => {
  currentColormap = e.target.value;
  console.log('Colormap sélectionnée :', currentColormap);
  updateHexColors();
})

// Simple color mapping
function getColorFromValue(v) {
  if (v == null || isNaN(v)) return null;
  let t = THREE.MathUtils.clamp((v - colorScaleMin) / (colorScaleMax - colorScaleMin), 0, 1);
  if (colormapReversed) t = 1 - t;
  const hexString = cmapInterpolators[currentColormap](t);
  return new THREE.Color(hexString);
}

let hexMeshes = [];
const savedVar = localStorage.getItem('activeVar');
let activeVar = savedVar !== null ? savedVar : null;

  function updateHexColors() {
  if (!activeVar) return;

  // 1) calcul des min/max
  const values = hexMeshes
    .map(m => m.userData.properties[activeVar])
    .filter(v => v != null && !isNaN(v));
  colorScaleMin = Math.min(...values);
  colorScaleMax = Math.max(...values);

  // 2) mise à jour du texte
  document.getElementById('scaleMin').textContent = colorScaleMin.toFixed(2);
  document.getElementById('scaleMax').textContent = colorScaleMax.toFixed(2);
  document.getElementById('unitLabel').textContent = units[activeVar] || '';

  // 3) génération de la colorbar avec la colormap sélectionnée
  const bar   = document.getElementById('scaleBar');
  const steps = 10;
  let colors = Array.from({ length: steps }, (_, i) =>
  cmapInterpolators[currentColormap]( i / (steps - 1) )
);

if (colormapReversed) {
  colors.reverse();
}
  const gradient = colors
     .map((c, i) => `${c} ${(i/(steps-1))*100}%`)
     .join(', ');
  bar.style.background = `linear-gradient(to right, ${gradient})`;

  // 4) recoloration des hexagones
  hexMeshes.forEach(mesh => {
    const v = mesh.userData.properties[activeVar];
    if (v == null || isNaN(v)) {
      mesh.visible = false;
    } else {
      mesh.visible = true;
      const newCol = getColorFromValue(v);
      const attr = mesh.geometry.attributes.color;
      for (let i = 0; i < attr.count; i++) {
        attr.setXYZ(i, newCol.r, newCol.g, newCol.b);
      }
      attr.needsUpdate = true;
    }
  });
}

function buildLayerButtons(variables) {
    const labels = {
    eff:   'Efficiency',
    salt:  'Salinity',
    temp:  'Temperature',
    alk:   'Alkalinity',
    dic:   'DIC',
    net_removal:       'Net Removal',
    net_cost:          'CDR Cost',
    ocean_emis:       'Ocean Emissions',
    ocean_cost:        'Ocean Cost',
    chem_eff:          'Chemical Efficiency',
    tot_eff_A001:      'CO₂ Removal',
    tot_eff_A01:       'CO₂ Removal',
    tot_eff_A1:        'CO₂ Removal',
    tot_eff_A10:       'CO₂ Removal',
    pr_eff_A001:      'Secondary Precipitation',
    pr_eff_A01:       'Secondary Precipitation',
    pr_eff_A1:        'Secondary Precipitation',
    pr_eff_A10:       'Secondary Precipitation',
  };

  const container = document.getElementById('layer-controls');
  container.innerHTML = '';
  variables.forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = labels[name] || name;

    const base   = 'px-2 py-1 rounded text-sm';
    const active = 'bg-blue-600 text-white';
    const inactive = 'bg-gray-800 hover:bg-gray-700 text-gray-200';
    btn.className = `${base} ${ name === activeVar ? active : inactive }`;

    btn.addEventListener('click', () => {
      activeVar = name;
      localStorage.setItem('activeVar', activeVar);
      updateHexColors();

      // on rerend toutes les classes en fonction du nouvel activeVar
      container.querySelectorAll('button').forEach(b => {
        const isActive = b.textContent === btn.textContent;
        b.className = `${base} ${ isActive ? active : inactive }`;
      });
    });
    container.appendChild(btn);
  });
  }

// ————————————————————————————————————————————————————————————————————————————————


async function init() {
  // Load textures and shaders
  const vertexShader = await fetch('./shaders/vertex.glsl').then(res => res.text());
  const fragmentShader = await fetch('./shaders/fragment.glsl').then(res => res.text());
  const atmosphereVertexShader = await fetch('./shaders/atmosphere_vertex.glsl').then(res => res.text());
  const atmosphereFragmentShader = await fetch('./shaders/atmosphere_fragment.glsl').then(res => res.text());
  const globeTexture = new THREE.TextureLoader().load('./data/uv_map.webp');
  const landMask = new THREE.TextureLoader().load('./data/land_mask.webp');

  const HEX_OFFSET = 0.003;
  const R = 5;
  const a = 200;

  // Initialize scene, camera, and renderer
  const scene = new THREE.Scene();
  
  const canvasContainer = document.querySelector('#canvas-container');
  const camera = new THREE.PerspectiveCamera(
      75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000
    );

  camera.position.z = 2*R;

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    canvas: document.querySelector('canvas')});
  
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Create globe
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(R, a, a),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: globeTexture }
      }
    })
  );

  scene.add(sphere);

  const mat = new THREE.MeshBasicMaterial({
  map: globeTexture,
  alphaMap: landMask,
  transparent: true,
  alphaTest: 0.5,
  depthWrite:  false,
  });
  const continent = new THREE.Mesh(
  new THREE.SphereGeometry(R+2*HEX_OFFSET, a, a), mat)

  scene.add(continent);

  // Create Atmosphere
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(R, a, a),
    new THREE.ShaderMaterial({
      vertexShader : atmosphereVertexShader,
      fragmentShader : atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
  );

  atmosphere.scale.set(1.05, 1.05, 1.05);

  scene.add(atmosphere);

  // Create stars
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

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
    }

  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, sizeAttenuation: true, map: createStarTexture(),
    transparent: true, depthWrite: false, size: 1.5});


  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  const stars = new THREE.Points(starGeometry, starMaterial);

  scene.add(stars);

  // Add Hexagons

  // Load and render hexagon overlay on globe surface
  fetch('./data/hex_forcing_merged.geojson')
    .then(res => res.json())
    .then(geojson => {
      const hexGroup = new THREE.Group();

      geojson.features.forEach(feat => {
        const eff = feat.properties.eff;
        // Skip hexagons without data
        if (eff === null || isNaN(eff)) return;

        const coords = feat.geometry.coordinates[0];
        const hexColor = getColorFromValue(eff);
        const positions = [];
        const colors = [];
        coords.forEach(([lon, lat]) => {
          const phi = (90 - lat) * Math.PI / 180;
          const theta = (-lon) * Math.PI / 180;
          // Position slightly above the globe surface
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
        const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;

        mesh.userData.properties = feat.properties;
        hexMeshes.push(mesh);

        hexGroup.add(mesh);
      });
      // Attach hexagons to globe so they rotate together
      sphere.add(hexGroup);
      updateHexColors();
      
    }); 

// Récupère le conteneur
const layerControlsContainer = document.getElementById('layer-controls');

  // Create mouse controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.4;
  controls.enableZoom = true;
  controls.enablePan = true;

  // Rotation toggle
  let autoRotate = document.getElementById('toggleRotation').checked;

  document.getElementById('toggleRotation').addEventListener('change', (e) => {
    autoRotate = e.target.checked;
  });

  // Handle window resize
  const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    const { width, height } = entry.contentRect;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, true); 
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
});

resizeObserver.observe(canvasContainer)

  function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (autoRotate) sphere.rotation.y += 0.001;
  if (autoRotate) continent.rotation.y += 0.001;
  renderer.render(scene, camera);
}

  animate()

}

let pricePresets = {};
// charge les presets dès que possible
fetch('./data/country_presets.json')
  .then(res => res.json())
  .then(json => { pricePresets = json; })
  .catch(err => console.error('Impossible de charger price_presets:', err));

init();

// dés que le <select id="country"> change, on applique le preset
document.getElementById('country').addEventListener('change', (e) => {
  const code = e.target.value;
  const preset = pricePresets[code];

  if (code === 'CUSTOM') {
    // vide les inputs pour que les placeholders réapparaissent
    document.getElementById('gasPrice').value  = '';
    document.getElementById('fuelPrice').value = '';
    document.getElementById('elecPrice').value  = '';
    document.getElementById('elecCIntensity').value = '';
  }
  else if (preset) {
    document.getElementById('gasPrice').value  = preset.gasPrice;
    document.getElementById('fuelPrice').value = preset.fuelPrice;
    document.getElementById('elecPrice').value  = preset.elecPrice;
    document.getElementById('elecCIntensity').value = preset.elecCIntensity;
  }
});


document.getElementById('runModel').addEventListener('click', async () => {
   const outputEl = document.getElementById('modelOutput');
   const loaderEl = document.getElementById('modelLoader');
   const resultEl = document.getElementById('modelResult');

   // 1) Validation des champs
   const gp = parseFloat(document.getElementById('gasPrice').value);
   const fp = parseFloat(document.getElementById('fuelPrice').value);
   const ep = parseFloat(document.getElementById('elecPrice').value);
   const ei = parseFloat(document.getElementById('elecCIntensity').value);

   const cs = parseFloat(document.getElementById('CCS_cost').value);
   const ce = parseFloat(document.getElementById('CCS_eff').value)/ 100;

   const hfRaw = document.getElementById('hfoPrice').value.trim();
   const hf = hfRaw === "" ? 620 : parseFloat(hfRaw);

   const ps = document.getElementById('precip_surface').value;

   const country = document.getElementById('country').value;

   const missing = [];

  if (isNaN(gp)) missing.push('Gas Price');
  if (isNaN(fp)) missing.push('Fuel Price');
  if (isNaN(ep)) missing.push('Electricity Price');
  if (isNaN(ei)) missing.push('Electricity Carbon Intensity');
  if (isNaN(cs)) missing.push('CCS Cost');
  if (isNaN(ce)) missing.push('CCS Efficiency');

  // hfoPrice : autoriser vide, mais refuser non-numérique si rempli
  if (hfRaw !== "" && isNaN(hf)) missing.push('HFO Price');

  if (!ps) missing.push('Reactive Precipitation Area');
  if (!country) missing.push('Country');

  if (missing.length) {
    outputEl.classList.remove('hidden');
    loaderEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `<span class="text-red-400">Please add ${missing.join(', ')}</span>`;
    return;
  }

   const params = {gasPrice: gp, fuelPrice: fp, elecPrice: ep, elecCIntensity: ei,
                   CCS_cost: cs, CCS_eff: ce,
                   hfoPrice: hf, precip_surface: ps, country: country };

   // 2) Affichage du loader
   outputEl.classList.remove('hidden');
   loaderEl.classList.remove('hidden');
   resultEl.classList.add('hidden');
   loaderEl.querySelector('span').textContent = 'Model is running…';

   try {
     // 3) Appel API
     //const res = await fetch('http://127.0.0.1:8000/api/run-model', {
     const res = await fetch('https://oae-dashboard-backend.onrender.com/api/run-model', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(params),
     });

     if (res.status === 422) {
       const err = await res.json();
       throw new Error(err.detail.map(e => `${e.loc[1]}: ${e.msg}`).join('\n'));
     }
     if (!res.ok) throw new Error(`HTTP ${res.status}`);

     // 4) Lecture du JSON {result and metadata}
     const {landCost, landEmission, metadata, json_output} = await res.json();

     // 5.1) Création d’un lookup par index
     const lookup = {};
     json_output.features.forEach(feat => {
       lookup[feat.properties.index] = feat.properties;
     });

    // 5.2) Réécriture de userData pour chaque mesh
    hexMeshes.forEach(mesh => {
      const idx = mesh.userData.properties.index;
      if (lookup[idx]) {
        mesh.userData.properties = lookup[idx];
      }
    });

    // 5.3) Extraction des noms de variables numériques disponibles
    const sampleProps = json_output.features[0].properties;
    const availableVars = Object
      .keys(sampleProps)
      .filter(k => typeof sampleProps[k] === 'number');

    // 5.4) restaure la couche sauvegardée si elle existe, sinon prend la première du nouveau jeu
     const saved = localStorage.getItem('activeVar');
     if (saved && availableVars.includes(saved)) {
       activeVar = saved;
     } else {
       activeVar = availableVars[0];
       localStorage.setItem('activeVar', activeVar);
     }
     buildLayerButtons(availableVars);

    // 5.5) Recoloration initiale des hexagones
    updateHexColors();

     // 6) Affichage du cout et des émissions sur terre
     resultEl.innerHTML = `
       <strong>Result:</strong><br>
       <span class="text-green-300">Land Emission: ${landEmission.toFixed(2)} tCO2/tCa(OH)2</span><br>
       <span class="text-green-300">Land Cost: ${landCost.toFixed(2)} $/tCa(OH)2</span><br>
     `;
   } catch (err) {
     resultEl.innerHTML = `<span class="text-red-400">Erreur : ${err.message}</span>`;
   } finally {
     // 6) On masque le loader quoi qu'il arrive
     loaderEl.classList.add('hidden');
     resultEl.classList.remove('hidden');
   }
});

document.getElementById('reverseColormapBtn').addEventListener('click', () => {
  colormapReversed = !colormapReversed;
  updateHexColors();
});
