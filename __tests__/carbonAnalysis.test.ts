import { describe, it, expect } from "vitest";
import {
  calculateBaselineEmissions,
  analyzeCarbonImpact,
  generateAIRecommendations,
  type BuildingData,
  type SimulationScenario,
} from "@/lib/carbonAnalysis";

describe("Carbon Analysis Engine", () => {
  const testBuilding: BuildingData = {
    size: 60000,
    floors: 18,
    location: "Bahrain",
    buildingType: "office",
  };

  describe("calculateBaselineEmissions", () => {
    it("should calculate baseline emissions for office building", () => {
      const result = calculateBaselineEmissions(testBuilding);
      
      expect(result.energyConsumption).toBeGreaterThan(0);
      expect(result.annualEmissions).toBeGreaterThan(0);
      expect(result.energyCost).toBeGreaterThan(0);
    });

    it("should calculate correct energy consumption based on building size", () => {
      const result = calculateBaselineEmissions(testBuilding);
      
      // Office buildings: ~15.5 kWh/sqft/year
      const expectedEnergy = 60000 * 15.5;
      expect(result.energyConsumption).toBe(expectedEnergy);
    });

    it("should calculate emissions with correct factor", () => {
      const result = calculateBaselineEmissions(testBuilding);
      
      // 0.65 kg CO₂/kWh = 0.00065 tons CO₂/kWh
      const expectedEmissions = (result.energyConsumption * 0.65) / 1000;
      expect(result.annualEmissions).toBe(expectedEmissions);
    });
  });

  describe("analyzeCarbonImpact - Solar", () => {
    const solarScenario: SimulationScenario = {
      type: "solar",
      parameters: {
        solarCapacity: 300,
      },
    };

    it("should calculate solar panel impact correctly", () => {
      const result = analyzeCarbonImpact(testBuilding, solarScenario);
      
      expect(result.baseline).toBeDefined();
      expect(result.projected).toBeDefined();
      expect(result.financial).toBeDefined();
      expect(result.confidence).toBeDefined();
    });

    it("should show carbon reduction from solar", () => {
      const result = analyzeCarbonImpact(testBuilding, solarScenario);
      
      expect(result.projected.annualEmissions).toBeLessThan(result.baseline.annualEmissions);
      expect(result.projected.reductionPercentage).toBeGreaterThan(0);
      expect(result.projected.reductionPercentage).toBeLessThan(100);
    });

    it("should calculate realistic solar financial metrics", () => {
      const result = analyzeCarbonImpact(testBuilding, solarScenario);
      
      // 300 kW * 1000 W/kW * $2.5/W
      const expectedCost = 300 * 1000 * 2.5;
      expect(result.financial.implementationCost).toBe(expectedCost);
      
      expect(result.financial.paybackPeriod).toBeGreaterThan(0);
      expect(result.financial.paybackPeriod).toBeLessThan(20); // Reasonable payback
      expect(result.financial.roi).toBeGreaterThan(0);
    });

    it("should have high confidence for solar predictions", () => {
      const result = analyzeCarbonImpact(testBuilding, solarScenario);
      
      expect(result.confidence.level).toBe("high");
      expect(result.confidence.percentage).toBeGreaterThan(85);
    });
  });

  describe("analyzeCarbonImpact - HVAC", () => {
    const hvacScenario: SimulationScenario = {
      type: "hvac",
      parameters: {
        hvacEfficiencyGain: 20,
      },
    };

    it("should calculate HVAC optimization impact", () => {
      const result = analyzeCarbonImpact(testBuilding, hvacScenario);
      
      expect(result.projected.reductionPercentage).toBeGreaterThan(0);
      expect(result.financial.implementationCost).toBeGreaterThan(0);
      expect(result.financial.paybackPeriod).toBeLessThan(20); // HVAC payback period
    });
  });

  describe("analyzeCarbonImpact - Combined", () => {
    const combinedScenario: SimulationScenario = {
      type: "combined",
      parameters: {
        solarCapacity: 300,
        hvacEfficiencyGain: 20,
      },
    };

    it("should calculate combined strategy with synergy", () => {
      const result = analyzeCarbonImpact(testBuilding, combinedScenario);
      
      // Combined should have higher reduction than individual
      expect(result.projected.reductionPercentage).toBeGreaterThan(30);
      expect(result.projected.reductionPercentage).toBeLessThan(60); // With synergy factor
    });

    it("should sum costs for combined strategy", () => {
      const result = analyzeCarbonImpact(testBuilding, combinedScenario);
      
      // Should be sum of solar + HVAC costs
      expect(result.financial.implementationCost).toBeGreaterThan(600000);
    });
  });

  describe("generateAIRecommendations", () => {
    it("should generate recommendations for large buildings", () => {
      const recommendations = generateAIRecommendations(testBuilding);
      
      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it("should recommend solar for buildings over 20,000 sqft", () => {
      const recommendations = generateAIRecommendations(testBuilding);
      
      const hasSolarRecommendation = recommendations.some(rec => 
        rec.toLowerCase().includes("solar")
      );
      expect(hasSolarRecommendation).toBe(true);
    });

    it("should recommend HVAC for office buildings", () => {
      const recommendations = generateAIRecommendations(testBuilding);
      
      const hasHVACRecommendation = recommendations.some(rec => 
        rec.toLowerCase().includes("hvac")
      );
      expect(hasHVACRecommendation).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle small buildings", () => {
      const smallBuilding: BuildingData = {
        size: 5000,
        floors: 2,
        location: "Bahrain",
        buildingType: "residential",
      };

      const result = calculateBaselineEmissions(smallBuilding);
      expect(result.energyConsumption).toBeGreaterThan(0);
    });

    it("should handle industrial buildings with higher intensity", () => {
      const industrial: BuildingData = {
        size: 100000,
        floors: 5,
        location: "Bahrain",
        buildingType: "industrial",
      };

      const result = calculateBaselineEmissions(industrial);
      
      // Industrial should have higher energy intensity
      const officeResult = calculateBaselineEmissions(testBuilding);
      const industrialIntensity = result.energyConsumption / industrial.size;
      const officeIntensity = officeResult.energyConsumption / testBuilding.size;
      
      expect(industrialIntensity).toBeGreaterThan(officeIntensity);
    });
  });
});
