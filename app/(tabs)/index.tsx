import { ScrollView, Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { demoBuildings } from "@/lib/demoBuildings";
import { getAllSimulations } from "@/lib/demoSimulations";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colors = useColors();
  
  // Calculate real statistics
  const buildingsCount = demoBuildings.length;
  const simulationsCount = getAllSimulations().length;
  const totalCO2Saved = getAllSimulations().reduce((sum, sim) => sum + (sim.carbonReduction * 10), 0); // Approximate
  const totalSavings = getAllSimulations().reduce((sum, sim) => sum + sim.costSavings, 0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScreenContainer>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Hero Section with Gradient */}
        <Animated.View entering={FadeInUp.duration(800)}>
          <LinearGradient
            colors={[colors.primary, colors.secondary, "#0a4a3a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mx-4 mt-4 rounded-3xl overflow-hidden"
            style={{ height: 200 }}
          >
            <View className="flex-1 p-6 justify-between">
              <View>
                <Text className="text-white text-3xl font-bold mb-2">
                  EcoTwin
                </Text>
                <Text className="text-white/90 text-base">
                  Digital Twin Sustainability Platform
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  Proactive carbon reduction through AI-powered optimization
                </Text>
              </View>
              
              <Link href="/demo/sce-building" asChild onPress={handlePress}>
                <TouchableOpacity 
                  className="bg-white/20 backdrop-blur-lg px-4 py-3 rounded-xl self-start"
                  style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" }}
                >
                  <Text className="text-white font-semibold">View SCE Demo →</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}
          >
            <View className="bg-surface rounded-2xl p-4 w-36" style={{ borderWidth: 1, borderColor: colors.border }}>
              <Text className="text-primary text-3xl font-bold">{buildingsCount}</Text>
              <Text className="text-muted text-sm mt-1">Buildings</Text>
            </View>
            
            <View className="bg-surface rounded-2xl p-4 w-36" style={{ borderWidth: 1, borderColor: colors.border }}>
              <Text className="text-primary text-3xl font-bold">{simulationsCount}</Text>
              <Text className="text-muted text-sm mt-1">Simulations</Text>
            </View>
            
            <View className="bg-surface rounded-2xl p-4 w-36" style={{ borderWidth: 1, borderColor: colors.border }}>
              <Text className="text-secondary text-3xl font-bold">{Math.round(totalCO2Saved)}t</Text>
              <Text className="text-muted text-sm mt-1">CO₂ Saved</Text>
            </View>
            
            <View className="bg-surface rounded-2xl p-4 w-36" style={{ borderWidth: 1, borderColor: colors.border }}>
              <Text className="text-success text-3xl font-bold">${(totalSavings / 1000000).toFixed(1)}M</Text>
              <Text className="text-muted text-sm mt-1">Cost Savings</Text>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Hero Image Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} className="px-4">
          <Image
            source={require("@/assets/images/hero-sustainability.png")}
            style={{ width: width - 32, height: 320, borderRadius: 16 }}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} className="px-4 mt-6">
          <Text className="text-foreground text-lg font-bold mb-4">Quick Actions</Text>
          
          <View className="gap-3">
            <Link href="/buildings/add" asChild onPress={handlePress}>
              <TouchableOpacity 
                className="bg-primary rounded-2xl p-5 flex-row items-center justify-between"
                style={{ shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
              >
                <View>
                  <Text className="text-white text-lg font-bold">Add Building</Text>
                  <Text className="text-white/80 text-sm mt-1">Upload or design new building</Text>
                </View>
                <Text className="text-white text-3xl">+</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/simulations/new" asChild onPress={handlePress}>
              <TouchableOpacity 
                className="bg-surface rounded-2xl p-5 flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <View>
                  <Text className="text-foreground text-lg font-bold">New Simulation</Text>
                  <Text className="text-muted text-sm mt-1">Run carbon reduction scenario</Text>
                </View>
                <Text className="text-primary text-2xl">⚡</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>

        {/* Features Overview */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)} className="px-4 mt-6">
          <Text className="text-foreground text-lg font-bold mb-4">Platform Features</Text>
          
          <View className="gap-4">
            <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
              <View className="flex-row items-center mb-2">
                <View className="bg-primary/20 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary text-xl">🏢</Text>
                </View>
                <Text className="text-foreground font-bold text-base flex-1">Digital Twin Visualization</Text>
              </View>
              <Text className="text-muted text-sm">
                Convert building sketches into interactive 3D models with IoT sensor integration
              </Text>
            </View>

            <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
              <View className="flex-row items-center mb-2">
                <View className="bg-secondary/20 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text className="text-secondary text-xl">🤖</Text>
                </View>
                <Text className="text-foreground font-bold text-base flex-1">AI-Powered Analysis</Text>
              </View>
              <Text className="text-muted text-sm">
                Intelligent carbon forecasting and cost-benefit analysis for sustainability interventions
              </Text>
            </View>

            <View className="bg-surface rounded-2xl p-4" style={{ borderWidth: 1, borderColor: colors.border }}>
              <View className="flex-row items-center mb-2">
                <View className="bg-success/20 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text className="text-success text-xl">🔗</Text>
                </View>
                <Text className="text-foreground font-bold text-base flex-1">Blockchain Carbon Accounting</Text>
              </View>
              <Text className="text-muted text-sm">
                Immutable supply chain carbon tracking with verified Scope 3 emissions data
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Digital Twin Concept Image */}
        <Animated.View entering={FadeInDown.delay(1000).duration(600)} className="px-4 mt-6">
          <Image
            source={require("@/assets/images/hero-digital-twin.png")}
            style={{ width: width - 32, height: 240, borderRadius: 16 }}
            resizeMode="cover"
          />
        </Animated.View>

        {/* AI Insights Section */}
        <Animated.View entering={FadeInDown.delay(1200).duration(600)} className="px-4 mt-6">
          <Text className="text-foreground text-lg font-bold mb-4">AI Insights</Text>
          
          <View className="bg-surface rounded-2xl p-5" style={{ borderWidth: 1, borderColor: colors.border }}>
            <View className="flex-row items-start mb-3">
              <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-primary text-base">💡</Text>
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold mb-1">Get Started</Text>
                <Text className="text-muted text-sm">
                  Add your first building to unlock AI-powered carbon reduction recommendations and simulation capabilities
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}
