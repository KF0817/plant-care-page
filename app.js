const plants = [
  {
    id: "monstera",
    name: "Monstera Deliciosa",
    nickname: "Big leaves, bright room",
    days: 7,
    light: "Bright indirect",
    humidity: "Medium-high",
    difficulty: "Easy",
    notes:
      "Let the top few centimeters of soil dry before watering. Rotate weekly so the plant grows evenly.",
  },
  {
    id: "snake",
    name: "Snake Plant",
    nickname: "Low water, low fuss",
    days: 18,
    light: "Low to bright",
    humidity: "Average",
    difficulty: "Very easy",
    notes:
      "Water only when the soil is fully dry. This plant prefers being slightly underwatered over sitting in wet soil.",
  },
  {
    id: "pothos",
    name: "Golden Pothos",
    nickname: "Fast trailing vines",
    days: 8,
    light: "Medium indirect",
    humidity: "Average",
    difficulty: "Easy",
    notes:
      "Trim long vines to encourage fuller growth. Yellow leaves usually mean it has been watered too often.",
  },
  {
    id: "fern",
    name: "Boston Fern",
    nickname: "Loves moisture",
    days: 4,
    light: "Filtered light",
    humidity: "High",
    difficulty: "Moderate",
    notes:
      "Keep the soil lightly moist and avoid hot dry air. A bathroom or humid corner is often a good fit.",
  },
  {
    id: "zz",
    name: "ZZ Plant",
    nickname: "Tough and sculptural",
    days: 21,
    light: "Low to medium",
    humidity: "Average",
    difficulty: "Very easy",
    notes:
      "Thick rhizomes store water, so wait until the pot feels light before watering again.",
  },
  {
    id: "calathea",
    name: "Calathea Orbifolia",
    nickname: "Patterned leaves",
    days: 5,
    light: "Soft indirect",
    humidity: "High",
    difficulty: "Fussy",
    notes:
      "Use filtered water if leaf edges brown. It likes steady moisture, warm rooms, and extra humidity.",
  },
];

const demoWeather = {
  title: "Toronto-style spring",
  temp: 22,
  humidity: 58,
  rain: 0.2,
  wind: 11,
  condition: "Partly cloudy",
};

let selectedPlant = plants[0];
let currentWeather = demoWeather;

const plantList = document.querySelector("#plantList");
const locationButton = document.querySelector("#locationButton");
const weatherStatus = document.querySelector("#weatherStatus");

const weatherCodes = new Map([
  [0, "Clear sky"],
  [1, "Mostly clear"],
  [2, "Partly cloudy"],
  [3, "Overcast"],
  [45, "Foggy"],
  [48, "Foggy"],
  [51, "Light drizzle"],
  [53, "Drizzle"],
  [55, "Heavy drizzle"],
  [61, "Light rain"],
  [63, "Rain"],
  [65, "Heavy rain"],
  [71, "Light snow"],
  [73, "Snow"],
  [75, "Heavy snow"],
  [80, "Rain showers"],
  [81, "Rain showers"],
  [82, "Heavy showers"],
  [95, "Thunderstorm"],
]);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getAdjustedDays(plant, weather) {
  let adjustment = 0;

  if (weather.temp >= 28) adjustment -= 2;
  else if (weather.temp >= 24) adjustment -= 1;
  else if (weather.temp <= 12) adjustment += 2;

  if (weather.humidity < 38) adjustment -= 1;
  else if (weather.humidity > 72) adjustment += 1;

  if (weather.rain > 2) adjustment += 1;

  return clamp(plant.days + adjustment, 2, 28);
}

function getAdjustmentText(baseDays, adjustedDays, weather) {
  if (adjustedDays < baseDays) {
    return `Sooner because it is ${weather.temp}°C with ${weather.humidity}% humidity.`;
  }

  if (adjustedDays > baseDays) {
    return `Later because cooler or humid weather slows drying.`;
  }

  return "Normal indoor conditions.";
}

function getHumidityTip(plant, weather) {
  if (plant.humidity === "High" && weather.humidity < 50) {
    return "Add a pebble tray or humidifier today.";
  }

  if (plant.humidity.includes("Average")) {
    return "Typical room humidity is fine.";
  }

  return "Group plants if the room feels dry.";
}

function formatDayLabel(date) {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
}

function renderPlants() {
  plantList.innerHTML = plants
    .map(
      (plant) => `
        <button class="plant-button" type="button" data-plant-id="${plant.id}" aria-pressed="${plant.id === selectedPlant.id}">
          <strong>${plant.name}</strong>
          <span>${plant.nickname}</span>
        </button>
      `,
    )
    .join("");
}

function renderSchedule(adjustedDays) {
  const scheduleList = document.querySelector("#scheduleList");
  const today = new Date();
  const waterDate = new Date(today);
  waterDate.setDate(today.getDate() + adjustedDays);

  const checkDate = new Date(today);
  checkDate.setDate(today.getDate() + Math.max(1, Math.floor(adjustedDays / 2)));

  const rotateDate = new Date(today);
  rotateDate.setDate(today.getDate() + 3);

  const items = [
    {
      date: today,
      title: "Check soil",
      detail: "Water only if the top soil is dry.",
    },
    {
      date: checkDate,
      title: "Quick leaf check",
      detail: "Look for droop, crisp edges, or yellowing.",
    },
    {
      date: rotateDate,
      title: "Rotate pot",
      detail: "Turn toward light for even growth.",
    },
    {
      date: waterDate,
      title: "Target watering",
      detail: `Plan a full soak in about ${adjustedDays} days.`,
    },
  ];

  scheduleList.innerHTML = items
    .map(
      (item) => `
        <li>
          <time datetime="${item.date.toISOString()}">${formatDayLabel(item.date)}</time>
          <div>
            <strong>${item.title}</strong>
            <span>${item.detail}</span>
          </div>
        </li>
      `,
    )
    .join("");
}

function renderCarePlan() {
  const adjustedDays = getAdjustedDays(selectedPlant, currentWeather);

  document.querySelector("#plantName").textContent = selectedPlant.name;
  document.querySelector("#plantDifficulty").textContent = selectedPlant.difficulty;
  document.querySelector("#waterFrequency").textContent = `${adjustedDays} days`;
  document.querySelector("#weatherAdjustment").textContent = getAdjustmentText(
    selectedPlant.days,
    adjustedDays,
    currentWeather,
  );
  document.querySelector("#plantLight").textContent = selectedPlant.light;
  document.querySelector("#plantHumidity").textContent = selectedPlant.humidity;
  document.querySelector("#humidityTip").textContent = getHumidityTip(selectedPlant, currentWeather);
  document.querySelector("#plantNotes").textContent = selectedPlant.notes;

  renderSchedule(adjustedDays);
}

function renderWeather() {
  document.querySelector("#weatherTitle").textContent = currentWeather.title;
  document.querySelector("#weatherTemp").textContent = `${Math.round(currentWeather.temp)}°C`;
  document.querySelector("#weatherCondition").textContent = currentWeather.condition;
  document.querySelector("#weatherHumidity").textContent = `${Math.round(currentWeather.humidity)}%`;
  document.querySelector("#weatherRain").textContent = `${currentWeather.rain.toFixed(1)} mm`;
  document.querySelector("#weatherWind").textContent = `${Math.round(currentWeather.wind)} km/h`;
}

function render() {
  renderPlants();
  renderWeather();
  renderCarePlan();
}

async function fetchWeather(position) {
  const { latitude, longitude } = position.coords;
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
    timezone: "auto",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) {
    throw new Error("Weather request failed");
  }

  const data = await response.json();
  const current = data.current;

  currentWeather = {
    title: "Your local weather",
    temp: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    rain: current.precipitation ?? 0,
    wind: current.wind_speed_10m,
    condition: weatherCodes.get(current.weather_code) || "Weather updated",
  };
}

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    weatherStatus.textContent = "Location is unavailable";
    return;
  }

  weatherStatus.textContent = "Checking location...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await fetchWeather(position);
        weatherStatus.textContent = "Using your weather";
        render();
      } catch (error) {
        weatherStatus.textContent = "Weather update failed";
      }
    },
    () => {
      weatherStatus.textContent = "Location permission needed";
    },
    { enableHighAccuracy: false, timeout: 9000, maximumAge: 600000 },
  );
});

plantList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-plant-id]");
  if (!button) return;

  selectedPlant = plants.find((plant) => plant.id === button.dataset.plantId) || plants[0];
  render();
});

render();
