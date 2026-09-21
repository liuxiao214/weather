import './style.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { hikingDays, trackSegments } from './trackData.js';

const route = [
  { day: 'D1', date: '09-25', place: '加德满都 Kathmandu', alt: 1400, dayTemp: 26, nightTemp: 18, rain: 38, snow: 0, wind: 10, icon: 'cloud-sun', status: '适宜', level: 'good' },
  { day: 'D2', date: '09-26', place: '卢卡拉 Lukla', alt: 2860, dayTemp: 11, nightTemp: 3, rain: 24, snow: 0, wind: 18, icon: 'cloud-sun', status: '适宜', level: 'good' },
  { day: 'D3', date: '09-27', place: '南池巴扎 Namche', alt: 3440, dayTemp: 8, nightTemp: -1, rain: 32, snow: 0, wind: 24, icon: 'cloud', status: '适宜', level: 'good' },
  { day: 'D4', date: '09-28', place: '丁波切 Dingboche', alt: 4410, dayTemp: 2, nightTemp: -8, rain: 18, snow: 1, wind: 36, icon: 'wind', status: '谨慎', level: 'warn' },
  { day: 'D5', date: '09-29', place: '罗布切 Lobuche', alt: 4910, dayTemp: -1, nightTemp: -12, rain: 12, snow: 3, wind: 43, icon: 'snow', status: '高风险', level: 'danger' },
  { day: 'D6', date: '09-30', place: '珠峰大本营 EBC', alt: 5364, dayTemp: -5, nightTemp: -18, rain: 14, snow: 5, wind: 56, icon: 'snow', status: '严峻', level: 'danger' },
  { day: 'D7', date: '10-01', place: '卡拉帕塔 Kala Patthar', alt: 5550, dayTemp: -7, nightTemp: -20, rain: 10, snow: 2, wind: 62, icon: 'wind', status: '严峻', level: 'danger' },
  { day: 'D8', date: '10-02', place: '曲拉山口 Cho La', alt: 5420, dayTemp: -6, nightTemp: -19, rain: 16, snow: 6, wind: 58, icon: 'snow', status: '严峻', level: 'danger' },
  { day: 'D9', date: '10-03', place: '高乔湖 Gokyo', alt: 4790, dayTemp: 0, nightTemp: -13, rain: 15, snow: 1, wind: 39, icon: 'cloud-sun', status: '谨慎', level: 'warn' },
  { day: 'D10', date: '10-04', place: '多勒 Dole', alt: 4200, dayTemp: 4, nightTemp: -7, rain: 22, snow: 0, wind: 31, icon: 'cloud', status: '谨慎', level: 'warn' },
  { day: 'D11', date: '10-05', place: '卢卡拉 Lukla', alt: 2860, dayTemp: 10, nightTemp: 2, rain: 30, snow: 0, wind: 20, icon: 'cloud-sun', status: '适宜', level: 'good' },
  { day: 'D12', date: '10-06', place: '加德满都 Kathmandu', alt: 1400, dayTemp: 25, nightTemp: 17, rain: 35, snow: 0, wind: 9, icon: 'cloud-sun', status: '适宜', level: 'good' },
  { day: 'D13', date: '10-07', place: '加德满都 Kathmandu', alt: 1400, dayTemp: 26, nightTemp: 17, rain: 28, snow: 0, wind: 8, icon: 'cloud-sun', status: '适宜', level: 'good' },
];

route.forEach(point => {
  point.dayRange = `${point.dayTemp - 2}°~${point.dayTemp + 2}°`;
  point.nightRange = `${point.nightTemp - 2}°~${point.nightTemp + 2}°`;
});

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

const icon = (type) => ({
  'cloud-sun': '<span class="weather-icon">🌤️</span>', cloud: '<span class="weather-icon">☁️</span>',
  snow: '<span class="weather-icon">🌨️</span>', wind: '<span class="weather-icon">💨</span>'
}[type]);

const weatherText = (point) => {
  if (point.snow >= 5) return '中雪';
  if (point.snow > 0) return '小雪';
  if (point.icon === 'wind') return '晴间多云·风大';
  if (point.icon === 'cloud') return '阴到多云';
  return point.rain >= 35 ? '多云有阵雨' : '多云间晴';
};

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
      <div class="field model-field dropdown-field"><label>预报模型</label><button class="dropdown-trigger" id="modelTrigger" aria-expanded="false"><span class="pulse"></span><b>智能融合</b><small>ECMWF · GFS · ICON</small><span class="chevron">⌄</span></button><div class="dropdown-menu" id="modelMenu"><button class="dropdown-option active" data-value="智能融合" data-detail="ECMWF · GFS · ICON"><b>智能融合</b><small>多模型综合研判</small><i>✓</i></button><button class="dropdown-option" data-value="ECMWF IFS" data-detail="欧洲中期天气预报中心"><b>ECMWF IFS</b><small>欧洲中期天气预报中心</small><i></i></button><button class="dropdown-option" data-value="NOAA GFS" data-detail="美国全球预报系统"><b>NOAA GFS</b><small>美国全球预报系统</small><i></i></button><button class="dropdown-option" data-value="DWD ICON" data-detail="德国全球预报模型"><b>DWD ICON</b><small>德国全球预报模型</small><i></i></button></div></div>
      <button class="refresh" id="refresh"><span>↻</span><b>刷新预报</b></button>
    </section>

    <section class="summary-grid">
      <article class="score-card dark-card">
        <div class="card-head"><span class="tag">综合研判</span><span class="live"><i></i>实时更新</span></div>
        <div class="score-row"><strong>68</strong><div><b>整体适宜度</b><span>条件尚可，需关注高海拔大风</span></div></div>
        <div class="score-bar"><span style="width:68%"></span></div>
        <div class="score-scale"><span>严峻</span><span>谨慎</span><span>适宜</span><span>理想</span></div>
      </article>
      <article class="metric-card"><div class="metric-icon temp">♨</div><span>体感温度范围</span><strong>-24° <small>至</small> 12°</strong><p>昼夜温差显著</p></article>
      <article class="metric-card"><div class="metric-icon wind">≋</div><span>最大阵风</span><strong>62 <small>km/h</small></strong><p>卡拉帕塔 · 10 月 01 日</p></article>
      <article class="metric-card"><div class="metric-icon snow">✣</div><span>累计新雪</span><strong>18 <small>cm</small></strong><p>4,500m 以上</p></article>
    </section>

    <section class="dashboard" id="risk">
      <div class="route-card">
        <div class="section-title"><div><span class="tag light">温度趋势</span><h2>海拔与昼夜温度范围</h2></div><div class="legend"><span><i class="alt-point-key"></i>海拔</span><span><i class="day-key"></i>白天</span><span><i class="night-key"></i>夜晚</span></div></div>
        <p class="chart-description">红色折线与圆点表示海拔；温度柱顶部与底部分别为最高、最低温，虚线为 0°C。</p>
        <div class="combined-chart temperature-only-chart">
          <div class="combined-plot">
            <div class="temperature-grid"><i></i><i></i><i></i><i class="zero"></i><i></i><i></i><i></i></div>
            <svg class="altitude-line" viewBox="0 0 920 220" preserveAspectRatio="none" aria-hidden="true"><path d="M ${route.map((p,i)=>`${(i+.5)*(920/route.length)} ${210-((p.alt-1400)/4300)*190}`).join(' L ')}"/></svg>
            <div class="altitude-points" style="grid-template-columns:repeat(${route.length},1fr)">${route.map(p=>`<div><i style="bottom:${((p.alt-1400)/4300)*190+10}px" title="${p.place} ${p.alt}m"></i></div>`).join('')}</div>
            <div class="combined-temp-bars" style="grid-template-columns:repeat(${route.length},1fr)">
              ${route.map(p=>{const min=-25,span=60;const dayLow=p.dayTemp-2,dayHigh=p.dayTemp+2,nightLow=p.nightTemp-2,nightHigh=p.nightTemp+2;const dayBottom=((dayLow-min)/span)*210;const nightBottom=((nightLow-min)/span)*210;const dayHeight=((dayHigh-dayLow)/span)*210;const nightHeight=((nightHigh-nightLow)/span)*210;return `<div class="combined-day"><div class="range-wrap day-range" style="bottom:${dayBottom}px;height:${dayHeight}px"><small>${dayHigh}°</small><i></i><small>${dayLow}°</small></div><div class="range-wrap night-range" style="bottom:${nightBottom}px;height:${nightHeight}px"><small>${nightHigh}°</small><i></i><small>${nightLow}°</small></div></div>`}).join('')}
            </div>
            <div class="route-labels" style="grid-template-columns:repeat(${route.length},1fr)">${route.map(p=>`<span><em>${p.date}</em><b>${p.place.split(' ')[0]}</b></span>`).join('')}</div>
          </div>
          <div class="altitude-axis"><span>5,700m</span><span>4,300m</span><span>2,900m</span><span>1,400m</span></div>
          <div class="temperature-axis"><span>35°C</span><span>25°C</span><span>15°C</span><span>5°C</span><span>-5°C</span><span>-15°C</span><span>-25°C</span></div>
        </div>

      </div>


    </section>

    <section class="forecast-section" id="forecast">
      <div class="forecast-header"><div><span class="tag light">行程天气</span><h2>每日住宿点与关键垭口</h2><p>按 09 月 25 日—10 月 07 日行程映射 · 当地时间</p></div><div class="updated"><i></i><span>最后更新<br><b id="updatedTime">刚刚</b></span></div></div>
      <div class="forecast-table">
        <div class="table-row table-head"><span>行程</span><span>地点 / 海拔</span><span>天气</span><span>白天 / 夜晚</span><span>降水</span><span>降雪</span><span>风速</span><span>风险等级</span></div>
        ${route.map(p=>`<div class="table-row"><span class="day">${p.day}<small>${p.date}</small></span><span class="place"><b>${p.place}</b><small>${p.alt.toLocaleString()}m</small></span><span class="weather-cell">${icon(p.icon)}<small>${weatherText(p)}</small></span><span class="temp-pair"><b><i>昼</i>${p.dayRange}</b><b><i>夜</i>${p.nightRange}</b></span><span><b class="rain">${p.rain}%</b><small>概率</small></span><span><b class="snow-value">${p.snow} cm</b><small>新雪</small></span><span><b>${p.wind} km/h</b><small>阵风 ${p.wind+12}</small></span><span><b class="risk ${p.level}"><i></i>${p.status}</b></span></div>`).join('')}
      </div>
    </section>

    <section class="tracks-section" id="tracks">
      <div class="forecast-header"><div><span class="tag light">真实 KML 轨迹</span><h2>每日徒步轨迹与海拔</h2><p>D2—D11 · 经纬度投影与累计距离剖面</p></div><span class="trip-badge">10 个徒步日</span></div>
      <div class="complete-track-grid">
        <article class="full-track-card"><div class="track-card-head"><div><span class="track-day">完整路线</span><h3>EBC · Gokyo 全程轨迹</h3></div><div class="track-stats"><span><small>总距离</small><b>${fullDistance.toFixed(1)} km</b></span><span><small>累计爬升</small><b>${fullAscent.toLocaleString()} m</b></span><span><small>累计下降</small><b>${fullDescent.toLocaleString()} m</b></span><span><small>最低海拔</small><b>${fullMinAlt.toLocaleString()} m</b></span><span><small>最高海拔</small><b>${fullMaxAlt.toLocaleString()} m</b></span></div></div><figure>${routeMap(fullTrack, '全程', null, fullLandmarks)}</figure></article>
        <article class="full-track-card"><div class="track-card-head"><div><span class="track-day">完整剖面</span><h3>全程海拔变化</h3></div></div><figure>${elevationSvg(fullTrack, '完整路线', fullDistance, fullDayMarkers)}</figure></article>
      </div>
      <div class="track-day-list">
        ${dayTracks.map(day => { const item = itinerary[day.itineraryIndex]; return `<article class="track-day-card"><div class="track-card-head"><div><span class="track-day">${day.day} · ${item.date}</span><h3>${item.route}</h3></div><div class="track-stats"><span><small>轨迹距离</small><b>${day.distance.toFixed(1)} km</b></span><span><small>当日爬升</small><b>${day.ascent.toLocaleString()} m</b></span><span><small>当日下降</small><b>${day.descent.toLocaleString()} m</b></span><span><small>最低海拔</small><b>${day.minAlt.toLocaleString()} m</b></span><span><small>最高海拔</small><b>${day.maxAlt.toLocaleString()} m</b></span></div></div><details class="track-details"><summary>查看轨迹平面图与海拔图<span>⌄</span></summary><div class="track-visuals"><figure><figcaption>轨迹平面图</figcaption>${routeMap(day.points, day.day, fullTrack, day.landmarks)}</figure><figure><figcaption>海拔剖面图</figcaption>${elevationSvg(day.points, day.day, day.distance, day.landmarks)}</figure></div></details></article>`; }).join('')}
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
  <footer><b>徒步助手</b><span>高海拔天气，仅供行程规划参考。山区气象瞬息万变，请结合现场判断。</span><span>数据源 · ECMWF / NOAA GFS / DWD ICON</span></footer>
`;

initializeSatelliteMaps();

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
    });
  });
});
document.addEventListener('click', () => dropdowns.forEach(field => {
  field.classList.remove('open');
  field.querySelector('.dropdown-trigger').setAttribute('aria-expanded', 'false');
}));

document.querySelector('#refresh').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.classList.add('loading');
  button.querySelector('b').textContent = '更新中…';
  setTimeout(() => {
    button.classList.remove('loading');
    button.querySelector('b').textContent = '刷新预报';
    document.querySelector('#updatedTime').textContent = new Date().toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'});
  }, 900);
});

