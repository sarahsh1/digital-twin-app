import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Building3DView } from "@/components/Building3DView";
import { IoTDashboard } from "@/components/IoTDashboard";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

interface Building {
  id: string;
  name: string;
  type: string;
  size: number;
  floors: number;
  location: string;
  image?: string;
  model3D?: any;
  solarModel?: any;
  createdAt: string;
  description?: string;
  currentEmissions?: number;
  energyConsumption?: number;
}

export default function BuildingDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams();
  const [building, setBuilding] = useState<Building | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "systems" | "analytics">("overview");

  useEffect(() => {
    loadBuilding();
  }, [id]);

  const loadBuilding = async () => {
    try {
      const data = await AsyncStorage.getItem("buildings");
      if (data) {
        const buildings = JSON.parse(data);
        const found = buildings.find((b: Building) => b.id === id);
        if (found) {
          setBuilding(found);
        }
      }
    } catch (error) {
      console.error("Failed to load building", error);
    }
  };

  const deleteBuilding = async () => {
    Alert.alert(
      "Delete Building",
      "Are you sure you want to delete this building?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const data = await AsyncStorage.getItem("buildings");
              if (data) {
                const buildings = JSON.parse(data);
                const filtered = buildings.filter((b: Building) => b.id !== id);
                await AsyncStorage.setItem("buildings", JSON.stringify(filtered));
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.back();
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete building");
            }
          }
        }
      ]
    );
  };

  if (!building) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b flex-row items-center justify-between" style={{ borderBottomColor: colors.border }}>
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              className="mr-3"
            >
              <Ionicons name="arrow-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-foreground text-xl font-bold">{building.name}</Text>
              <Text className="text-muted text-sm capitalize">{building.type}</Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              className="p-2"
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                deleteBuilding();
              }}
              className="p-2"
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row px-4 py-2 border-b" style={{ borderBottomColor: colors.border }}>
          {(["overview", "systems", "analytics"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab);
              }}
              className="px-4 py-2 mr-2 rounded-lg"
              style={{
                backgroundColor: activeTab === tab ? colors.primary : "transparent",
              }}
            >
              <Text
                className="font-semibold capitalize"
                style={{ color: activeTab === tab ? "#fff" : colors.muted }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {activeTab === "overview" && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              {/* 3D Visualization */}
              <View className="mb-6">
                <Text className="text-foreground text-lg font-bold mb-3">Digital Twin Visualization</Text>
                <Building3DView buildingId={building.id} model3D={building.model3D} solarModel={building.solarModel} />
              </View>

              {/* Building Info */}
              <View className="bg-surface rounded-2xl p-4 mb-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                <Text className="text-foreground text-lg font-bold mb-3">Building Information</Text>
                
                <View className="gap-3">
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Location</Text>
                    <Text className="text-foreground font-semibold">📍 {building.location}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Size</Text>
                    <Text className="text-foreground font-semibold">{building.size.toLocaleString()} sq ft</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Floors</Text>
                    <Text className="text-foreground font-semibold">{building.floors}</Text>
                  </View>
                  {building.currentEmissions && (
                    <View className="flex-row justify-between">
                      <Text className="text-muted">Current Emissions</Text>
                      <Text className="text-foreground font-semibold">{building.currentEmissions} tons CO₂/year</Text>
                    </View>
                  )}
                  {building.energyConsumption && (
                    <View className="flex-row justify-between">
                      <Text className="text-muted">Energy Consumption</Text>
                      <Text className="text-foreground font-semibold">{(building.energyConsumption / 1000000).toFixed(1)}M kWh/year</Text>
                    </View>
                  )}
                </View>

                {building.description && (
                  <View className="mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                    <Text className="text-muted text-sm">{building.description}</Text>
                  </View>
                )}
              </View>

              {/* Quick Actions */}
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/simulations/new");
                }}
                className="bg-primary rounded-2xl p-4 flex-row items-center justify-between"
              >
                <View>
                  <Text className="text-white text-lg font-bold">Run Simulation</Text>
                  <Text className="text-white/80 text-sm">Analyze carbon reduction scenarios</Text>
                </View>
                <Text className="text-white text-2xl">→</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {activeTab === "systems" && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-lg font-bold mb-4">IoT Systems Dashboard</Text>
              <IoTDashboard />

              {/* Building Systems */}
              <View className="mt-6 gap-3">
                {[
                  { icon: "Zap", label: "Electrical System", status: "Active", color: colors.success },
                  { icon: "Thermometer", label: "HVAC System", status: "Active", color: colors.success },
                  { icon: "Droplets", label: "Water System", status: "Active", color: colors.success },
                  { icon: "Wind", label: "Ventilation", status: "Active", color: colors.success },
                ].map((system, index) => {
                  const iconName = system.icon;
                  return (
                    <View
                      key={index}
                      className="bg-surface rounded-xl p-4 flex-row items-center justify-between"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: system.color + "20" }}>
                          <Text style={{ fontSize: 20 }}>{system.icon === "Zap" ? "⚡" : system.icon === "Thermometer" ? "🌡️" : system.icon === "Droplets" ? "💧" : "💨"}</Text>
                        </View>
                        <View>
                          <Text className="text-foreground font-semibold">{system.label}</Text>
                          <Text className="text-muted text-sm">{system.status}</Text>
                        </View>
                      </View>
                      <View className="w-2 h-2 rounded-full" style={{ backgroundColor: system.color }} />
                    </View>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {activeTab === "analytics" && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-lg font-bold mb-4">Building Analytics</Text>
              
              {/* Key Metrics */}
              <View className="gap-4 mb-6">
                <View className="bg-surface rounded-xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                  <Text className="text-muted text-sm mb-1">Carbon Intensity</Text>
                  <Text className="text-foreground text-2xl font-bold">
                    {building.currentEmissions && building.size 
                      ? ((building.currentEmissions / building.size) * 1000).toFixed(2)
                      : "N/A"} kg CO₂/sq ft
                  </Text>
                </View>

                <View className="bg-surface rounded-xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                  <Text className="text-muted text-sm mb-1">Energy Intensity</Text>
                  <Text className="text-foreground text-2xl font-bold">
                    {building.energyConsumption && building.size
                      ? (building.energyConsumption / building.size).toFixed(1)
                      : "N/A"} kWh/sq ft
                  </Text>
                </View>

                <View className="bg-surface rounded-xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                  <Text className="text-muted text-sm mb-1">Reduction Potential</Text>
                  <Text className="text-primary text-2xl font-bold">32-45%</Text>
                  <Text className="text-muted text-xs mt-1">Based on similar buildings</Text>
                </View>
              </View>

              {/* Energy Consumption Trend */}
              <View className="mb-6">
                <Text className="text-foreground text-base font-bold mb-3">Energy Consumption (12 Months)</Text>
                <View className="bg-surface rounded-xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                  <LineChart
                    data={{
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                      datasets: [{
                        data: [
                          building.energyConsumption ? building.energyConsumption * 0.85 : 100,
                          building.energyConsumption ? building.energyConsumption * 0.92 : 110,
                          building.energyConsumption ? building.energyConsumption * 0.88 : 105,
                          building.energyConsumption ? building.energyConsumption * 0.95 : 115,
                          building.energyConsumption ? building.energyConsumption * 1.05 : 125,
                          building.energyConsumption ? building.energyConsumption * 1.15 : 135,
                          building.energyConsumption ? building.energyConsumption * 1.20 : 140,
                          building.energyConsumption ? building.energyConsumption * 1.18 : 138,
                          building.energyConsumption ? building.energyConsumption * 1.08 : 128,
                          building.energyConsumption ? building.energyConsumption * 0.98 : 118,
                          building.energyConsumption ? building.energyConsumption * 0.90 : 108,
                          building.energyConsumption ? building.energyConsumption * 0.87 : 103,
                        ]
                      }]
                    }}
                    width={Dimensions.get("window").width - 80}
                    height={220}
                    chartConfig={{
                      backgroundColor: colors.surface,
                      backgroundGradientFrom: colors.surface,
                      backgroundGradientTo: colors.surface,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(10, 126, 164, ${opacity})`,
                      labelColor: (opacity = 1) => colors.muted,
                      style: { borderRadius: 16 },
                      propsForDots: {
                        r: "4",
                        strokeWidth: "2",
                        stroke: colors.primary
                      }
                    }}
                    bezier
                    style={{ marginVertical: 8, borderRadius: 16 }}
                  />
                  <Text className="text-muted text-xs text-center mt-2">Monthly kWh consumption</Text>
                </View>
              </View>

              {/* Carbon Emissions Breakdown */}
              <View className="mb-6">
                <Text className="text-foreground text-base font-bold mb-3">Carbon Emissions by System</Text>
                <View className="bg-surface rounded-xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                  <PieChart
                    data={[
                      { name: "HVAC", population: 45, color: "#0a7ea4", legendFontColor: colors.muted, legendFontSize: 12 },
                      { name: "Lighting", population: 25, color: "#10b981", legendFontColor: colors.muted, legendFontSize: 12 },
                      { name: "Equipment", population: 20, color: "#f59e0b", legendFontColor: colors.muted, legendFontSize: 12 },
                      { name: "Other", population: 10, color: "#6b7280", legendFontColor: colors.muted, legendFontSize: 12 },
                    ]}
                    width={Dimensions.get("window").width - 80}
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(10, 126, 164, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                  <Text className="text-muted text-xs text-center mt-2">Percentage of total emissions</Text>
                </View>
              </View>

              {/* Monthly Cost Analysis */}
              <View className="mb-6">
                <Text className="text-foreground text-base font-bold mb-3">Monthly Energy Cost</Text>
                <View className="bg-surface rounded-xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                  <BarChart
                    data={{
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                      datasets: [{
                        data: [8500, 9200, 8800, 9500, 10500, 11500]
                      }]
                    }}
                    width={Dimensions.get("window").width - 80}
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix=""
                    chartConfig={{
                      backgroundColor: colors.surface,
                      backgroundGradientFrom: colors.surface,
                      backgroundGradientTo: colors.surface,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                      labelColor: (opacity = 1) => colors.muted,
                      style: { borderRadius: 16 },
                    }}
                    style={{ marginVertical: 8, borderRadius: 16 }}
                    showValuesOnTopOfBars
                  />
                  <Text className="text-muted text-xs text-center mt-2">USD per month</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
