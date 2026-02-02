import { ScrollView, Text, View, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { loadDemoBuildings } from "@/lib/demoBuildings";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Building {
  id: string;
  name: string;
  type: string;
  size: number;
  floors: number;
  location: string;
  image?: string;
  createdAt: string;
}

export default function BuildingsScreen() {
  const colors = useColors();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      // Load demo buildings first, then load all buildings
      loadDemoBuildings().then(() => {
        loadBuildings();
      });
    }, [])
  );

  const loadBuildings = async () => {
    try {
      const data = await AsyncStorage.getItem("buildings");
      if (data) {
        setBuildings(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load buildings", error);
    }
  };

  const deleteBuilding = async (id: string) => {
    Alert.alert(
      "Delete Building",
      "Are you sure you want to delete this building?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const filtered = buildings.filter(b => b.id !== id);
              await AsyncStorage.setItem("buildings", JSON.stringify(filtered));
              setBuildings(filtered);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert("Error", "Failed to delete building");
            }
          }
        }
      ]
    );
  };

  const filteredBuildings = buildings.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <Text className="text-foreground text-2xl font-bold mb-4">Buildings</Text>
          
          {/* Search Bar */}
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search buildings..."
            placeholderTextColor={colors.muted}
            className="bg-surface rounded-xl p-3 text-foreground"
            style={{ borderWidth: 1, borderColor: colors.border }}
          />
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {buildings.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(400)} className="items-center justify-center py-16">
              <Image
                source={require("@/assets/images/empty-buildings.png")}
                style={{ width: 200, height: 200, marginBottom: 16 }}
                resizeMode="contain"
              />
              <Text className="text-foreground text-xl font-bold mb-2">No Buildings Yet</Text>
              <Text className="text-muted text-center mb-6 px-8">
                Add your first building to start analyzing carbon reduction opportunities
              </Text>
              <Link href="/buildings/add" asChild>
                <TouchableOpacity 
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  className="bg-primary rounded-xl px-6 py-3"
                >
                  <Text className="text-white font-semibold">+ Add Building</Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          ) : (
            <>
              {/* Add Button */}
              <Link href="/buildings/add" asChild>
                <TouchableOpacity 
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  className="bg-primary rounded-2xl p-4 my-4 flex-row items-center justify-between"
                >
                  <View>
                    <Text className="text-white text-lg font-bold">Add New Building</Text>
                    <Text className="text-white/80 text-sm">Upload or design from scratch</Text>
                  </View>
                  <Text className="text-white text-3xl">+</Text>
                </TouchableOpacity>
              </Link>

              {/* Buildings List */}
              <View className="gap-4 pb-6">
                {filteredBuildings.map((building, index) => (
                  <Animated.View 
                    key={building.id} 
                    entering={FadeInDown.delay(index * 100).duration(400)}
                  >
                    <View 
                      className="bg-surface rounded-2xl overflow-hidden"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    >
                      {building.image ? (
                        <Image
                          source={typeof building.image === 'string' ? { uri: building.image } : building.image}
                          style={{ width: "100%", height: 220 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View 
                          className="w-full items-center justify-center"
                          style={{ height: 220, backgroundColor: colors.primary + "20" }}
                        >
                          <Text style={{ fontSize: 60 }}>
                            {building.type === "office" ? "🏢" : 
                             building.type === "residential" ? "🏘️" : 
                             building.type === "industrial" ? "🏭" : "🏬"}
                          </Text>
                        </View>
                      )}
                      
                      <View className="p-4">
                        <Text className="text-foreground text-xl font-bold mb-1">{building.name}</Text>
                        <Text className="text-muted text-sm capitalize mb-2">{building.type}</Text>
                        
                        <View className="flex-row gap-4 mb-3">
                          <View className="flex-1">
                            <Text className="text-muted text-xs">Size</Text>
                            <Text className="text-foreground font-semibold">{building.size.toLocaleString()} sq ft</Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-muted text-xs">Floors</Text>
                            <Text className="text-foreground font-semibold">{building.floors}</Text>
                          </View>
                        </View>
                        
                        <Text className="text-muted text-sm mb-4">📍 {building.location}</Text>
                        
                        {/* Actions */}
                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              router.push(`/buildings/${building.id}`);
                            }}
                            className="flex-1 bg-primary rounded-xl py-3 items-center"
                          >
                            <Text className="text-white font-semibold">View Details</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              router.push("/simulations/new");
                            }}
                            className="flex-1 bg-secondary/20 rounded-xl py-3 items-center"
                            style={{ borderWidth: 1, borderColor: colors.primary }}
                          >
                            <Text className="font-semibold" style={{ color: colors.primary }}>Simulate</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                              deleteBuilding(building.id);
                            }}
                            className="bg-error/20 rounded-xl px-4 py-3 items-center justify-center"
                            style={{ borderWidth: 1, borderColor: colors.error }}
                          >
                            <Text className="text-error font-semibold">🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
