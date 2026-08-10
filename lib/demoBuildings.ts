// Pre-loaded demo buildings for prominent Bahraini institutions

export interface DemoBuilding {
  id: string;
  name: string;
  type: string;
  size: number; // square feet
  floors: number;
  location: string;
  lat?: number;
  lng?: number;
  image?: string;
  model3D?: string; // Path to 3D wireframe model
  solarModel?: string; // Path to solar simulation 3D model
  createdAt: string;
  description: string;
  currentEmissions: number; // tons CO2/year
  energyConsumption: number; // kWh/year
  isDemo: true;
}

export const demoBuildings: DemoBuilding[] = [
  // 1. Supreme Council for Environment (SCE) - FIRST
  {
    id: "demo-sce-building",
    name: "Supreme Council for Environment (SCE)",
    type: "government",
    size: 125000,
    floors: 5,
    location: "Manama, Bahrain",
    lat: 26.2285,
    lng: 50.586,
    description: "Government environmental agency headquarters with modern sustainable design and advanced building management systems",
    currentEmissions: 750,
    energyConsumption: 3500000,
    image: require("@/assets/demo-buildings/sce-building.jpg"),
    model3D: require("@/assets/demo-buildings/sce-building-3d-wireframe.png"),
    solarModel: require("@/assets/demo-buildings/sce-building-solar-simulation.png"),
    createdAt: new Date("2024-01-01").toISOString(),
    isDemo: true,
  },
  // 2. Bapco
  {
    id: "demo-bapco",
    name: "Bahrain Petroleum Company (Bapco)",
    type: "industrial",
    size: 4300000, // Large refinery complex, estimated
    floors: 3,
    location: "Sitra, Bahrain",
    lat: 26.1518,
    lng: 50.6199,
    description: "National oil company with refinery operations, administrative buildings, and extensive industrial infrastructure",
    currentEmissions: 9800,
    energyConsumption: 72000000,
    image: require("@/assets/demo-buildings/bapco-refinery.jpg"),
    model3D: require("@/assets/demo-buildings/bapco-refinery-3d.png"),
    solarModel: require("@/assets/demo-buildings/bapco-refinery-solar.png"),
    createdAt: new Date("2024-01-02").toISOString(),
    isDemo: true,
  },
  // 3. KFUPM -- no real photo/3D/solar assets provided yet, so image fields
  // are left unset; the app's icon fallback renders instead of a fabricated
  // or mismatched visual. Size/floors/emissions/energy are illustrative
  // estimates (neither of us had real figures), same convention as Bapco's
  // "estimated" size above.
  {
    id: "demo-kfupm",
    name: "King Fahd University of Petroleum and Minerals (KFUPM)",
    type: "educational",
    size: 3500000, // Large multi-college campus, estimated
    floors: 5, // Representative academic building, estimated
    location: "Dhahran, Saudi Arabia",
    lat: 26.3055,
    lng: 50.1394,
    description: "Leading research university and petroleum engineering institution with extensive academic, research, and residential facilities across a large campus",
    currentEmissions: 4200, // tons CO2/year, estimated
    energyConsumption: 28000000, // kWh/year, estimated
    createdAt: new Date("2024-01-03").toISOString(),
    isDemo: true,
  },
];

// Demo building ids that have existed at any point, including ones since
// retired from `demoBuildings` above. Used so loadDemoBuildings can prune
// stale samples out of previously-saved storage, not just skip re-adding
// current ones.
const ALL_KNOWN_DEMO_IDS = new Set([
  "demo-sce-building",
  "demo-bapco",
  "demo-kfupm",
  "demo-alba",
  "demo-kingdom-university",
  "demo-king-hamad-hospital",
  "demo-almarifa-school",
]);

// Helper function to load demo buildings into AsyncStorage
export const loadDemoBuildings = async () => {
  try {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    const existingData = await AsyncStorage.getItem("buildings");
    const existing = existingData ? JSON.parse(existingData) : [];
    
    // Keep real user buildings; drop anything that's a current or
    // since-retired demo id so retired samples don't linger in storage.
    const userBuildings = existing.filter((b: DemoBuilding) => !ALL_KNOWN_DEMO_IDS.has(b.id));
    
    // Always put demo buildings first, then user buildings
    const combined = [...demoBuildings, ...userBuildings];
    await AsyncStorage.setItem("buildings", JSON.stringify(combined));
    
    return combined;
  } catch (error) {
    console.error("Error loading demo buildings:", error);
    return demoBuildings;
  }
};
