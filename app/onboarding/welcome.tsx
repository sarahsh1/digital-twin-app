import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { GlowBackdrop } from "@/components/ui/glow-backdrop";
import { DigitalTwinGlyph } from "@/components/ui/digital-twin-glyph";
import { useColors } from "@/hooks/use-colors";

export default function WelcomeScreen() {
  const colors = useColors();

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#05100D]">
      <GlowBackdrop>
        <View
          className="flex-1 items-center justify-center px-6 self-center"
          style={{ width: "100%", maxWidth: 480 }}
        >
          <Animated.View entering={FadeInUp.duration(700)} className="items-center">
            <DigitalTwinGlyph size={120} />

            <Text
              className="text-foreground text-6xl font-bold text-center mt-6"
              style={{ letterSpacing: -0.5, lineHeight: 60 }}
            >
              EcoTwin
            </Text>
            <Text className="text-muted text-lg text-center mt-3 max-w-xs" style={{ lineHeight: 26 }}>
              Proactive carbon reduction through AI-powered building optimization
            </Text>

            <Text
              className="text-primary text-sm font-bold text-center mt-6"
              style={{ letterSpacing: 1.5 }}
            >
              FROM MEASUREMENT TO ACTION
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(700)} className="w-full max-w-sm gap-4 mt-14">
            <TouchableOpacity
              onPress={() => router.push("/onboarding/features")}
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
                <Text className="text-white text-lg font-bold">Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 items-center active:opacity-60"
              onPress={() => router.replace("/(tabs)")}
            >
              <Text className="text-muted text-base font-medium">Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </GlowBackdrop>
    </ScreenContainer>
  );
}
