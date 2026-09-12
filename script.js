/* =========================================================
   COSMOS EYES — 3D Solar System & Asteroid Watch
   Three.js r128 + OrbitControls
   Original design/code, inspired by the *idea* of a real-time
   orbital visualizer + near-Earth-object tracker — not a copy
   of any specific app's visuals, layout, or code.
   ========================================================= */

/* ---------------------------------------------------------
   1. DATA — planets, moons, satellites, missions, asteroids
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
    radius: 1.6, trueRadius: 0.13, distance: 30, color: 0x9a9187,
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
    radius: 2.4, trueRadius: 0.332, distance: 44, color: 0xd9b98a,
    orbitSpeed: 1.62, rotSpeed: -0.0009,
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
    radius: 2.6, trueRadius: 0.35, distance: 60, color: 0x3f7fd9,
    orbitSpeed: 1, rotSpeed: 0.02,
    period: "365 days", distanceReal: "1 AU",
    desc: "Home. The only known world with liquid surface water, a breathable atmosphere, and life — and the busiest orbital neighbourhood in the solar system.",
    moons: [{ name: "Moon", distance: 4.5, size: 0.7, speed: 1.2 }],
    satelliteCount: "9,000+ active",
    missions: [
      { agency: "ISRO", name: "Chandrayaan-3", note: "Landed near the lunar south pole in 2023 — launched from Earth orbit." },
      { agency: "ISRO", name: "Aditya-L1 / RISAT / Cartosat", note: "Earth-orbiting and Earth-observation missions supporting weather, mapping and solar research." },
      { agency: "NASA", name: "Apollo 11", note: "First crewed Moon landing, launched from Earth in 1969." }
    ]
  },
  {
    key: "mars", name: "Mars", badge: "PLANET · IV",
    radius: 2.0, trueRadius: 0.186, distance: 76, color: 0xc1440e,
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
    radius: 7.2, trueRadius: 3.92, distance: 118, color: 0xd8ba8c,
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
    radius: 6.2, trueRadius: 3.31, distance: 158, color: 0xe3c78a,
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
    radius: 4.4, trueRadius: 1.40, distance: 196, color: 0x9fe3e0,
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
    radius: 4.2, trueRadius: 1.36, distance: 230, color: 0x4361d0,
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

// Named main-belt asteroids shown as clickable bodies in Solar System mode.
const NAMED_ASTEROIDS = [
  { name: "433 Eros", size: 0.9, desc: "One of the first near-Earth asteroids discovered (1898) and the first ever orbited by a spacecraft (NASA's NEAR Shoemaker, 2000).", tracked: "Public small-body catalog / IAWN" },
  { name: "101955 Bennu", size: 0.7, desc: "Sampled by NASA's OSIRIS-REx mission, which returned material to Earth in 2023 for study.", tracked: "Public small-body catalog / IAWN" },
  { name: "162173 Ryugu", size: 0.7, desc: "Sampled by JAXA's Hayabusa2 mission, which returned material to Earth in 2020.", tracked: "Public small-body catalog / IAWN" },
  { name: "4 Vesta", size: 1.1, desc: "One of the largest bodies in the asteroid belt, visited by the Dawn spacecraft.", tracked: "Public small-body catalog / IAWN" },
  { name: "1 Ceres", size: 1.3, desc: "The largest object in the asteroid belt, classified as a dwarf planet, also visited by Dawn.", tracked: "Public small-body catalog / IAWN" }
];

// Static fallback used only if the live near-Earth-object feed can't be reached
// (offline, rate-limited, or no API key configured yet).
const FALLBACK_APPROACHES = [
  { name: "(sample) 2025 QT1", date: "Sample data", diameterM: 42, velocityKph: 28500, missDistanceLD: 6.2, hazardous: false },
  { name: "(sample) 2025 RF4", date: "Sample data", diameterM: 140, velocityKph: 41200, missDistanceLD: 3.1, hazardous: true },
  { name: "(sample) 2025 SK2", date: "Sample data", diameterM: 18, velocityKph: 19800, missDistanceLD: 12.4, hazardous: false },
  { name: "(sample) 2025 TL9", date: "Sample data", diameterM: 310, velocityKph: 52300, missDistanceLD: 9.7, hazardous: true },
  { name: "(sample) 2025 UB3", date: "Sample data", diameterM: 65, velocityKph: 33100, missDistanceLD: 15.8, hazardous: false }
];

/* ---------------------------------------------------------
   2. SCENE SETUP
--------------------------------------------------------- */

const root = document.getElementById("scene-root");
const scene = new THREE.Scene();
const clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(0, 90, 260);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
root.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 4;
controls.maxDistance = 900;
controls.target.set(0, 0, 0);

const sunLight = new THREE.PointLight(0xffffff, 2.4, 3000, 1.4);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x404060, 0.6));

(function buildStarfield() {
  const starGeo = new THREE.BufferGeometry();
  const count = 6000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 2200;
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.1, sizeAttenuation: true, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Points(starGeo, starMat));
})();

// Everything specific to Solar System mode lives under this group so it
// can be shown/hidden as a whole when switching modes.
const solarSystemGroup = new THREE.Object3D();
scene.add(solarSystemGroup);

// Everything specific to Asteroid Watch mode lives here.
const asteroidWatchGroup = new THREE.Object3D();
asteroidWatchGroup.visible = false;
scene.add(asteroidWatchGroup);

let mode = "solar"; // "solar" | "asteroids"

/* ---------------------------------------------------------
   3. SUN
--------------------------------------------------------- */

const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(SUN.radius, 48, 48),
  new THREE.MeshBasicMaterial({ color: SUN.color })
);
sunMesh.userData = { type: "sun", data: SUN };
solarSystemGroup.add(sunMesh);

const glow = new THREE.Mesh(
  new THREE.SphereGeometry(SUN.radius * 1.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffb020, transparent: true, opacity: 0.15 })
);
sunMesh.add(glow);

/* ---------------------------------------------------------
   4. PLANETS, MOONS, RINGS, ORBIT PATHS
--------------------------------------------------------- */

const clickable = [sunMesh];
const labelTargets = [];
const orbitLines = [];
const planetObjects = [];

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
  solarSystemGroup.add(line);
  orbitLines.push(line);
  return line;
}

PLANETS.forEach((p) => {
  const orbitGroup = new THREE.Object3D();
  orbitGroup.rotation.y = Math.random() * Math.PI * 2;
  solarSystemGroup.add(orbitGroup);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.radius, 40, 40),
    new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.85, metalness: 0.05 })
  );
  mesh.position.set(p.distance, 0, 0);
  mesh.userData = { type: "planet", data: p, baseRadius: p.radius, trueRadius: p.trueRadius };
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
   6. ASTEROID BELT (Mars–Jupiter) + named bodies
--------------------------------------------------------- */

const beltGroup = new THREE.Object3D();
solarSystemGroup.add(beltGroup);

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
   7. ASTEROID WATCH — mini scene + live near-Earth-object feed
--------------------------------------------------------- */

const WATCH_EARTH_RADIUS = 4;
const watchEarth = new THREE.Mesh(
  new THREE.SphereGeometry(WATCH_EARTH_RADIUS, 40, 40),
  new THREE.MeshStandardMaterial({ color: 0x3f7fd9, roughness: 0.8 })
);
watchEarth.userData = { type: "watch-earth" };
asteroidWatchGroup.add(watchEarth);

const watchEarthGlow = new THREE.Mesh(
  new THREE.SphereGeometry(WATCH_EARTH_RADIUS * 1.08, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x6c7bff, transparent: true, opacity: 0.12 })
);
watchEarth.add(watchEarthGlow);

// Simple sunward direction marker so the scene reads as "Earth in space"
const sunwardLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-60, 0, 0), new THREE.Vector3(-8, 0, 0)]),
  new THREE.LineBasicMaterial({ color: 0xffb020, transparent: true, opacity: 0.4 })
);
asteroidWatchGroup.add(sunwardLine);

const neoClickable = [];
const neoArcs = []; // { mesh, data }

function clearNeoScene() {
  neoArcs.forEach((a) => asteroidWatchGroup.remove(a.mesh));
  neoArcs.length = 0;
  neoClickable.length = 0;
}

function distanceUnitsForLD(ld) {
  // Log scale so both very close and very distant approaches stay legible.
  return WATCH_EARTH_RADIUS + 6 + Math.log10(ld + 1) * 7;
}

function buildNeoArc(item, index, total) {
  const angle = (index / total) * Math.PI * 2 + 0.6;
  const closeDist = distanceUnitsForLD(item.missDistanceLD);
  const closePoint = new THREE.Vector3(Math.cos(angle) * closeDist, (Math.random() - 0.5) * 4, Math.sin(angle) * closeDist);
  const farStart = closePoint.clone().multiplyScalar(3.2).add(new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20));
  const farEnd = closePoint.clone().multiplyScalar(3.2).add(new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20));

  const curve = new THREE.QuadraticBezierCurve3(farStart, closePoint, farEnd);
  const points = curve.getPoints(48);
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const color = item.hazardous ? 0xff5a5a : 0x6c7bff;
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
  const line = new THREE.Line(geo, mat);
  asteroidWatchGroup.add(line);

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 12, 12),
    new THREE.MeshBasicMaterial({ color })
  );
  marker.position.copy(closePoint);
  marker.userData = { type: "neo", data: item };
  asteroidWatchGroup.add(marker);
  neoClickable.push(marker);

  neoArcs.push({ mesh: line, marker, data: item });
  return { line, marker };
}

function renderApproachList(items) {
  const list = document.getElementById("approach-list");
  list.innerHTML = "";
  items.forEach((item, i) => {
    const el = document.createElement("div");
    el.className = "approach-item " + (item.hazardous ? "hazard" : "safe");
    el.innerHTML = `
      <div class="name">${item.name}</div>
      <div class="meta">${item.date} · ${item.missDistanceLD.toFixed(1)} LD · ${item.hazardous ? "Potentially hazardous" : "Routine"}</div>
    `;
    el.addEventListener("click", () => {
      selectNeo(item);
    });
    list.appendChild(el);
  });
}

function loadNeoFeed() {
  const statusEl = document.getElementById("approach-status");
  const start = new Date();
  const end = new Date(start.getTime() + 6 * 86400000);
  const fmt = (d) => d.toISOString().slice(0, 10);
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${fmt(start)}&end_date=${fmt(end)}&api_key=DEMO_KEY`;

  fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error("Feed request failed (" + r.status + ")");
      return r.json();
    })
    .then((data) => {
      const all = [];
      Object.keys(data.near_earth_objects || {}).forEach((day) => {
        data.near_earth_objects[day].forEach((obj) => {
          const approach = obj.close_approach_data && obj.close_approach_data[0];
          if (!approach) return;
          all.push({
            name: obj.name,
            date: approach.close_approach_date_full || approach.close_approach_date,
            diameterM: Math.round(((obj.estimated_diameter.meters.estimated_diameter_min || 0) + (obj.estimated_diameter.meters.estimated_diameter_max || 0)) / 2),
            velocityKph: Math.round(parseFloat(approach.relative_velocity.kilometers_per_hour)),
            missDistanceLD: parseFloat(approach.miss_distance.lunar),
            hazardous: !!obj.is_potentially_hazardous_asteroid,
            epoch: approach.epoch_date_close_approach
          });
        });
      });
      all.sort((a, b) => a.epoch - b.epoch);
      const next5 = all.slice(0, 5);
      if (next5.length === 0) throw new Error("Feed returned no upcoming approaches");
      finishNeoLoad(next5, true);
    })
    .catch((err) => {
      console.warn("Live NEO feed unavailable, using sample data:", err.message);
      finishNeoLoad(FALLBACK_APPROACHES, false);
    });

  function finishNeoLoad(items, live) {
    statusEl.textContent = live
      ? "Live feed — next 5 upcoming close approaches"
      : "Sample data — live feed unavailable right now";
    clearNeoScene();
    items.forEach((item, i) => buildNeoArc(item, i, items.length));
    renderApproachList(items);
    SEARCHABLE.push(
      ...items.map((item) => ({
        label: item.name,
        tag: item.hazardous ? "NEO · hazardous" : "NEO",
        select: () => selectNeo(item)
      }))
    );
  }
}

function selectNeo(item) {
  setMode("asteroids");
  const arc = neoArcs.find((a) => a.data === item);
  if (arc) {
    neoArcs.forEach((a) => (a.mesh.material.opacity = a === arc ? 0.95 : 0.25));
    controls.target.copy(arc.marker.position);
  }
  openPanelForNeo(item);
}

/* ---------------------------------------------------------
   8. RAYCASTING / SELECTION
--------------------------------------------------------- */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const targets = mode === "solar" ? clickable : neoClickable;
  const hits = raycaster.intersectObjects(targets, false);
  if (hits.length > 0) selectObject(hits[0].object);
}
renderer.domElement.addEventListener("click", onPointerClick);

function selectObject(mesh) {
  const { type, data } = mesh.userData;
  if (type === "satellite") {
    openPanelForSatellite(data);
  } else if (type === "neo") {
    selectNeo(data);
  } else {
    openPanelForBody(type, data);
  }
  const worldPos = new THREE.Vector3();
  mesh.getWorldPosition(worldPos);
  controls.target.copy(worldPos);
}

function setStat(index, label, value) {
  document.getElementById("stat-label-" + index).textContent = label;
  document.getElementById("info-stat-" + index).textContent = value;
}

function openPanelForBody(type, data) {
  document.getElementById("info-block-moons").classList.remove("hidden");
  document.getElementById("info-block-missions").classList.remove("hidden");
  document.getElementById("info-block-moons-title").textContent = "Moons on record";

  document.getElementById("info-badge").textContent = data.badge || type.toUpperCase();
  document.getElementById("info-name").textContent = data.name;
  document.getElementById("info-desc").textContent = data.desc || "";

  setStat(1, "Moons", data.moons ? data.moons.length : (data.moons === 0 ? 0 : "—"));
  setStat(2, "Tracked satellites", data.satelliteCount !== undefined ? data.satelliteCount : "—");
  setStat(3, "Orbital period", data.period || "—");
  setStat(4, "Distance from Sun", data.distanceReal || data.distance || "—");

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
  document.getElementById("info-block-moons").classList.add("hidden");
  document.getElementById("info-block-missions").classList.add("hidden");
  document.getElementById("info-badge").textContent = "SATELLITE";
  document.getElementById("info-name").textContent = data.name;
  document.getElementById("info-desc").textContent = `An orbital asset shown here in orbit around ${data.parent}.`;
  setStat(1, "Moons", "—");
  setStat(2, "Tracked satellites", "—");
  setStat(3, "Orbital period", "—");
  setStat(4, "Orbiting", data.parent);
  document.getElementById("info-panel").classList.add("open");
}

function openPanelForNeo(item) {
  document.getElementById("info-block-moons").classList.add("hidden");
  document.getElementById("info-block-missions").classList.remove("hidden");
  document.getElementById("info-badge").textContent = item.hazardous ? "NEAR-EARTH OBJECT · FLAGGED" : "NEAR-EARTH OBJECT";
  document.getElementById("info-name").textContent = item.name;
  document.getElementById("info-desc").textContent = item.hazardous
    ? "Larger than the usual monitoring threshold and passing close enough to Earth's orbit to warrant closer tracking. This does not mean an impact is expected."
    : "A routine close approach — the overwhelming majority of tracked near-Earth objects pass by at safe distances like this one.";

  setStat(1, "Estimated diameter", item.diameterM + " m");
  setStat(2, "Relative velocity", Math.round(item.velocityKph).toLocaleString() + " km/h");
  setStat(3, "Miss distance", item.missDistanceLD.toFixed(1) + " lunar distances");
  setStat(4, "Close approach", item.date);

  const missionList = document.getElementById("info-mission-list");
  missionList.innerHTML = "";
  const li = document.createElement("li");
  li.innerHTML = `<span>How it's classified</span>Objects larger than about 140 m that pass within roughly 19.5 lunar distances of Earth's orbit are labelled "potentially hazardous" and tracked more closely — a precaution, not a prediction.`;
  missionList.appendChild(li);
  document.getElementById("info-panel").classList.add("open");
}

document.getElementById("close-panel").addEventListener("click", () => {
  document.getElementById("info-panel").classList.remove("open");
});

/* ---------------------------------------------------------
   9. LABELS (DOM overlay, solar-system mode only)
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
  if (!labelsEnabled || mode !== "solar") {
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
   10. MODE SWITCHING
--------------------------------------------------------- */

const CAMERA_PRESETS = {
  solar: { pos: new THREE.Vector3(0, 90, 260), target: new THREE.Vector3(0, 0, 0) },
  asteroids: { pos: new THREE.Vector3(0, 26, 46), target: new THREE.Vector3(0, 0, 0) }
};

function setMode(next) {
  if (mode === next) return;
  mode = next;
  solarSystemGroup.visible = mode === "solar";
  asteroidWatchGroup.visible = mode === "asteroids";

  document.querySelectorAll(".mode-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  document.getElementById("rail-solar").classList.toggle("hidden", mode !== "solar");
  document.getElementById("rail-asteroids").classList.toggle("hidden", mode !== "asteroids");
  document.querySelector(".hud-bottom").classList.toggle("hidden", mode !== "solar");
  document.getElementById("info-panel").classList.remove("open");

  const preset = CAMERA_PRESETS[mode];
  camera.position.copy(preset.pos);
  controls.target.copy(preset.target);
}

document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

/* ---------------------------------------------------------
   11. UI WIRING — rail toggles, picker, time controls
--------------------------------------------------------- */

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
bindToggle("toggle-scale", (on) => {
  planetObjects.forEach((po) => {
    const scaleFactor = on ? po.mesh.userData.trueRadius / po.mesh.userData.baseRadius : 1;
    po.mesh.scale.setScalar(scaleFactor);
  });
});

document.getElementById("reset-view").addEventListener("click", () => {
  const preset = CAMERA_PRESETS[mode];
  camera.position.copy(preset.pos);
  controls.target.copy(preset.target);
});

// Time controls
let playing = true;
let speedMultiplier = 1;
let simTime = new Date();
let orbitAnimSpeed = 1;

function formatSimDate(d) {
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const playPauseBtn = document.getElementById("play-pause");
playPauseBtn.addEventListener("click", () => {
  playing = !playing;
  playPauseBtn.textContent = playing ? "Pause" : "Play";
  playPauseBtn.classList.toggle("active", playing);
});

document.querySelectorAll(".speed-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".speed-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    speedMultiplier = parseFloat(btn.dataset.speed);
  });
});

document.getElementById("jump-now").addEventListener("click", () => {
  simTime = new Date();
});

// Bottom quick-picker: Sun + 8 planets (solar mode only)
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
   12. SEARCH
--------------------------------------------------------- */

const SEARCHABLE = [
  { label: "Sun", tag: "Star", select: () => { setMode("solar"); selectObject(sunMesh); } },
  ...planetObjects.map((po) => ({
    label: po.data.name,
    tag: "Planet",
    select: () => { setMode("solar"); selectObject(po.mesh); }
  })),
  ...asteroidRuntime.map((a) => ({
    label: a.mesh.userData.data.name,
    tag: "Belt asteroid",
    select: () => { setMode("solar"); selectObject(a.mesh); }
  }))
];
// NEO entries are appended once the live feed (or fallback) finishes loading.

const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";
  if (!q) {
    searchResults.classList.remove("open");
    return;
  }
  const matches = SEARCHABLE.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 8);
  if (matches.length === 0) {
    searchResults.classList.remove("open");
    return;
  }
  matches.forEach((m) => {
    const el = document.createElement("div");
    el.className = "search-result-item";
    el.innerHTML = `<span>${m.label}</span><span class="tag">${m.tag}</span>`;
    el.addEventListener("click", () => {
      m.select();
      searchResults.classList.remove("open");
      searchInput.value = "";
    });
    searchResults.appendChild(el);
  });
  searchResults.classList.add("open");
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-bar")) searchResults.classList.remove("open");
});

/* ---------------------------------------------------------
   13. FIREBASE AUTH (Google sign-in)
   1. Firebase console -> create a project -> Authentication ->
      Sign-in method -> enable Google.
   2. Project settings -> General -> Your apps -> Web app ->
      copy the config object into firebaseConfig below.
   3. Authentication -> Settings -> Authorized domains -> add
      your GitHub Pages domain (yourusername.github.io).
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
   14. ANIMATION LOOP
--------------------------------------------------------- */

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  orbitAnimSpeed = playing ? speedMultiplier : 0;
  if (playing) {
    simTime = new Date(simTime.getTime() + delta * speedMultiplier * 8640000); // ~1 sim-day/10s at 1x
  }
  const simDateEl = document.getElementById("sim-date");
  if (simDateEl) simDateEl.textContent = formatSimDate(simTime);

  planetObjects.forEach((po) => {
    po.orbitGroup.rotation.y += 0.004 * po.data.orbitSpeed * orbitAnimSpeed;
    po.mesh.rotation.y += po.data.rotSpeed * orbitAnimSpeed;
    po.moonMeshes.forEach((m) => {
      m.angle += 0.01 * m.speed * orbitAnimSpeed;
      m.mesh.position.set(Math.cos(m.angle) * m.distance, 0, Math.sin(m.angle) * m.distance);
    });
  });

  satelliteRuntime.forEach((s) => {
    s.angle += 0.02 * s.speed * orbitAnimSpeed;
    s.mesh.position.set(Math.cos(s.angle) * s.distance, Math.sin(s.angle * 0.5) * 0.6, Math.sin(s.angle) * s.distance);
  });

  asteroidRuntime.forEach((a) => {
    a.angle += 0.002 * a.speed * orbitAnimSpeed;
    a.mesh.position.set(Math.cos(a.angle) * a.radius, a.mesh.position.y, Math.sin(a.angle) * a.radius);
    a.mesh.rotation.x += 0.003;
    a.mesh.rotation.y += 0.004;
  });

  sunMesh.rotation.y += 0.0015;
  watchEarth.rotation.y += 0.003;

  controls.update();
  updateLabels();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setTimeout(() => {
  document.getElementById("loading-veil").classList.add("hidden");
}, 900);

loadNeoFeed();
animate();
