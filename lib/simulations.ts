// Single source of truth for reading simulations, merging real (user-created)
// and demo (seeded) records without ever writing demo data into the same
// AsyncStorage key as real data. Replaces the duplicated formatting logic
// that used to live separately in the Simulations tab and Results screen.

import { demoSimulations, type SimulationResult } from "@/lib/demoSimulations";

export interface FormattedSimulation {
  id: string;
  buildingName: string;
  interventionType: string;
  isDemo: boolean;
  createdAt: string;
  results: {
    baseline: { annualEmissions: number };
    projected: { annualEmissions: number; annualReduction: number; reductionPercentage: number };
    financial: { implementationCost: number; annualSavings: number; paybackPeriod: number; roi: number; npv: number };
    confidence: { level: "high" | "medium" | "low"; percentage: number; factors: string[] };
  };
}

function mapInterventionType(scenarioType: string): string {
  const t = scenarioType.toLowerCase();
  if (t.includes("solar")) return "solar";
  if (t.includes("wind")) return "wind";
  if (t.includes("hvac") || t.includes("energy") || t.includes("process")) return "hvac";
  return "envelope";
}

/** Formats one seeded demo simulation into the shape every screen renders. */
export function formatDemoSimulation(sim: SimulationResult): FormattedSimulation {
  // Demo simulations only carry a reduction %, not a real baseline tonnage,
  // so a fixed reference baseline is used to derive an illustrative tons figure.
  const baselineEmissions = 1000;
  const annualReduction = baselineEmissions * (sim.carbonReduction / 100);

  return {
    id: sim.id,
    buildingName: sim.buildingName,
    interventionType: mapInterventionType(sim.scenarioType),
    isDemo: true,
    createdAt: sim.date,
    results: {
      baseline: { annualEmissions: baselineEmissions },
      projected: {
        annualEmissions: baselineEmissions - annualReduction,
        annualReduction,
        reductionPercentage: sim.carbonReduction,
      },
      financial: {
        implementationCost: sim.costSavings / (sim.roi / 100),
        annualSavings: sim.costSavings,
        paybackPeriod: sim.paybackPeriod,
        roi: sim.roi,
        npv: sim.costSavings * 15,
      },
      confidence: {
        level: sim.confidence >= 90 ? "high" : sim.confidence >= 80 ? "medium" : "low",
        percentage: sim.confidence,
        factors: ["Building data quality", "Historical performance", "Weather patterns"],
      },
    },
  };
}

export function getFormattedDemoSimulations(): FormattedSimulation[] {
  return demoSimulations.map(formatDemoSimulation);
}

/**
 * Normalizes a raw simulation record as saved by the New Simulation wizard
 * (the direct output of `analyzeCarbonImpact`) into the same shape as demo
 * simulations. Also the one place that maps `twentyYearNPV` -> `npv` -- the
 * field name the results screen actually reads.
 */
export function normalizeUserSimulation(raw: any): FormattedSimulation {
  const baseline = raw?.results?.baseline ?? { annualEmissions: 0 };
  const projected = raw?.results?.projected ?? { annualEmissions: 0, reductionPercentage: 0 };
  const financial = raw?.results?.financial ?? {};
  const confidence = raw?.results?.confidence ?? {};
  const annualReduction =
    projected.annualReduction ?? Math.max(0, (baseline.annualEmissions ?? 0) - (projected.annualEmissions ?? 0));

  return {
    id: raw.id,
    buildingName: raw.buildingName,
    interventionType: raw.interventionType,
    isDemo: false,
    createdAt: raw.createdAt,
    results: {
      baseline: { annualEmissions: baseline.annualEmissions ?? 0 },
      projected: {
        annualEmissions: projected.annualEmissions ?? 0,
        annualReduction,
        reductionPercentage: projected.reductionPercentage ?? 0,
      },
      financial: {
        implementationCost: financial.implementationCost ?? 0,
        annualSavings: financial.annualSavings ?? 0,
        paybackPeriod: financial.paybackPeriod ?? 0,
        roi: financial.roi ?? 0,
        npv: financial.npv ?? financial.twentyYearNPV ?? 0,
      },
      confidence: {
        level: confidence.level ?? "medium",
        percentage: confidence.percentage ?? 75,
        factors: confidence.factors ?? ["Building data quality", "Historical performance", "Weather patterns"],
      },
    },
  };
}

export async function loadUserSimulations(): Promise<FormattedSimulation[]> {
  const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
  try {
    const data = await AsyncStorage.getItem("simulations");
    const raw = data ? JSON.parse(data) : [];
    return raw.map(normalizeUserSimulation);
  } catch (error) {
    console.error("Failed to load user simulations", error);
    return [];
  }
}

/** Merges real + demo simulations, newest first. Demo data is never persisted. */
export async function loadAllSimulations(): Promise<FormattedSimulation[]> {
  const userSims = await loadUserSimulations();
  const demoSims = getFormattedDemoSimulations();
  return [...userSims, ...demoSims].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getSimulationById(id: string): Promise<FormattedSimulation | undefined> {
  const all = await loadAllSimulations();
  return all.find((s) => s.id === id);
}
