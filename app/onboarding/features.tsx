import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

const { width } = Dimensions.get("window");

const features = [
  {
    icon: "🏗️",
    title: "Digital Twin Creation",
    description: "Upload building sketches or design from scratch. Our AI converts them into accurate 3D digital twins with all systems mapped.",
  },
  {
    icon: "⚗️",
    title: "Simulation Engine",
    description: "Test sustainability scenarios before investment. Solar panels, wind turbines, HVAC optimization, and more.",
  },
  {
    icon: "🧠",
    title: "AI Forecasting",
    description: "Predictive analytics for carbon reduction, energy savings, and ROI. Make data-driven decisions with confidence.",
  },
  {
    icon: "🔗",
    title: "Blockchain Tracking",
    description: "Transparent supply chain emissions with immutable blockchain verification. Solve Scope 3 reporting challenges.",
  },
];

export default function FeaturesScreen() {
  const colors = useColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      router.push("/onboarding/setup" as any);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/setup" as any);
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1">
        {/* Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {features.map((feature, index) => (
            <View
              key={index}
              style={{ width }}
              className="flex-1 items-center justify-center px-8"
            >
              <View className="items-center">
                <Text className="text-8xl mb-8">{feature.icon}</Text>
                <Text className="text-3xl font-bold text-foreground text-center mb-4">
                  {feature.title}
                </Text>
                <Text className="text-lg text-muted text-center max-w-md leading-relaxed">
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Progress Indicators */}
        <View className="flex-row justify-center gap-2 mb-8">
          {features.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </View>

        {/* Actions */}
        <View className="px-6 pb-8 gap-4">
          <TouchableOpacity
            className="bg-primary py-4 rounded-full items-center active:opacity-80"
            onPress={handleNext}
          >
            <Text className="text-background text-lg font-semibold">
              {currentIndex === features.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>

          {currentIndex < features.length - 1 && (
            <TouchableOpacity
              className="py-4 items-center active:opacity-60"
              onPress={handleSkip}
            >
              <Text className="text-muted text-base font-medium">Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
