// -----------------------------
// Sample Data (you'll later fetch this from your backend)
// -----------------------------
const taverns = [
  {
    id: 1,
    name: "Taverna Nikos",
    image: "https://picsum.photos/300/200?1",
    category: "seafood",
    shortDescription: "By the port, fresh catch daily",
    distance: 0.3,
  },
  {
    id: 2,
    name: "Grill House Kostas",
    image: "https://picsum.photos/300/200?2",
    category: "grill",
    shortDescription: "Authentic souvlaki and live music",
    distance: 1.2,
  },
  {
    id: 3,
    name: "Maria's Corner",
    image: "https://picsum.photos/300/200?3",
    category: "vibes",
    shortDescription: "Cozy neighborhood taverna",
    distance: 0.7,
  },
];

// -----------------------------
// 1️⃣ Display Carousel
// -----------------------------
const carousel = document.getElementById("taste-cards-carousel");
carousel.innerHTML = taverns
  .map(
    (t) => `
  <div class="taste-card">
    <img src="${t.image}" alt="${t.name}">
    <h3>${t.name}</h3>
    <p>${t.shortDescription}</p>
    <button onclick="viewTavern(${t.id})">View Tavern</button>
  </div>
`
  )
  .join("");

// Simulate navigation to tavern detail
function viewTavern(id) {
  alert(
    "Open tavern page for ID " +
      id +
      " (here you'd go to /tavern?id=" +
      id +
      ")"
  );
}

// -----------------------------
// 2️⃣ Toggle between Quick Find and Craving
// -----------------------------
const btnQuick = document.getElementById("btn-quick");
const btnCraving = document.getElementById("btn-craving");
const panel = document.getElementById("foodie-panel");

btnQuick.addEventListener("click", () => {
  btnQuick.classList.add("active");
  btnCraving.classList.remove("active");
  showQuickFind();
});

btnCraving.addEventListener("click", () => {
  btnCraving.classList.add("active");
  btnQuick.classList.remove("active");
  showCraving();
});

// -----------------------------
// 3️⃣ Quick Find: find nearby
// -----------------------------
function showQuickFind() {
  panel.innerHTML = "<p>Detecting your location...</p>";
  if (!navigator.geolocation) {
    panel.innerHTML = "<p>Geolocation not supported.</p>";
    return;
  }
  navigator.geolocation.getCurrentPosition(success, error);
  function success(pos) {
    const { latitude, longitude } = pos.coords;
    // Filter simulated data by distance
    const nearby = taverns.filter((t) => t.distance <= 1.0);
    displayTaverns(nearby);
  }
  function error() {
    panel.innerHTML = "<p>Unable to retrieve your location.</p>";
  }
}

// -----------------------------
// 4️⃣ Craving Categories
// -----------------------------
function showCraving() {
  panel.innerHTML = `
    <div class="craving-buttons">
      <button onclick="loadCraving('seafood')">🐟 Seafood</button>
      <button onclick="loadCraving('grill')">🍖 Grill</button>
      <button onclick="loadCraving('vibes')">🍷 Neighborhood Vibes</button>
    </div>
    <div id="craving-results"></div>
  `;
}

function loadCraving(type) {
  const results = taverns.filter((t) => t.category === type);
  displayTaverns(results, "craving-results");
}

// -----------------------------
// Helper to display taverns
// -----------------------------
function displayTaverns(list, containerId = "foodie-panel") {
  const container = document.getElementById(containerId);
  container.innerHTML = list
    .map(
      (t) => `
    <div class="tavern-card">
      <img src="${t.image}" alt="${t.name}">
      <h4>${t.name}</h4>
      <p>${t.shortDescription}</p>
      <button onclick="showOnMap(${t.id})">Show on Map</button>
    </div>
  `
    )
    .join("");
}

function showOnMap(id) {
  alert("Redirect to /map?tavern=" + id);
}

// -----------------------------
// Initialize default view
// -----------------------------
showQuickFind();
