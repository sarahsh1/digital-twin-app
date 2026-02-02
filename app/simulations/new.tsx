import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { analyzeCarbonImpact, type BuildingData, type SimulationScenario } from "@/lib/carbonAnalysis";

type InterventionType = "solar" | "hvac" | "wind" | "envelope" | "combined";

interface Building {
  id: string;
  name: string;
  type: string;
  size: number;
  floors: number;
  location: string;
}

export default function NewSimulationScreen() {
  const colors = useColors();
  const [step, setStep] = useState(1);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [interventionType, setInterventionType] = useState<InterventionType | null>(null);
  
  // Configuration parameters
  const [solarCapacity, setSolarCapacity] = useState("300");
  const [hvacEfficiency, setHvacEfficiency] = useState("20");
  const [windTurbines, setWindTurbines] = useState("2");
  const [insulationUpgrade, setInsulationUpgrade] = useState("30");

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      const data = await AsyncStorage.getItem("buildings");
      if (data) {
        setBuildings(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load buildings", error);
    }
  };

  const interventionTypes = [
    { 
      type: "solar" as InterventionType, 
      label: "Solar Panels", 
      description: "Rooftop photovoltaic installation",
      imagePath: require("@/assets/images/intervention-solar.png"),
      icon: "☀️"
    },
    { 
      type: "hvac" as InterventionType, 
      label: "HVAC Optimization", 
      description: "High-efficiency climate control",
      imagePath: require("@/assets/images/intervention-hvac.png"),
      icon: "❄️"
    },
    { 
      type: "wind" as InterventionType, 
      label: "Wind Turbines", 
      description: "On-site wind energy generation",
      imagePath: require("@/assets/images/intervention-wind.png"),
      icon: "💨"
    },
    { 
      type: "envelope" as InterventionType, 
      label: "Building Envelope", 
      description: "Insulation and window upgrades",
      imagePath: null,
      icon: "🏗️"
    },
    { 
      type: "combined" as InterventionType, 
      label: "Combined Strategy", 
      description: "Multiple interventions together",
      imagePath: null,
      icon: "⚡"
    },
  ];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const runSimulation = async () => {
    if (!selectedBuilding || !interventionType) {
      Alert.alert("Error", "Please complete all steps");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const buildingData: BuildingData = {
      size: selectedBuilding.size,
      floors: selectedBuilding.floors,
      location: selectedBuilding.location,
      buildingType: selectedBuilding.type as any,
    };

    const scenario: SimulationScenario = {
      type: interventionType,
      parameters: {
        solarCapacity: interventionType === "solar" || interventionType === "combined" ? parseInt(solarCapacity) : undefined,
        hvacEfficiencyGain: interventionType === "hvac" || interventionType === "combined" ? parseInt(hvacEfficiency) : undefined,
        windTurbines: interventionType === "wind" ? parseInt(windTurbines) : undefined,
        envelopeUpgrade: interventionType === "envelope" ? true : undefined,
      },
    };

    const results = analyzeCarbonImpact(buildingData, scenario);

    const simulation = {
      id: Date.now().toString(),
      buildingId: selectedBuilding.id,
      buildingName: selectedBuilding.name,
      interventionType,
      parameters: scenario.parameters,
      results,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem("simulations");
      const simulations = existing ? JSON.parse(existing) : [];
      simulations.push(simulation);
      await AsyncStorage.setItem("simulations", JSON.stringify(simulations));
      
      // Navigate to simulations tab to see results
      router.replace("/(tabs)/simulations");
    } catch (error) {
      Alert.alert("Error", "Failed to save simulation");
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleBack} className="py-2">
              <Text className="text-primary text-base">← Back</Text>
            </TouchableOpacity>
            <Text className="text-foreground text-lg font-bold">New Simulation</Text>
            <View style={{ width: 60 }} />
          </View>
          
          {/* Progress Indicator */}
          <View className="flex-row mt-4 gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <View
                key={s}
                className="flex-1 h-1 rounded-full"
                style={{ backgroundColor: s <= step ? colors.primary : colors.border }}
              />
            ))}
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Step 1: Select Building */}
          {step === 1 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-2xl font-bold mb-2">Select Building</Text>
              <Text className="text-muted mb-6">Choose a building to simulate</Text>

              {buildings.length === 0 ? (
                <View className="bg-surface rounded-2xl p-8 items-center" style={{ borderWidth: 1, borderColor: colors.border }}>
                  <Image
                    source={require("@/assets/images/empty-buildings.png")}
                    style={{ width: 120, height: 120, marginBottom: 16 }}
                    resizeMode="contain"
                  />
                  <Text className="text-muted text-center mb-4">No buildings added yet</Text>
                  <TouchableOpacity
                    onPress={() => router.push("/buildings/add")}
                    className="bg-primary rounded-xl px-6 py-3"
                  >
                    <Text className="text-white font-semibold">Add Your First Building</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="gap-3">
                  {buildings.map((building) => (
                    <TouchableOpacity
                      key={building.id}
                      onPress={() => {
                        setSelectedBuilding(building);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      className="rounded-2xl p-4"
                      style={{
                        backgroundColor: selectedBuilding?.id === building.id ? colors.primary + "20" : colors.surface,
                        borderWidth: 2,
                        borderColor: selectedBuilding?.id === building.id ? colors.primary : colors.border,
                      }}
                    >
                      <Text className="text-foreground text-lg font-bold mb-1">{building.name}</Text>
                      <Text className="text-muted text-sm capitalize">{building.type} • {building.size.toLocaleString()} sq ft • {building.floors} floors</Text>
                      <Text className="text-muted text-sm">{building.location}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Animated.View>
          )}

          {/* Step 2: Choose Intervention Type */}
          {step === 2 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-2xl font-bold mb-2">Choose Intervention</Text>
              <Text className="text-muted mb-6">Select sustainability strategy</Text>

              <View className="gap-3">
                {interventionTypes.map((item) => (
                  <TouchableOpacity
                    key={item.type}
                    onPress={() => {
                      setInterventionType(item.type);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="rounded-2xl p-4 flex-row items-center"
                    style={{
                      backgroundColor: interventionType === item.type ? colors.primary + "20" : colors.surface,
                      borderWidth: 2,
                      borderColor: interventionType === item.type ? colors.primary : colors.border,
                    }}
                  >
                    {item.imagePath ? (
                      <Image source={item.imagePath} style={{ width: 60, height: 60, marginRight: 16 }} resizeMode="contain" />
                    ) : (
                      <Text style={{ fontSize: 40, marginRight: 16 }}>{item.icon}</Text>
                    )}
                    <View className="flex-1">
                      <Text className="text-foreground text-lg font-bold">{item.label}</Text>
                      <Text className="text-muted text-sm">{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Step 3: Configure Parameters */}
          {step === 3 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-2xl font-bold mb-2">Configure Parameters</Text>
              <Text className="text-muted mb-6">Set intervention specifications</Text>

              <View className="gap-4">
                {(interventionType === "solar" || interventionType === "combined") && (
                  <View>
                    <Text className="text-foreground font-semibold mb-2">Solar Capacity (kW)</Text>
                    <TextInput
                      value={solarCapacity}
                      onChangeText={setSolarCapacity}
                      placeholder="300"
                      keyboardType="numeric"
                      placeholderTextColor={colors.muted}
                      className="bg-surface rounded-xl p-4 text-foreground"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    />
                    <Text className="text-muted text-xs mt-1">Typical: 200-500 kW for commercial buildings</Text>
                  </View>
                )}

                {(interventionType === "hvac" || interventionType === "combined") && (
                  <View>
                    <Text className="text-foreground font-semibold mb-2">HVAC Efficiency Gain (%)</Text>
                    <TextInput
                      value={hvacEfficiency}
                      onChangeText={setHvacEfficiency}
                      placeholder="20"
                      keyboardType="numeric"
                      placeholderTextColor={colors.muted}
                      className="bg-surface rounded-xl p-4 text-foreground"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    />
                    <Text className="text-muted text-xs mt-1">Typical: 15-30% improvement</Text>
                  </View>
                )}

                {interventionType === "wind" && (
                  <View>
                    <Text className="text-foreground font-semibold mb-2">Number of Turbines</Text>
                    <TextInput
                      value={windTurbines}
                      onChangeText={setWindTurbines}
                      placeholder="2"
                      keyboardType="numeric"
                      placeholderTextColor={colors.muted}
                      className="bg-surface rounded-xl p-4 text-foreground"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    />
                    <Text className="text-muted text-xs mt-1">Each turbine: ~50 kW capacity</Text>
                  </View>
                )}

                {interventionType === "envelope" && (
                  <View>
                    <Text className="text-foreground font-semibold mb-2">Insulation Upgrade (%)</Text>
                    <TextInput
                      value={insulationUpgrade}
                      onChangeText={setInsulationUpgrade}
                      placeholder="30"
                      keyboardType="numeric"
                      placeholderTextColor={colors.muted}
                      className="bg-surface rounded-xl p-4 text-foreground"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    />
                    <Text className="text-muted text-xs mt-1">Typical: 20-40% thermal improvement</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-2xl font-bold mb-2">Review Configuration</Text>
              <Text className="text-muted mb-6">Verify simulation parameters</Text>

              <View className="bg-surface rounded-2xl p-4 gap-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                <View>
                  <Text className="text-muted text-sm">Building</Text>
                  <Text className="text-foreground text-base font-semibold">{selectedBuilding?.name}</Text>
                  <Text className="text-muted text-sm">{selectedBuilding?.size.toLocaleString()} sq ft • {selectedBuilding?.floors} floors</Text>
                </View>

                <View>
                  <Text className="text-muted text-sm">Intervention Type</Text>
                  <Text className="text-foreground text-base font-semibold capitalize">{interventionType?.replace("-", " ")}</Text>
                </View>

                <View>
                  <Text className="text-muted text-sm">Parameters</Text>
                  {(interventionType === "solar" || interventionType === "combined") && (
                    <Text className="text-foreground text-sm">• Solar: {solarCapacity} kW</Text>
                  )}
                  {(interventionType === "hvac" || interventionType === "combined") && (
                    <Text className="text-foreground text-sm">• HVAC: {hvacEfficiency}% efficiency gain</Text>
                  )}
                  {interventionType === "wind" && (
                    <Text className="text-foreground text-sm">• Wind: {windTurbines} turbines ({parseInt(windTurbines) * 50} kW)</Text>
                  )}
                  {interventionType === "envelope" && (
                    <Text className="text-foreground text-sm">• Insulation: {insulationUpgrade}% upgrade</Text>
                  )}
                </View>
              </View>
            </Animated.View>
          )}

          {/* Step 5: Running Simulation */}
          {step === 5 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4 items-center">
              <Image
                source={require("@/assets/images/simulation-success.png")}
                style={{ width: 200, height: 200, marginBottom: 24 }}
                resizeMode="contain"
              />
              <Text className="text-foreground text-2xl font-bold mb-2 text-center">Running Simulation</Text>
              <Text className="text-muted text-center mb-6">Analyzing carbon impact and cost-benefit...</Text>

              <TouchableOpacity
                onPress={runSimulation}
                className="bg-primary rounded-xl px-8 py-4"
              >
                <Text className="text-white font-bold text-lg">View Results</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        {step < 5 && (
          <View className="p-4 border-t" style={{ borderTopColor: colors.border }}>
            <TouchableOpacity
              onPress={handleNext}
              disabled={
                (step === 1 && !selectedBuilding) ||
                (step === 2 && !interventionType)
              }
              className="bg-primary rounded-xl p-4 items-center"
              style={{ 
                opacity: ((step === 1 && !selectedBuilding) || (step === 2 && !interventionType)) ? 0.5 : 1 
              }}
            >
              <Text className="text-white font-bold text-base">Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
