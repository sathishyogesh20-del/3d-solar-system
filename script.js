/* =========================================================
   COSMOS — 3D Solar System Explorer
   Three.js r128 + OrbitControls
   ========================================================= */

/* ---------------------------------------------------------
   1. DATA — planets, moons, satellites, missions
   (Distances/sizes below are scaled for a legible 3D view,
   not to real astronomical scale. Orbital periods, moon
   counts and mission lists are illustrative reference data —
   swap in a live API if you want it to stay current.)
--------------------------------------------------------- */

const SUN = {
  name: "Sun",
  badge: "STAR",
  radius: 12,
  color: 0xffb020,
  desc: "The star at the centre of the solar system. Its gravity binds every planet, moon and asteroid in this scene into orbit.",
  moons: [],
  satelliteCount: "N/A",
  period: "N/A",
  distance: "0 AU (centre)",
  missions: [
    { agency: "ISRO", name: "Aditya-L1", note: "India's first dedicated solar observatory, studying the Sun's corona from the L1 Lagrange point." },
    { agency: "NASA/ESA", name: "Parker Solar Probe / Solar Orbiter", note: "Flew closer to the Sun than any prior spacecraft to sample the solar wind directly." }
  ]
};

const PLANETS = [
  {
    key: "mercury", name: "Mercury", badge: "PLANET · I",
    radius: 1.6, distance: 30, color: 0x9a9187,
    orbitSpeed: 4.15, rotSpeed: 0.004,
    period: "88 days", distanceReal: "0.39 AU",
    desc: "The smallest and innermost planet. Cratered like our Moon, with wild temperature swings and almost no atmosphere.",
    moons: [], satelliteCount: 0,
    missions: [
      { agency: "NASA", name: "MESSENGER", note: "First spacecraft to orbit Mercury, mapping its surface and magnetic field (2011–2015)." },
      { agency: "ESA/JAXA", name: "BepiColombo", note: "En route to Mercury for a detailed study of its interior and exosphere." }
    ]
  },
  {
    key: "venus", name: "Venus", badge: "PLANET · II",
    radius: 2.4, distance: 44, color: 0xd9b98a,
    orbitSpeed: 1.62, rotSpeed: -0.0009, // retrograde spin
    period: "225 days", distanceReal: "0.72 AU",
    desc: "Earth's near-twin in size, smothered in a thick carbon-dioxide atmosphere that traps enough heat to melt lead. It spins backwards.",
    moons: [], satelliteCount: 0,
    missions: [
      { agency: "NASA", name: "Magellan", note: "Radar-mapped nearly the entire surface of Venus through its opaque clouds." },
      { agency: "ISRO", name: "Shukrayaan-1", note: "Planned Venus orbiter to study its atmosphere and surface geology." }
    ]
  },
  {
    key: "earth", name: "Earth", badge: "PLANET · III",
    radius: 2.6, distance: 60, color: 0x3f7fd9,
    orbitSpeed: 1, rotSpeed: 0.02,
    period: "365 days", distanceReal: "1 AU",
    desc: "Home. The only known world with liquid surface water, a breathable atmosphere, and life — and the busiest orbital neighbourhood in the solar system.",
    moons: [{ name: "Moon", distance: 4.5, size: 0.7, speed: 1.2 }],
    satelliteCount: "9,000+ active",
    satNote: "Rough count of active operational satellites across all operators, not individually simulated here.",
    missions: [
      { agency: "ISRO", name: "Chandrayaan-3", note: "Landed near the lunar south pole in 2023 — launched from Earth orbit." },
      { agency: "ISRO", name: "Aditya-L1 / RISAT / Cartosat", note: "Earth-orbiting and Earth-observation missions supporting weather, mapping and solar research." },
      { agency: "NASA", name: "Apollo 11", note: "First crewed Moon landing, launched from Earth in 1969." }
    ]
  },
  {
    key: "mars", name: "Mars", badge: "PLANET · IV",
    radius: 2.0, distance: 76, color: 0xc1440e,
    orbitSpeed: 0.53, rotSpeed: 0.018,
    period: "687 days", distanceReal: "1.52 AU",
    desc: "The Red Planet. Home to the solar system's tallest volcano and evidence of ancient rivers and lakes — and the most-visited planet after Earth.",
    moons: [
      { name: "Phobos", distance: 3.2, size: 0.28, speed: 2.4 },
      { name: "Deimos", distance: 4.1, size: 0.2, speed: 1.6 }
    ],
    satelliteCount: "8 active orbiters",
    missions: [
      { agency: "ISRO", name: "Mangalyaan (Mars Orbiter Mission)", note: "India's first interplanetary mission — made ISRO the first Asian agency to reach Mars orbit, on its first attempt (2014)." },
      { agency: "NASA", name: "Perseverance & Curiosity", note: "Rovers searching for signs of ancient microbial life and characterising Martian geology." },
      { agency: "NASA", name: "MAVEN", note: "Studies how Mars lost most of its atmosphere over billions of years." }
    ]
  },
  {
    key: "jupiter", name: "Jupiter", badge: "PLANET · V",
    radius: 7.2, distance: 118, color: 0xd8ba8c,
    orbitSpeed: 0.084, rotSpeed: 0.04,
    period: "11.9 years", distanceReal: "5.20 AU",
    desc: "The largest planet — a gas giant with a Great Red Spot storm bigger than Earth, and the most extensive moon system known.",
    moons: [
      { name: "Io", distance: 8, size: 0.55, speed: 1.8 },
      { name: "Europa", distance: 9.5, size: 0.5, speed: 1.4 },
      { name: "Ganymede", distance: 11.5, size: 0.75, speed: 1.0 },
      { name: "Callisto", distance: 13.5, size: 0.7, speed: 0.7 }
    ],
    moonNote: "95 confirmed moons in total — the four largest (Galilean moons) are shown here.",
    satelliteCount: 0,
    missions: [
      { agency: "NASA", name: "Juno", note: "In orbit since 2016, studying Jupiter's composition, gravity and magnetic field." },
      { agency: "NASA/ESA", name: "Galileo & JUICE", note: "Galileo (1995–2003) was the first Jupiter orbiter; JUICE is en route to study its icy moons." }
    ]
  },
  {
    key: "saturn", name: "Saturn", badge: "PLANET · VI",
    radius: 6.2, distance: 158, color: 0xe3c78a,
    orbitSpeed: 0.034, rotSpeed: 0.038,
    period: "29.5 years", distanceReal: "9.58 AU",
    desc: "Famous for its dramatic ring system built from ice and rock. Less dense than water — it would float, in theory.",
    moons: [
      { name: "Titan", distance: 10, size: 0.7, speed: 0.9 },
      { name: "Rhea", distance: 8.5, size: 0.4, speed: 1.1 },
      { name: "Iapetus", distance: 12.5, size: 0.38, speed: 0.6 }
    ],
    moonNote: "146 confirmed moons in total — three notable ones are shown here.",
    hasRing: true,
    satelliteCount: 0,
    missions: [
      { agency: "NASA/ESA/ASI", name: "Cassini–Huygens", note: "Orbited Saturn for 13 years (2004–2017) and landed a probe on Titan — the most distant landing ever achieved." }
    ]
  },
  {
    key: "uranus", name: "Uranus", badge: "PLANET · VII",
    radius: 4.4, distance: 196, color: 0x9fe3e0,
    orbitSpeed: 0.012, rotSpeed: 0.022,
    period: "84 years", distanceReal: "19.2 AU",
    desc: "An ice giant that rotates almost completely on its side, likely the result of an ancient collision.",
    moons: [
      { name: "Titania", distance: 7, size: 0.35, speed: 0.9 },
      { name: "Oberon", distance: 8.5, size: 0.33, speed: 0.7 }
    ],
    moonNote: "28 confirmed moons in total — two are shown here.",
    hasRing: true,
    satelliteCount: 0,
    missions: [
      { agency: "NASA", name: "Voyager 2", note: "The only spacecraft to have visited Uranus, flying past in 1986." }
    ]
  },
  {
    key: "neptune", name: "Neptune", badge: "PLANET · VIII",
    radius: 4.2, distance: 230, color: 0x4361d0,
    orbitSpeed: 0.006, rotSpeed: 0.021,
    period: "165 years", distanceReal: "30.1 AU",
    desc: "The windiest planet, with supersonic storms, and the furthest official planet from the Sun.",
    moons: [{ name: "Triton", distance: 6.5, size: 0.5, speed: -0.8 }],
    moonNote: "16 confirmed moons in total — Triton, its largest, orbits backwards.",
    satelliteCount: 0,
    missions: [
      { agency: "NASA", name: "Voyager 2", note: "The only spacecraft to have visited Neptune, flying past in 1989." }
    ]
  }
];

// A handful of named Near-Earth Objects, tracked in NASA JPL's
// Small-Body Database — the same catalogue ISRO and other space
// agencies feed into through the International Asteroid Warning
// Network (IAWN) for planetary-defence coordination.
const NAMED_ASTEROIDS = [
  { name: "433 Eros", size: 0.9, desc: "One of the first near-Earth asteroids discovered (1898) and the first ever orbited by a spacecraft (NASA's NEAR Shoemaker, 2000).", tracked: "NASA JPL Small-Body Database / IAWN" },
  { name: "101955 Bennu", size: 0.7, desc: "Sampled by NASA's OSIRIS-REx mission, which returned material to Earth in 2023 for study.", tracked: "NASA JPL Small-Body Database / IAWN" },
  { name: "162173 Ryugu", size: 0.7, desc: "Sampled by JAXA's Hayabusa2 mission, which returned material to Earth in 2020.", tracked: "NASA JPL Small-Body Database / IAWN" },
  { name: "4 Vesta", size: 1.1, desc: "One of the largest bodies in the asteroid belt, visited by NASA's Dawn spacecraft.", tracked: "NASA JPL Small-Body Database / IAWN" },
  { name: "1 Ceres", size: 1.3, desc: "The largest object in the asteroid belt, classified as a dwarf planet, also visited by Dawn.", tracked: "NASA JPL Small-Body Database / IAWN" }
];

/* ---------------------------------------------------------
   2. SCENE SETUP
--------------------------------------------------------- */

const root = document.getElementById("scene-root");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(0, 90, 260);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
root.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 20;
controls.maxDistance = 900;
controls.target.set(0, 0, 0);

// Lighting: the Sun itself is the light source
const sunLight = new THREE.PointLight(0xffffff, 2.4, 3000, 1.4);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x404060, 0.6));

// Starfield
(function buildStarfield() {
  const starGeo = new THREE.BufferGeometry();
  const count = 6000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 2200;
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.1, sizeAttenuation: true, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Points(starGeo, starMat));
})();

/* ---------------------------------------------------------
   3. SUN
--------------------------------------------------------- */

const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(SUN.radius, 48, 48),
  new THREE.MeshBasicMaterial({ color: SUN.color })
);
sunMesh.userData = { type: "sun", data: SUN };
scene.add(sunMesh);

// Soft glow shell
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(SUN.radius * 1.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffb020, transparent: true, opacity: 0.15 })
);
sunMesh.add(glow);

/* ---------------------------------------------------------
   4. PLANETS, MOONS, RINGS, ORBIT PATHS
--------------------------------------------------------- */

const clickable = [];      // meshes eligible for raycasting
const labelTargets = [];   // { mesh, text } for DOM label overlay
const orbitLines = [];
const planetObjects = [];  // runtime state per planet

function makeOrbitLine(radius) {
  const segments = 128;
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0x6c7bff, transparent: true, opacity: 0.25 });
  const line = new THREE.LineLoop(geo, mat);
  scene.add(line);
  orbitLines.push(line);
  return line;
}

PLANETS.forEach((p) => {
  const orbitGroup = new THREE.Object3D(); // handles revolution around Sun
  orbitGroup.rotation.y = Math.random() * Math.PI * 2;
  scene.add(orbitGroup);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.radius, 40, 40),
    new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.85, metalness: 0.05 })
  );
  mesh.position.set(p.distance, 0, 0);
  mesh.userData = { type: "planet", data: p };
  orbitGroup.add(mesh);
  clickable.push(mesh);
  labelTargets.push({ mesh, text: p.name });

  if (p.hasRing) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.2, 64),
      new THREE.MeshBasicMaterial({ color: p.color, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
    );
    ring.rotation.x = Math.PI / 2.2;
    mesh.add(ring);
  }

  makeOrbitLine(p.distance);

  // Moons
  const moonMeshes = [];
  (p.moons || []).forEach((m) => {
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(m.size, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xbfbfbf, roughness: 0.9 })
    );
    moonMesh.position.set(m.distance, 0, 0);
    mesh.add(moonMesh);
    moonMeshes.push({ mesh: moonMesh, distance: m.distance, speed: m.speed, angle: Math.random() * Math.PI * 2 });
  });

  planetObjects.push({ orbitGroup, mesh, data: p, moonMeshes, angle: orbitGroup.rotation.y });
});

/* ---------------------------------------------------------
   5. EARTH & MARS SATELLITES (illustrative)
--------------------------------------------------------- */

const SATELLITE_SETS = {
  earth: [
    { name: "INSAT-3D (ISRO)", distance: 4 },
    { name: "Cartosat-3 (ISRO)", distance: 3.4 },
    { name: "Hubble (NASA)", distance: 5.2 }
  ],
  mars: [
    { name: "Mangalyaan (ISRO)", distance: 3.6 },
    { name: "MAVEN (NASA)", distance: 4.4 }
  ]
};

const satelliteRuntime = [];
planetObjects.forEach((po) => {
  const list = SATELLITE_SETS[po.data.key];
  if (!list) return;
  list.forEach((s) => {
    const satMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.22, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x6c7bff, emissive: 0x101840 })
    );
    satMesh.position.set(s.distance, 0, 0);
    satMesh.userData = { type: "satellite", data: { name: s.name, parent: po.data.name } };
    po.mesh.add(satMesh);
    clickable.push(satMesh);
    satelliteRuntime.push({ mesh: satMesh, distance: s.distance, angle: Math.random() * Math.PI * 2, speed: 1.5 + Math.random() });
  });
});

/* ---------------------------------------------------------
   6. ASTEROID BELT (Mars–Jupiter) + named NEOs
--------------------------------------------------------- */

const beltGroup = new THREE.Object3D();
scene.add(beltGroup);

const BELT_INNER = 88, BELT_OUTER = 108;
const beltPositions = [];
const beltCount = 2200;
for (let i = 0; i < beltCount; i++) {
  const r = BELT_INNER + Math.random() * (BELT_OUTER - BELT_INNER);
  const theta = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 2.5;
  beltPositions.push(Math.cos(theta) * r, y, Math.sin(theta) * r);
}
const beltGeo = new THREE.BufferGeometry();
beltGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(beltPositions), 3));
const beltMat = new THREE.PointsMaterial({ color: 0xa7a2a0, size: 0.55, sizeAttenuation: true });
const beltPoints = new THREE.Points(beltGeo, beltMat);
beltGroup.add(beltPoints);

// A few larger, clickable, named asteroids seeded within the belt
const asteroidRuntime = [];
NAMED_ASTEROIDS.forEach((a, i) => {
  const r = BELT_INNER + ((i + 1) / (NAMED_ASTEROIDS.length + 1)) * (BELT_OUTER - BELT_INNER);
  const mesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(a.size, 0),
    new THREE.MeshStandardMaterial({ color: 0xc9beb2, roughness: 1 })
  );
  const angle = Math.random() * Math.PI * 2;
  mesh.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
  mesh.userData = { type: "asteroid", data: a };
  beltGroup.add(mesh);
  clickable.push(mesh);
  labelTargets.push({ mesh, text: a.name });
  asteroidRuntime.push({ mesh, radius: r, angle, speed: 0.15 + Math.random() * 0.1 });
});

/* ---------------------------------------------------------
   7. RAYCASTING / SELECTION
--------------------------------------------------------- */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let focusedMesh = null;

function onPointerClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([sunMesh, ...clickable], false);
  if (hits.length > 0) {
    selectObject(hits[0].object);
  }
}
renderer.domElement.addEventListener("click", onPointerClick);

function selectObject(mesh) {
  focusedMesh = mesh;
  const { type, data } = mesh.userData;

  if (type === "satellite") {
    openPanelForSatellite(data);
  } else {
    openPanelForBody(type, data);
  }

  // Smoothly retarget the orbit controls at the clicked body
  const worldPos = new THREE.Vector3();
  mesh.getWorldPosition(worldPos);
  controls.target.copy(worldPos);
}

function openPanelForBody(type, data) {
  document.getElementById("info-badge").textContent = data.badge || type.toUpperCase();
  document.getElementById("info-name").textContent = data.name;
  document.getElementById("info-desc").textContent = data.desc || "";
  document.getElementById("info-moons").textContent = (data.moons ? data.moons.length : (data.moons === 0 ? 0 : "—"));
  document.getElementById("info-sats").textContent = data.satelliteCount !== undefined ? data.satelliteCount : "—";
  document.getElementById("info-period").textContent = data.period || "—";
  document.getElementById("info-distance").textContent = data.distanceReal || data.distance || "—";

  const moonList = document.getElementById("info-moon-list");
  moonList.innerHTML = "";
  (data.moons || []).forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m.name;
    moonList.appendChild(li);
  });
  if (data.moonNote) {
    const li = document.createElement("li");
    li.textContent = data.moonNote;
    li.style.opacity = 0.6;
    moonList.appendChild(li);
  }
  if (type === "asteroid" && data.tracked) {
    const li = document.createElement("li");
    li.textContent = "Catalogue: " + data.tracked;
    moonList.appendChild(li);
  }

  const missionList = document.getElementById("info-mission-list");
  missionList.innerHTML = "";
  (data.missions || []).forEach((m) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${m.agency}</span>${m.name} — ${m.note}`;
    missionList.appendChild(li);
  });
  if (!data.missions || data.missions.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No crewed or robotic missions on record for this body.";
    missionList.appendChild(li);
  }

  document.getElementById("info-panel").classList.add("open");
}

function openPanelForSatellite(data) {
  document.getElementById("info-badge").textContent = "SATELLITE";
  document.getElementById("info-name").textContent = data.name;
  document.getElementById("info-desc").textContent = `An orbital asset shown here in orbit around ${data.parent}.`;
  document.getElementById("info-moons").textContent = "—";
  document.getElementById("info-sats").textContent = "—";
  document.getElementById("info-period").textContent = "—";
  document.getElementById("info-distance").textContent = `Orbiting ${data.parent}`;
  document.getElementById("info-moon-list").innerHTML = "";
  document.getElementById("info-mission-list").innerHTML = "";
  document.getElementById("info-panel").classList.add("open");
}

document.getElementById("close-panel").addEventListener("click", () => {
  document.getElementById("info-panel").classList.remove("open");
  focusedMesh = null;
});

/* ---------------------------------------------------------
   8. LABELS (DOM overlay, projected each frame)
--------------------------------------------------------- */

const labelLayer = document.createElement("div");
document.body.appendChild(labelLayer);
let labelsEnabled = true;

const labelEls = labelTargets.map((t) => {
  const el = document.createElement("div");
  el.className = "planet-label";
  el.textContent = t.text;
  labelLayer.appendChild(el);
  return el;
});

function updateLabels() {
  if (!labelsEnabled) {
    labelEls.forEach((el) => (el.style.display = "none"));
    return;
  }
  const tmp = new THREE.Vector3();
  labelTargets.forEach((t, i) => {
    t.mesh.getWorldPosition(tmp);
    const projected = tmp.clone().project(camera);
    const behind = projected.z > 1;
    const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
    const el = labelEls[i];
    el.style.display = behind ? "none" : "block";
    el.style.left = x + "px";
    el.style.top = y + "px";
  });
}

/* ---------------------------------------------------------
   9. UI WIRING (rail toggles, picker, speed)
--------------------------------------------------------- */

let orbitSpeedMultiplier = 1;
document.getElementById("speed-slider").addEventListener("input", (e) => {
  orbitSpeedMultiplier = parseFloat(e.target.value);
});

function bindToggle(id, onChange) {
  const btn = document.getElementById(id);
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    onChange(btn.classList.contains("active"));
  });
}
bindToggle("toggle-orbits", (on) => orbitLines.forEach((l) => (l.visible = on)));
bindToggle("toggle-belt", (on) => (beltGroup.visible = on));
bindToggle("toggle-labels", (on) => (labelsEnabled = on));

document.getElementById("reset-view").addEventListener("click", () => {
  camera.position.set(0, 90, 260);
  controls.target.set(0, 0, 0);
  focusedMesh = null;
});

// Bottom quick-picker: Sun + 8 planets
const picker = document.getElementById("planet-picker");
[{ name: "Sun", mesh: sunMesh }, ...planetObjects.map((po) => ({ name: po.data.name, mesh: po.mesh }))].forEach((entry) => {
  const btn = document.createElement("button");
  btn.className = "picker-btn";
  btn.textContent = entry.name;
  btn.addEventListener("click", () => {
    document.querySelectorAll(".picker-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectObject(entry.mesh);
  });
  picker.appendChild(btn);
});

/* ---------------------------------------------------------
   10. FIREBASE AUTH (Google sign-in)
   1. In the Firebase console, create a project, then enable
      Authentication -> Sign-in method -> Google.
   2. Project settings -> General -> "Your apps" -> Web app
      -> copy the config object into firebaseConfig below.
   3. Authentication -> Settings -> Authorized domains ->
      add your GitHub Pages domain (yourusername.github.io)
      so sign-in works once deployed.
--------------------------------------------------------- */

const firebaseConfig = {
apiKey: "AIzaSyBGYJCuZ7gCRTj-o8jSOVSYbXTwWmZPRe4",
  authDomain: "d-solar-system-73df2.firebaseapp.com",
  projectId: "d-solar-system-73df2",
  storageBucket: "d-solar-system-73df2.firebasestorage.app",
  messagingSenderId: "525990700263",
  appId: "1:525990700263:web:010a6cdf1a02688fecee42"
};

let auth = null;
try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
} catch (e) {
  console.warn("Firebase not configured yet — fill in firebaseConfig in script.js.", e);
}

const googleProvider = new firebase.auth.GoogleAuthProvider();
const signInBtn = document.getElementById("google-signin-btn");
const signedInChip = document.getElementById("signed-in-chip");

signInBtn.addEventListener("click", () => {
  if (!auth) {
    alert("Add your Firebase project config in script.js (firebaseConfig) before signing in.");
    return;
  }
  auth.signInWithPopup(googleProvider).catch((err) => {
    console.error(err);
    alert("Sign-in failed: " + err.message);
  });
});

document.getElementById("sign-out-btn").addEventListener("click", () => {
  if (auth) auth.signOut();
});

if (auth) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      signInBtn.classList.add("hidden");
      document.getElementById("user-avatar").src = user.photoURL || "";
      document.getElementById("user-name").textContent = user.displayName || "Explorer";
      signedInChip.classList.remove("hidden");
    } else {
      signedInChip.classList.add("hidden");
      signInBtn.classList.remove("hidden");
    }
  });
}

/* ---------------------------------------------------------
   11. ANIMATION LOOP
--------------------------------------------------------- */

function animate() {
  requestAnimationFrame(animate);

  planetObjects.forEach((po) => {
    po.orbitGroup.rotation.y += 0.004 * po.data.orbitSpeed * orbitSpeedMultiplier;
    po.mesh.rotation.y += po.data.rotSpeed * orbitSpeedMultiplier;
    po.moonMeshes.forEach((m) => {
      m.angle += 0.01 * m.speed * orbitSpeedMultiplier;
      m.mesh.position.set(Math.cos(m.angle) * m.distance, 0, Math.sin(m.angle) * m.distance);
    });
  });

  satelliteRuntime.forEach((s) => {
    s.angle += 0.02 * s.speed * orbitSpeedMultiplier;
    s.mesh.position.set(Math.cos(s.angle) * s.distance, Math.sin(s.angle * 0.5) * 0.6, Math.sin(s.angle) * s.distance);
  });

  asteroidRuntime.forEach((a) => {
    a.angle += 0.002 * a.speed * orbitSpeedMultiplier;
    a.mesh.position.set(Math.cos(a.angle) * a.radius, a.mesh.position.y, Math.sin(a.angle) * a.radius);
    a.mesh.rotation.x += 0.003;
    a.mesh.rotation.y += 0.004;
  });

  sunMesh.rotation.y += 0.0015;

  controls.update();
  updateLabels();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Kick things off
setTimeout(() => {
  document.getElementById("loading-veil").classList.add("hidden");
}, 900);

animate();
