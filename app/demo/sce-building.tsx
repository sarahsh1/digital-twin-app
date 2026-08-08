import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/typography";
import { useColors } from "@/hooks/use-colors";
import { Building3DView } from "@/components/Building3DView";
import { IoTDashboard } from "@/components/IoTDashboard";
import { analyzeCarbonImpact, type BuildingData, type SimulationScenario } from "@/lib/carbonAnalysis";

export default function SCEBuildingDemoScreen() {
  const colors = useColors();
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

  const ScenarioCard = ({
    title,
    analysis,
    icon,
  }: {
    title: string;
    analysis: ReturnType<typeof analyzeCarbonImpact>;
    icon: keyof typeof Ionicons.glyphMap;
  }) => (
    <View className="bg-surface rounded-2xl p-5 mb-4">
      <View className="flex-row items-center mb-4">
        <View
          className="w-11 h-11 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <Text className="text-xl font-bold text-foreground flex-1">{title}</Text>
        <Badge
          label={`${analysis.confidence.percentage}% Confidence`}
          tone={analysis.confidence.level === "high" ? "success" : "warning"}
        />
      </View>

      {/* Impact Metrics */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <MetricCard
            label="Carbon Reduction"
            value={`${analysis.projected.reductionPercentage.toFixed(1)}%`}
            caption={`${(analysis.baseline.annualEmissions - analysis.projected.annualEmissions).toFixed(0)} tons CO₂/year`}
            tone="success"
          />
        </View>
        <View className="flex-1">
          <MetricCard
            label="Energy Savings"
            value={`${((analysis.baseline.energyConsumption - analysis.projected.energyConsumption) / 1000).toFixed(0)}k`}
            caption="kWh/year"
            tone="primary"
          />
        </View>
      </View>

      {/* Financial Metrics */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <MetricCard
            label="Implementation Cost"
            value={`$${(analysis.financial.implementationCost / 1000).toFixed(0)}k`}
            caption="One-time investment"
          />
        </View>
        <View className="flex-1">
          <MetricCard
            label="Annual Savings"
            value={`$${(analysis.financial.annualSavings / 1000).toFixed(0)}k`}
            caption="Per year"
            tone="success"
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <MetricCard
            label="Payback Period"
            value={`${analysis.financial.paybackPeriod.toFixed(1)} yrs`}
            caption="Break-even point"
          />
        </View>
        <View className="flex-1">
          <MetricCard
            label="20-Year ROI"
            value={`${analysis.financial.roi.toFixed(0)}%`}
            caption={`NPV: $${(analysis.financial.twentyYearNPV / 1000).toFixed(0)}k`}
            tone="success"
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <TouchableOpacity
            className="flex-row items-center gap-1 mb-4 active:opacity-70"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
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

        {/* Building Rendering */}
        <View className="px-6 mb-6">
          <SectionHeader className="mb-1">Building Rendering</SectionHeader>
          <Text className="text-muted text-xs mb-3">Static illustration, not a live 3D model</Text>
          <Building3DView buildingId="sce" showSolarSimulation />
        </View>

        {/* IoT Dashboard */}
        <IoTDashboard />

        {/* Baseline Emissions */}
        <View className="px-6 mb-6">
          <SectionHeader className="mb-3">Current Carbon Footprint</SectionHeader>
          <View className="bg-surface rounded-xl p-5">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-xs text-muted mb-1">Annual CO₂ Emissions</Text>
                <Text className="text-3xl font-bold text-foreground">
                  {solarAnalysis.baseline.annualEmissions.toFixed(0)}
                  <Text className="text-lg text-muted"> tons/year</Text>
                </Text>
              </View>
              <Badge label="Baseline" tone="error" />
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
          <SectionHeader className="mb-3">Sustainability Scenarios</SectionHeader>

          <ScenarioCard
            title="Solar Panel Installation"
            analysis={solarAnalysis}
            icon="sunny"
          />

          <ScenarioCard
            title="HVAC System Optimization"
            analysis={hvacAnalysis}
            icon="snow"
          />

          <ScenarioCard
            title="Combined Strategy (Recommended)"
            analysis={combinedAnalysis}
            icon="star"
          />
        </View>

        {/* AI Recommendations */}
        <View className="px-6">
          <SectionHeader className="mb-3">AI Recommendations</SectionHeader>
          <View
            className="border-l-4 border-secondary rounded-lg p-4"
            style={{ backgroundColor: colors.secondary + "1A" }}
          >
            <View className="flex-row items-start">
              <Ionicons name="bulb" size={22} color={colors.secondary} style={{ marginRight: 12, marginTop: 2 }} />
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
