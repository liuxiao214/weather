import './style.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { hikingDays, trackSegments } from './trackData.js';

const route = [
  { day: 'D1', date: '09-25', fullDate: '2026-09-25', place: '加德满都 Kathmandu', lat: 27.7172, lon: 85.3240, alt: 1400, dayLow: 24, dayHigh: 28, nightLow: 16, nightHigh: 20, rain: 38, snow: 0, wind: 22, code: 3 },
  { day: 'D2', date: '09-26', fullDate: '2026-09-26', place: '帕克丁 Phakding', lat: 27.7408, lon: 86.7123, alt: 2610, dayLow: 11, dayHigh: 15, nightLow: 3, nightHigh: 7, rain: 24, snow: 0, wind: 30, code: 2 },
  { day: 'D3', date: '09-27', fullDate: '2026-09-27', place: '南池巴扎 Namche', lat: 27.8053, lon: 86.7106, alt: 3440, dayLow: 6, dayHigh: 10, nightLow: -3, nightHigh: 1, rain: 32, snow: 0, wind: 36, code: 3 },
  { day: 'D4', date: '09-28', fullDate: '2026-09-28', place: '丁波切 Dingboche', lat: 27.8947, lon: 86.8314, alt: 4410, dayLow: 0, dayHigh: 4, nightLow: -10, nightHigh: -6, rain: 18, snow: 1, wind: 36, code: 71 },
  { day: 'D5', date: '09-29', fullDate: '2026-09-29', place: '罗布切 Lobuche', lat: 27.9485, lon: 86.8105, alt: 4910, dayLow: -3, dayHigh: 1, nightLow: -14, nightHigh: -10, rain: 12, snow: 3, wind: 43, code: 73 },
  { day: 'D6', date: '09-30', fullDate: '2026-09-30', place: '珠峰大本营 EBC', lat: 28.0026, lon: 86.8528, alt: 5364, dayLow: -7, dayHigh: -3, nightLow: -20, nightHigh: -16, rain: 14, snow: 5, wind: 56, code: 73 },
  { day: 'D7', date: '10-01', fullDate: '2026-10-01', place: '卡拉帕塔 Kala Patthar', lat: 27.9958, lon: 86.8284, alt: 5550, dayLow: -9, dayHigh: -5, nightLow: -22, nightHigh: -18, rain: 10, snow: 2, wind: 62, code: 71 },
  { day: 'D8', date: '10-02', fullDate: '2026-10-02', place: '曲拉山口 Cho La', lat: 27.9608, lon: 86.7520, alt: 5420, dayLow: -8, dayHigh: -4, nightLow: -21, nightHigh: -17, rain: 16, snow: 6, wind: 58, code: 75 },
  { day: 'D9', date: '10-03', fullDate: '2026-10-03', place: '高乔湖 Gokyo', lat: 27.9549, lon: 86.6946, alt: 4790, dayLow: -2, dayHigh: 2, nightLow: -15, nightHigh: -11, rain: 15, snow: 1, wind: 39, code: 71 },
  { day: 'D10', date: '10-04', fullDate: '2026-10-04', place: '多勒 Dole', lat: 27.8727, lon: 86.7142, alt: 4200, dayLow: 2, dayHigh: 6, nightLow: -9, nightHigh: -5, rain: 22, snow: 0, wind: 31, code: 3 },
  { day: 'D11', date: '10-05', fullDate: '2026-10-05', place: '卢卡拉 Lukla', lat: 27.6869, lon: 86.7297, alt: 2860, dayLow: 8, dayHigh: 12, nightLow: 0, nightHigh: 4, rain: 30, snow: 0, wind: 32, code: 2 },
  { day: 'D12', date: '10-06', fullDate: '2026-10-06', place: '加德满都 Kathmandu', lat: 27.7172, lon: 85.3240, alt: 1400, dayLow: 23, dayHigh: 27, nightLow: 15, nightHigh: 19, rain: 35, snow: 0, wind: 21, code: 61 },
  { day: 'D13', date: '10-07', fullDate: '2026-10-07', place: '加德满都 Kathmandu', lat: 27.7172, lon: 85.3240, alt: 1400, dayLow: 24, dayHigh: 28, nightLow: 15, nightHigh: 19, rain: 28, snow: 0, wind: 20, code: 2 },
].map(point => ({ ...point, source: 'fallback' }));

const endpointLocations = {
  kathmandu: { id: 'kathmandu', place: '加德满都 Kathmandu', lat: 27.7172, lon: 85.3240, alt: 1400 },
  lukla: { id: 'lukla', place: '卢卡拉 Lukla', lat: 27.6869, lon: 86.7297, alt: 2860 },
  phakding: { id: 'phakding', place: '帕克丁 Phakding', lat: 27.7408, lon: 86.7123, alt: 2610 },
  namche: { id: 'namche', place: '南池巴扎 Namche Bazaar', lat: 27.8053, lon: 86.7106, alt: 3440 },
  tengboche: { id: 'tengboche', place: '天波切 Tengboche', lat: 27.8355, lon: 86.7649, alt: 3860 },
  pangboche: { id: 'pangboche', place: '潘波切 Pangboche', lat: 27.8569, lon: 86.7940, alt: 3985 },
  dingboche: { id: 'dingboche', place: '丁波切 Dingboche', lat: 27.8947, lon: 86.8314, alt: 4410 },
  thukla: { id: 'thukla', place: '土克拉 Thukla', lat: 27.9237, lon: 86.8064, alt: 4620 },
  lobuche: { id: 'lobuche', place: '罗布切 Lobuche', lat: 27.9485, lon: 86.8105, alt: 4910 },
  gorakshep: { id: 'gorakshep', place: '戈瑞夏普 Gorak Shep', lat: 27.9803, lon: 86.8290, alt: 5140 },
  ebc: { id: 'ebc', place: '珠峰大本营 EBC', lat: 27.9972, lon: 86.8472, alt: 5364 },
  kalapatthar: { id: 'kalapatthar', place: '卡拉帕塔 Kala Patthar', lat: 27.9958, lon: 86.8284, alt: 5550 },
  dzongla: { id: 'dzongla', place: '宗拉 Dzongla', lat: 27.9388, lon: 86.7732, alt: 4830 },
  chola: { id: 'chola', place: '曲拉山口 Cho La Pass', lat: 27.9616, lon: 86.7571, alt: 5420 },
  gokyo: { id: 'gokyo', place: '高乔湖 Gokyo Lake', lat: 27.9549, lon: 86.6946, alt: 4790 },
  gokyori: { id: 'gokyori', place: '高乔峰 Gokyo Ri', lat: 27.9626, lon: 86.6832, alt: 5360 },
  dole: { id: 'dole', place: '多勒 Dole', lat: 27.8727, lon: 86.7142, alt: 4200 },
};

const dailyEndpoints = [
  { day: 'D1', fullDate: '2026-09-25', points: [{ role: '终点/到达地', location: endpointLocations.kathmandu }] },
  { day: 'D2', fullDate: '2026-09-26', points: [{ role: '起点', location: endpointLocations.kathmandu }, { role: '途经', location: endpointLocations.lukla }, { role: '终点', location: endpointLocations.phakding }] },
  { day: 'D3', fullDate: '2026-09-27', points: [{ role: '起点', location: endpointLocations.phakding }, { role: '终点', location: endpointLocations.namche }] },
  { day: 'D4', fullDate: '2026-09-28', points: [{ role: '起点', location: endpointLocations.namche }, { role: '途经', location: endpointLocations.tengboche }, { role: '途经', location: endpointLocations.pangboche }, { role: '终点', location: endpointLocations.dingboche }] },
  { day: 'D5', fullDate: '2026-09-29', points: [{ role: '起点', location: endpointLocations.dingboche }, { role: '途经', location: endpointLocations.thukla }, { role: '终点', location: endpointLocations.lobuche }] },
  { day: 'D6', fullDate: '2026-09-30', points: [{ role: '起点', location: endpointLocations.lobuche }, { role: '途经/住宿点', location: endpointLocations.gorakshep }, { role: '途经', location: endpointLocations.ebc }] },
  { day: 'D7', fullDate: '2026-10-01', points: [{ role: '起点', location: endpointLocations.gorakshep }, { role: '途经', location: endpointLocations.kalapatthar }, { role: '终点', location: endpointLocations.dzongla }] },
  { day: 'D8', fullDate: '2026-10-02', points: [{ role: '起点', location: endpointLocations.dzongla }, { role: '途经', location: endpointLocations.chola }, { role: '终点', location: endpointLocations.gokyo }] },
  { day: 'D9', fullDate: '2026-10-03', points: [{ role: '起点', location: endpointLocations.gokyo }, { role: '可选途经', location: endpointLocations.gokyori }, { role: '终点', location: endpointLocations.dole }] },
  { day: 'D10', fullDate: '2026-10-04', points: [{ role: '起点', location: endpointLocations.dole }, { role: '终点', location: endpointLocations.namche }] },
  { day: 'D11', fullDate: '2026-10-05', points: [{ role: '起点', location: endpointLocations.namche }, { role: '途经', location: endpointLocations.phakding }, { role: '终点', location: endpointLocations.lukla }] },
  { day: 'D12', fullDate: '2026-10-06', points: [{ role: '起点', location: endpointLocations.lukla }, { role: '终点', location: endpointLocations.kathmandu }] },
  { day: 'D13', fullDate: '2026-10-07', points: [{ role: '单点', location: endpointLocations.kathmandu }] },
];

const itinerary = [
  { day: '第一天', date: '09-25', route: '国内 → 加德满都 Kathmandu', meta: '机场接机，按航班时间安排', stay: '酒店', level: 'city' },
  { day: '第二天', date: '09-26', route: '加德满都 → 卢卡拉 → 帕克丁 Phakding', meta: '8km · 3—4小时 · ↑200m ↓450m', stay: '客栈', level: 'good' },
  { day: '第三天', date: '09-27', route: '帕克丁 → 南池巴扎 Namche Bazaar', meta: '11km · 5—6小时 · ↑950m ↓120m', stay: '客栈', level: 'good' },
  { day: '第四天', date: '09-28', route: '南池巴扎 → 天波切 → 潘波切 → 丁波切', meta: '19km · 8—9小时 · ↑1000m ↓180m', stay: '客栈', level: 'warn' },
  { day: '第五天', date: '09-29', route: '丁波切 → 土克拉 → 罗布切 Lobuche', meta: '12km · 5—6小时 · ↑600m ↓100m', stay: '客栈', level: 'warn' },
  { day: '第六天', date: '09-30', route: '罗布切 → 戈瑞夏普 → 珠峰大本营 EBC → 戈瑞夏普', meta: '16km · 7—8小时 · ↑460m ↓230m', stay: '客栈', level: 'danger' },
  { day: '第七天', date: '10-01', route: '戈瑞夏普 → 卡拉帕塔 → 宗拉 Dzongla', meta: '15km · 7—8小时 · ↑410m ↓720m', stay: '客栈', level: 'danger' },
  { day: '第八天', date: '10-02', route: '宗拉 → 曲拉山口 Cho La Pass → 高乔湖 Gokyo', meta: '12km · 7—9小时 · ↑590m ↓630m', stay: '客栈', level: 'danger' },
  { day: '第九天', date: '10-03', route: '高乔湖 → 多勒 Dole', meta: '11km · 5—6小时 · ↑80m ↓670m · 可选登高乔日出峰', stay: '客栈', level: 'warn' },
  { day: '第十天', date: '10-04', route: '多勒 → 南池巴扎 Namche Bazaar', meta: '11km · 约5小时 · ↑60m ↓820m', stay: '客栈', level: 'good' },
  { day: '第十一天', date: '10-05', route: '南池巴扎 → 帕克丁 → 卢卡拉', meta: '19km · 7—8小时 · ↑570m ↓1150m', stay: '客栈', level: 'good' },
  { day: '第十二天', date: '10-06', route: '卢卡拉 → 加德满都 Kathmandu', meta: '飞行约30分钟 · 送机与庆功宴', stay: '酒店', level: 'city' },
  { day: '第十三天', date: '10-07', route: '加德满都解散', meta: '早餐后自由返程', stay: '—', level: 'city' },
];

const earthDistance = (a, b) => {
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLon = (b[0] - a[0]) * rad;
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const joinSegments = indexes => indexes.flatMap((index, position) => position ? trackSegments[index].slice(1) : trackSegments[index]);

const landmarkSpecs = {
  D2: [['卢卡拉', 0], ['帕克丁', 1]],
  D3: [['帕克丁', 0], ['南池巴扎', 1]],
  D4: [['南池巴扎', 0], ['天波切', .36], ['潘波切', .68], ['丁波切', 1]],
  D5: [['丁波切', 0], ['土克拉', .52], ['罗布切', 1]],
  D6: [['罗布切', 0], ['戈瑞夏普', .35], ['珠峰大本营', .62], ['戈瑞夏普', 1]],
  D7: [['戈瑞夏普', 0], ['卡拉帕塔', 'highest'], ['宗拉', 1]],
  D8: [['宗拉', 0], ['曲拉山口', 'highest'], ['高乔湖', 1]],
  D9: [['高乔湖', 0], ['高乔日出峰', 'highest'], ['多勒', 1]],
  D10: [['多勒', 0], ['南池巴扎', 1]],
  D11: [['南池巴扎', 0], ['帕克丁', .55], ['卢卡拉', 1]],
};

const resolveLandmarks = (points, specs) => specs.map(([name, position]) => {
  let index;
  if (position === 'highest') index = points.reduce((best, point, current) => point[2] > points[best][2] ? current : best, 0);
  else index = Math.round(position * (points.length - 1));
  return { name, index, point: points[index] };
});

const withDistances = points => {
  let distance = 0;
  return points.map((point, index) => {
    if (index) distance += earthDistance(points[index - 1], point);
    return { point, distance };
  });
};

let mapSequence = 0;
const mapTracks = new Map();
const routeMap = (points, label, contextPoints = null, landmarks = []) => {
  const id = `satellite-map-${mapSequence++}`;
  mapTracks.set(id, { points, contextPoints, landmarks });
  return `<div class="satellite-map" id="${id}" data-label="${label}" role="img" aria-label="${label}卫星轨迹图"></div>`;
};

const markerIcon = type => L.divIcon({
  className: '',
  html: `<div class="track-marker ${type}"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const landmarkIcon = name => L.divIcon({
  className: 'landmark-icon-wrap',
  html: `<div class="landmark-icon"><i></i><span>${name}</span></div>`,
  iconSize: [110, 34],
  iconAnchor: [7, 27],
});

const satelliteMaps = new WeakMap();

const initializeSatelliteMap = element => {
  if (satelliteMaps.has(element)) return satelliteMaps.get(element);
  const track = mapTracks.get(element.id);
  const toLatLng = points => points.map(point => [point[1], point[0]]);
  const points = toLatLng(track.points);
  const contextPoints = track.contextPoints ? toLatLng(track.contextPoints) : null;
  const bounds = L.latLngBounds(points);
  const map = L.map(element, { scrollWheelZoom: false, attributionControl: true });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: '卫星影像 © Esri',
  }).addTo(map);
  if (contextPoints) {
    L.polyline(contextPoints, { color: '#fff', weight: 6, opacity: .65 }).addTo(map);
    L.polyline(contextPoints, { color: '#74b9dc', weight: 3, opacity: .88 }).addTo(map);
  }
  L.polyline(points, { color: '#fff', weight: 7, opacity: .95 }).addTo(map);
  L.polyline(points, { color: '#d83f36', weight: 4, opacity: 1 }).addTo(map);
  track.landmarks.forEach(landmark => {
    L.marker([landmark.point[1], landmark.point[0]], {
      icon: landmarkIcon(landmark.name),
      title: landmark.name,
    }).addTo(map);
  });
  L.marker(points[0], { icon: markerIcon('start'), title: '起点' }).addTo(map);
  L.marker(points.at(-1), { icon: markerIcon('end'), title: '终点' }).addTo(map);
  map.fitBounds(bounds, { padding: [22, 22] });
  satelliteMaps.set(element, { map, bounds });
  return satelliteMaps.get(element);
};

const initializeSatelliteMaps = () => {
  document.querySelectorAll('.satellite-map:not(.track-details .satellite-map)').forEach(initializeSatelliteMap);
  document.querySelectorAll('.track-details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      requestAnimationFrame(() => {
        const instance = initializeSatelliteMap(details.querySelector('.satellite-map'));
        instance.map.invalidateSize();
        instance.map.fitBounds(instance.bounds, { padding: [22, 22] });
      });
    });
  });
};

const elevationSvg = (points, label, distanceOverride, landmarks = []) => {
  const width = 640;
  const height = 270;
  const plot = { left:54, right:16, top:22, bottom:42 };
  const measured = withDistances(points);
  const measuredTotal = measured.at(-1).distance || 1;
  const total = distanceOverride || measuredTotal;
  const elevations = points.map(point => point[2]);
  const rawMin = Math.min(...elevations), rawMax = Math.max(...elevations);
  const min = Math.floor((rawMin - 80) / 100) * 100;
  const max = Math.ceil((rawMax + 80) / 100) * 100;
  const x = distance => plot.left + distance / measuredTotal * (width - plot.left - plot.right);
  const y = elevation => plot.top + (max - elevation) / (max - min || 1) * (height - plot.top - plot.bottom);
  const line = measured.map(({point, distance}, index) => `${index ? 'L' : 'M'}${x(distance).toFixed(1)} ${y(point[2]).toFixed(1)}`).join(' ');
  const bottom = height - plot.bottom;
  const area = `${line} L${width - plot.right} ${bottom} L${plot.left} ${bottom} Z`;
  const grid = [0, .5, 1].map(ratio => { const py = plot.top + ratio * (bottom - plot.top); const altitude = Math.round(max - ratio * (max - min)); return `<line x1="${plot.left}" y1="${py}" x2="${width - plot.right}" y2="${py}"/><text x="${plot.left - 8}" y="${py + 3}">${altitude}m</text>`; }).join('');
  const ticks = [0, .25, .5, .75, 1].map(ratio => { const px = plot.left + ratio * (width - plot.left - plot.right); return `<line x1="${px}" y1="${bottom}" x2="${px}" y2="${bottom + 5}"/><text x="${px}" y="${bottom + 19}">${(total * ratio).toFixed(ratio === 0 ? 0 : 1)}</text>`; }).join('');
  const markers = landmarks.map((landmark, markerIndex) => {
    const item = measured[landmark.index];
    const px = x(item.distance);
    const py = y(item.point[2]);
    const anchor = px > width - 130 ? 'end' : px < 130 ? 'start' : 'middle';
    const tx = anchor === 'end' ? px - 7 : anchor === 'start' ? px + 7 : px;
    const ty = Math.max(plot.top + 10, py - 12 - (markerIndex % 2) * 15);
    const dayClass = landmark.day ? ' day-marker' : '';
    const text = landmark.day ? landmark.name : `${landmark.name} · ${Math.round(item.point[2]).toLocaleString()}m`;
    return `<g class="elevation-landmark${dayClass}"><line x1="${px}" y1="${py}" x2="${px}" y2="${ty + 3}"/><circle cx="${px}" cy="${py}" r="4"/><text x="${tx}" y="${ty}" text-anchor="${anchor}">${text}</text></g>`;
  }).join('');
  return `<svg class="elevation-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}海拔剖面图"><defs><linearGradient id="elevation-${label.replace(/\W/g, '')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#63a3c3" stop-opacity=".55"/><stop offset="1" stop-color="#dcecf3" stop-opacity=".24"/></linearGradient></defs><g class="elevation-grid">${grid}</g><path class="elevation-area" fill="url(#elevation-${label.replace(/\W/g, '')})" d="${area}"/><path class="elevation-line" d="${line}"/><g class="elevation-landmarks">${markers}</g><g class="distance-ticks">${ticks}<text class="axis-title" x="${(plot.left + width - plot.right) / 2}" y="${height - 3}">累计距离（km）</text></g></svg>`;
};

const dayTracks = hikingDays.map(day => {
  const points = joinSegments(day.segments);
  return { ...day, points, landmarks: resolveLandmarks(points, landmarkSpecs[day.day]) };
});
const fullTrack = trackSegments.flatMap((segment, index) => index ? segment.slice(1) : segment);
const fullDayMarkers = dayTracks.map(day => {
  const lastSegment = day.segments.at(-1);
  const index = trackSegments.slice(0, lastSegment + 1).reduce((sum, segment, segmentIndex) => sum + segment.length - (segmentIndex ? 1 : 0), 0) - 1;
  const destination = landmarkSpecs[day.day].at(-1)[0];
  return { name: `${day.day} · ${destination}`, day: day.day, index, point: fullTrack[index] };
});
const fullLandmarks = dayTracks.flatMap(day => day.landmarks.filter((_, index) => index || day.day === 'D2'))
  .filter((landmark, index, landmarks) => landmarks.findIndex(item => item.name === landmark.name) === index)
  .map(landmark => {
    const index = fullTrack.reduce((best, point, current) => earthDistance(point, landmark.point) < earthDistance(fullTrack[best], landmark.point) ? current : best, 0);
    return { ...landmark, index, point: fullTrack[index] };
  });
const fullDistance = hikingDays.reduce((sum, day) => sum + day.distance, 0);
const fullMinAlt = Math.min(...hikingDays.map(day => day.minAlt));
const fullMaxAlt = Math.max(...hikingDays.map(day => day.maxAlt));
const fullAscent = hikingDays.reduce((sum, day) => sum + day.ascent, 0);
const fullDescent = hikingDays.reduce((sum, day) => sum + day.descent, 0);

const MODEL_OPTIONS = {
  blend: { label: '智能融合', detail: 'ECMWF · GFS · ICON', models: ['ecmwf_ifs025', 'gfs_seamless', 'icon_seamless'] },
  ecmwf: { label: 'ECMWF IFS', detail: '欧洲中期天气预报中心', models: ['ecmwf_ifs025'] },
  gfs: { label: 'NOAA GFS', detail: '美国全球预报系统', models: ['gfs_seamless'] },
  icon: { label: 'DWD ICON', detail: '德国全球预报模型', models: ['icon_seamless'] },
};
const HOURLY_FIELDS = ['temperature_2m', 'precipitation_probability', 'snowfall', 'weather_code', 'wind_gusts_10m'];
const locationKey = point => `${point.lat},${point.lon},${point.alt}`;
const weatherLocations = [...route, ...Object.values(endpointLocations)].filter((point, index, points) => points.findIndex(item => locationKey(item) === locationKey(point)) === index);
const weatherLocationIndexes = new Map(weatherLocations.map((point, index) => [locationKey(point), index]));
let selectedModel = 'blend';
let activeRequest = null;

const weatherInfo = code => {
  if ([95, 96, 99].includes(code)) return { text: '雷暴', icon: '⛈️', severity: 10 };
  if ([75, 77, 85, 86].includes(code)) return { text: '大雪', icon: '🌨️', severity: 9 };
  if ([73].includes(code)) return { text: '中雪', icon: '🌨️', severity: 8 };
  if ([71].includes(code)) return { text: '小雪', icon: '🌨️', severity: 7 };
  if ([65, 67, 82].includes(code)) return { text: '强降雨', icon: '🌧️', severity: 6 };
  if ([61, 63, 66, 80, 81].includes(code)) return { text: '有雨', icon: '🌧️', severity: 5 };
  if ([51, 53, 55, 56, 57].includes(code)) return { text: '毛毛雨', icon: '🌦️', severity: 4 };
  if ([45, 48].includes(code)) return { text: '有雾', icon: '🌫️', severity: 3 };
  if (code === 3) return { text: '阴天', icon: '☁️', severity: 2 };
  if ([1, 2].includes(code)) return { text: '多云间晴', icon: '🌤️', severity: 1 };
  return { text: '晴朗', icon: '☀️', severity: 0 };
};

const riskInfo = point => {
  const cold = Math.min(point.dayLow, point.nightLow);
  if (point.wind >= 55 || point.snow >= 5 || cold <= -18) return { status: '严峻', level: 'danger' };
  if (point.wind >= 40 || point.snow >= 2 || cold <= -10) return { status: '高风险', level: 'danger' };
  if (point.wind >= 30 || point.snow > 0 || point.rain >= 55 || cold <= -5) return { status: '谨慎', level: 'warn' };
  return { status: '适宜', level: 'good' };
};

const enrichWeather = point => ({ ...point, ...riskInfo(point), weather: weatherInfo(point.code) });
let weatherRoute = route.map(enrichWeather);

const formatRange = (low, high) => `${Math.round(low)}°~${Math.round(high)}°`;
const numberValues = values => values.filter(Number.isFinite);
const average = values => {
  const valid = numberValues(values);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
};
const datePlus = (date, days) => {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};

const TRIP_START_DATE = '2026-09-25';
const TRIP_END_DATE = '2026-10-07';
const forecastWindow = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = type => parts.find(part => part.type === type).value;
  const today = `${get('year')}-${get('month')}-${get('day')}`;
  const maxDate = datePlus(today, 15);
  const availableStart = today;
  const availableEnd = maxDate;
  const valid = TRIP_START_DATE <= availableEnd && TRIP_END_DATE >= availableStart;
  return { start: TRIP_START_DATE, end: TRIP_END_DATE, availableStart, availableEnd, valid };
};

const fetchModel = async (model, startDate, endDate, signal) => {
  const params = new URLSearchParams({
    latitude: weatherLocations.map(point => point.lat).join(','),
    longitude: weatherLocations.map(point => point.lon).join(','),
    elevation: weatherLocations.map(point => point.alt).join(','),
    hourly: HOURLY_FIELDS.join(','),
    timezone: 'Asia/Kathmandu',
    wind_speed_unit: 'kmh',
    start_date: startDate,
    end_date: endDate,
    models: model,
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!response.ok) throw new Error(`Open-Meteo ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};

const fuseResponses = responses => weatherLocations.map((_, locationIndex) => {
  const sources = responses.map(response => response[locationIndex]).filter(item => item?.hourly?.time);
  if (!sources.length) return null;
  const times = [...new Set(sources.flatMap(source => source.hourly.time))].sort();
  const indexes = sources.map(source => new Map(source.hourly.time.map((time, index) => [time, index])));
  const hourly = { time: times };
  HOURLY_FIELDS.forEach(field => {
    hourly[field] = times.map(time => {
      const values = sources.map((source, sourceIndex) => source.hourly[field]?.[indexes[sourceIndex].get(time)]).filter(Number.isFinite);
      if (field === 'weather_code') return values.sort((a, b) => weatherInfo(b).severity - weatherInfo(a).severity)[0] ?? null;
      return average(values);
    });
  });
  return { hourly };
});

const aggregateLocation = (point, payload) => {
  if (!payload?.hourly?.time) return null;
  const records = payload.hourly.time.map((time, index) => ({
    date: time.slice(0, 10), hour: Number(time.slice(11, 13)),
    temp: payload.hourly.temperature_2m?.[index], rain: payload.hourly.precipitation_probability?.[index],
    snow: payload.hourly.snowfall?.[index], code: payload.hourly.weather_code?.[index], wind: payload.hourly.wind_gusts_10m?.[index],
  }));
  const today = records.filter(record => record.date === point.fullDate);
  if (!today.length) return null;
  const dayTemps = numberValues(today.filter(record => record.hour >= 6 && record.hour < 18).map(record => record.temp));
  const nextDate = datePlus(point.fullDate, 1);
  const eveningTemps = numberValues(today.filter(record => record.hour >= 18).map(record => record.temp));
  const nextMorningTemps = numberValues(records.filter(record => record.date === nextDate && record.hour < 6).map(record => record.temp));
  const nightTemps = nextMorningTemps.length
    ? [...eveningTemps, ...nextMorningTemps]
    : numberValues(today.filter(record => record.hour < 6 || record.hour >= 18).map(record => record.temp));
  if (!dayTemps.length || !nightTemps.length) return null;
  const codes = numberValues(today.map(record => record.code)).sort((a, b) => weatherInfo(b).severity - weatherInfo(a).severity);
  return enrichWeather({
    ...point, source: 'live', dayLow: Math.min(...dayTemps), dayHigh: Math.max(...dayTemps),
    nightLow: Math.min(...nightTemps), nightHigh: Math.max(...nightTemps),
    rain: Math.round(Math.max(...numberValues(today.map(record => record.rain)), 0)),
    snow: Math.round(numberValues(today.map(record => record.snow)).reduce((sum, value) => sum + value, 0) * 10) / 10,
    wind: Math.round(Math.max(...numberValues(today.map(record => record.wind)), 0)), code: codes[0] ?? 0,
  });
};

const tripDates = route.map(({ day, fullDate, date }) => ({ day, fullDate, date }));
const emptyEndpointPoint = (location, role, tripDate, source) => enrichWeather({
  ...location, ...tripDate, role, dayLow: 0, dayHigh: 0, nightLow: 0, nightHigh: 0,
  rain: 0, snow: 0, wind: 0, code: 0, source,
});
const endpointMatrix = resolvePoint => dailyEndpoints.map(day => ({
  ...day,
  groups: day.points.map(({ role, location }) => ({
    role,
    location,
    forecasts: tripDates.map(tripDate => resolvePoint(location, role, tripDate)),
  })),
}));

const endpointWeatherFromResponses = (fused, window) => endpointMatrix((location, role, tripDate) => {
  if (tripDate.fullDate < window.availableStart || tripDate.fullDate > window.availableEnd) return emptyEndpointPoint(location, role, tripDate, 'out-of-range');
  const payload = fused[weatherLocationIndexes.get(locationKey(location))];
  const base = { ...location, ...tripDate, role };
  return aggregateLocation(base, payload) || emptyEndpointPoint(location, role, tripDate, 'pending');
});

const routeFallbackLocationIds = {
  D1: 'kathmandu', D2: 'phakding', D3: 'namche', D4: 'dingboche', D5: 'lobuche',
  D6: 'ebc', D7: 'kalapatthar', D8: 'chola', D9: 'gokyo', D10: 'dole',
  D11: 'lukla', D12: 'kathmandu', D13: 'kathmandu',
};
const fallbackEndpointWeather = () => endpointMatrix((location, role, tripDate) => {
  const fallback = route.find(point => point.fullDate === tripDate.fullDate
    && (locationKey(point) === locationKey(location) || routeFallbackLocationIds[point.day] === location.id));
  return fallback
    ? enrichWeather({ ...fallback, ...location, role, source: 'fallback' })
    : emptyEndpointPoint(location, role, tripDate, 'pending');
});

const emptyEndpointWeather = source => endpointMatrix((location, role, tripDate) => emptyEndpointPoint(location, role, tripDate, source));
let endpointWeather = emptyEndpointWeather('pending');

const endpointWeatherRow = point => {
  const hasData = point.source === 'live' || point.source === 'fallback';
  const sourceLabel = point.source === 'live' ? '实时' : point.source === 'fallback' ? '回退' : point.source === 'out-of-range' ? '超出范围' : '暂无实时数据';
  return `<tr class="${hasData ? '' : 'unavailable'}"><td>${point.fullDate}<small>${sourceLabel}</small></td><td>${point.place}</td><td>${point.alt.toLocaleString()}m</td><td>${hasData ? `${point.weather.icon} ${point.weather.text}` : sourceLabel}</td><td>${hasData ? formatRange(point.dayLow, point.dayHigh) : '—'}</td><td>${hasData ? formatRange(point.nightLow, point.nightHigh) : '—'}</td><td>${hasData ? `${point.rain}%` : '—'}</td><td>${hasData ? `${point.snow} cm` : '—'}</td><td>${hasData ? `${point.wind} km/h` : '—'}</td><td>${hasData ? `<b class="risk ${point.level}"><i></i>${point.status}</b>` : `<b class="range-badge">${sourceLabel}</b>`}</td></tr>`;
};
const endpointWeatherTable = day => `<div class="endpoint-weather-groups">${day.groups.map(group => `<details class="endpoint-location-group"><summary><b>${group.role}</b><span>${group.location.place}</span><small>${group.location.alt.toLocaleString()}m · 13 天</small><i>⌄</i></summary><div class="endpoint-table-wrap"><table class="endpoint-weather-table"><thead><tr><th>日期</th><th>地点</th><th>海拔</th><th>天气</th><th>白天温度范围</th><th>夜晚温度范围</th><th>降水概率</th><th>降雪量</th><th>最大阵风</th><th>风险等级</th></tr></thead><tbody>${group.forecasts.map(endpointWeatherRow).join('')}</tbody></table></div></details>`).join('')}</div>`;

const renderEndpointWeather = days => {
  endpointWeather = days;
  days.forEach(day => {
    const target = document.querySelector(`[data-endpoint-weather="${day.day}"]`);
    if (target) target.innerHTML = endpointWeatherTable(day);
  });
};

const forecastRows = points => points.map(point => {
  const unavailable = point.source === 'unavailable';
  const sourceLabel = point.source === 'live' ? '实时' : point.source === 'fallback' ? '回退' : '超出范围';
  return `<div class="table-row ${unavailable ? 'unavailable' : ''}"><span class="day">${point.day}<small>${point.date} · ${sourceLabel}</small></span><span class="place"><b>${point.place}</b><small>${point.alt.toLocaleString()}m · ${point.lat.toFixed(3)}, ${point.lon.toFixed(3)}</small></span><span class="weather-cell"><span class="weather-icon">${unavailable ? '—' : point.weather.icon}</span><small>${unavailable ? '超出可预报范围' : point.weather.text}</small></span><span class="temp-pair"><b><i>昼</i>${unavailable ? '—' : formatRange(point.dayLow, point.dayHigh)}</b><b><i>夜</i>${unavailable ? '—' : formatRange(point.nightLow, point.nightHigh)}</b></span><span><b class="rain">${unavailable ? '—' : `${point.rain}%`}</b><small>概率</small></span><span><b class="snow-value">${unavailable ? '—' : `${point.snow} cm`}</b><small>新雪</small></span><span><b>${unavailable ? '—' : `${point.wind} km/h`}</b><small>最大阵风</small></span><span>${unavailable ? '<b class="range-badge">超出范围</b>' : `<b class="risk ${point.level}"><i></i>${point.status}</b>`}</span></div>`;
}).join('');

const chartMarkup = points => {
  const available = points.filter(point => point.source !== 'unavailable');
  const lows = available.flatMap(point => [point.dayLow, point.nightLow]);
  const highs = available.flatMap(point => [point.dayHigh, point.nightHigh]);
  const min = Math.floor((Math.min(...lows, -5) - 5) / 5) * 5;
  const max = Math.ceil((Math.max(...highs, 5) + 5) / 5) * 5;
  const span = max - min;
  return `<div class="combined-plot"><div class="temperature-grid"><i></i><i></i><i></i><i class="zero"></i><i></i><i></i><i></i></div><svg class="altitude-line" viewBox="0 0 920 220" preserveAspectRatio="none" aria-hidden="true"><path d="M ${points.map((point,index)=>`${(index+.5)*(920/points.length)} ${210-((point.alt-1400)/4300)*190}`).join(' L ')}"/></svg><div class="altitude-points" style="grid-template-columns:repeat(${points.length},1fr)">${points.map(point=>`<div><i style="bottom:${((point.alt-1400)/4300)*190+10}px" title="${point.place} ${point.alt}m"></i></div>`).join('')}</div><div class="combined-temp-bars" style="grid-template-columns:repeat(${points.length},1fr)">${points.map(point => {
    if (point.source === 'unavailable') return '<div class="combined-day no-data"><span>超出范围</span></div>';
    const dayBottom=((point.dayLow-min)/span)*210, nightBottom=((point.nightLow-min)/span)*210;
    const dayHeight=Math.max(((point.dayHigh-point.dayLow)/span)*210, 4), nightHeight=Math.max(((point.nightHigh-point.nightLow)/span)*210, 4);
    return `<div class="combined-day"><div class="range-wrap day-range" style="bottom:${dayBottom}px;height:${dayHeight}px"><small>${Math.round(point.dayHigh)}°</small><i></i><small>${Math.round(point.dayLow)}°</small></div><div class="range-wrap night-range" style="bottom:${nightBottom}px;height:${nightHeight}px"><small>${Math.round(point.nightHigh)}°</small><i></i><small>${Math.round(point.nightLow)}°</small></div></div>`;
  }).join('')}</div><div class="route-labels" style="grid-template-columns:repeat(${points.length},1fr)">${points.map(point=>`<span><em>${point.date}</em><b>${point.place.split(' ')[0]}</b></span>`).join('')}</div></div><div class="altitude-axis"><span>5,700m</span><span>4,300m</span><span>2,900m</span><span>1,400m</span></div><div class="temperature-axis"><span>${max}°C</span><span>${Math.round(max-span/6)}°C</span><span>${Math.round(max-span*2/6)}°C</span><span>${Math.round(max-span*3/6)}°C</span><span>${Math.round(max-span*4/6)}°C</span><span>${Math.round(max-span*5/6)}°C</span><span>${min}°C</span></div>`;
};

const summaryMarkup = points => {
  const available = points.filter(point => point.source !== 'unavailable');
  const score = available.length ? Math.max(15, Math.round(100 - average(available.map(point => point.level === 'danger' ? 65 : point.level === 'warn' ? 32 : 8)))) : 0;
  const minTemp = available.length ? Math.round(Math.min(...available.map(point => point.nightLow))) : '—';
  const maxTemp = available.length ? Math.round(Math.max(...available.map(point => point.dayHigh))) : '—';
  const gustPoint = available.reduce((best, point) => !best || point.wind > best.wind ? point : best, null);
  const snow = Math.round(available.reduce((sum, point) => sum + point.snow, 0) * 10) / 10;
  return `<article class="score-card dark-card"><div class="card-head"><span class="tag">综合研判</span><span class="live"><i></i>${available.some(point => point.source === 'live') ? '实时更新' : '回退数据'}</span></div><div class="score-row"><strong>${score || '—'}</strong><div><b>整体适宜度</b><span>${score >= 70 ? '整体条件适宜，仍需关注山区变化' : '条件有限，重点关注高海拔风雪'}</span></div></div><div class="score-bar"><span style="width:${score}%"></span></div><div class="score-scale"><span>严峻</span><span>谨慎</span><span>适宜</span><span>理想</span></div></article><article class="metric-card"><div class="metric-icon temp">♨</div><span>预报温度范围</span><strong>${minTemp}° <small>至</small> ${maxTemp}°</strong><p>白天与夜间小时数据聚合</p></article><article class="metric-card"><div class="metric-icon wind">≋</div><span>最大阵风</span><strong>${gustPoint?.wind ?? '—'} <small>km/h</small></strong><p>${gustPoint ? `${gustPoint.place.split(' ')[0]} · ${gustPoint.date}` : '暂无有效预报'}</p></article><article class="metric-card"><div class="metric-icon snow">✣</div><span>累计新雪</span><strong>${snow} <small>cm</small></strong><p>有效预报日期累计</p></article>`;
};

const trackByDay = new Map(dayTracks.map(day => [day.day, day]));
const endpointDetails = day => `<section class="endpoint-weather-details"><h4>关键节点天气</h4><div data-endpoint-weather="${day}">${endpointWeatherTable(endpointWeather.find(item => item.day === day))}</div></section>`;
const dayTrackCards = () => itinerary.map((item, index) => {
  const dayId = `D${index + 1}`;
  const day = trackByDay.get(dayId);
  const headerExtra = day
    ? `<div class="track-stats"><span><small>轨迹距离</small><b>${day.distance.toFixed(1)} km</b></span><span><small>当日爬升</small><b>${day.ascent.toLocaleString()} m</b></span><span><small>当日下降</small><b>${day.descent.toLocaleString()} m</b></span><span><small>最低海拔</small><b>${day.minAlt.toLocaleString()} m</b></span><span><small>最高海拔</small><b>${day.maxAlt.toLocaleString()} m</b></span></div>`
    : `<div class="non-hiking-status"><b>${dayId === 'D12' ? '飞行日' : '城市日'}</b><span>无徒步轨迹</span></div>`;
  const trackDetails = day
    ? `<details class="track-details"><summary>查看轨迹平面图与海拔图<span>⌄</span></summary><div class="track-visuals"><figure><figcaption>轨迹平面图</figcaption>${routeMap(day.points, day.day, fullTrack, day.landmarks)}</figure><figure><figcaption>海拔剖面图</figcaption>${elevationSvg(day.points, day.day, day.distance, day.landmarks)}</figure></div></details>`
    : '';
  return `<article class="track-day-card"><div class="track-card-head"><div><span class="track-day">${dayId} · ${item.date}</span><h3>${item.route}</h3><p class="track-itinerary-meta">${item.meta} · 住宿：${item.stay}</p></div>${headerExtra}</div>${trackDetails}${endpointDetails(dayId)}</article>`;
}).join('');

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#"><span class="brand-mark">徒</span><span>徒步助手</span></a>
    <nav><a class="active" href="#overview">路线总览</a><a href="#risk">温度趋势</a><a href="#forecast">逐日预报</a><a href="#tracks">轨迹剖析</a><a href="#itinerary">行程指南</a></nav>
  </header>

  <main>
    <section class="hero" id="overview">
      <h1>珠峰大本营徒步<br><em>天气与风险导航</em></h1>
      <p>融合多源气象模型，提供逐点预报、风险研判与行程建议。</p>
      <div class="hero-meta">
        <span>2026.09.25 — 10.07</span><i></i><span>EBC · Gokyo</span><i></i><span>最高 5,550 m</span>
      </div>
    </section>

    <section class="control-panel">
      <div class="field route-field dropdown-field"><label>当前路线</label><button class="dropdown-trigger" id="routeTrigger" aria-expanded="false"><span class="route-dot"></span><b>EBC · Gokyo 环线</b><small>13 天 · 每日天气全覆盖</small><span class="chevron">⌄</span></button><div class="dropdown-menu" id="routeMenu"><button class="dropdown-option active" data-value="EBC · Gokyo 环线" data-detail="13 天 · 每日天气全覆盖"><b>EBC · Gokyo 环线</b><small>当前 13 天行程</small><i>✓</i></button><button class="dropdown-option" disabled><b>EBC 经典线</b><small>暂未配置行程</small></button><button class="dropdown-option" disabled><b>三垭口环线</b><small>暂未配置行程</small></button></div></div>
      <div class="field"><label>出发日期</label><button class="date-button"><span>▣</span><b>2026 年 09 月 25 日</b></button></div>
      <div class="field model-field dropdown-field"><label>预报模型</label><button class="dropdown-trigger" id="modelTrigger" aria-expanded="false"><span class="pulse"></span><b>智能融合</b><small>ECMWF · GFS · ICON</small><span class="chevron">⌄</span></button><div class="dropdown-menu" id="modelMenu"><button class="dropdown-option active" data-model="blend" data-value="智能融合" data-detail="ECMWF · GFS · ICON"><b>智能融合</b><small>多模型综合研判</small><i>✓</i></button><button class="dropdown-option" data-model="ecmwf" data-value="ECMWF IFS" data-detail="欧洲中期天气预报中心"><b>ECMWF IFS</b><small>欧洲中期天气预报中心</small><i></i></button><button class="dropdown-option" data-model="gfs" data-value="NOAA GFS" data-detail="美国全球预报系统"><b>NOAA GFS</b><small>美国全球预报系统</small><i></i></button><button class="dropdown-option" data-model="icon" data-value="DWD ICON" data-detail="德国全球预报模型"><b>DWD ICON</b><small>德国全球预报模型</small><i></i></button></div></div>
      <button class="refresh" id="refresh"><span>↻</span><b>刷新预报</b></button>
      <div class="weather-status fallback" id="weatherStatus" role="status">正在获取 Open-Meteo 实时预报；加载完成前显示回退数据。</div>
    </section>

    <section class="summary-grid" id="summaryGrid">${summaryMarkup(weatherRoute)}</section>

    <section class="dashboard" id="risk">
      <div class="route-card">
        <div class="section-title"><div><span class="tag light">温度趋势</span><h2>海拔与昼夜温度范围</h2></div><div class="legend"><span><i class="alt-point-key"></i>海拔</span><span><i class="day-key"></i>白天</span><span><i class="night-key"></i>夜晚</span></div></div>
        <p class="chart-description">红色折线与圆点表示海拔；温度柱顶部与底部分别为最高、最低温，虚线为 0°C。</p>
        <div class="combined-chart temperature-only-chart" id="temperatureChart">${chartMarkup(weatherRoute)}</div>

      </div>


    </section>

    <section class="forecast-section" id="forecast">
      <div class="forecast-header"><div><span class="tag light">行程天气</span><h2>每日住宿点与关键垭口</h2><p>按 09 月 25 日—10 月 07 日行程映射 · 当地时间</p></div><div class="updated"><i></i><span>最后更新<br><b id="updatedTime">刚刚</b></span></div></div>
      <div class="forecast-table">
        <div class="table-row table-head"><span>行程</span><span>地点 / 海拔</span><span>天气</span><span>白天 / 夜晚</span><span>降水</span><span>降雪</span><span>风速</span><span>风险等级</span></div>
        <div id="forecastRows">${forecastRows(weatherRoute)}</div>
      </div>
    </section>

    <section class="tracks-section" id="tracks">
      <div class="forecast-header"><div><span class="tag light">真实 KML 轨迹</span><h2>每日徒步轨迹与海拔</h2><p>D1—D13 · 09 月 25 日—10 月 07 日 · 行程与关键节点天气</p></div><span class="trip-badge">13 个日卡 · 10 个徒步日</span></div>
      <div class="complete-track-grid">
        <article class="full-track-card"><div class="track-card-head"><div><span class="track-day">完整路线</span><h3>EBC · Gokyo 全程轨迹</h3></div><div class="track-stats"><span><small>总距离</small><b>${fullDistance.toFixed(1)} km</b></span><span><small>累计爬升</small><b>${fullAscent.toLocaleString()} m</b></span><span><small>累计下降</small><b>${fullDescent.toLocaleString()} m</b></span><span><small>最低海拔</small><b>${fullMinAlt.toLocaleString()} m</b></span><span><small>最高海拔</small><b>${fullMaxAlt.toLocaleString()} m</b></span></div></div><figure>${routeMap(fullTrack, '全程', null, fullLandmarks)}</figure></article>
        <article class="full-track-card"><div class="track-card-head"><div><span class="track-day">完整剖面</span><h3>全程海拔变化</h3></div></div><figure>${elevationSvg(fullTrack, '完整路线', fullDistance, fullDayMarkers)}</figure></article>
      </div>
      <div class="track-day-list">
        ${dayTrackCards()}
      </div>
    </section>

    <section class="itinerary-section" id="itinerary">
      <div class="forecast-header"><div><span class="tag light">13 天计划</span><h2>每日行程安排</h2><p>2026 年 09 月 25 日 — 10 月 07 日 · EBC、曲拉山口与高乔湖环线</p></div><span class="trip-badge">最高点 5,550m</span></div>
      <div class="itinerary-list">
        ${itinerary.map(item=>`<article class="itinerary-row ${item.level}"><div class="trip-date"><b>${item.date}</b><span>${item.day}</span></div><div class="trip-route"><b>${item.route}</b><span>${item.meta}</span></div><div class="trip-stay"><small>住宿</small><b>${item.stay}</b></div><i></i></article>`).join('')}
      </div>
      <div class="altitude-note"><b>高海拔提示</b><span>全程无专门休整日。第 6—8 天连续经过 EBC、卡拉帕塔和曲拉山口，应重点评估高反、风寒、积雪和体力恢复情况，并服从当地向导判断。</span></div>
    </section>

  </main>
  <footer><b>徒步助手</b><span>高海拔天气，仅供行程规划参考。山区气象瞬息万变，请结合现场判断。</span><span>天气数据 © <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · ECMWF / NOAA GFS / DWD ICON</span></footer>
`;

initializeSatelliteMaps();

const renderWeather = (points, status, state = 'live') => {
  weatherRoute = points;
  document.querySelector('#summaryGrid').innerHTML = summaryMarkup(points);
  document.querySelector('#temperatureChart').innerHTML = chartMarkup(points);
  document.querySelector('#forecastRows').innerHTML = forecastRows(points);
  const statusElement = document.querySelector('#weatherStatus');
  statusElement.className = `weather-status ${state}`;
  statusElement.textContent = status;
};

const loadWeather = async () => {
  if (activeRequest) {
    activeRequest.abort();
    activeRequest = null;
  }
  const button = document.querySelector('#refresh');
  const statusElement = document.querySelector('#weatherStatus');
  const model = MODEL_OPTIONS[selectedModel];
  const window = forecastWindow();
  button.disabled = true;
  button.classList.add('loading');
  button.querySelector('b').textContent = '更新中…';
  statusElement.className = 'weather-status loading';
  statusElement.textContent = `正在请求 Open-Meteo · ${model.label}…`;
  renderEndpointWeather(emptyEndpointWeather('pending'));

  if (!window.valid) {
    const unavailable = route.map(point => ({ ...enrichWeather(point), source: 'unavailable' }));
    renderWeather(unavailable, '整个行程已超出 Open-Meteo 当前可预报范围。', 'warning');
    renderEndpointWeather(emptyEndpointWeather('out-of-range'));
    document.querySelector('#updatedTime').textContent = '无有效预报';
    button.disabled = false;
    button.classList.remove('loading');
    button.querySelector('b').textContent = '刷新预报';
    return;
  }

  const controller = new AbortController();
  activeRequest = controller;
  try {
    const responses = await Promise.all(model.models.map(item => fetchModel(item, window.start, window.end, controller.signal)));
    const fused = fuseResponses(responses);
    const points = route.map(point => {
      if (point.fullDate < window.availableStart || point.fullDate > window.availableEnd) return { ...enrichWeather(point), source: 'unavailable' };
      return aggregateLocation(point, fused[weatherLocationIndexes.get(locationKey(point))]) || { ...enrichWeather(point), source: 'unavailable' };
    });
    const liveCount = points.filter(point => point.source === 'live').length;
    const rangeNote = liveCount < route.length ? `；${route.length - liveCount} 天超出可预报范围` : '';
    renderWeather(points, `实时 Open-Meteo · ${model.label}${rangeNote}`, 'live');
    renderEndpointWeather(endpointWeatherFromResponses(fused, window));
    document.querySelector('#updatedTime').textContent = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    if (error.name !== 'AbortError') {
      renderWeather(route.map(enrichWeather), '实时数据获取失败，当前为回退数据', 'error');
      renderEndpointWeather(fallbackEndpointWeather());
      document.querySelector('#updatedTime').textContent = '获取失败 · 回退数据';
      console.error('Open-Meteo forecast request failed:', error);
    }
  } finally {
    if (activeRequest === controller) {
      activeRequest = null;
      button.disabled = false;
      button.classList.remove('loading');
      button.querySelector('b').textContent = '刷新预报';
    }
  }
};

const dropdowns = document.querySelectorAll('.dropdown-field');
dropdowns.forEach(field => {
  const trigger = field.querySelector('.dropdown-trigger');
  const menu = field.querySelector('.dropdown-menu');
  trigger.addEventListener('click', event => {
    event.stopPropagation();
    dropdowns.forEach(other => {
      if (other !== field) {
        other.classList.remove('open');
        other.querySelector('.dropdown-trigger').setAttribute('aria-expanded', 'false');
      }
    });
    const open = field.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('.dropdown-option:not(:disabled)').forEach(option => {
    option.addEventListener('click', event => {
      event.stopPropagation();
      menu.querySelectorAll('.dropdown-option').forEach(item => {
        item.classList.remove('active');
        const mark = item.querySelector('i');
        if (mark) mark.textContent = '';
      });
      option.classList.add('active');
      option.querySelector('i').textContent = '✓';
      trigger.querySelector('b').textContent = option.dataset.value;
      trigger.querySelector('small').textContent = option.dataset.detail;
      field.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (option.dataset.model && option.dataset.model !== selectedModel) {
        selectedModel = option.dataset.model;
        loadWeather();
      }
    });
  });
});
document.addEventListener('click', () => dropdowns.forEach(field => {
  field.classList.remove('open');
  field.querySelector('.dropdown-trigger').setAttribute('aria-expanded', 'false');
}));

document.querySelector('#refresh').addEventListener('click', loadWeather);
loadWeather();

