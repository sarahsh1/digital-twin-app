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
];

export function getSimulationsForBuilding(buildingId: string): SimulationResult[] {
  return demoSimulations.filter(sim => sim.buildingId === buildingId);
}

export function getAllSimulations(): SimulationResult[] {
  return demoSimulations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
