// 🔥 REAL-TIME LIKE FUNCTIONS
function getStatus() {
  let r = Math.random();
  if (r > 0.6) return "Free";
  if (r > 0.3) return "Busy";
  return "Occupied";
}

function getPower() {
  return Math.floor(Math.random() * 50) + 20; // 20–70 kW
}

function getSolar() {
  return Math.floor(Math.random() * 70) + 20; // 20–90%
}

function getGrid(solar) {
  return 100 - solar;
}

function getPrice(base, peakHours) {
  let hour = new Date().getHours();
  return peakHours.includes(hour) ? base + 3 : base - 2;
}


// 🔥 STATIONS DATA (ALL 6 WITH COST)
const stations = [

  {
    name: "Tata Power EZ Charge - Hosur",
    lat: 12.7409,
    lng: 77.8253,
    totalPower: getPower(),
    solar: getSolar(),
    grid: 0,
    solarPower: 0,
    gridPower: 0,
    status: getStatus(),
    perUnitCost: getPrice(15, [18,19,20,21]), // 💰 cost added
    phone: "9000000001"
  },
  {
    name: "Ather Grid - Hosur",
    lat: 12.7390,
    lng: 77.8260,
    totalPower: getPower(),
    solar: getSolar(),
    grid: 0,
    solarPower: 0,
    gridPower: 0,
    status: getStatus(),
    perUnitCost: getPrice(13, [9,10,19]),
    phone: "9000000002"
  },

  {
    name: "Relux Charging - Krishnagiri",
    lat: 12.5266,
    lng: 78.2137,
    totalPower: getPower(),
    solar: getSolar(),
    grid: 0,
    solarPower: 0,
    gridPower: 0,
    status: getStatus(),
    perUnitCost: getPrice(14, [8,18,20]),
    phone: "9000000003"
  },
  {
    name: "HP Fast Charger - Krishnagiri",
    lat: 12.5300,
    lng: 78.2200,
    totalPower: getPower(),
    solar: getSolar(),
    grid: 0,
    solarPower: 0,
    gridPower: 0,
    status: getStatus(),
    perUnitCost: getPrice(12, [9,19,21]),
    phone: "9000000004"
  },

  {
    name: "Zeon Charging - Shoolagiri",
    lat: 12.6635,
    lng: 78.0282,
    totalPower: getPower(),
    solar: getSolar(),
    grid: 0,
    solarPower: 0,
    gridPower: 0,
    status: getStatus(),
    perUnitCost: getPrice(16, [7,9,21]),
    phone: "9000000005"
  },
  {
    name: "IOCL EV Station - Shoolagiri",
    lat: 12.6680,
    lng: 78.0300,
    totalPower: getPower(),
    solar: getSolar(),
    grid: 0,
    solarPower: 0,
    gridPower: 0,
    status: getStatus(),
    perUnitCost: getPrice(11, [8,18,20]),
    phone: "9000000006"
  }

];


// 🔥 CALCULATIONS (UNCHANGED)
stations.forEach(s => {

  // % split
  s.grid = getGrid(s.solar);

  // convert to kW
  s.solarPower = Math.round((s.totalPower * s.solar) / 100);
  s.gridPower = Math.round((s.totalPower * s.grid) / 100);

});