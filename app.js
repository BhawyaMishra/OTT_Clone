// ---------- TMDB poster resolution ----------
// Caches resolved poster/backdrop URLs in sessionStorage so we don't
// re-hit the API on every reload.
const posterCache = JSON.parse(sessionStorage.getItem("posterCache") || "{}");

function saveCache() {
  sessionStorage.setItem("posterCache", JSON.stringify(posterCache));
}

async function fetchTmdbImage(item, kind) {
  // kind: "poster" or "backdrop"
  const cacheKey = `${item.tmdbType}:${item.tmdb}:${kind}`;
  if (posterCache[cacheKey]) return posterCache[cacheKey];

  try {
    const endpoint = item.tmdbType === "tv" ? "tv" : "movie";
    const res = await fetch(
      `https://api.themoviedb.org/3/search/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(item.tmdb)}`
    );
    if (!res.ok) throw new Error("TMDB request failed");
    const data = await res.json();
    const result = data.results && data.results[0];

    let path = null;
    if (result) {
      path = kind === "backdrop" ? result.backdrop_path : result.poster_path;
    }

    const size = kind === "backdrop" ? "original" : "w500";
    const url = path ? `${TMDB_IMG_BASE}${size}${path}` : item.fallback;

    posterCache[cacheKey] = url;
    saveCache();
    return url;
  } catch (err) {
    return item.fallback;
  }
}

// ---------- Banner ----------
let bannerIndex = 0;

async function updateBanner() {
  const banner = document.querySelector(".banner");
  const title = document.querySelector(".banner-title");
  const desc = document.querySelector(".banner-description");

  const movie = featured[bannerIndex];
  const imgUrl = await fetchTmdbImage(movie, "backdrop");

  banner.style.backgroundImage = `
    linear-gradient(to top, #141414, transparent),
    url('${imgUrl}')
  `;

  title.textContent = movie.title;
  desc.textContent = movie.description;

  bannerIndex = (bannerIndex + 1) % featured.length;
}

setInterval(updateBanner, 6000);
updateBanner();

document.querySelector(".banner-buttons").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn") && !e.target.classList.contains("btn-gray")) {
    const title = document.querySelector(".banner-title").textContent;
    openPlayer(title);
  }
  if (e.target.classList.contains("btn-gray")) {
    const title = document.querySelector(".banner-title").textContent;
    const desc = document.querySelector(".banner-description").textContent;
    openInfoModal(title, desc);
  }
});

// ---------- Movie cards ----------
function createMovieCard(movie, options = {}) {
  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.dataset.id = movie.id;

  const img = document.createElement("img");
  img.src = movie.fallback; // shows instantly, swapped once TMDB resolves
  img.classList.add("poster");
  img.alt = movie.title;

  fetchTmdbImage(movie, "poster").then(url => {
    img.src = url;
  });

  img.onerror = function () {
    this.onerror = null;
    this.src = movie.fallback;
  };

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  let progressBar = "";
  if (options.progress !== undefined) {
    progressBar = `<div class="progress-track"><div class="progress-fill" style="width:${options.progress}%"></div></div>`;
  }

  const actionBtn = options.remove
    ? `<button class="remove-btn" data-id="${movie.id}" title="Remove from My List">✕</button>`
    : `<button class="add-btn" data-id="${movie.id}" title="Add to My List">+</button>`;

  overlay.innerHTML = `
    ${progressBar}
    <h3>${movie.title}</h3>
    <div class="overlay-buttons">
      <button class="play-btn" data-title="${movie.title}">▶</button>
      ${actionBtn}
      <span class="rating">⭐ ${(7 + Math.random() * 2.5).toFixed(1)}</span>
    </div>
  `;

  card.appendChild(img);
  card.appendChild(overlay);
  return card;
}

function displayMovies(category, containerId) {
  const container = document.getElementById(containerId);
  const filteredMovies = movies.filter(movie => movie.category === category);

  filteredMovies.forEach(movie => {
    container.appendChild(createMovieCard(movie));
  });
}

function displayContinueWatching() {
  const container = document.getElementById("continue");
  continueWatching.forEach(movie => {
    container.appendChild(createMovieCard(movie, { progress: movie.progress }));
  });
}

displayMovies("thriller", "thriller");
displayMovies("horror", "horror");
displayMovies("romcom", "romcom");
displayMovies("indian", "indian");
displayContinueWatching();

// ---------- My List ----------
let myList = JSON.parse(localStorage.getItem("myList")) || [];

function saveMyList() {
  localStorage.setItem("myList", JSON.stringify(myList));
}

function renderMyList() {
  const container = document.getElementById("myList");
  const wrapper = document.getElementById("myListWrapper");
  container.innerHTML = "";

  if (myList.length === 0) {
    wrapper.style.display = "none";
    return;
  }
  wrapper.style.display = "block";

  myList.forEach(movie => {
    container.appendChild(createMovieCard(movie, { remove: true }));
  });
}
renderMyList();

// ---------- Global click handling ----------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const movieId = Number(e.target.dataset.id);
    const selectedMovie = movies.find(m => m.id === movieId) || continueWatching.find(m => m.id === movieId);

    if (selectedMovie && !myList.some(m => m.id === movieId)) {
      myList.push(selectedMovie);
      saveMyList();
      renderMyList();
      showToast(`Added "${selectedMovie.title}" to My List`);
    }
  }

  if (e.target.classList.contains("remove-btn")) {
    const movieId = Number(e.target.dataset.id);
    myList = myList.filter(m => m.id !== movieId);
    saveMyList();
    renderMyList();
  }

  if (e.target.classList.contains("play-btn")) {
    openPlayer(e.target.dataset.title);
  }

  if (e.target.classList.contains("poster")) {
    const card = e.target.closest(".movie-card");
    const title = card.querySelector("h3")?.textContent || "Untitled";
    openInfoModal(title, "No description available for this title yet.");
  }
});

// ---------- Player modal ----------
function openPlayer(title) {
  const modal = document.getElementById("playerModal");
  document.getElementById("playerTitle").textContent = title;
  modal.classList.add("active");
}

function closePlayer() {
  document.getElementById("playerModal").classList.remove("active");
}

// ---------- Info modal ----------
function openInfoModal(title, description) {
  document.getElementById("infoTitle").textContent = title;
  document.getElementById("infoDescription").textContent = description;
  document.getElementById("infoModal").classList.add("active");
}

function closeInfoModal() {
  document.getElementById("infoModal").classList.remove("active");
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("modal-close")) {
    closePlayer();
    closeInfoModal();
  }
});

// ---------- Toast ----------
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ---------- Search ----------
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase().trim();

  document.querySelectorAll(".movie-card").forEach(card => {
    const title = (card.querySelector("h3")?.textContent || "").toLowerCase();
    card.style.display = title.includes(value) ? "" : "none";
  });

  document.querySelectorAll(".row").forEach(row => {
    const visibleCards = row.querySelectorAll(".movie-card:not([style*='display: none'])");
    row.style.display = (value && visibleCards.length === 0) ? "none" : "";
  });
});

// ---------- Row scroll buttons ----------
document.querySelectorAll(".row-container").forEach(container => {
  const leftBtn = container.querySelector(".left");
  const rightBtn = container.querySelector(".right");
  const row = container.querySelector(".row-posters");

  rightBtn.addEventListener("click", () => {
    row.scrollBy({ left: 600, behavior: "smooth" });
  });

  leftBtn.addEventListener("click", () => {
    row.scrollBy({ left: -600, behavior: "smooth" });
  });
});

// ---------- Navbar scroll effect ----------
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
