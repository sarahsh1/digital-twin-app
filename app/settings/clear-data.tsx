import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function ClearDataScreen() {
  const colors = useColors();

  const handleClearBuildings = async () => {
    try {
      await AsyncStorage.removeItem("buildings");
      Alert.alert("Success", "All buildings have been cleared. The app will reload with fresh demo data.", [
        { text: "OK", onPress: () => router.replace("/") }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to clear buildings data");
    }
  };

  return (
    <ScreenContainer className="p-6">
      <Text className="text-2xl font-bold text-foreground mb-4">Clear App Data</Text>
      
      <View className="bg-surface rounded-2xl p-4 mb-4" style={{ borderWidth: 1, borderColor: colors.border }}>
        <Text className="text-foreground font-semibold mb-2">Clear Buildings</Text>
        <Text className="text-muted text-sm mb-4">
          This will remove all buildings from storage and reload the 6 demo buildings. Use this if you see duplicate buildings.
        </Text>
        
        <TouchableOpacity
          onPress={handleClearBuildings}
          className="bg-error rounded-xl p-4"
        >
          <Text className="text-white font-semibold text-center">Clear All Buildings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-surface rounded-xl p-4"
        style={{ borderWidth: 1, borderColor: colors.border }}
      >
        <Text className="text-foreground font-semibold text-center">Go Back</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
