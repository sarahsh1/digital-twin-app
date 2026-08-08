import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native'
import { Link, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

import { ScreenContainer } from '@/components/screen-container'
import { MetricCard, Card } from '@/components/ui/card'
import { SectionHeader, Caption } from '@/components/ui/typography'
import { useColors } from '@/hooks/use-colors'
import { loadDemoBuildings } from '@/lib/demoBuildings'
import { loadAllSimulations, type FormattedSimulation } from '@/lib/simulations'

const { width } = Dimensions.get('window')

interface BuildingSummary {
  id: string
  isDemo?: boolean
}

export default function HomeScreen() {
  const colors = useColors()
  const [buildings, setBuildings] = useState<BuildingSummary[]>([])
  const [simulations, setSimulations] = useState<FormattedSimulation[]>([])

  useFocusEffect(
    useCallback(() => {
      loadPortfolio()
    }, [])
  )

  const loadPortfolio = async () => {
    await loadDemoBuildings()
    const buildingsData = await AsyncStorage.getItem('buildings')
    setBuildings(buildingsData ? JSON.parse(buildingsData) : [])
    setSimulations(await loadAllSimulations())
  }

  // Real portfolio statistics -- these reflect whatever is actually stored
  // on this device, not a fixed demo-data count.
  const buildingsCount = buildings.length
  const sampleBuildingsCount = buildings.filter((b) => b.isDemo).length
  const simulationsCount = simulations.length
  const totalCO2Saved = simulations.reduce(
    (sum, sim) => sum + sim.results.projected.annualReduction,
    0
  )
  const totalSavings = simulations.reduce(
    (sum, sim) => sum + sim.results.financial.annualSavings,
    0
  )

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Hero Section with Gradient */}
        <Animated.View entering={FadeInUp.duration(800)}>
          <LinearGradient
            colors={[colors.primary, colors.secondary, '#0a4a3a']}
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

              <Link
                href="/buildings/demo-sce-building"
                asChild
                onPress={handlePress}
              >
                <TouchableOpacity
                  className="bg-white/20 backdrop-blur-lg px-4 py-3 rounded-xl self-start"
                  style={{
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.3)'
                  }}
                >
                  <Text className="text-white font-semibold">
                    View SCE Demo →
                  </Text>
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
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              gap: 12
            }}
          >
            <MetricCard label="Buildings" value={String(buildingsCount)} tone="primary" width={144} />
            <MetricCard label="Simulations" value={String(simulationsCount)} tone="primary" width={144} />
            <MetricCard label="CO₂ Saved" value={`${Math.round(totalCO2Saved)}t`} tone="secondary" width={144} />
            <MetricCard
              label="Cost Savings"
              value={`$${(totalSavings / 1000000).toFixed(1)}M`}
              tone="success"
              width={144}
            />
          </ScrollView>
          {sampleBuildingsCount > 0 && (
            <Caption className="px-4 -mt-2 mb-2">
              Includes {sampleBuildingsCount} sample building{sampleBuildingsCount === 1 ? '' : 's'} for reference
            </Caption>
          )}
        </Animated.View>

        {/* Hero Image Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          className="px-4"
        >
          <Image
            source={require('@/assets/images/hero-sustainability.png')}
            style={{ width: width - 32, height: 320, borderRadius: 16 }}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(600)}
          className="px-4 mt-6"
        >
          <SectionHeader className="mb-4">Quick Actions</SectionHeader>

          <View className="gap-3">
            <Link href="/buildings/add" asChild onPress={handlePress}>
              <TouchableOpacity
                className="bg-primary rounded-2xl p-5 flex-row items-center justify-between"
                style={{
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8
                }}
              >
                <View>
                  <Text className="text-white text-lg font-bold">
                    Add Building
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    Upload or design new building
                  </Text>
                </View>
                <Ionicons name="add-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </Link>

            <Link href="/simulations/new" asChild onPress={handlePress}>
              <TouchableOpacity
                className="bg-surface rounded-2xl p-5 flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <View>
                  <Text className="text-foreground text-lg font-bold">
                    New Simulation
                  </Text>
                  <Text className="text-muted text-sm mt-1">
                    Run carbon reduction scenario
                  </Text>
                </View>
                <Ionicons name="flash" size={24} color={colors.primary} />
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>

        {/* Features Overview */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(600)}
          className="px-4 mt-6"
        >
          <SectionHeader className="mb-4">Platform Features</SectionHeader>

          <View className="gap-4">
            <Card>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary + "33" }}
                >
                  <Ionicons name="business" size={20} color={colors.primary} />
                </View>
                <Text className="text-foreground font-bold text-base flex-1">
                  Digital Twin Visualization
                </Text>
              </View>
              <Text className="text-muted text-sm">
                Convert building sketches into interactive 3D models with IoT
                sensor integration
              </Text>
            </Card>

            <Card>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.secondary + "33" }}
                >
                  <Ionicons name="hardware-chip" size={20} color={colors.secondary} />
                </View>
                <Text className="text-foreground font-bold text-base flex-1">
                  AI-Powered Analysis
                </Text>
              </View>
              <Text className="text-muted text-sm">
                Intelligent carbon forecasting and cost-benefit analysis for
                sustainability interventions
              </Text>
            </Card>

            <Card>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.success + "33" }}
                >
                  <Ionicons name="link" size={20} color={colors.success} />
                </View>
                <Text className="text-foreground font-bold text-base flex-1">
                  Blockchain Carbon Accounting
                </Text>
              </View>
              <Text className="text-muted text-sm">
                Immutable supply chain carbon tracking with verified Scope 3
                emissions data
              </Text>
            </Card>
          </View>
        </Animated.View>

        {/* Digital Twin Concept Image */}
        <Animated.View
          entering={FadeInDown.delay(1000).duration(600)}
          className="px-4 mt-6"
        >
          <Image
            source={require('@/assets/images/hero-digital-twin.png')}
            style={{ width: width - 32, height: 240, borderRadius: 16 }}
            resizeMode="cover"
          />
        </Animated.View>

        {/* AI Insights Section */}
        <Animated.View
          entering={FadeInDown.delay(1200).duration(600)}
          className="px-4 mt-6"
        >
          <SectionHeader className="mb-4">AI Insights</SectionHeader>

          <Card className="p-5">
            <View className="flex-row items-start mb-3">
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1"
                style={{ backgroundColor: colors.primary + "33" }}
              >
                <Ionicons name="bulb" size={16} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold mb-1">
                  Get Started
                </Text>
                <Text className="text-muted text-sm">
                  Add your first building to unlock AI-powered carbon reduction
                  recommendations and simulation capabilities
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  )
}
