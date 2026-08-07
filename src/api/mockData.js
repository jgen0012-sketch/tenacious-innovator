// 本地 Mock 数据，用于开发阶段无后端时展示 UI
// 数据模拟墨尔本市中心真实传感器位置

export const mockSensorLocations = [
  { sensorId: 1, name: 'Bourke St Mall (North)',     lat: -37.8132, lng: 144.9653, status: 'active' },
  { sensorId: 2, name: 'Flinders St Station',        lat: -37.8183, lng: 144.9671, status: 'active' },
  { sensorId: 3, name: 'Swanston St / Collins St',   lat: -37.8143, lng: 144.9669, status: 'active' },
  { sensorId: 4, name: 'Melbourne Central',           lat: -37.8101, lng: 144.9631, status: 'active' },
  { sensorId: 5, name: 'Federation Square',           lat: -37.8179, lng: 144.9691, status: 'active' },
  { sensorId: 6, name: 'Queen Victoria Market',      lat: -37.8072, lng: 144.9568, status: 'active' },
  { sensorId: 7, name: 'Lygon St / Carlton',         lat: -37.7990, lng: 144.9667, status: 'active' },
  { sensorId: 8, name: 'Docklands / Waterfront City',lat: -37.8145, lng: 144.9481, status: 'active' },
]

export const mockLiveCountsPerMinute = [
  { sensorId: 1, timestamp: new Date().toISOString(), count: 72 },
  { sensorId: 2, timestamp: new Date().toISOString(), count: 95 },
  { sensorId: 3, timestamp: new Date().toISOString(), count: 18 },
  { sensorId: 4, timestamp: new Date().toISOString(), count: 41 },
  { sensorId: 5, timestamp: new Date().toISOString(), count: 63 },
  { sensorId: 6, timestamp: new Date().toISOString(), count: 12 },
  { sensorId: 7, timestamp: new Date().toISOString(), count: 8  },
  { sensorId: 8, timestamp: new Date().toISOString(), count: 29 },
]

export const mockRoutes = [
  {
    routeId: 'r1',
    distance: 850,
    duration: 11,
    sensoryScore: 'low',
    note: 'Avoids Bourke St Mall. Quieter side streets via Little Collins St.',
    geometry: { type: 'LineString', coordinates: [] },
    waypoints: []
  },
  {
    routeId: 'r2',
    distance: 620,
    duration: 8,
    sensoryScore: 'moderate',
    note: 'Slightly shorter but passes Federation Square during peak hour.',
    geometry: { type: 'LineString', coordinates: [] },
    waypoints: []
  },
  {
    routeId: 'r3',
    distance: 530,
    duration: 7,
    sensoryScore: 'high',
    note: 'Fastest route but goes through Swanston St high-density corridor.',
    geometry: { type: 'LineString', coordinates: [] },
    waypoints: []
  }
]

export const mockRefuges = [
  { id: 1, name: 'Carlton Gardens',          type: 'Park',    lat: -37.8044, lng: 144.9723, distance: 320, crowdLevel: 'low',      address: 'Carlton Gardens, Melbourne VIC 3000' },
  { id: 2, name: 'State Library Victoria',   type: 'Library', lat: -37.8098, lng: 144.9642, distance: 180, crowdLevel: 'low',      address: '328 Swanston St, Melbourne VIC 3000'  },
  { id: 3, name: 'Melbourne Museum',         type: 'Museum',  lat: -37.8030, lng: 144.9716, distance: 490, crowdLevel: 'moderate', address: '11 Nicholson St, Carlton VIC 3053'    },
  { id: 4, name: 'Treasury Gardens',         type: 'Park',    lat: -37.8132, lng: 144.9742, distance: 410, crowdLevel: 'low',      address: 'Spring St, Melbourne VIC 3000'        },
  { id: 5, name: 'Pellegrini\'s Espresso Bar', type: 'Cafe', lat: -37.8140, lng: 144.9683, distance: 95,  crowdLevel: 'low',      address: '66 Bourke St, Melbourne VIC 3000'     },
  { id: 6, name: 'NGV International',        type: 'Gallery', lat: -37.8225, lng: 144.9685, distance: 560, crowdLevel: 'low',      address: '180 St Kilda Rd, Melbourne VIC 3004'  },
]
