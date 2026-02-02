// Pre-loaded simulation results for demo buildings

export interface SimulationResult {
  id: string;
  buildingId: string;
  buildingName: string;
  scenarioType: string;
  date: string;
  carbonReduction: number;
  costSavings: number;
  roi: number;
  paybackPeriod: number;
  confidence: number;
}

export const demoSimulations: SimulationResult[] = [
  // SCE Building Simulations
  {
    id: "sim-sce-1",
    buildingId: "sce-building",
    buildingName: "Supreme Council for Environment (SCE)",
    scenarioType: "Solar Panels",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 32,
    costSavings: 85000,
    roi: 145,
    paybackPeriod: 9.2,
    confidence: 92,
  },
  {
    id: "sim-sce-2",
    buildingId: "sce-building",
    buildingName: "Supreme Council for Environment (SCE)",
    scenarioType: "HVAC Optimization",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 28,
    costSavings: 62000,
    roi: 185,
    paybackPeriod: 6.5,
    confidence: 88,
  },
  
  // Bapco Simulations
  {
    id: "sim-bapco-1",
    buildingId: "bapco-refinery",
    buildingName: "Bahrain Petroleum Company (Bapco)",
    scenarioType: "Solar Panels",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 18,
    costSavings: 2400000,
    roi: 165,
    paybackPeriod: 11.8,
    confidence: 85,
  },
  {
    id: "sim-bapco-2",
    buildingId: "bapco-refinery",
    buildingName: "Bahrain Petroleum Company (Bapco)",
    scenarioType: "Energy Management System",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 22,
    costSavings: 1800000,
    roi: 210,
    paybackPeriod: 7.2,
    confidence: 90,
  },
  
  // Alba Simulations
  {
    id: "sim-alba-1",
    buildingId: "alba-facility",
    buildingName: "Aluminium Bahrain (Alba)",
    scenarioType: "Solar Panels",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 15,
    costSavings: 3200000,
    roi: 155,
    paybackPeriod: 13.5,
    confidence: 82,
  },
  {
    id: "sim-alba-2",
    buildingId: "alba-facility",
    buildingName: "Aluminium Bahrain (Alba)",
    scenarioType: "Process Optimization",
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 25,
    costSavings: 4500000,
    roi: 225,
    paybackPeriod: 8.8,
    confidence: 88,
  },
  
  // Kingdom University Simulations
  {
    id: "sim-ku-1",
    buildingId: "kingdom-university",
    buildingName: "Kingdom University",
    scenarioType: "Solar Panels",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 35,
    costSavings: 95000,
    roi: 170,
    paybackPeriod: 8.5,
    confidence: 91,
  },
  {
    id: "sim-ku-2",
    buildingId: "kingdom-university",
    buildingName: "Kingdom University",
    scenarioType: "HVAC Optimization",
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 30,
    costSavings: 72000,
    roi: 195,
    paybackPeriod: 6.8,
    confidence: 89,
  },
  
  // King Hamad Hospital Simulations
  {
    id: "sim-kh-1",
    buildingId: "king-hamad-hospital",
    buildingName: "King Hamad University Hospital",
    scenarioType: "Solar Panels",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 28,
    costSavings: 420000,
    roi: 160,
    paybackPeriod: 10.2,
    confidence: 87,
  },
  {
    id: "sim-kh-2",
    buildingId: "king-hamad-hospital",
    buildingName: "King Hamad University Hospital",
    scenarioType: "HVAC Optimization",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 32,
    costSavings: 380000,
    roi: 205,
    paybackPeriod: 7.5,
    confidence: 90,
  },
  
  // Almarifa School Simulations
  {
    id: "sim-almarifa-1",
    buildingId: "almarifa-school",
    buildingName: "Almarifa Girls High School",
    scenarioType: "Solar Panels",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 38,
    costSavings: 42000,
    roi: 175,
    paybackPeriod: 8.8,
    confidence: 90,
  },
  {
    id: "sim-almarifa-2",
    buildingId: "almarifa-school",
    buildingName: "Almarifa Girls High School",
    scenarioType: "Building Envelope",
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    carbonReduction: 25,
    costSavings: 28000,
    roi: 140,
    paybackPeriod: 9.5,
    confidence: 85,
  },
];

export function getSimulationsForBuilding(buildingId: string): SimulationResult[] {
  return demoSimulations.filter(sim => sim.buildingId === buildingId);
}

export function getAllSimulations(): SimulationResult[] {
  return demoSimulations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
