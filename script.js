let selectedStation = stations[0];
let map;

const clickSound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");

function playClick(){
  clickSound.currentTime = 0;
  clickSound.play();
}

function goToPage(p){
  document.querySelectorAll('.page').forEach(pg=>pg.classList.remove('active'));
  document.getElementById('page'+p).classList.add('active');

  if(p===2) loadStations();
  if(p===3) loadDashboard();
}

/* 🔥 DISTANCE FUNCTION */
function getDistance(lat1, lon1, lat2, lon2){
  let R = 6371;
  let dLat = (lat2-lat1) * Math.PI/180;
  let dLon = (lon2-lon1) * Math.PI/180;

  let a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/* ================= PAGE 2 ================= */

function loadStations(){
  let list=document.getElementById("stationsList");
  list.innerHTML="";

  navigator.geolocation.getCurrentPosition(pos=>{

    let userLat = pos.coords.latitude;
    let userLng = pos.coords.longitude;

    let nearestIndex = 0;
    let minDist = getDistance(userLat,userLng,stations[0].lat,stations[0].lng);

    stations.forEach((s,i)=>{
      let dist = getDistance(userLat,userLng,s.lat,s.lng);
      if(dist < minDist){
        minDist = dist;
        nearestIndex = i;
      }
    });

    stations.forEach((s,i)=>{

      let dist = getDistance(userLat,userLng,s.lat,s.lng).toFixed(2);
      let eta = Math.round(dist * 2);

      list.innerHTML+=`
        <div class="card" style="${i===nearestIndex ? 'border:2px solid #22c55e;' : ''}">
          <h2>${s.name} ${i===nearestIndex ? '(Nearest)' : ''}</h2>

          <p>☀️ Solar Power: ${s.solarPower} kW</p>
          <p>⚡ Grid Power: ${s.gridPower} kW</p>
          <p>💰 Cost: ₹${s.perUnitCost} / unit</p>  <!-- ✅ ADDED -->
          <p>Status: ${s.status}</p>

          <p>Distance: ${dist} km</p>
          <p>ETA: ${eta} mins</p>

          <button onclick="playClick(); selectStation(${i})">
            View Details
          </button>
        </div>
      `;
    });

  }, ()=>{
    alert("Enable location ❌");
  });
}

function selectStation(i){
  selectedStation=stations[i];
  goToPage(3);
}

/* ================= PAGE 3 ================= */

function loadDashboard(){

  document.getElementById("stats").innerHTML=`
    <h3>System Overview</h3>
    Active Stations: ${stations.length}
  `;

  document.getElementById("energy").innerHTML=`
    <h3>Energy</h3>
    ☀️ Solar: ${selectedStation.solarPower} kW<br>
    ⚡ Grid: ${selectedStation.gridPower} kW<br>
    💰 Cost: ₹${selectedStation.perUnitCost} / unit   <!-- ✅ ADDED -->
  `;

  if(map){ map.remove(); }

  map=L.map('map').setView([selectedStation.lat,selectedStation.lng],11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  stations.forEach(s=>{
    L.marker([s.lat,s.lng]).addTo(map).bindPopup(s.name);
  });

  let panel=document.getElementById("stationsPanel");
  panel.innerHTML="";

  stations.forEach(s=>{
    panel.innerHTML+=`
      <div class="card">
        <h3>${s.name}</h3>

        <p>☀️ Solar: ${s.solarPower} kW</p>
        <p>⚡ Grid: ${s.gridPower} kW</p>
        <p>💰 Cost: ₹${s.perUnitCost} / unit</p>  <!-- ✅ ADDED -->
        <p>Status: ${s.status}</p>

        <button class="nav-btn"
          onclick="playClick(); navigateTo(${s.lat},${s.lng},'${s.name}')">
          Navigate
        </button>

        <button class="book-btn"
          onclick="playClick(); book('${s.name}')">
          Book Slot
        </button>

        <p>
          Distance: <span id="d_${s.name}">--</span> km |
          ETA: <span id="t_${s.name}">--</span> mins
        </p>
      </div>
    `;
  });

  navigator.geolocation.getCurrentPosition(pos=>{

    let userLat=pos.coords.latitude;
    let userLng=pos.coords.longitude;

    stations.forEach(s=>{
      let dist=getDistance(userLat,userLng,s.lat,s.lng).toFixed(2);
      let eta=Math.round(dist*2);

      document.getElementById("d_"+s.name).innerText=dist;
      document.getElementById("t_"+s.name).innerText=eta;
    });

  });

  document.getElementById("callBtn").onclick=()=>{
    window.location.href="tel:"+selectedStation.phone;
  };
}

/* 🔥 NAVIGATION */
function navigateTo(lat,lng,name){
  navigator.geolocation.getCurrentPosition(pos=>{

    let origin = pos.coords.latitude + "," + pos.coords.longitude;
    let destination = lat + "," + lng;

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    window.open(url);

  });
}

function book(name){
  alert("Booked at "+name);
}

function voiceAssistant(){
  let msg=new SpeechSynthesisUtterance("Navigation started");
  speechSynthesis.speak(msg);
}