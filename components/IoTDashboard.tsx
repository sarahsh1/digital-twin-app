import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface IoTMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: string;
  trend: "up" | "down" | "stable";
  status: "normal" | "warning" | "critical";
}

export function IoTDashboard() {
  const colors = useColors();
  const [metrics, setMetrics] = useState<IoTMetric[]>([
    { id: "energy", name: "Energy Usage", value: 850, unit: "kW", icon: "⚡", trend: "down", status: "normal" },
    { id: "temp", name: "Avg Temperature", value: 24, unit: "°C", icon: "🌡️", trend: "stable", status: "normal" },
    { id: "co2", name: "CO₂ Emissions", value: 1250, unit: "kg/day", icon: "🌫️", trend: "down", status: "normal" },
    { id: "occupancy", name: "Occupancy", value: 78, unit: "%", icon: "👥", trend: "up", status: "normal" },
    { id: "hvac", name: "HVAC Efficiency", value: 92, unit: "%", icon: "❄️", trend: "up", status: "normal" },
    { id: "solar", name: "Solar Generation", value: 120, unit: "kW", icon: "☀️", trend: "up", status: "normal" },
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => {
          // Simulate small random changes
          const change = (Math.random() - 0.5) * 10;
          let newValue = metric.value + change;
          
          // Keep values in reasonable ranges
          if (metric.id === "energy") newValue = Math.max(700, Math.min(1000, newValue));
          if (metric.id === "temp") newValue = Math.max(22, Math.min(26, newValue));
          if (metric.id === "co2") newValue = Math.max(1000, Math.min(1500, newValue));
          if (metric.id === "occupancy") newValue = Math.max(50, Math.min(100, newValue));
          if (metric.id === "hvac") newValue = Math.max(85, Math.min(98, newValue));
          if (metric.id === "solar") newValue = Math.max(80, Math.min(150, newValue));

          return {
            ...metric,
            value: Math.round(newValue * 10) / 10,
            trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ metric }: { metric: IoTMetric }) => {
    const trendColor = metric.trend === "up" ? colors.success : metric.trend === "down" ? colors.error : colors.muted;
    const trendSymbol = metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→";

    return (
      <View className="bg-surface rounded-xl p-4 mr-3" style={{ width: 160 }}>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl">{metric.icon}</Text>
          <View className="flex-row items-center">
            <Text style={{ color: trendColor, fontSize: 16, fontWeight: "bold" }}>{trendSymbol}</Text>
          </View>
        </View>
        <Text className="text-2xl font-bold text-foreground mb-1">
          {metric.value}
          <Text className="text-sm text-muted"> {metric.unit}</Text>
        </Text>
        <Text className="text-xs text-muted">{metric.name}</Text>
        <View className="mt-2 pt-2 border-t border-border">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full mr-2 bg-success" />
            <Text className="text-xs text-muted">Live</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="mb-6">
      <View className="px-6 mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-foreground">Live IoT Data</Text>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-success mr-2" />
          <Text className="text-xs text-muted">Real-time</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </ScrollView>
    </View>
  );
}
