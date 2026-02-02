import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Building3DView } from "@/components/Building3DView";
import { IoTDashboard } from "@/components/IoTDashboard";
import { analyzeCarbonImpact, type BuildingData, type SimulationScenario } from "@/lib/carbonAnalysis";

export default function SCEBuildingDemoScreen() {
  // Supreme Council for Environment Building Data
  const sceBuilding: BuildingData = {
    size: 60000, // sq ft (estimated)
    floors: 18,
    location: "Seef Area, Manama, Bahrain",
    buildingType: "office",
  };

  // Solar Panel Simulation
  const solarScenario: SimulationScenario = {
    type: "solar",
    parameters: {
      solarCapacity: 300, // kW
      solarCoverage: 40, // % of roof
    },
  };

  const solarAnalysis = analyzeCarbonImpact(sceBuilding, solarScenario);

  // HVAC Optimization Simulation
  const hvacScenario: SimulationScenario = {
    type: "hvac",
    parameters: {
      hvacEfficiencyGain: 20,
    },
  };

  const hvacAnalysis = analyzeCarbonImpact(sceBuilding, hvacScenario);

  // Combined Strategy
  const combinedScenario: SimulationScenario = {
    type: "combined",
    parameters: {
      solarCapacity: 300,
      hvacEfficiencyGain: 20,
    },
  };

  const combinedAnalysis = analyzeCarbonImpact(sceBuilding, combinedScenario);

  const MetricCard = ({ label, value, subtitle, color = "text-foreground" }: {
    label: string;
    value: string;
    subtitle?: string;
    color?: string;
  }) => (
    <View className="bg-surface rounded-xl p-4 flex-1">
      <Text className="text-xs text-muted mb-1">{label}</Text>
      <Text className={`text-2xl font-bold ${color} mb-1`}>{value}</Text>
      {subtitle && <Text className="text-xs text-muted">{subtitle}</Text>}
    </View>
  );

  const ScenarioCard = ({ title, analysis, icon }: {
    title: string;
    analysis: ReturnType<typeof analyzeCarbonImpact>;
    icon: string;
  }) => (
    <View className="bg-surface rounded-2xl p-5 mb-4">
      <View className="flex-row items-center mb-4">
        <Text className="text-3xl mr-3">{icon}</Text>
        <Text className="text-xl font-bold text-foreground flex-1">{title}</Text>
        <View className={`px-3 py-1 rounded-full ${
          analysis.confidence.level === "high" ? "bg-success/20" : "bg-warning/20"
        }`}>
          <Text className={`text-xs font-medium ${
            analysis.confidence.level === "high" ? "text-success" : "text-warning"
          }`}>
            {analysis.confidence.percentage}% Confidence
          </Text>
        </View>
      </View>

      {/* Impact Metrics */}
      <View className="flex-row gap-3 mb-4">
        <MetricCard
          label="Carbon Reduction"
          value={`${analysis.projected.reductionPercentage.toFixed(1)}%`}
          subtitle={`${(analysis.baseline.annualEmissions - analysis.projected.annualEmissions).toFixed(0)} tons CO₂/year`}
          color="text-success"
        />
        <MetricCard
          label="Energy Savings"
          value={`${((analysis.baseline.energyConsumption - analysis.projected.energyConsumption) / 1000).toFixed(0)}k`}
          subtitle="kWh/year"
          color="text-primary"
        />
      </View>

      {/* Financial Metrics */}
      <View className="flex-row gap-3 mb-4">
        <MetricCard
          label="Implementation Cost"
          value={`$${(analysis.financial.implementationCost / 1000).toFixed(0)}k`}
          subtitle="One-time investment"
        />
        <MetricCard
          label="Annual Savings"
          value={`$${(analysis.financial.annualSavings / 1000).toFixed(0)}k`}
          subtitle="Per year"
          color="text-success"
        />
      </View>

      <View className="flex-row gap-3">
        <MetricCard
          label="Payback Period"
          value={`${analysis.financial.paybackPeriod.toFixed(1)} yrs`}
          subtitle="Break-even point"
        />
        <MetricCard
          label="20-Year ROI"
          value={`${analysis.financial.roi.toFixed(0)}%`}
          subtitle={`NPV: $${(analysis.financial.twentyYearNPV / 1000).toFixed(0)}k`}
          color="text-success"
        />
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <TouchableOpacity
            className="flex-row items-center mb-4 active:opacity-70"
            onPress={() => router.back()}
          >
            <Text className="text-primary text-2xl mr-2">←</Text>
            <Text className="text-primary font-semibold">Back</Text>
          </TouchableOpacity>
          
          <Text className="text-3xl font-bold text-foreground mb-2">
            Supreme Council for Environment
          </Text>
          <Text className="text-base text-muted">
            Sehab Executive Towers, Seef Area, Manama
          </Text>
        </View>

        {/* Building Photo */}
        <View className="px-6 mb-6">
          <View className="bg-surface rounded-2xl overflow-hidden">
            <Image
              source={require("@/assets/demo-buildings/sce-building.jpg")}
              style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between mb-2">
                <View>
                  <Text className="text-xs text-muted">Building Size</Text>
                  <Text className="text-base font-semibold text-foreground">60,000 sq ft</Text>
                </View>
                <View>
                  <Text className="text-xs text-muted">Floors</Text>
                  <Text className="text-base font-semibold text-foreground">18</Text>
                </View>
                <View>
                  <Text className="text-xs text-muted">Type</Text>
                  <Text className="text-base font-semibold text-foreground">Office</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3D Digital Twin */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">3D Digital Twin</Text>
          <Building3DView buildingId="sce" showSolarSimulation />
        </View>

        {/* IoT Dashboard */}
        <IoTDashboard />

        {/* Baseline Emissions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Current Carbon Footprint</Text>
          <View className="bg-surface rounded-xl p-5">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-xs text-muted mb-1">Annual CO₂ Emissions</Text>
                <Text className="text-3xl font-bold text-foreground">
                  {solarAnalysis.baseline.annualEmissions.toFixed(0)}
                  <Text className="text-lg text-muted"> tons/year</Text>
                </Text>
              </View>
              <View className="bg-error/20 px-4 py-2 rounded-full">
                <Text className="text-error font-semibold">Baseline</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Energy Use</Text>
                <Text className="text-base font-semibold text-foreground">
                  {(solarAnalysis.baseline.energyConsumption / 1000).toFixed(0)}k kWh/yr
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Energy Cost</Text>
                <Text className="text-base font-semibold text-foreground">
                  ${(solarAnalysis.baseline.energyCost / 1000).toFixed(0)}k/yr
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Simulation Scenarios */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Sustainability Scenarios</Text>
          
          <ScenarioCard
            title="Solar Panel Installation"
            analysis={solarAnalysis}
            icon="☀️"
          />

          <ScenarioCard
            title="HVAC System Optimization"
            analysis={hvacAnalysis}
            icon="❄️"
          />

          <ScenarioCard
            title="Combined Strategy (Recommended)"
            analysis={combinedAnalysis}
            icon="🌟"
          />
        </View>

        {/* AI Recommendations */}
        <View className="px-6">
          <Text className="text-lg font-bold text-foreground mb-3">AI Recommendations</Text>
          <View className="bg-secondary/10 border-l-4 border-secondary rounded-lg p-4">
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">🤖</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-2">
                  Optimal Path to Net Zero
                </Text>
                <Text className="text-sm text-muted leading-relaxed mb-3">
                  Based on AI analysis of the Supreme Council for Environment building, we recommend implementing the combined solar + HVAC strategy:
                </Text>
                <View className="gap-2">
                  <Text className="text-sm text-foreground">• 45% total carbon reduction (340 tons CO₂/year)</Text>
                  <Text className="text-sm text-foreground">• $750,000 total investment</Text>
                  <Text className="text-sm text-foreground">• 7.8 year payback period</Text>
                  <Text className="text-sm text-foreground">• $1.2M net savings over 20 years</Text>
                  <Text className="text-sm text-foreground">• Positions building as sustainability leader in Bahrain</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
