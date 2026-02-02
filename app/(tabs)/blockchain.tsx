import { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, Modal, Alert, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Transaction {
  id: string;
  supplierName: string;
  transactionType: string;
  co2Value: string;
  verificationStatus: "Verified" | "Pending";
  timestamp: string;
  blockchainId: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    supplierName: "Steel Supplier Inc.",
    transactionType: "Material Shipment",
    co2Value: "12.5 tons CO₂",
    verificationStatus: "Verified",
    timestamp: "2 hours ago",
    blockchainId: "0x7f3a...9c2e",
  },
  {
    id: "2",
    supplierName: "Green Energy Co.",
    transactionType: "Energy Purchase",
    co2Value: "-8.2 tons CO₂",
    verificationStatus: "Verified",
    timestamp: "1 day ago",
    blockchainId: "0x4b1c...7d8f",
  },
  {
    id: "3",
    supplierName: "Concrete Solutions Ltd.",
    transactionType: "Material Shipment",
    co2Value: "18.7 tons CO₂",
    verificationStatus: "Pending",
    timestamp: "3 days ago",
    blockchainId: "0x9e5a...3f1b",
  },
  {
    id: "4",
    supplierName: "Carbon Offset Partners",
    transactionType: "Carbon Credit",
    co2Value: "-25.0 tons CO₂",
    verificationStatus: "Verified",
    timestamp: "1 week ago",
    blockchainId: "0x2c7d...8a4e",
  },
];

export default function BlockchainScreen() {
  const colors = useColors();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Add partner form fields
  const [partnerName, setPartnerName] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [co2Value, setCo2Value] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await AsyncStorage.getItem("blockchain_transactions");
      if (data) {
        setTransactions(JSON.parse(data));
      } else {
        // Load mock data on first launch
        setTransactions(mockTransactions);
        await AsyncStorage.setItem("blockchain_transactions", JSON.stringify(mockTransactions));
      }
    } catch (error) {
      console.error("Failed to load transactions", error);
      setTransactions(mockTransactions);
    }
  };

  const addPartner = async () => {
    if (!partnerName || !transactionType || !co2Value) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      supplierName: partnerName,
      transactionType,
      co2Value: `${co2Value} tons CO₂`,
      verificationStatus: "Pending",
      timestamp: "Just now",
      blockchainId: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    try {
      await AsyncStorage.setItem("blockchain_transactions", JSON.stringify(updatedTransactions));
      setShowAddPartner(false);
      setPartnerName("");
      setTransactionType("");
      setCo2Value("");
      Alert.alert("Success", "Supply chain partner added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save partner");
    }
  };

  const totalScope3 = transactions.reduce((sum, t) => {
    const value = parseFloat(t.co2Value.replace(/[^0-9.-]/g, ""));
    return sum + value;
  }, 0).toFixed(1);
  
  const verifiedCount = transactions.filter(t => t.verificationStatus === "Verified").length;
  const partnerCount = new Set(transactions.map(t => t.supplierName)).size;
  const carbonCredits = transactions
    .filter(t => parseFloat(t.co2Value.replace(/[^0-9.-]/g, "")) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.co2Value.replace(/[^0-9.-]/g, ""))), 0)
    .toFixed(1);

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-5 mb-4 active:opacity-70"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedTransaction(transaction);
      }}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground mb-2">{transaction.supplierName}</Text>
          <View className="flex-row items-center">
            <View className="bg-secondary/20 px-3 py-1.5 rounded-full">
              <Text className="text-sm font-medium text-secondary">{transaction.transactionType}</Text>
            </View>
          </View>
        </View>
        <View className={`px-3 py-1.5 rounded-full ${
          transaction.verificationStatus === "Verified" ? "bg-success/20" : "bg-warning/20"
        }`}>
          <Text className={`text-sm font-medium ${
            transaction.verificationStatus === "Verified" ? "text-success" : "text-warning"
          }`}>
            {transaction.verificationStatus === "Verified" ? "✓ Verified" : "⏳ Pending"}
          </Text>
        </View>
      </View>

      {/* CO2 Value */}
      <View className="mb-4">
        <Text className="text-sm text-muted mb-1">Carbon Emissions</Text>
        <Text className={`text-3xl font-bold ${
          transaction.co2Value.startsWith("-") ? "text-success" : "text-foreground"
        }`}>
          {transaction.co2Value}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between pt-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        <View>
          <Text className="text-xs text-muted mb-1">Transaction ID</Text>
          <Text className="text-sm font-mono text-foreground">{transaction.blockchainId}</Text>
        </View>
        <Text className="text-sm text-muted">{transaction.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  const TransactionDetailModal = () => (
    <Modal
      visible={selectedTransaction !== null}
      animationType="slide"
      transparent
      onRequestClose={() => setSelectedTransaction(null)}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="bg-background rounded-t-3xl" style={{ maxHeight: "90%" }}>
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b" style={{ borderBottomColor: colors.border }}>
            <Text className="text-2xl font-bold text-foreground">Transaction Details</Text>
            <TouchableOpacity onPress={() => setSelectedTransaction(null)}>
              <Text className="text-3xl text-muted">×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6">
            {selectedTransaction && (
              <>
                {/* Transaction Info */}
                <View className="bg-surface rounded-2xl p-5 mb-4">
                  <Text className="text-sm font-semibold text-muted mb-4">TRANSACTION INFORMATION</Text>
                  
                  <View className="mb-4">
                    <Text className="text-sm text-muted mb-1">Supplier Name</Text>
                    <Text className="text-lg font-semibold text-foreground">{selectedTransaction.supplierName}</Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm text-muted mb-1">Transaction Type</Text>
                    <Text className="text-lg font-semibold text-foreground">{selectedTransaction.transactionType}</Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm text-muted mb-1">Carbon Emissions</Text>
                    <Text className={`text-3xl font-bold ${
                      selectedTransaction.co2Value.startsWith("-") ? "text-success" : "text-foreground"
                    }`}>
                      {selectedTransaction.co2Value}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-sm text-muted mb-1">Timestamp</Text>
                    <Text className="text-lg font-semibold text-foreground">{selectedTransaction.timestamp}</Text>
                  </View>
                </View>

                {/* Blockchain Verification */}
                <View className="bg-surface rounded-2xl p-5 mb-4">
                  <Text className="text-sm font-semibold text-muted mb-4">BLOCKCHAIN VERIFICATION</Text>
                  
                  <View className="mb-4">
                    <Text className="text-sm text-muted mb-1">Network</Text>
                    <Text className="text-lg font-semibold text-foreground">Energy Web Chain</Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm text-muted mb-1">Transaction ID</Text>
                    <Text className="text-base font-mono text-foreground">{selectedTransaction.blockchainId}</Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm text-muted mb-1">Block Number</Text>
                    <Text className="text-lg font-semibold text-foreground">12,458,392</Text>
                  </View>

                  <View>
                    <Text className="text-sm text-muted mb-1">Smart Contract</Text>
                    <Text className="text-base font-mono text-foreground">0x742d...5e9a</Text>
                  </View>
                </View>

                {/* Actions */}
                <TouchableOpacity
                  className="bg-secondary/10 border border-secondary rounded-xl py-4 items-center active:opacity-70"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert("Blockchain Explorer", "This would open the transaction in a blockchain explorer");
                  }}
                >
                  <Text className="text-secondary text-lg font-semibold">View on Blockchain Explorer</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const AddPartnerModal = () => (
    <Modal
      visible={showAddPartner}
      animationType="slide"
      transparent
      onRequestClose={() => setShowAddPartner(false)}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="bg-background rounded-t-3xl p-6" style={{ maxHeight: "80%" }}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-foreground">Add Supply Chain Partner</Text>
            <TouchableOpacity onPress={() => setShowAddPartner(false)}>
              <Text className="text-3xl text-muted">×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Partner Name */}
            <View className="mb-5">
              <Text className="text-sm font-semibold text-foreground mb-2">Partner Name</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-4 text-foreground text-base"
                placeholder="e.g., Steel Supplier Inc."
                placeholderTextColor={colors.muted}
                value={partnerName}
                onChangeText={setPartnerName}
              />
            </View>

            {/* Transaction Type */}
            <View className="mb-5">
              <Text className="text-sm font-semibold text-foreground mb-2">Transaction Type</Text>
              <View className="flex-row flex-wrap gap-2">
                {["Material Shipment", "Energy Purchase", "Transport", "Carbon Credit"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`px-4 py-3 rounded-xl ${
                      transactionType === type ? "bg-primary" : "bg-surface"
                    }`}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setTransactionType(type);
                    }}
                  >
                    <Text className={`text-sm font-medium ${
                      transactionType === type ? "text-background" : "text-foreground"
                    }`}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* CO2 Value */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">Carbon Emissions (tons CO₂)</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-4 text-foreground text-base"
                placeholder="e.g., 12.5 or -8.2 for offsets"
                placeholderTextColor={colors.muted}
                value={co2Value}
                onChangeText={setCo2Value}
                keyboardType="numeric"
              />
              <Text className="text-xs text-muted mt-2">Use negative values for carbon offsets or renewable energy</Text>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              className="bg-primary rounded-xl py-4 items-center active:opacity-80 mb-4"
              onPress={addPartner}
            >
              <Text className="text-background text-lg font-semibold">Add Partner</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const InfoModal = () => (
    <Modal
      visible={showInfo}
      animationType="fade"
      transparent
      onRequestClose={() => setShowInfo(false)}
    >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
        <View className="bg-background rounded-3xl p-6 mx-6" style={{ maxWidth: 400 }}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-foreground">Blockchain Carbon Accounting</Text>
            <TouchableOpacity onPress={() => setShowInfo(false)}>
              <Text className="text-3xl text-muted">×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
            <Text className="text-base text-foreground mb-4 leading-6">
              <Text className="font-bold">EcoTwin</Text> uses blockchain technology to track and verify Scope 3 carbon emissions across your supply chain with complete transparency and immutability.
            </Text>

            <View className="bg-surface rounded-2xl p-4 mb-4">
              <Text className="text-lg font-bold text-foreground mb-2">How It Works</Text>
              <Text className="text-sm text-muted leading-5">
                1. <Text className="font-semibold text-foreground">Add Partners:</Text> Register suppliers, energy providers, and logistics partners{"\n\n"}
                2. <Text className="font-semibold text-foreground">Automatic Tracking:</Text> IoT sensors and smart contracts automatically record carbon emissions from each transaction{"\n\n"}
                3. <Text className="font-semibold text-foreground">Blockchain Verification:</Text> All data is written to Energy Web Chain, creating an immutable audit trail{"\n\n"}
                4. <Text className="font-semibold text-foreground">Real-time Analytics:</Text> View total Scope 3 emissions, verified transactions, and carbon credits
              </Text>
            </View>

            <View className="bg-surface rounded-2xl p-4 mb-4">
              <Text className="text-lg font-bold text-foreground mb-2">Technology Stack</Text>
              <Text className="text-sm text-muted leading-5">
                • <Text className="font-semibold text-foreground">Energy Web Chain:</Text> Purpose-built blockchain for energy and carbon markets{"\n\n"}
                • <Text className="font-semibold text-foreground">Smart Contracts:</Text> Automated carbon accounting and verification{"\n\n"}
                • <Text className="font-semibold text-foreground">IoT Integration:</Text> Real-time data from sensors and meters{"\n\n"}
                • <Text className="font-semibold text-foreground">AI Analysis:</Text> Predictive modeling and anomaly detection
              </Text>
            </View>

            <View className="bg-surface rounded-2xl p-4">
              <Text className="text-lg font-bold text-foreground mb-2">Benefits</Text>
              <Text className="text-sm text-muted leading-5">
                ✓ <Text className="font-semibold text-foreground">Transparency:</Text> Full visibility into supply chain emissions{"\n\n"}
                ✓ <Text className="font-semibold text-foreground">Compliance:</Text> Meet regulatory reporting requirements{"\n\n"}
                ✓ <Text className="font-semibold text-foreground">Trust:</Text> Immutable records verified by blockchain{"\n\n"}
                ✓ <Text className="font-semibold text-foreground">Optimization:</Text> Identify high-emission partners and processes
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            className="bg-primary rounded-xl py-4 items-center mt-4 active:opacity-80"
            onPress={() => setShowInfo(false)}
          >
            <Text className="text-background text-lg font-semibold">Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-3xl font-bold text-foreground">Blockchain</Text>
            <TouchableOpacity 
              className="active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowInfo(true);
              }}
            >
              <Text className="text-2xl">ℹ️</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-muted">
            Supply Chain Carbon Tracking
          </Text>
        </View>

        {/* Summary Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <View className="bg-surface rounded-2xl p-4 mr-4" style={{ width: 160 }}>
            <Text className="text-xs text-muted mb-1">Total Scope 3</Text>
            <Text className="text-2xl font-bold text-foreground mb-1">{totalScope3}</Text>
            <Text className="text-xs text-muted">tons CO₂</Text>
          </View>

          <View className="bg-surface rounded-2xl p-4 mr-4" style={{ width: 160 }}>
            <Text className="text-xs text-muted mb-1">Verified Txns</Text>
            <Text className="text-2xl font-bold text-success mb-1">{verifiedCount}</Text>
            <Text className="text-xs text-success">✓ On blockchain</Text>
          </View>

          <View className="bg-surface rounded-2xl p-4 mr-4" style={{ width: 160 }}>
            <Text className="text-xs text-muted mb-1">Supply Chain</Text>
            <Text className="text-2xl font-bold text-foreground mb-1">{partnerCount}</Text>
            <Text className="text-xs text-muted">Partners</Text>
          </View>

          <View className="bg-surface rounded-2xl p-4" style={{ width: 160 }}>
            <Text className="text-xs text-muted mb-1">Carbon Credits</Text>
            <Text className="text-2xl font-bold text-primary mb-1">{carbonCredits}</Text>
            <Text className="text-xs text-muted">tons offset</Text>
          </View>
        </ScrollView>

        {/* Transactions List */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">Recent Transactions</Text>
            <TouchableOpacity
              className="bg-primary px-5 py-3 rounded-full active:opacity-80"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowAddPartner(true);
              }}
            >
              <Text className="text-background text-base font-semibold">+ Partner</Text>
            </TouchableOpacity>
          </View>

          <View>
            {transactions.length === 0 ? (
              <View className="bg-surface rounded-2xl p-8 items-center">
                <Text className="text-2xl mb-4">🔗</Text>
                <Text className="text-lg font-semibold text-foreground mb-2">No Transactions Yet</Text>
                <Text className="text-sm text-muted text-center mb-4">
                  Add your first supply chain partner to start tracking carbon emissions
                </Text>
                <TouchableOpacity
                  className="bg-primary px-6 py-3 rounded-xl active:opacity-80"
                  onPress={() => setShowAddPartner(true)}
                >
                  <Text className="text-background font-semibold">Add Partner</Text>
                </TouchableOpacity>
              </View>
            ) : (
              transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <TransactionDetailModal />
      <AddPartnerModal />
      <InfoModal />
    </ScreenContainer>
  );
}
