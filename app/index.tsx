import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "@/hooks/use-colors";

export default function Index() {
  const colors = useColors();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem("onboardingCompleted");
      
      if (onboardingCompleted === "true") {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding/welcome");
      }
    } catch (error) {
      // Default to onboarding if there's an error
      router.replace("/onboarding/welcome");
    }
  };

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
