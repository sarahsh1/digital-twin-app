// Pre-loaded demo buildings for prominent Bahraini institutions

export interface DemoBuilding {
  id: string;
  name: string;
  type: string;
  size: number; // square feet
  floors: number;
  location: string;
  image?: string;
  model3D?: string; // Path to 3D wireframe model
  solarModel?: string; // Path to solar simulation 3D model
  createdAt: string;
  description: string;
  currentEmissions: number; // tons CO2/year
  energyConsumption: number; // kWh/year
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
    description: "Government environmental agency headquarters with modern sustainable design and advanced building management systems",
    currentEmissions: 750,
    energyConsumption: 3500000,
    image: require("@/assets/demo-buildings/sce-building.jpg"),
    model3D: require("@/assets/demo-buildings/sce-building-3d-wireframe.png"),
    solarModel: require("@/assets/demo-buildings/sce-building-solar-simulation.png"),
    createdAt: new Date("2024-01-01").toISOString(),
  },
  // 2. Bapco
  {
    id: "demo-bapco",
    name: "Bahrain Petroleum Company (Bapco)",
    type: "industrial",
    size: 4300000, // Large refinery complex, estimated
    floors: 3,
    location: "Sitra, Bahrain",
    description: "National oil company with refinery operations, administrative buildings, and extensive industrial infrastructure",
    currentEmissions: 9800,
    energyConsumption: 72000000,
    image: require("@/assets/demo-buildings/bapco-refinery.jpg"),
    model3D: require("@/assets/demo-buildings/bapco-refinery-3d.png"),
    solarModel: require("@/assets/demo-buildings/bapco-refinery-solar.png"),
    createdAt: new Date("2024-01-02").toISOString(),
  },
  // 3. Alba
  {
    id: "demo-alba",
    name: "Aluminium Bahrain (Alba)",
    type: "industrial",
    size: 5380000, // Large industrial facility, estimated
    floors: 2,
    location: "Askar, Bahrain",
    description: "One of the world's largest aluminum smelters with extensive production facilities and power generation infrastructure",
    currentEmissions: 12500,
    energyConsumption: 85000000,
    image: require("@/assets/demo-buildings/alba-facility.jpg"),
    model3D: require("@/assets/demo-buildings/alba-facility-3d.png"),
    solarModel: require("@/assets/demo-buildings/alba-facility-solar.png"),
    createdAt: new Date("2024-01-03").toISOString(),
  },
  // 4. Kingdom University
  {
    id: "demo-kingdom-university",
    name: "Kingdom University",
    type: "educational",
    size: 77500, // 7204 sqm = ~77,500 sqft
    floors: 6,
    location: "Riffa, Bahrain",
    description: "Leading private university in Bahrain with modern campus facilities including library, laboratories, and administrative buildings",
    currentEmissions: 580,
    energyConsumption: 2850000,
    image: require("@/assets/demo-buildings/kingdom-university.jpg"),
    model3D: require("@/assets/demo-buildings/kingdom-university-3d.png"),
    solarModel: require("@/assets/demo-buildings/kingdom-university-solar.png"),
    createdAt: new Date("2024-01-04").toISOString(),
  },
  // 5. King Hamad Hospital
  {
    id: "demo-king-hamad-hospital",
    name: "King Hamad University Hospital",
    type: "healthcare",
    size: 688900, // 64,000 sqm = ~688,900 sqft
    floors: 4,
    location: "Busaiteen, Muharraq",
    description: "State-of-the-art university hospital with three main buildings, National Oncology Centre, and cutting-edge medical facilities",
    currentEmissions: 4200,
    energyConsumption: 18500000,
    image: require("@/assets/demo-buildings/king-hamad-hospital.jpg"),
    model3D: require("@/assets/demo-buildings/king-hamad-hospital-3d.png"),
    solarModel: require("@/assets/demo-buildings/king-hamad-hospital-solar.png"),
    createdAt: new Date("2024-01-05").toISOString(),
  },
  // 6. Almarifa School
  {
    id: "demo-almarifa-school",
    name: "Almarifa Girls High School",
    type: "educational",
    size: 95000, // Estimated for large high school
    floors: 3,
    location: "Riffa, Bahrain",
    description: "Modern educational facility with classrooms, laboratories, sports facilities, and administrative areas",
    currentEmissions: 320,
    energyConsumption: 1650000,
    image: require("@/assets/demo-buildings/almarifa-school.jpg"),
    model3D: require("@/assets/demo-buildings/almarifa-school-3d.png"),
    solarModel: require("@/assets/demo-buildings/almarifa-school-solar.png"),
    createdAt: new Date("2024-01-06").toISOString(),
  },
];

// Helper function to load demo buildings into AsyncStorage
export const loadDemoBuildings = async () => {
  try {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    const existingData = await AsyncStorage.getItem("buildings");
    const existing = existingData ? JSON.parse(existingData) : [];
    
    // Only add demo buildings if they don't already exist
    const demoIds = new Set(demoBuildings.map(b => b.id));
    const userBuildings = existing.filter((b: DemoBuilding) => !demoIds.has(b.id));
    
    // Always put demo buildings first, then user buildings
    const combined = [...demoBuildings, ...userBuildings];
    await AsyncStorage.setItem("buildings", JSON.stringify(combined));
    
    return combined;
  } catch (error) {
    console.error("Error loading demo buildings:", error);
    return demoBuildings;
  }
};
