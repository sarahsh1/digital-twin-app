import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

type BuildingType = "office" | "residential" | "industrial" | "retail";

export default function AddBuildingScreen() {
  const colors = useColors();
  const [step, setStep] = useState(1);
  const [buildingType, setBuildingType] = useState<BuildingType | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [floors, setFloors] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const buildingTypes: { type: BuildingType; label: string; icon: string; imagePath: any }[] = [
    { type: "office", label: "Office Building", icon: "🏢", imagePath: require("@/assets/images/building-types-office.png") },
    { type: "residential", label: "Residential", icon: "🏘️", imagePath: require("@/assets/images/building-types-residential.png") },
    { type: "industrial", label: "Industrial", icon: "🏭", imagePath: require("@/assets/images/building-types-industrial.png") },
    { type: "retail", label: "Retail/Commercial", icon: "🏬", imagePath: null },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required to take photos");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (!buildingType || !name || !location || !size || !floors) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newBuilding = {
      id: Date.now().toString(),
      type: buildingType,
      name,
      location,
      size: parseInt(size),
      floors: parseInt(floors),
      image,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem("buildings");
      const buildings = existing ? JSON.parse(existing) : [];
      buildings.push(newBuilding);
      await AsyncStorage.setItem("buildings", JSON.stringify(buildings));
      
      Alert.alert("Success", "Building added successfully!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/buildings") }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save building");
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleBack} className="py-2">
              <Text className="text-primary text-base">← Back</Text>
            </TouchableOpacity>
            <Text className="text-foreground text-lg font-bold">Add Building</Text>
            <View style={{ width: 60 }} />
          </View>
          
          {/* Progress Indicator */}
          <View className="flex-row mt-4 gap-2">
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                className="flex-1 h-1 rounded-full"
                style={{ backgroundColor: s <= step ? colors.primary : colors.border }}
              />
            ))}
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Step 1: Building Type */}
          {step === 1 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-2xl font-bold mb-2">Select Building Type</Text>
              <Text className="text-muted mb-6">Choose the type of building you want to add</Text>

              <View className="gap-3">
                {buildingTypes.map((item) => (
                  <TouchableOpacity
                    key={item.type}
                    onPress={() => {
                      setBuildingType(item.type);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className="rounded-2xl p-4 flex-row items-center"
                    style={{
                      backgroundColor: buildingType === item.type ? colors.primary + "20" : colors.surface,
                      borderWidth: 2,
                      borderColor: buildingType === item.type ? colors.primary : colors.border,
                    }}
                  >
                    {item.imagePath ? (
                      <Image source={item.imagePath} style={{ width: 60, height: 60, marginRight: 16 }} resizeMode="contain" />
                    ) : (
                      <Text style={{ fontSize: 40, marginRight: 16 }}>{item.icon}</Text>
                    )}
                    <Text className="text-foreground text-lg font-semibold">{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-2xl font-bold mb-2">Basic Information</Text>
              <Text className="text-muted mb-6">Enter building details</Text>

              <View className="gap-4">
                <View>
                  <Text className="text-foreground font-semibold mb-2">Building Name *</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Main Office Tower"
                    placeholderTextColor={colors.muted}
                    className="bg-surface rounded-xl p-4 text-foreground"
                    style={{ borderWidth: 1, borderColor: colors.border }}
                  />
                </View>

                <View>
                  <Text className="text-foreground font-semibold mb-2">Location *</Text>
                  <TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g., Manama, Bahrain"
                    placeholderTextColor={colors.muted}
                    className="bg-surface rounded-xl p-4 text-foreground"
                    style={{ borderWidth: 1, borderColor: colors.border }}
                  />
                </View>

                <View>
                  <Text className="text-foreground font-semibold mb-2">Total Size (sq ft) *</Text>
                  <TextInput
                    value={size}
                    onChangeText={setSize}
                    placeholder="e.g., 60000"
                    keyboardType="numeric"
                    placeholderTextColor={colors.muted}
                    className="bg-surface rounded-xl p-4 text-foreground"
                    style={{ borderWidth: 1, borderColor: colors.border }}
                  />
                </View>

                <View>
                  <Text className="text-foreground font-semibold mb-2">Number of Floors *</Text>
                  <TextInput
                    value={floors}
                    onChangeText={setFloors}
                    placeholder="e.g., 18"
                    keyboardType="numeric"
                    placeholderTextColor={colors.muted}
                    className="bg-surface rounded-xl p-4 text-foreground"
                    style={{ borderWidth: 1, borderColor: colors.border }}
                  />
                </View>
              </View>
            </Animated.View>
          )}

          {/* Step 3: Upload Image */}
          {step === 3 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-2xl font-bold mb-2">Building Image</Text>
              <Text className="text-muted mb-6">Upload a photo or sketch of your building</Text>

              {image ? (
                <View className="mb-4">
                  <Image source={{ uri: image }} style={{ width: "100%", height: 200, borderRadius: 16 }} resizeMode="cover" />
                  <TouchableOpacity
                    onPress={() => setImage(null)}
                    className="absolute top-2 right-2 bg-error rounded-full w-8 h-8 items-center justify-center"
                  >
                    <Text className="text-white font-bold">×</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="bg-surface rounded-2xl p-8 items-center justify-center mb-4" style={{ borderWidth: 2, borderColor: colors.border, borderStyle: "dashed", minHeight: 200 }}>
                  <Text className="text-muted text-center mb-4">No image selected</Text>
                </View>
              )}

              <View className="gap-3">
                <TouchableOpacity
                  onPress={pickImage}
                  className="bg-primary rounded-xl p-4 items-center"
                >
                  <Text className="text-white font-semibold">📁 Choose from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={takePhoto}
                  className="bg-surface rounded-xl p-4 items-center"
                  style={{ borderWidth: 1, borderColor: colors.border }}
                >
                  <Text className="text-foreground font-semibold">📷 Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleNext}
                  className="bg-muted/20 rounded-xl p-4 items-center"
                >
                  <Text className="text-muted font-semibold">Skip for Now</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <Animated.View entering={FadeInDown.duration(400)} className="p-4">
              <Text className="text-foreground text-2xl font-bold mb-2">Review & Confirm</Text>
              <Text className="text-muted mb-6">Please review your building information</Text>

              <View className="bg-surface rounded-2xl p-4 gap-4" style={{ borderWidth: 1, borderColor: colors.border }}>
                <View>
                  <Text className="text-muted text-sm">Building Type</Text>
                  <Text className="text-foreground text-base font-semibold capitalize">{buildingType}</Text>
                </View>

                <View>
                  <Text className="text-muted text-sm">Name</Text>
                  <Text className="text-foreground text-base font-semibold">{name}</Text>
                </View>

                <View>
                  <Text className="text-muted text-sm">Location</Text>
                  <Text className="text-foreground text-base font-semibold">{location}</Text>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-muted text-sm">Size</Text>
                    <Text className="text-foreground text-base font-semibold">{size} sq ft</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-muted text-sm">Floors</Text>
                    <Text className="text-foreground text-base font-semibold">{floors}</Text>
                  </View>
                </View>

                {image && (
                  <View>
                    <Text className="text-muted text-sm mb-2">Image</Text>
                    <Image source={{ uri: image }} style={{ width: "100%", height: 150, borderRadius: 12 }} resizeMode="cover" />
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={handleSave}
                className="bg-primary rounded-xl p-4 items-center mt-6"
              >
                <Text className="text-white font-bold text-lg">Add Building</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        {step < 4 && (
          <View className="p-4 border-t" style={{ borderTopColor: colors.border }}>
            <TouchableOpacity
              onPress={handleNext}
              disabled={step === 1 && !buildingType}
              className="bg-primary rounded-xl p-4 items-center"
              style={{ opacity: (step === 1 && !buildingType) ? 0.5 : 1 }}
            >
              <Text className="text-white font-bold text-base">Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
