import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { GlowBackdrop } from "@/components/ui/glow-backdrop";
import { GlowIcon } from "@/components/ui/glow-icon";
import { useColors } from "@/hooks/use-colors";

// Caps the carousel/content column at a phone-like width and centers it --
// on an actual phone this is a no-op (window width stays under the cap),
// on a wide web/desktop viewport it keeps onboarding from stretching into
// a broken full-bleed layout.
const MAX_CONTENT_WIDTH = 480;

const features: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string }[] = [
  {
    icon: "cube-outline",
    title: "Digital Twin Creation",
    description: "Upload building sketches or design from scratch. Our AI converts them into accurate 3D digital twins with all systems mapped.",
  },
  {
    icon: "flask-outline",
    title: "Simulation Engine",
    description: "Test sustainability scenarios before investment. Solar panels, wind turbines, HVAC optimization, and more.",
  },
  {
    icon: "hardware-chip-outline",
    title: "AI Forecasting",
    description: "Predictive analytics for carbon reduction, energy savings, and ROI. Make data-driven decisions with confidence.",
  },
  {
    icon: "link-outline",
    title: "Blockchain Tracking",
    description: "Transparent supply chain emissions with immutable blockchain verification. Solve Scope 3 reporting challenges.",
  },
];

export default function FeaturesScreen() {
  const colors = useColors();
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, MAX_CONTENT_WIDTH);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const isLast = currentIndex === features.length - 1;

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: width * index, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (!isLast) {
      goToSlide(currentIndex + 1);
    } else {
      router.push("/onboarding/setup" as any);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  };

  const handleSkip = () => {
    router.push("/onboarding/setup" as any);
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#05100D]">
      <GlowBackdrop>
        <View className="flex-1 self-center" style={{ width: "100%", maxWidth: MAX_CONTENT_WIDTH }}>
          {/* Carousel */}
          <View className="flex-1 justify-center">
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {features.map((feature, index) => (
                <View key={index} style={{ width }} className="items-center justify-center px-10">
                  <View className="items-center">
                    <GlowIcon icon={feature.icon} size={96} iconSize={44} />
                    <Text
                      className="text-foreground text-3xl font-bold text-center mt-8 mb-4"
                      style={{ letterSpacing: -0.5 }}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      className="text-foreground/70 text-base text-center max-w-xs"
                      style={{ lineHeight: 24 }}
                    >
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Carousel chevrons */}
            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={handlePrev}
                className="absolute left-3 w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", top: "50%", marginTop: -20 }}
              >
                <Ionicons name="chevron-back" size={20} color={colors.foreground} />
              </TouchableOpacity>
            )}
            {!isLast && (
              <TouchableOpacity
                onPress={() => goToSlide(currentIndex + 1)}
                className="absolute right-3 w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", top: "50%", marginTop: -20 }}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.foreground} />
              </TouchableOpacity>
            )}
          </View>

          {/* Progress Indicators */}
          <View className="flex-row justify-center gap-2 mb-8">
            {features.map((_, index) => (
              <View
                key={index}
                className="h-2 rounded-full"
                style={{
                  width: index === currentIndex ? 28 : 8,
                  backgroundColor: index === currentIndex ? colors.primary : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </View>

          {/* Actions */}
          <View className="px-6 pb-8 gap-4">
            <TouchableOpacity
              onPress={handleNext}
              style={{
                borderRadius: 28,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.45,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 28, paddingVertical: 17, alignItems: "center" }}
              >
                <Text className="text-white text-lg font-bold">{isLast ? "Get Started" : "Next"}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {!isLast && (
              <TouchableOpacity className="py-3 items-center active:opacity-60" onPress={handleSkip}>
                <Text className="text-foreground/60 text-base font-medium">Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </GlowBackdrop>
    </ScreenContainer>
  );
}
