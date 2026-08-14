async function todayInSpace(date) {
  let response = await fetch(
    "https://api.nasa.gov/planetary/apod?api_key=mtAX5DH41YHR37xKJPivh39wCxHtRb8mVd8yCJNl&date=" +
      date,
  );
  response = await response.json();
  displayTodayInSpace(response);
}

let currentHdUrl = "";

document.querySelector("#img-button").addEventListener("click", function () {
  if (currentHdUrl) {
    window.open(currentHdUrl, "_blank");
  }
});

function displayTodayInSpace(data) {
  const date = new Date(data.date);

  const newDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const newDateShort = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  document.querySelector("#apod-date").innerHTML = newDate;
  document.querySelector("#apod-title").innerHTML = data.title;
  document.querySelector("#apod-date-detail").innerHTML = newDate;
  document.querySelector("#apod-explanation").innerHTML = data.explanation;
  document.querySelector("#apod-copyright").innerHTML =
    data.copyright || "NASA";
  document.querySelector("#apod-date-info").innerHTML = newDate;
  document.querySelector("#apod-media-type").innerHTML = data.media_type;

  const apodImage = document.querySelector("#apod-image");
  const apodVideo = document.querySelector("#apod-video");

  if (data.media_type === "image") {
    apodImage.src = data.url;

    apodImage.classList.remove("hidden");
    apodVideo.classList.add("hidden");

    currentHdUrl = data.hdurl || data.url;
  } else if (data.media_type === "video") {
    apodVideo.src = data.url;

    apodVideo.classList.remove("hidden");
    apodImage.classList.add("hidden");

    currentHdUrl = "";
  }

  document.querySelector("#apod-date-input-s").innerHTML = newDateShort;
  document.querySelector("#apod-date-input").value = data.date;
}

document
  .querySelector("#apod-date-input")
  .addEventListener("change", function (e) {
    document.querySelector("#apod-date-input-s").innerHTML = e.target.value;
  });

document.querySelector("#load-date-btn").addEventListener("click", function () {
  const select = document.querySelector("#apod-date-input").value;
  todayInSpace(select);
});
document
  .querySelector("#today-apod-btn")
  .addEventListener("click", function () {
    todayInSpace(date);
  });

const date = new Date().toISOString().split("T")[0];
todayInSpace(date);

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    navLinks.forEach((navLink) => {
      navLink.classList.remove("bg-blue-500/10", "text-blue-400");
      navLink.classList.add("text-slate-300");
    });

    this.classList.remove("text-slate-300");
    this.classList.add("bg-blue-500/10", "text-blue-400");

    sections.forEach((section) => {
      section.classList.add("hidden");
    });

    const sectionId = this.dataset.section;
    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
      targetSection.classList.remove("hidden");
    }
  });
});

async function upcomingLaunches() {
  try {
    let response = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10",
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    response = await response.json();

    // console.log(response);

    displayUpcomingLaunches(response);
  } catch (error) {
    console.error("Error fetching launches:", error);
  }
}

function formatLaunchDate(dateString) {
  const date = new Date(dateString);

  return {
    shortDate: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),

    fullDate: date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),

    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }),
  };
}

function displayUpcomingLaunches(data) {
  const firstLaunch = data.results[0];

  if (!firstLaunch) {
    return;
  }
  document.querySelector("#launches-title").innerHTML =
    firstLaunch.name || "Unknown";

  document.querySelector("#status").innerHTML =
    firstLaunch.status?.abbrev || "Unknown";
  document.querySelector("#status").classList.add("text-yellow-400");

  document.querySelector("#starship").innerHTML =
    firstLaunch.rocket?.configuration?.name || "Unknown";

  document.querySelector("#qwe").innerHTML =
    firstLaunch.launch_service_provider?.name || "Unknown";

  document.querySelector("#asd").innerHTML =
    firstLaunch.pad?.country?.name || "Unknown";

  document.querySelector("#location").innerHTML =
    firstLaunch.pad?.location?.name || "Unknown";

  document.querySelector("#launches-desc").innerHTML =
    firstLaunch.mission?.description || "No description available.";

  const featuredImage =
    firstLaunch.image?.image_url || "assets/images/launch-placeholder.png";

  document.querySelector("#img-launches").innerHTML = `
    <img
      class="w-full h-full object-cover"
      src="${featuredImage}"
      alt="${firstLaunch.name || "Launch"}"
      onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';"
    >
  `;
  const firstLaunchDate = formatLaunchDate(firstLaunch.window_start);

  document.querySelector("#launchTime").innerHTML =
    firstLaunchDate.time + " UTC";

  document.querySelector("#launchDateFormatted").innerHTML =
    firstLaunchDate.fullDate;

  const container = document.querySelector("#launches-container");

  container.innerHTML = "";

  data.results.slice(1).forEach((launch) => {
    const launchDate = formatLaunchDate(launch.window_start);

    const imageUrl =
      launch.image?.image_url || "assets/images/launch-placeholder.png";

    container.innerHTML += `
      <div
        class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
      >
        <!-- Image -->
        <div
          class="relative h-48 bg-slate-900/50 flex items-center justify-center"
        >
          <img
            src="${imageUrl}"
            alt="${launch.name || "Launch"}"
            class="w-full h-full object-cover"
            onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';"
          >
          <!-- Status -->
          <div class="absolute top-3 right-3">
            <span
              class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
            >
              ${launch.status?.abbrev || "Unknown"}
            </span>
          </div>
        </div>
        <!-- Content -->
        <div class="p-5">
          <!-- Title & Provider -->
          <div class="mb-3">
            <h4
              class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
            >
              ${launch.name || "Unknown Launch"}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${launch.launch_service_provider?.name || "Unknown"}
            </p>
          </div>
          <!-- Launch Information -->
          <div class="space-y-2 mb-4">
            <!-- Date -->
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>

              <span class="text-slate-300">
                ${launchDate.shortDate}
              </span>
            </div>
            <!-- Time -->
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>

              <span class="text-slate-300">
                ${launchDate.time} UTC
              </span>
            </div>
            <!-- Rocket -->
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-slate-500 w-4"></i>
              <span class="text-slate-300">
                ${launch.rocket?.configuration?.name || "Unknown"}
              </span>
            </div>
            <!-- Location -->
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>

              <span class="text-slate-300 line-clamp-1">
                ${launch.pad?.location?.name || "Unknown"}
              </span>
            </div>
          </div>
          <!-- Buttons -->
          <div
            class="flex items-center gap-2 pt-4 border-t border-slate-700"
          >
            <button
              class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
              onclick="window.open('${launch.url}', '_blank')"
            >
              Details
            </button>
            <button
              class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

upcomingLaunches();

async function Planets() {
  try {
    let response = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets",
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    response = await response.json();

    displayPlanets(response);
  } catch (error) {
    console.error("Error fetching planets:", error);
  }
}

function displayPlanets(data) {
  const planets = data.bodies;

  const planetCards = document.querySelectorAll(".planet-card");

  planetCards.forEach((card) => {
    card.addEventListener("click", function () {
      const planetId = this.dataset.planetId;

      const selectedPlanet = planets.find(
        (planet) =>
          planet.englishName?.toLowerCase() === planetId.toLowerCase(),
      );

      if (!selectedPlanet) {
        console.log("Planet not found");
        return;
      }

      displayPlanetDetails(selectedPlanet);

      planetCards.forEach((card) => {
        card.classList.remove("border-blue-500", "bg-slate-700/50");
      });

      this.classList.add("border-blue-500", "bg-slate-700/50");
    });
  });
  updatePlanetComparisonTable(data);

  const earth = planets.find(
    (planet) => planet.englishName?.toLowerCase() === "earth",
  );

  if (earth) {
    displayPlanetDetails(earth);

    const earthCard = document.querySelector(
      '.planet-card[data-planet-id="earth"]',
    );

    if (earthCard) {
      earthCard.classList.add("border-blue-500", "bg-slate-700/50");
    }
  }
}

const planetColors = {
  mercury: "#9ca3af",
  venus: "#ca8a04",
  earth: "#3b82f6",
  mars: "#ef4444",
  jupiter: "#fb923c",
  saturn: "#eab308",
  uranus: "#22d3ee",
  neptune: "#1d4ed8",
};
const planetTypeColors = {
  "Ice Giant": "#2C56A1",
  "Gas Giant": "#6240A3",
  Terrestrial: "#8A5036",
};

function updatePlanetComparisonTable(data) {
  const tableBody = document.querySelector("#planet-comparison-tbody");

  tableBody.innerHTML = "";

  const earth = data.bodies.find(
    (planet) => planet.englishName?.toLowerCase() === "earth",
  );

  data.bodies.forEach((planet) => {
    const planetId = planet.englishName?.trim().toLowerCase();
    const planetColor = planetColors[planetId] || "#64748b";

    const distance = formatDistance(planet.semimajorAxis);
    const diameter =
      planet.meanRadius != null
        ? `${Math.round(planet.meanRadius * 2).toLocaleString()}`
        : "N/A";

    const mass = formatMassRelativeToEarth(planet, earth);
    const orbitalPeriod = formatOrbitalPeriod(planet.sideralOrbit);
    const moons = planet.moons?.length || 0;
    const type = planet.type || "Unknown";
    const typeColor = planetTypeColors[type] || "#64748B";

    tableBody.innerHTML += `
      <tr
        data-planet-id="${planetId}"
        class="hover:bg-slate-800/30 transition-colors"
      >

        <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
          <div class="flex items-center space-x-2 md:space-x-3">

            <div
              class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
              style="background-color: ${planetColor};"
            ></div>

            <span class="font-semibold text-sm md:text-base whitespace-nowrap">
              ${planet.englishName || "Unknown"}
            </span>

          </div>
        </td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 whitespace-nowrap">
          ${distance}
        </td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 whitespace-nowrap">
          ${diameter}
        </td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 whitespace-nowrap">
          ${mass}
        </td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 whitespace-nowrap">
          ${orbitalPeriod}
        </td>

        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 whitespace-nowrap">
          ${moons}
        </td>

        <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
          <span class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200"
          style="background-color: ${typeColor};"
          >
            ${type}
          </span>
        </td>

      </tr>
    `;
  });
}

function displayPlanetDetails(planet) {
  document.querySelector("#planet-detail-name").innerHTML =
    planet.englishName || "Unknown";

  document.querySelector("#planet-detail-description").innerHTML =
    planet.description || "No description available.";

  document.querySelector("#planet-detail-image").src =
    planet.image || "./assets/images/earth.png";

  document.querySelector("#planet-detail-image").alt =
    planet.englishName || "Planet";

  document.querySelector("#planet-distance").innerHTML =
    planet.semimajorAxis != null
      ? `${(planet.semimajorAxis / 1000000).toFixed(1)}M km`
      : "N/A";
  document.querySelector("#planet-radius").innerHTML =
    planet.meanRadius != null ? `${Math.round(planet.meanRadius)} km` : "N/A";

  document.querySelector("#planet-mass").innerHTML = formatMass(planet.mass);

  document.querySelector("#planet-density").innerHTML =
    planet.density != null
      ? `${Number(planet.density).toFixed(2)} g/cm³`
      : "N/A";

  document.querySelector("#planet-orbital-period").innerHTML =
    planet.sideralOrbit != null
      ? `${Math.abs(Number(planet.sideralOrbit)).toFixed(2)} hours`
      : "N/A";
  document.querySelector("#planet-rotation").innerHTML =
    planet.sideralRotation != null
      ? `${Math.abs(Number(planet.sideralRotation)).toFixed(2)} hours`
      : "N/A";

  document.querySelector("#planet-moons").innerHTML = planet.moons?.length || 0;

  document.querySelector("#planet-gravity").innerHTML =
    planet.gravity != null
      ? `${Number(planet.gravity).toFixed(2)} m/s²`
      : "N/A";

  document.querySelector("#planet-discoverer").innerHTML =
    planet.discoveredBy || "Known since antiquity";

  document.querySelector("#planet-discovery-date").innerHTML =
    planet.discoveryDate || "Ancient times";

  document.querySelector("#planet-body-type").innerHTML =
    planet.bodyType || "Planet";

  document.querySelector("#planet-volume").innerHTML = formatVolume(planet.vol);

  document.querySelector("#planet-perihelion").innerHTML =
    `${(planet.perihelion / 1000000).toFixed(1)}M km`;

  document.querySelector("#planet-aphelion").innerHTML =
    `${(planet.aphelion / 1000000).toFixed(1)}M km`;

  document.querySelector("#planet-eccentricity").innerHTML =
    planet.eccentricity?.toFixed(5) ?? "N/A";

  document.querySelector("#planet-inclination").innerHTML =
    `${planet.inclination?.toFixed(2) ?? "N/A"}°`;

  document.querySelector("#planet-axial-tilt").innerHTML =
    `${planet.axialTilt?.toFixed(2) ?? "N/A"}°`;

  document.querySelector("#planet-temp").innerHTML =
    planet.avgTemp != null ? `${planet.avgTemp}°C` : "N/A";

  document.querySelector("#planet-escape").innerHTML =
    planet.escape != null ? `${(planet.escape / 1000).toFixed(2)} km/s` : "N/A";

  document.querySelector("#planet-facts").innerHTML = `
  <li class="flex items-start">
    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
    <span class="text-slate-300">
      Mass:
      <span class="font-semibold">
        ${formatMass(planet.mass)}
      </span>
    </span>
  </li>

  <li class="flex items-start">
    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
    <span class="text-slate-300">
      Surface gravity:
      <span class="font-semibold">
        ${planet.gravity ?? "N/A"} m/s²
      </span>
    </span>
  </li>

  <li class="flex items-start">
    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
    <span class="text-slate-300">
      Density:
      <span class="font-semibold">
        ${planet.density ?? "N/A"} g/cm³
      </span>
    </span>
  </li>

  <li class="flex items-start">
    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
    <span class="text-slate-300">
      Axial tilt:
      <span class="font-semibold">
        ${planet.axialTilt ?? "N/A"}°
      </span>
    </span>
  </li>
`;
}

function formatMass(mass) {
  if (!mass || mass.massValue == null || mass.massExponent == null) {
    return "N/A";
  }

  return `${mass.massValue} × 10^${mass.massExponent} kg`;
}
function formatVolume(vol) {
  if (!vol || vol.volValue == null) {
    return "N/A";
  }

  return `${vol.volValue} × 10^${vol.volExponent} km³`;
}
function formatDistance(distance) {
  if (distance == null) {
    return "N/A";
  }

  const distanceInAU = distance / 149591359.3538301;

  return `${distanceInAU.toFixed(2)}`;
}
function formatMassRelativeToEarth(planet, earth) {
  if (
    !planet.mass ||
    !earth.mass ||
    planet.mass.massValue == null ||
    planet.mass.massExponent == null ||
    earth.mass.massValue == null ||
    earth.mass.massExponent == null
  ) {
    return "N/A";
  }

  const planetMass = planet.mass.massValue * 10 ** planet.mass.massExponent;

  const earthMass = earth.mass.massValue * 10 ** earth.mass.massExponent;

  return (planetMass / earthMass).toFixed(3);
}
function formatOrbitalPeriod(days) {
  if (days == null) {
    return "N/A";
  }

  if (days >= 365) {
    const years = days / 365.25;

    return `${years.toFixed(1)} years`;
  }

  return `${Math.round(days)} days`;
}

Planets();
