import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

const industries = [
  "Manufacturing",
  "Commercial Real Estate",
  "Institutional (Education, Healthcare)",
  "Hospitality",
  "Retail",
  "Technology",
  "Other",
];

export default function SetupScreen() {
  const colors = useColors();
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [buildingCount, setBuildingCount] = useState("");
  const [goals, setGoals] = useState("");
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);

  const handleComplete = async () => {
    if (!companyName.trim()) {
      Alert.alert("Required", "Please enter your company name");
      return;
    }

    if (!industry) {
      Alert.alert("Required", "Please select your industry");
      return;
    }

    try {
      const profile = {
        companyName: companyName.trim(),
        industry,
        buildingCount: buildingCount ? parseInt(buildingCount) : 0,
        goals: goals.trim(),
        onboardingCompleted: true,
      };

      await AsyncStorage.setItem("companyProfile", JSON.stringify(profile));
      await AsyncStorage.setItem("onboardingCompleted", "true");
      
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 40, paddingBottom: 40 }}>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Create Your Profile
          </Text>
          <Text className="text-base text-muted">
            Tell us about your organization to personalize your experience
          </Text>
        </View>

        {/* Company Name */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground mb-2">
            Company Name *
          </Text>
          <TextInput
            className="bg-surface text-foreground px-4 py-3 rounded-lg border border-border"
            placeholder="Enter company name"
            placeholderTextColor={colors.muted}
            value={companyName}
            onChangeText={setCompanyName}
            returnKeyType="next"
          />
        </View>

        {/* Industry */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground mb-2">
            Industry Sector *
          </Text>
          <TouchableOpacity
            className="bg-surface px-4 py-3 rounded-lg border border-border"
            onPress={() => setShowIndustryPicker(!showIndustryPicker)}
          >
            <Text className={industry ? "text-foreground" : "text-muted"}>
              {industry || "Select industry"}
            </Text>
          </TouchableOpacity>
          
          {showIndustryPicker && (
            <View className="mt-2 bg-surface rounded-lg border border-border overflow-hidden">
              {industries.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="px-4 py-3 border-b border-border active:bg-primary/10"
                  onPress={() => {
                    setIndustry(item);
                    setShowIndustryPicker(false);
                  }}
                >
                  <Text className={item === industry ? "text-primary font-semibold" : "text-foreground"}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Building Count */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground mb-2">
            Number of Buildings (Optional)
          </Text>
          <TextInput
            className="bg-surface text-foreground px-4 py-3 rounded-lg border border-border"
            placeholder="0"
            placeholderTextColor={colors.muted}
            value={buildingCount}
            onChangeText={setBuildingCount}
            keyboardType="number-pad"
            returnKeyType="next"
          />
        </View>

        {/* Sustainability Goals */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-foreground mb-2">
            Sustainability Goals (Optional)
          </Text>
          <TextInput
            className="bg-surface text-foreground px-4 py-3 rounded-lg border border-border"
            placeholder="e.g., Achieve net-zero by 2030, reduce emissions by 50%"
            placeholderTextColor={colors.muted}
            value={goals}
            onChangeText={setGoals}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            returnKeyType="done"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-primary py-4 rounded-full items-center active:opacity-80"
          onPress={handleComplete}
        >
          <Text className="text-background text-lg font-semibold">Complete Setup</Text>
        </TouchableOpacity>

        {/* Skip Link */}
        <TouchableOpacity
          className="py-4 items-center active:opacity-60"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="text-muted text-base font-medium">Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
