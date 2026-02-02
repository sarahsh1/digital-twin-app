import { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

interface CompanyProfile {
  companyName: string;
  industry: string;
  buildingCount: number;
  goals: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

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

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/onboarding/welcome");
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4 border-b border-border active:opacity-70"
      onPress={onPress}
    >
      <View className="flex-row items-center flex-1">
        <Text className="text-2xl mr-3">{icon}</Text>
        <Text className="text-base text-foreground">{title}</Text>
      </View>
      <Text className="text-muted text-xl">›</Text>
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

            {profile?.buildingCount !== undefined && (
              <View className="flex-row justify-around border-t border-border pt-4">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">{profile.buildingCount}</Text>
                  <Text className="text-sm text-muted">Buildings</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">12</Text>
                  <Text className="text-sm text-muted">Simulations</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">127</Text>
                  <Text className="text-sm text-muted">Blockchain Txns</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              className="bg-primary/10 border border-primary rounded-xl py-3 items-center mt-4 active:opacity-70"
              onPress={() => Alert.alert("Edit Profile", "This would open the profile editor")}
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
            <SettingItem
              icon="🔔"
              title="Notifications"
              onPress={() => Alert.alert("Notifications", "Notification settings would open here")}
            />
            <SettingItem
              icon="🔄"
              title="Data Sync"
              onPress={() => Alert.alert("Data Sync", "Data sync settings would open here")}
            />
            <SettingItem
              icon="📏"
              title="Units"
              onPress={() => Alert.alert("Units", "Units preference (metric/imperial) would open here")}
            />
            <SettingItem
              icon="🌐"
              title="Language"
              onPress={() => Alert.alert("Language", "Language selector would open here")}
            />
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
            <TouchableOpacity
              className="bg-primary rounded-xl py-3 items-center active:opacity-80"
              onPress={() => Alert.alert("Upgrade", "Subscription plans would be shown here")}
            >
              <Text className="text-background font-semibold">Upgrade to Pro</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Resources */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Support & Resources</Text>
          <View className="bg-surface rounded-xl px-4">
            <SettingItem
              icon="❓"
              title="Help Center"
              onPress={() => Alert.alert("Help Center", "Help documentation would open here")}
            />
            <SettingItem
              icon="💬"
              title="Contact Support"
              onPress={() => Alert.alert("Contact Support", "Support contact form would open here")}
            />
            <SettingItem
              icon="🎓"
              title="Tutorial Videos"
              onPress={() => Alert.alert("Tutorials", "Video tutorials would be shown here")}
            />
            <SettingItem
              icon="📚"
              title="API Documentation"
              onPress={() => Alert.alert("API Docs", "API documentation would open here")}
            />
          </View>
        </View>

        {/* About */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">About</Text>
          <View className="bg-surface rounded-xl px-4">
            <SettingItem
              icon="ℹ️"
              title="App Version"
              onPress={() => Alert.alert("Version", "Digital Twin Platform v1.0.0")}
            />
            <SettingItem
              icon="📄"
              title="Terms of Service"
              onPress={() => Alert.alert("Terms", "Terms of Service would open here")}
            />
            <SettingItem
              icon="🔒"
              title="Privacy Policy"
              onPress={() => Alert.alert("Privacy", "Privacy Policy would open here")}
            />
            <SettingItem
              icon="⚖️"
              title="Licenses"
              onPress={() => Alert.alert("Licenses", "Open source licenses would be shown here")}
            />
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
