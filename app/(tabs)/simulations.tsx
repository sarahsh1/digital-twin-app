import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Link, router, useFocusEffect } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getAllSimulations, type SimulationResult } from "@/lib/demoSimulations";

interface Simulation {
  id: string;
  buildingName: string;
  interventionType: string;
  results: {
    baseline: { annualEmissions: number };
    projected: { annualEmissions: number; reductionPercentage: number };
    financial: { implementationCost: number; annualSavings: number; paybackPeriod: number };
  };
  createdAt: string;
}

export default function SimulationsScreen() {
  const colors = useColors();
  const [simulations, setSimulations] = useState<Simulation[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSimulations();
    }, [])
  );

  const reloadDemoData = async () => {
    try {
      // Clear all data including initialization flags
      await AsyncStorage.removeItem("simulations");
      await AsyncStorage.removeItem("buildings");
      await AsyncStorage.removeItem("demoDataInitialized");
      await AsyncStorage.removeItem("demoSimsSaved");
      // Reload page to trigger auto-initialization
      if (typeof window !== 'undefined') {
        window.location.reload();
      } else {
        await loadSimulations();
        alert("Demo data reloaded successfully! All simulations now show correct percentages.");
      }
    } catch (error) {
      console.error("Failed to reload demo data", error);
      alert("Failed to reload data. Please try again.");
    }
  };

  const loadSimulations = async () => {
    try {
      const data = await AsyncStorage.getItem("simulations");
      let userSimulations: Simulation[] = [];
      if (data) {
        userSimulations = JSON.parse(data);
      }
      
      // Load demo simulations
      const demoSims = getAllSimulations();
      const formattedDemoSims: Simulation[] = demoSims.map(sim => ({
        id: sim.id,
        buildingName: sim.buildingName,
        interventionType: sim.scenarioType.toLowerCase().includes("solar") ? "solar" : 
                         sim.scenarioType.toLowerCase().includes("hvac") ? "hvac" :
                         sim.scenarioType.toLowerCase().includes("wind") ? "wind" : 
                         sim.scenarioType.toLowerCase().includes("process") ? "hvac" :
                         sim.scenarioType.toLowerCase().includes("energy") ? "hvac" : "envelope",
        results: {
          baseline: { annualEmissions: 1000 },
          projected: { 
            annualEmissions: 1000 * (1 - sim.carbonReduction / 100), 
            reductionPercentage: sim.carbonReduction 
          },
          financial: { 
            implementationCost: sim.costSavings / (sim.roi / 100), 
            annualSavings: sim.costSavings, 
            paybackPeriod: sim.paybackPeriod 
          }
        },
        createdAt: sim.date
      }));
      
      // Save demo simulations to AsyncStorage if not already saved
      const hasDemoSims = await AsyncStorage.getItem("demoSimsSaved");
      if (!hasDemoSims) {
        await AsyncStorage.setItem("simulations", JSON.stringify(formattedDemoSims));
        await AsyncStorage.setItem("demoSimsSaved", "true");
      }
      
      // Combine user and demo simulations
      const allSims = [...userSimulations, ...formattedDemoSims];
      setSimulations(allSims.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to load simulations", error);
    }
  };

  const getInterventionIcon = (type: string) => {
    switch (type) {
      case "solar": return "☀️";
      case "hvac": return "❄️";
      case "wind": return "💨";
      case "envelope": return "🏗️";
      case "combined": return "⚡";
      default: return "🔧";
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <Text className="text-foreground text-2xl font-bold">Simulations</Text>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {simulations.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(400)} className="items-center justify-center py-16">
              <Image
                source={require("@/assets/images/simulation-success.png")}
                style={{ width: 200, height: 200, marginBottom: 16 }}
                resizeMode="contain"
              />
              <Text className="text-foreground text-xl font-bold mb-2">No Simulations Yet</Text>
              <Text className="text-muted text-center mb-6 px-8">
                Run your first simulation to analyze carbon reduction opportunities
              </Text>
              <Link href="/simulations/new" asChild>
                <TouchableOpacity 
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  className="bg-primary rounded-xl px-6 py-3"
                >
                  <Text className="text-white font-semibold">+ New Simulation</Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          ) : (
            <>
              {/* Reload Demo Data Button */}
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  reloadDemoData();
                }}
                className="bg-success rounded-2xl p-4 my-4 flex-row items-center justify-between"
              >
                <View>
                  <Text className="text-white text-lg font-bold">Reload Demo Data</Text>
                  <Text className="text-white/80 text-sm">Fix 0% issue - refresh all simulations</Text>
                </View>
                <Text className="text-white text-3xl">🔄</Text>
              </TouchableOpacity>

              {/* New Simulation Button */}
              <Link href="/simulations/new" asChild>
                <TouchableOpacity 
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  className="bg-primary rounded-2xl p-4 my-4 flex-row items-center justify-between"
                >
                  <View>
                    <Text className="text-white text-lg font-bold">Run New Simulation</Text>
                    <Text className="text-white/80 text-sm">Analyze carbon reduction scenarios</Text>
                  </View>
                  <Text className="text-white text-3xl">⚡</Text>
                </TouchableOpacity>
              </Link>

              {/* Simulations List */}
              <View className="gap-4 pb-6">
                {simulations.map((sim, index) => (
                  <Animated.View 
                    key={sim.id} 
                    entering={FadeInDown.delay(index * 100).duration(400)}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push({
                          pathname: "/simulations/results",
                          params: { simulationId: sim.id }
                        } as any);
                      }}
                      className="bg-surface rounded-2xl p-4"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    >
                      <View className="flex-row items-center mb-3">
                        <Text style={{ fontSize: 32, marginRight: 12 }}>
                          {getInterventionIcon(sim.interventionType)}
                        </Text>
                        <View className="flex-1">
                          <Text className="text-foreground text-lg font-bold capitalize">
                            {sim.interventionType.replace("-", " ")} Strategy
                          </Text>
                          <Text className="text-muted text-sm">{sim.buildingName}</Text>
                        </View>
                        <View className="bg-success/20 px-3 py-1 rounded-full">
                          <Text className="text-success font-bold text-sm">
                            -{sim.results?.projected?.reductionPercentage?.toFixed(0) || 0}%
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row gap-4 mb-3">
                        <View className="flex-1">
                          <Text className="text-muted text-xs mb-1">CO₂ Reduction</Text>
                          <Text className="text-foreground font-semibold">
                            {((sim.results?.baseline?.annualEmissions || 0) - (sim.results?.projected?.annualEmissions || 0)).toFixed(0)} tons/yr
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-muted text-xs mb-1">Annual Savings</Text>
                          <Text className="text-success font-semibold">
                            ${(sim.results?.financial?.annualSavings || 0).toLocaleString()}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row gap-4">
                        <View className="flex-1">
                          <Text className="text-muted text-xs mb-1">Investment</Text>
                          <Text className="text-foreground font-semibold">
                            ${((sim.results?.financial?.implementationCost || 0) / 1000).toFixed(0)}K
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-muted text-xs mb-1">Payback</Text>
                          <Text className="text-primary font-semibold">
                            {(sim.results?.financial?.paybackPeriod || 0).toFixed(1)} years
                          </Text>
                        </View>
                      </View>

                      <View className="border-t mt-3 pt-3" style={{ borderTopColor: colors.border }}>
                        <Text className="text-muted text-xs">
                          {new Date(sim.createdAt).toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric", 
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
