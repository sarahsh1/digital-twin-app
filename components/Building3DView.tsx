import { useState } from "react";
import { View, Image, TouchableOpacity, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface Building3DViewProps {
  buildingId: string;
  showSolarSimulation?: boolean;
  model3D?: any; // Custom 3D model for this building
  solarModel?: any; // Custom solar simulation model for this building
}

export function Building3DView({ buildingId, showSolarSimulation = false, model3D, solarModel }: Building3DViewProps) {
  const colors = useColors();
  const [viewMode, setViewMode] = useState<"wireframe" | "solar">(showSolarSimulation ? "solar" : "wireframe");
  const { width } = Dimensions.get("window");

  // Use custom 3D model if provided, otherwise use default SCE model
  const wireframeImage = model3D || require("@/assets/demo-buildings/sce-building-3d-wireframe.png");
  const solarImage = solarModel || require("@/assets/demo-buildings/sce-building-solar-simulation.png");

  return (
    <View className="w-full">
      {/* 3D Visualization */}
      <View className="w-full bg-background rounded-2xl overflow-hidden" style={{ height: width * 0.7 }}>
        <Image
          source={viewMode === "wireframe" ? wireframeImage : solarImage}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
        
        {/* View Mode Toggle */}
        <View className="absolute bottom-4 left-4 right-4 flex-row gap-2">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${viewMode === "wireframe" ? "bg-primary" : "bg-surface/80"}`}
            onPress={() => setViewMode("wireframe")}
            style={{ opacity: 0.95 }}
          >
            <Text className={`text-center font-semibold ${viewMode === "wireframe" ? "text-background" : "text-foreground"}`}>
              Digital Twin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ${viewMode === "solar" ? "bg-primary" : "bg-surface/80"}`}
            onPress={() => setViewMode("solar")}
            style={{ opacity: 0.95 }}
          >
            <Text className={`text-center font-semibold ${viewMode === "solar" ? "text-background" : "text-foreground"}`}>
              Solar Simulation
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legend */}
      <View className="mt-4 bg-surface rounded-xl p-4">
        <Text className="text-sm font-semibold text-foreground mb-3">Visualization Legend</Text>
        {viewMode === "wireframe" ? (
          <View className="gap-2">
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: "#00C896" }} />
              <Text className="text-sm text-muted">Building Structure & Systems</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: "#FFA500" }} />
              <Text className="text-sm text-muted">Energy Consumption Nodes</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: "#00D4FF" }} />
              <Text className="text-sm text-muted">HVAC & Climate Control</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: "#FFEB3B" }} />
              <Text className="text-sm text-muted">Solar Potential Areas</Text>
            </View>
          </View>
        ) : (
          <View className="gap-2">
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: "#FFD700" }} />
              <Text className="text-sm text-muted">Solar Energy Generation Flow</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: "#00C896" }} />
              <Text className="text-sm text-muted">Carbon Reduction Indicator</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: "#1E40AF" }} />
              <Text className="text-sm text-muted">Photovoltaic Panels</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
