import { ScrollView, Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { useEffect, useState } from "react";

const { width } = Dimensions.get("window");
import { router, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { Badge } from "@/components/ui/badge";
import { useColors } from "@/hooks/use-colors";
import { getSimulationById, type FormattedSimulation } from "@/lib/simulations";

export default function SimulationResultsScreen() {
  const colors = useColors();
  const { simulationId } = useLocalSearchParams();
  const [simulation, setSimulation] = useState<FormattedSimulation | null>(null);

  useEffect(() => {
    loadSimulation();
  }, [simulationId]);

  const loadSimulation = async () => {
    try {
      const found = await getSimulationById(simulationId as string);
      setSimulation(found ?? null);
    } catch (error) {
      console.error("Failed to load simulation", error);
    }
  };

  if (!simulation) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Loading results...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const { results, buildingName, interventionType } = simulation;
  const { baseline, projected, financial, confidence } = results;

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <TouchableOpacity onPress={() => router.back()} className="mb-2">
            <Text className="text-primary text-base">← Back</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <Text className="text-foreground text-xl font-bold">Simulation Results</Text>
            {simulation.isDemo && <Badge label="Sample" tone="sample" />}
          </View>
          <Text className="text-muted text-sm">{buildingName}</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Success Banner */}
          <Animated.View entering={FadeInUp.duration(600)} className="mx-4 mt-4">
            <View className="bg-success/20 rounded-2xl p-4 border-2" style={{ borderColor: colors.success }}>
              <Text className="text-success text-center text-lg font-bold mb-1">✓ Simulation Complete</Text>
              <Text className="text-success/80 text-center text-sm capitalize">
                {interventionType.replace("-", " ")} Strategy Analysis
              </Text>
            </View>
          </Animated.View>

          {/* Key Metrics */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} className="px-4 mt-6">
            <Text className="text-foreground text-lg font-bold mb-4">Key Results</Text>
            
            <View className="gap-3">
              <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                <Text className="text-muted text-sm mb-1">Carbon Reduction</Text>
                <Text className="text-success text-3xl font-bold">{(projected.reductionPercentage || projected.annualReduction / baseline.annualEmissions * 100 || 0).toFixed(1)}%</Text>
                <Text className="text-muted text-sm mt-1">
                  {projected.annualReduction.toFixed(1)} tons CO₂/year saved
                </Text>
              </View>

              <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                <Text className="text-muted text-sm mb-1">Implementation Cost</Text>
                <Text className="text-primary text-3xl font-bold">${(financial.implementationCost / 1000).toFixed(0)}K</Text>
                <Text className="text-muted text-sm mt-1">
                  One-time investment required
                </Text>
              </View>

              <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                <Text className="text-muted text-sm mb-1">Payback Period</Text>
                <Text className="text-secondary text-3xl font-bold">{financial.paybackPeriod.toFixed(1)} years</Text>
                <Text className="text-muted text-sm mt-1">
                  ROI: {financial.roi.toFixed(1)}%
                </Text>
              </View>

              <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                <Text className="text-muted text-sm mb-1">Annual Savings</Text>
                <Text className="text-success text-3xl font-bold">${financial.annualSavings.toLocaleString()}</Text>
                <Text className="text-muted text-sm mt-1">
                  Energy cost reduction
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Baseline vs Projected */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} className="px-4 mt-6">
            <Text className="text-foreground text-lg font-bold mb-4">Before & After Comparison</Text>
            
            <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
              <View className="flex-row justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-muted text-xs mb-1">CURRENT</Text>
                  <Text className="text-error text-2xl font-bold">{baseline.annualEmissions.toFixed(0)}t</Text>
                  <Text className="text-muted text-xs">CO₂/year</Text>
                </View>
                <View className="items-center justify-center px-4">
                  <Text className="text-primary text-2xl">→</Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-muted text-xs mb-1">PROJECTED</Text>
                  <Text className="text-success text-2xl font-bold">{projected.annualEmissions.toFixed(0)}t</Text>
                  <Text className="text-muted text-xs">CO₂/year</Text>
                </View>
              </View>

              <View className="h-2 bg-background rounded-full overflow-hidden flex-row">
                <View style={{ width: `${100 - (projected.reductionPercentage || 0)}%`, backgroundColor: colors.success }} />
                <View style={{ width: `${(projected.reductionPercentage || 0)}%`, backgroundColor: colors.error }} />
              </View>
              <Text className="text-muted text-xs text-center mt-2">
                {(projected.reductionPercentage || projected.annualReduction / baseline.annualEmissions * 100 || 0).toFixed(1)}% reduction achieved
              </Text>
            </View>
          </Animated.View>

          {/* Financial Analysis */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} className="px-4 mt-6">
            <Text className="text-foreground text-lg font-bold mb-4">Financial Analysis</Text>
            
            <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
              <View className="flex-row justify-between mb-3">
                <Text className="text-muted">Initial Investment</Text>
                <Text className="text-foreground font-semibold">${financial.implementationCost.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-muted">Annual Savings</Text>
                <Text className="text-success font-semibold">+${financial.annualSavings.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-muted">Payback Period</Text>
                <Text className="text-foreground font-semibold">{financial.paybackPeriod.toFixed(1)} years</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-muted">20-Year NPV</Text>
                <Text className="text-success font-semibold">${financial.npv.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">Return on Investment</Text>
                <Text className="text-success font-bold">{financial.roi.toFixed(1)}%</Text>
              </View>
            </View>
          </Animated.View>

          {/* Confidence Level */}
          <Animated.View entering={FadeInDown.delay(800).duration(600)} className="px-4 mt-6 mb-6">
            <Text className="text-foreground text-lg font-bold mb-4">AI Confidence</Text>
            
            <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-foreground font-semibold capitalize">{confidence.level} Confidence</Text>
                <Text className="text-primary font-bold">{confidence.percentage}%</Text>
              </View>
              <View className="h-2 bg-background rounded-full overflow-hidden">
                <View style={{ width: `${confidence.percentage}%`, backgroundColor: colors.primary }} />
              </View>
              <Text className="text-muted text-xs mt-2">{confidence.factors.join(" • ")}</Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Actions */}
        <View className="p-4 border-t gap-3" style={{ borderTopColor: colors.border }}>
          <View
            className="rounded-xl p-4 items-center flex-row justify-center gap-2"
            style={{ borderWidth: 1, borderColor: colors.border, opacity: 0.6 }}
          >
            <Text className="text-muted font-semibold">📄 Export PDF Report</Text>
            <Badge label="Coming soon" tone="neutral" />
          </View>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/simulations");
            }}
            className="bg-primary rounded-xl p-4 items-center"
          >
            <Text className="text-white font-bold">View All Simulations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/simulations/new");
            }}
            className="bg-surface rounded-xl p-4 items-center"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <Text className="text-foreground font-semibold">Run Another Simulation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
