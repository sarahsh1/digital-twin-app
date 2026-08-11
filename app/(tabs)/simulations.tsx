import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
import { useState, useCallback } from "react";
import { Link, router, useFocusEffect } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "@/components/screen-container";
import { Badge } from "@/components/ui/badge";
import { ScreenTitle } from "@/components/ui/typography";
import { useColors } from "@/hooks/use-colors";
import { loadAllSimulations, type FormattedSimulation } from "@/lib/simulations";

const interventionIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  solar: "sunny",
  hvac: "snow",
  wind: "cloudy",
  envelope: "construct",
  combined: "flash",
};

export default function SimulationsScreen() {
  const colors = useColors();
  const [simulations, setSimulations] = useState<FormattedSimulation[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSimulations();
    }, [])
  );

  const loadSimulations = async () => {
    const all = await loadAllSimulations();
    setSimulations(all);
  };

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <ScreenTitle>Simulations</ScreenTitle>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {simulations.length === 0 ? (
            <Animated.View
              entering={FadeInDown.duration(400)}
              className="py-16"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
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
                  className="bg-primary rounded-xl px-6 py-3 flex-row items-center gap-2"
                >
                  <Ionicons name="add" size={18} color="#fff" />
                  <Text className="text-white font-semibold">New Simulation</Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          ) : (
            <>
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
                  <Ionicons name="flash" size={26} color="#fff" />
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
                        <View
                          className="w-11 h-11 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: colors.primary + "20" }}
                        >
                          <Ionicons
                            name={interventionIcon[sim.interventionType] ?? "settings"}
                            size={22}
                            color={colors.primary}
                          />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1">
                            <Text className="text-foreground text-lg font-bold capitalize">
                              {sim.interventionType.replace("-", " ")} Strategy
                            </Text>
                            {sim.isDemo && <Badge label="Sample" tone="sample" />}
                          </View>
                          <Text className="text-muted text-sm">{sim.buildingName}</Text>
                        </View>
                        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.success + "33" }}>
                          <Text className="text-success font-bold text-sm">
                            -{sim.results?.projected?.reductionPercentage?.toFixed(0) || 0}%
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row gap-4 mb-3">
                        <View className="flex-1">
                          <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
                            CO2 Reduction
                          </Text>
                          <Text className="text-foreground font-semibold">
                            {((sim.results?.baseline?.annualEmissions || 0) - (sim.results?.projected?.annualEmissions || 0)).toFixed(0)} tons/yr
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
                            Annual Savings
                          </Text>
                          <Text className="text-success font-semibold">
                            ${(sim.results?.financial?.annualSavings || 0).toLocaleString()}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row gap-4">
                        <View className="flex-1">
                          <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
                            Investment
                          </Text>
                          <Text className="text-foreground font-semibold">
                            ${(sim.results?.financial?.implementationCost || 0).toLocaleString()}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
                            Payback
                          </Text>
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
