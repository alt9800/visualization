const { DeckGL, PathLayer } = deck;

const requestURL = './files/';
let allGeoJsonData = {};

let currentRoute = 1;
const maxRoute = 507;
let isAnimating = false;

function updateLayers(routeNumber) {
  const geo = allGeoJsonData[routeNumber];
  if (!geo) {
    console.log(`No data found for route ${routeNumber}`);
    deckInstance.setProps({ layers: [] });
    updateCurrentRouteDisplay(routeNumber);
    return;
  }

  let data = [];
  for (let key in geo.features) {
    if (geo.features[key].geometry == null) {
      console.log(key + "がnullぽい");
      continue;
    }
    data.push({
      "name": `${routeNumber}-${key}`,
      "color": "#ed1c24",
      "path": geo.features[key].geometry.coordinates
    });
  }

  const newLayers = [
    new PathLayer({
      id: `route-${routeNumber}`,
      data: data,
      pickable: true,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: d => d.path,
      getColor: d => {
        const hex = "#ed1c24";
        return hex.match(/[0-9a-f]{2}/g).map(x => parseInt(x, 16));
      },
      getWidth: d => 5
    })
  ];

  deckInstance.setProps({ layers: newLayers });
  updateCurrentRouteDisplay(routeNumber);
}

async function loadAllGeoJsonFiles() {
  for (let i = 1; i <= maxRoute; i++) {
    try {
      const response = await fetch(`${requestURL}${i}.geojson`);
      if (response.ok) {
        const data = await response.json();
        allGeoJsonData[i] = data;
        console.log(`Loaded geojson for route ${i}`);
      } else {
        allGeoJsonData[i] = null;
        console.log(`No data for route ${i}`);
      }
    } catch (error) {
      allGeoJsonData[i] = null;
      console.error(`Failed to load geojson for route ${i}:`, error);
    }
  }
  console.log('All geojson files processed');
  updateLayers(1);
}

function valueChange() {
  const selectedRoute = fileSelect.value;
  console.log('新しく ' + selectedRoute + ' を選択しました');
  updateLayers(parseInt(selectedRoute));
}

let fileSelect = document.getElementById('file');
fileSelect.options[0].selected = true;
fileSelect.addEventListener('change', valueChange);

let deckInstance = new DeckGL({
  container: 'map',
  mapStyle: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
  initialViewState: {
    longitude: 135.7006491212362,
    latitude: 34.92583726748164,
    zoom: 5
  },
  controller: true,
  layers: []
});

const currentRouteElement = document.getElementById('currentRoute');

function startAnimation() {
  if (!isAnimating) {
    isAnimating = true;
    currentRoute = 1;
    console.log("アニメーションを開始します");
    animateRoutes();
  }
}

function animateRoutes() {
  if (currentRoute <= maxRoute && isAnimating) {
    updateLayers(currentRoute);
    setTimeout(() => {
      currentRoute++;
      animateRoutes();
    }, 300); // 300ms後に次のルートに切り替え
  } else {
    console.log("All routes displayed");
    isAnimating = false;
    updateCurrentRouteDisplay('-');
  }
}

function updateCurrentRouteDisplay(route = currentRoute) {
  if (currentRouteElement) {
    let routeText = `現在の国道: ${route}号線`;
    if (!allGeoJsonData[route]) {
      routeText += ' (割り当て無し)';
    }
    currentRouteElement.textContent = routeText;
  } else {
    console.error('currentRoute element not found');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const animateButton = document.getElementById('animateButton');
  if (animateButton) {
    animateButton.addEventListener('click', startAnimation);
  } else {
    console.error('アニメーション開始ボタンが見つかりません');
  }
  
  loadAllGeoJsonFiles();
});