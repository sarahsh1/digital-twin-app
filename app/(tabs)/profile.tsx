import { useState, useCallback } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Badge } from "@/components/ui/badge";
import { loadAllSimulations } from "@/lib/simulations";

interface CompanyProfile {
  companyName: string;
  industry: string;
  buildingCount: number;
  goals: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [buildingsCount, setBuildingsCount] = useState(0);
  const [simulationsCount, setSimulationsCount] = useState(0);
  const [blockchainCount, setBlockchainCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
      loadStats();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem("companyProfile");
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const loadStats = async () => {
    try {
      const buildingsData = await AsyncStorage.getItem("buildings");
      setBuildingsCount(buildingsData ? JSON.parse(buildingsData).length : 0);

      const simulations = await loadAllSimulations();
      setSimulationsCount(simulations.length);

      const txnData = await AsyncStorage.getItem("blockchain_transactions");
      setBlockchainCount(txnData ? JSON.parse(txnData).length : 0);
    } catch (error) {
      console.error("Failed to load profile stats:", error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "This clears your company profile and returns you to setup. Your buildings and simulations stay saved on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("companyProfile");
            await AsyncStorage.removeItem("onboardingCompleted");
            router.replace("/onboarding/welcome");
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    onPress,
    comingSoon,
  }: {
    icon: string;
    title: string;
    onPress?: () => void;
    comingSoon?: boolean;
  }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4 border-b border-border active:opacity-70"
      onPress={comingSoon ? undefined : onPress}
      disabled={comingSoon}
      style={{ opacity: comingSoon ? 0.55 : 1 }}
    >
      <View className="flex-row items-center flex-1">
        <Text className="text-2xl mr-3">{icon}</Text>
        <Text className="text-base text-foreground">{title}</Text>
      </View>
      {comingSoon ? <Badge label="Coming soon" tone="neutral" /> : <Text className="text-muted text-xl">›</Text>}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Profile</Text>
        </View>

        {/* Company Profile Card */}
        <View className="px-6 mb-6">
          <View className="bg-surface rounded-2xl p-6">
            <View className="items-center mb-4">
              <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-3">
                <Text className="text-4xl">🏢</Text>
              </View>
              <Text className="text-2xl font-bold text-foreground mb-1">
                {profile?.companyName || "Your Company"}
              </Text>
              <Text className="text-base text-muted">{profile?.industry || "Industry"}</Text>
            </View>

            <View className="flex-row justify-around border-t border-border pt-4">
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">{buildingsCount}</Text>
                <Text className="text-sm text-muted">Buildings</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">{simulationsCount}</Text>
                <Text className="text-sm text-muted">Simulations</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">{blockchainCount}</Text>
                <Text className="text-sm text-muted">Blockchain Txns</Text>
              </View>
            </View>

            <TouchableOpacity
              className="bg-primary/10 border border-primary rounded-xl py-3 items-center mt-4 active:opacity-70"
              onPress={() => router.push("/onboarding/setup")}
            >
              <Text className="text-primary font-semibold">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sustainability Goals */}
        {profile?.goals && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Sustainability Goals</Text>
            <View className="bg-surface rounded-xl p-4">
              <Text className="text-base text-foreground leading-relaxed">{profile.goals}</Text>
            </View>
          </View>
        )}

        {/* Account Settings */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Account Settings</Text>
          <View className="bg-surface rounded-xl px-4">
            <SettingItem icon="🔔" title="Notifications" comingSoon />
            <SettingItem icon="🔄" title="Data Sync" comingSoon />
            <SettingItem icon="📏" title="Units" comingSoon />
            <SettingItem icon="🌐" title="Language" comingSoon />
          </View>
        </View>

        {/* Subscription */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Subscription & Billing</Text>
          <View className="bg-surface rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-base font-semibold text-foreground mb-1">Free Plan</Text>
                <Text className="text-sm text-muted">Limited features</Text>
              </View>
              <View className="bg-primary/20 px-3 py-1 rounded-full">
                <Text className="text-xs font-medium text-primary">Active</Text>
              </View>
            </View>
            <View
              className="rounded-xl py-3 items-center flex-row justify-center gap-2 border border-border"
              style={{ opacity: 0.6 }}
            >
              <Text className="text-muted font-semibold">Upgrade to Pro</Text>
              <Badge label="Coming soon" tone="neutral" />
            </View>
          </View>
        </View>

        {/* Support & Resources */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Support & Resources</Text>
          <View className="bg-surface rounded-xl px-4">
            <SettingItem icon="❓" title="Help Center" comingSoon />
            <SettingItem icon="💬" title="Contact Support" comingSoon />
            <SettingItem icon="🎓" title="Tutorial Videos" comingSoon />
            <SettingItem icon="📚" title="API Documentation" comingSoon />
          </View>
        </View>

        {/* About */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">About</Text>
          <View className="bg-surface rounded-xl px-4">
            <View className="flex-row items-center justify-between py-4 border-b border-border">
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">ℹ️</Text>
                <Text className="text-base text-foreground">App Version</Text>
              </View>
              <Text className="text-muted text-sm">1.0.0</Text>
            </View>
            <SettingItem icon="📄" title="Terms of Service" comingSoon />
            <SettingItem icon="🔒" title="Privacy Policy" comingSoon />
            <SettingItem icon="⚖️" title="Licenses" comingSoon />
          </View>
        </View>

        {/* Sign Out */}
        <View className="px-6">
          <TouchableOpacity
            className="bg-error/10 border border-error rounded-xl py-4 items-center active:opacity-70"
            onPress={handleSignOut}
          >
            <Text className="text-error font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
