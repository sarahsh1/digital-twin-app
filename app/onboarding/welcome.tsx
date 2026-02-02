import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function WelcomeScreen() {
  const colors = useColors();

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Hero Section */}
        <View className="items-center mb-12">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 128, height: 128, marginBottom: 24 }}
            resizeMode="contain"
          />
          <Text className="text-5xl font-bold text-foreground text-center mb-4">
            EcoTwin
          </Text>
          <Text className="text-xl text-muted text-center mb-2">
            Digital Twin Sustainability Platform
          </Text>
          <Text className="text-lg text-muted text-center max-w-sm">
            Proactive carbon reduction through AI-powered building optimization
          </Text>
        </View>

        {/* Tagline */}
        <View className="mb-12">
          <Text className="text-xl font-semibold text-primary text-center">
            From Measurement to Action
          </Text>
        </View>

        {/* Actions */}
        <View className="w-full max-w-sm gap-4">
          <TouchableOpacity
            className="bg-primary py-4 rounded-full items-center active:opacity-80"
            onPress={() => router.push("/onboarding/features")}
          >
            <Text className="text-background text-lg font-semibold">Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="py-4 items-center active:opacity-60"
            onPress={() => router.replace("/(tabs)")}
          >
            <Text className="text-primary text-base font-medium">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
