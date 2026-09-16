/**
 * app.js — 3D Molecular Explorer
 * Three.js r128 (loaded via CDN script tag)
 * Dependencies: molecules.js (loaded first), three.min.js
 */

// ─── OrbitControls (inline, from r128) ──────────────────────
// We use the CDN three.min.js which doesn't include addons,
// so a minimal OrbitControls implementation is bundled here.

(function () {
  /* ───────────────────────────────────────────────────────── */
  /* Minimal OrbitControls compatible with Three.js r128       */
  /* ───────────────────────────────────────────────────────── */
  THREE.OrbitControls = function (camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.enableDamping = true;
    this.dampingFactor = 0.08;
    this.enableZoom = true;
    this.enablePan = true;
    this.autoRotate = false;
    this.autoRotateSpeed = 1.0;

    // Internal state
    const scope = this;
    const spherical = new THREE.Spherical();
    const sphericalDelta = new THREE.Spherical();
    const panOffset = new THREE.Vector3();
    const target = new THREE.Vector3();
    let zoomChanged = false;
    let scale = 1;
    let state = -1; // STATE
    const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2 };
    const EPS = 0.000001;
    const rotateStart = new THREE.Vector2();
    const rotateEnd = new THREE.Vector2();
    const rotateDelta = new THREE.Vector2();
    const panStart = new THREE.Vector2();
    const panEnd = new THREE.Vector2();
    const panDelta = new THREE.Vector2();
    const dollyStart = new THREE.Vector2();
    const dollyEnd = new THREE.Vector2();
    const dollyDelta = new THREE.Vector2();

    // Compute initial spherical from camera position
    const offset = new THREE.Vector3();
    const quat = new THREE.Quaternion().setFromUnitVectors(camera.up, new THREE.Vector3(0, 1, 0));
    const quatInverse = quat.clone().invert();
    offset.copy(camera.position).sub(target);
    offset.applyQuaternion(quat);
    spherical.setFromVector3(offset);

    function getZoomScale() { return Math.pow(0.95, 1); }
    function rotateLeft(angle) { sphericalDelta.theta -= angle; }
    function rotateUp(angle) { sphericalDelta.phi -= angle; }

    function dollyIn(scale) { scope._scale *= scale; }
    function dollyOut(scale) { scope._scale /= scale; }
    scope._scale = 1;

    const panLeftV = new THREE.Vector3();
    function panLeft(distance, objectMatrix) {
      panLeftV.setFromMatrixColumn(objectMatrix, 0);
      panLeftV.multiplyScalar(-distance);
      panOffset.add(panLeftV);
    }
    const panUpV = new THREE.Vector3();
    function panUp(distance, objectMatrix) {
      panUpV.setFromMatrixColumn(objectMatrix, 1);
      panUpV.multiplyScalar(distance);
      panOffset.add(panUpV);
    }
    function pan(deltaX, deltaY) {
      const el = scope.domElement;
      const position = scope.camera.position;
      offset.copy(position).sub(target);
      let targetDistance = offset.length();
      targetDistance *= Math.tan((scope.camera.fov / 2) * Math.PI / 180);
      panLeft(2 * deltaX * targetDistance / el.clientHeight, scope.camera.matrix);
      panUp(2 * deltaY * targetDistance / el.clientHeight, scope.camera.matrix);
    }

    this.update = function () {
      if (scope.autoRotate) {
        rotateLeft((2 * Math.PI / 60 / 60) * scope.autoRotateSpeed * 60);
      }
      const position = scope.camera.position;
      offset.copy(position).sub(target);
      offset.applyQuaternion(quat);
      spherical.setFromVector3(offset);
      if (scope.enableDamping) {
        spherical.theta += sphericalDelta.theta * scope.dampingFactor;
        spherical.phi   += sphericalDelta.phi   * scope.dampingFactor;
      } else {
        spherical.theta += sphericalDelta.theta;
        spherical.phi   += sphericalDelta.phi;
      }
      spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, spherical.phi));
      spherical.radius *= scope._scale;
      spherical.radius = Math.max(0.5, Math.min(50, spherical.radius));
      target.add(panOffset);
      offset.setFromSpherical(spherical);
      offset.applyQuaternion(quatInverse);
      position.copy(target).add(offset);
      scope.camera.lookAt(target);
      if (scope.enableDamping) {
        sphericalDelta.theta *= (1 - scope.dampingFactor);
        sphericalDelta.phi   *= (1 - scope.dampingFactor);
        panOffset.multiplyScalar(1 - scope.dampingFactor);
      } else {
        sphericalDelta.set(0, 0, 0);
        panOffset.set(0, 0, 0);
      }
      scope._scale = 1;
    };

    this.reset = function () {
      sphericalDelta.set(0, 0, 0);
      panOffset.set(0, 0, 0);
      scope._scale = 1;
      target.set(0, 0, 0);
      camera.position.set(0, 0, 5);
      camera.lookAt(target);
    };

    this.zoomIn  = function (s) { scope._scale *= (s || 0.85); };
    this.zoomOut = function (s) { scope._scale /= (s || 0.85); };

    // ── Mouse Events ──────────────────────────────────────
    function onMouseDown(e) {
      e.preventDefault();
      if (e.button === 0) {
        state = STATE.ROTATE;
        rotateStart.set(e.clientX, e.clientY);
      } else if (e.button === 2) {
        state = STATE.PAN;
        panStart.set(e.clientX, e.clientY);
      }
    }
    function onMouseMove(e) {
      if (state === STATE.ROTATE) {
        rotateEnd.set(e.clientX, e.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(0.005);
        const el = scope.domElement;
        rotateLeft(2 * Math.PI * rotateDelta.x / el.clientHeight);
        rotateUp(2 * Math.PI * rotateDelta.y / el.clientHeight);
        rotateStart.copy(rotateEnd);
      } else if (state === STATE.PAN) {
        panEnd.set(e.clientX, e.clientY);
        panDelta.subVectors(panEnd, panStart).multiplyScalar(0.002);
        pan(panDelta.x, panDelta.y);
        panStart.copy(panEnd);
      }
    }
    function onMouseUp() { state = STATE.NONE; }
    function onWheel(e) {
      e.preventDefault();
      if (e.deltaY < 0) scope.zoomIn();
      else scope.zoomOut();
    }
    function onContextMenu(e) { e.preventDefault(); }
    function onDblClick() { scope.reset(); }

    domElement.addEventListener('contextmenu', onContextMenu, false);
    domElement.addEventListener('mousedown', onMouseDown, false);
    domElement.addEventListener('dblclick', onDblClick, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // ── Touch Events ───────────────────────────────────────
    let touches = [];
    let prevTouchDist = 0;
    function onTouchStart(e) {
      touches = Array.from(e.touches);
      if (touches.length === 1) {
        state = STATE.ROTATE;
        rotateStart.set(touches[0].clientX, touches[0].clientY);
      } else if (touches.length === 2) {
        state = STATE.DOLLY;
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        prevTouchDist = Math.sqrt(dx*dx + dy*dy);
      }
    }
    function onTouchMove(e) {
      e.preventDefault();
      const t = Array.from(e.touches);
      if (state === STATE.ROTATE && t.length === 1) {
        rotateEnd.set(t[0].clientX, t[0].clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(0.005);
        const el = scope.domElement;
        rotateLeft(2 * Math.PI * rotateDelta.x / el.clientHeight);
        rotateUp(2 * Math.PI * rotateDelta.y / el.clientHeight);
        rotateStart.copy(rotateEnd);
      } else if (state === STATE.DOLLY && t.length === 2) {
        const dx = t[0].clientX - t[1].clientX;
        const dy = t[0].clientY - t[1].clientY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > prevTouchDist) scope.zoomIn(0.95);
        else scope.zoomOut(0.95);
        prevTouchDist = dist;
      }
    }
    function onTouchEnd() { state = STATE.NONE; }
    domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    domElement.addEventListener('touchend', onTouchEnd, false);
  };
})();


/* ============================================================
   MAIN APPLICATION
   ============================================================ */
(function () {
  'use strict';

  // ── DOM References ───────────────────────────────────────
  const canvas         = document.getElementById('moleculeCanvas');
  const wrapper        = document.getElementById('canvasWrapper');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const searchInput    = document.getElementById('searchInput');
  const searchClear    = document.getElementById('searchClear');
  const searchSuggs    = document.getElementById('searchSuggestions');
  const categoryTabs   = document.getElementById('categoryTabs');
  const moleculeGrid   = document.getElementById('moleculeGrid');
  const displayMode    = document.getElementById('displayMode');
  const autoRotateEl   = document.getElementById('autoRotate');
  const showLabelsEl   = document.getElementById('showLabels');
  const showBondsEl    = document.getElementById('showBonds');
  const atomScaleEl    = document.getElementById('atomScale');
  const atomScaleVal   = document.getElementById('atomScaleValue');
  const rotateSpeedEl  = document.getElementById('rotateSpeed');
  const rotateSpeedVal = document.getElementById('rotateSpeedValue');
  const bgColorPicker  = document.getElementById('bgColorPicker');
  const infoFormula    = document.getElementById('infoFormula');
  const infoName       = document.getElementById('infoName');
  const infoAtoms      = document.getElementById('infoAtoms');
  const infoMw         = document.getElementById('infoMw');
  const infoCategory   = document.getElementById('infoCategory');
  const atomLegend     = document.getElementById('atomLegend');
  const descTitle      = document.getElementById('descTitle');
  const descText       = document.getElementById('descText');
  const propBoilingVal = document.getElementById('propBoilingVal');
  const propMeltingVal = document.getElementById('propMeltingVal');
  const propShapeVal   = document.getElementById('propShapeVal');
  const propPolarityVal= document.getElementById('propPolarityVal');
  const zoomInBtn      = document.getElementById('zoomIn');
  const zoomOutBtn     = document.getElementById('zoomOut');
  const zoomResetBtn   = document.getElementById('zoomReset');
  const screenshotBtn  = document.getElementById('screenshotBtn');
  const fullscreenBtn  = document.getElementById('fullscreenBtn');
  const toast          = document.getElementById('toast');
  const bgParticles    = document.getElementById('bgParticles');

  // ── State ────────────────────────────────────────────────
  let currentMol   = 'H2O';
  let currentCat   = 'all';
  let currentMode  = 'ball-stick';
  let atomScaleFactor = 1.0;
  let bgColor      = '#0a0a1a';

  // ── Three.js Setup ───────────────────────────────────────
  const scene    = new THREE.Scene();
  scene.background = new THREE.Color(bgColor);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // ── Lighting ──────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0x8888ff, 0.4);
  dirLight2.position.set(-5, -3, -5);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0x818cf8, 0.6, 30);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  // ── Molecule Group ────────────────────────────────────────
  const molGroup = new THREE.Group();
  scene.add(molGroup);

  // ── Resize Handler ────────────────────────────────────────
  function resize() {
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(wrapper);
  resize();

  // ── Texture Cache ─────────────────────────────────────────
  const labelCache = {};

  function createLabelSprite(symbol, color) {
    const key = symbol + '_' + color;
    if (labelCache[key]) return labelCache[key].clone();

    const size = 256;
    const cv   = document.createElement('canvas');
    cv.width = cv.height = size;
    const ctx = cv.getContext('2d');

    // Glow
    const hex = '#' + ('000000' + color.toString(16)).slice(-6);
    ctx.shadowColor  = hex;
    ctx.shadowBlur   = 30;
    for (let i = 0; i < 3; i++) {
      ctx.font         = `bold 110px 'Inter', sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = '#ffffff';
      ctx.fillText(symbol, size / 2, size / 2);
    }

    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sp  = new THREE.Sprite(mat);
    sp.scale.set(1.2, 1.2, 1);
    labelCache[key] = sp;
    return sp.clone();
  }

  // ── Bond Geometry Builder ─────────────────────────────────
  const sharedCylMat = new THREE.MeshStandardMaterial({
    color: 0xaab0c8,
    roughness: 0.35,
    metalness: 0.1,
  });

  function buildBond(start, end) {
    const dir  = new THREE.Vector3().subVectors(end, start);
    const len  = dir.length();
    const geo  = new THREE.CylinderGeometry(0.09, 0.09, len, 12, 1);
    const mesh = new THREE.Mesh(geo, sharedCylMat);
    const mid  = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return mesh;
  }

  // ── Build Molecule Scene ──────────────────────────────────
  function buildMolecule(key) {
    const data = window.MOLECULES[key];
    if (!data) { showToast('지원하지 않는 분자식입니다.', 'error'); return; }

    // Show loading briefly
    loadingOverlay.classList.remove('hidden');

    setTimeout(() => {
      // Clear previous
      while (molGroup.children.length > 0) {
        const c = molGroup.children[0];
        if (c.geometry) c.geometry.dispose();
        if (c.material && c.material.map) c.material.map.dispose();
        if (c.material) c.material.dispose();
        molGroup.remove(c);
      }

      const isSpacefill = currentMode === 'spacefill';
      const isStick     = currentMode === 'stick';
      const meshes      = [];

      // Atoms
      data.atoms.forEach((atom) => {
        const baseRadius = isSpacefill
          ? atom.radius * 1.8
          : isStick
          ? 0.12
          : atom.radius;

        const r = baseRadius * atomScaleFactor;
        const geo = new THREE.SphereGeometry(r, 32, 24);
        const mat = new THREE.MeshStandardMaterial({
          color:     atom.color,
          roughness: 0.25,
          metalness: 0.12,
          envMapIntensity: 0.5,
        });
        // Subtle emissive glow
        mat.emissive = new THREE.Color(atom.color);
        mat.emissiveIntensity = 0.04;

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...atom.pos);
        mesh.castShadow    = true;
        mesh.receiveShadow = true;
        molGroup.add(mesh);
        meshes.push(mesh);

        // Label
        if (showLabelsEl.checked && !isSpacefill) {
          const label = createLabelSprite(atom.symbol, atom.color);
          label.position.set(...atom.pos);
          label.position.z += r + 0.05;
          molGroup.add(label);
        }
      });

      // Bonds
      if (!isSpacefill && showBondsEl.checked) {
        data.bonds.forEach(([i, j]) => {
          const bond = buildBond(meshes[i].position, meshes[j].position);
          molGroup.add(bond);
        });
      }

      // Legend
      buildLegend(data.atoms);

      // Info bar
      updateInfoBar(key, data);

      loadingOverlay.classList.add('hidden');
    }, 120);
  }

  // ── Legend ────────────────────────────────────────────────
  function buildLegend(atoms) {
    const seen = new Map();
    atoms.forEach(a => {
      if (!seen.has(a.symbol)) seen.set(a.symbol, a.color);
    });
    atomLegend.innerHTML = '';
    seen.forEach((color, symbol) => {
      const hex = '#' + ('000000' + color.toString(16)).slice(-6);
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `<span class="legend-dot" style="background:${hex};box-shadow:0 0 6px ${hex}"></span><span>${symbol}</span>`;
      atomLegend.appendChild(item);
    });
  }

  // ── Info Bar & Properties ─────────────────────────────────
  function updateInfoBar(key, data) {
    infoFormula.textContent = data.formula;
    infoName.textContent    = data.name;
    infoAtoms.textContent   = `${data.atoms.length} 원자`;
    infoMw.textContent      = `MW: ${data.mw} g/mol`;

    const catMap = { inorganic: '무기물', organic: '유기물', biomolecule: '생체분자' };
    infoCategory.innerHTML = `<span class="category-badge ${data.category}">${catMap[data.category]}</span>`;

    descTitle.textContent       = `${data.name} (${data.formula})`;
    descText.textContent        = data.description;
    propBoilingVal.textContent  = data.properties.boiling;
    propMeltingVal.textContent  = data.properties.melting;
    propShapeVal.textContent    = data.properties.shape;
    propPolarityVal.textContent = data.properties.polarity;
  }

  // ── Molecule Grid ─────────────────────────────────────────
  function renderGrid(cat, filter) {
    moleculeGrid.innerHTML = '';
    const keys = Object.keys(window.MOLECULES);
    keys.forEach(key => {
      const m = window.MOLECULES[key];
      if (cat !== 'all' && m.category !== cat) return;
      if (filter && !m.name.toLowerCase().includes(filter) &&
          !m.formula.toLowerCase().includes(filter) &&
          !key.toLowerCase().includes(filter)) return;

      const card = document.createElement('div');
      card.className = 'mol-card' + (key === currentMol ? ' active' : '');
      card.dataset.key = key;
      card.innerHTML = `<span class="mol-formula">${m.formula}</span><span class="mol-name">${m.name.split(' ')[0]}</span>`;
      card.addEventListener('click', () => selectMolecule(key));
      moleculeGrid.appendChild(card);
    });
  }

  function selectMolecule(key) {
    currentMol = key;
    document.querySelectorAll('.mol-card').forEach(c => {
      c.classList.toggle('active', c.dataset.key === key);
    });
    buildMolecule(key);
  }

  // ── Search ────────────────────────────────────────────────
  searchInput.addEventListener('input', () => {
    const v = searchInput.value.trim();
    searchClear.classList.toggle('visible', v.length > 0);
    renderSuggestions(v);
    renderGrid(currentCat, v.toLowerCase());
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    searchSuggs.classList.remove('open');
    renderGrid(currentCat, '');
  });

  function renderSuggestions(q) {
    searchSuggs.innerHTML = '';
    if (!q) { searchSuggs.classList.remove('open'); return; }
    const ql = q.toLowerCase();
    const matches = Object.entries(window.MOLECULES).filter(([k, m]) =>
      m.formula.toLowerCase().includes(ql) ||
      m.name.toLowerCase().includes(ql) ||
      k.toLowerCase().includes(ql)
    ).slice(0, 5);

    if (!matches.length) { searchSuggs.classList.remove('open'); return; }
    matches.forEach(([key, m]) => {
      const it = document.createElement('div');
      it.className = 'suggestion-item';
      it.innerHTML = `<span class="sug-formula">${m.formula}</span><span class="sug-name">${m.name}</span>`;
      it.addEventListener('click', () => {
        selectMolecule(key);
        searchInput.value = m.formula;
        searchSuggs.classList.remove('open');
        searchClear.classList.add('visible');
        renderGrid(currentCat, '');
      });
      searchSuggs.appendChild(it);
    });
    searchSuggs.classList.add('open');
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) searchSuggs.classList.remove('open');
  });

  // ── Category Tabs ─────────────────────────────────────────
  categoryTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.cat-tab');
    if (!tab) return;
    currentCat = tab.dataset.cat;
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderGrid(currentCat, searchInput.value.toLowerCase());
  });

  // ── Display Mode ──────────────────────────────────────────
  displayMode.addEventListener('click', (e) => {
    const btn = e.target.closest('.mode-btn');
    if (!btn) return;
    currentMode = btn.dataset.mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildMolecule(currentMol);
  });

  // ── Toggles ───────────────────────────────────────────────
  autoRotateEl.addEventListener('change', () => {
    controls.autoRotate = autoRotateEl.checked;
  });
  showLabelsEl.addEventListener('change', () => buildMolecule(currentMol));
  showBondsEl.addEventListener('change', () => buildMolecule(currentMol));

  // ── Sliders ───────────────────────────────────────────────
  atomScaleEl.addEventListener('input', () => {
    atomScaleFactor = parseFloat(atomScaleEl.value);
    atomScaleVal.textContent = atomScaleFactor.toFixed(1) + '×';
    buildMolecule(currentMol);
  });

  rotateSpeedEl.addEventListener('input', () => {
    const v = parseFloat(rotateSpeedEl.value);
    rotateSpeedVal.textContent = v.toFixed(1) + '×';
    controls.autoRotateSpeed = v;
  });

  // ── Background Color ──────────────────────────────────────
  document.querySelectorAll('.color-preset').forEach(el => {
    el.addEventListener('click', () => {
      setBackground(el.dataset.color);
      document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      bgColorPicker.value = el.dataset.color;
    });
  });
  bgColorPicker.addEventListener('input', () => setBackground(bgColorPicker.value));

  function setBackground(hex) {
    bgColor = hex;
    scene.background = new THREE.Color(hex);
  }

  // Mark first preset active
  document.getElementById('bgPreset1').classList.add('active');

  // ── Zoom Controls ─────────────────────────────────────────
  zoomInBtn.addEventListener('click',    () => controls.zoomIn());
  zoomOutBtn.addEventListener('click',   () => controls.zoomOut());
  zoomResetBtn.addEventListener('click', () => controls.reset());

  // ── Screenshot ────────────────────────────────────────────
  screenshotBtn.addEventListener('click', () => {
    renderer.render(scene, camera); // ensure fresh frame
    const dataURL = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `molecule_${currentMol}_${Date.now()}.png`;
    a.click();
    showToast('📸 스크린샷이 저장되었습니다!', 'success');
  });

  // ── Fullscreen ────────────────────────────────────────────
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });

  // ── Toast ──────────────────────────────────────────────────
  let toastTimer;
  function showToast(msg, type = '') {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.className = 'toast show' + (type ? ' ' + type : '');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ── Background Particles (DOM stars) ──────────────────────
  (function spawnStars() {
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      const sz = Math.random() * 2.5 + 0.5;
      star.style.cssText = `
        position:absolute;
        width:${sz}px; height:${sz}px;
        border-radius:50%;
        background:rgba(200,210,255,${Math.random() * 0.4 + 0.1});
        top:${Math.random() * 100}%;
        left:${Math.random() * 100}%;
        animation: twinkle ${Math.random() * 4 + 2}s ease-in-out infinite alternate;
        animation-delay: ${Math.random() * 4}s;
      `;
      bgParticles.appendChild(star);
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        from { opacity: 0.1; transform: scale(1); }
        to   { opacity: 0.8; transform: scale(1.4); }
      }
    `;
    document.head.appendChild(style);
  })();

  // ── Initial controls state ────────────────────────────────
  controls.autoRotate      = autoRotateEl.checked;
  controls.autoRotateSpeed = parseFloat(rotateSpeedEl.value);

  // ── Render Grid & First Molecule ──────────────────────────
  renderGrid('all', '');
  buildMolecule('H2O');

  // ── Animation Loop ────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // Gentle y-axis sway for point light
    pointLight.position.x = Math.sin(Date.now() * 0.0008) * 4;
    pointLight.position.z = Math.cos(Date.now() * 0.0008) * 4;
    renderer.render(scene, camera);
  }
  animate();

})();
