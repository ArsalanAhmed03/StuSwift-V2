import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import { FetchFitnessData, UpdateFitnessData } from "../../../services/Firebase/Fetching";

const WaterIntakeTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);

  // Fetch initial water intake from Firestore
  useEffect(() => {
    const fetchFitness = async () => {
      try {
        const data = await new FetchFitnessData().fetchdata();
        if (data) {
          setWaterIntake(data.waterIntake || 0);
        }
      } catch (error) {
        console.error("Error fetching fitness data:", error);
        Alert.alert("Error", "Failed to fetch water intake data.");
      }
    };
    fetchFitness();
  }, []);

  // Add water amount
  const addWater = (amount) => {
    setWaterIntake((prev) => prev + amount);
  };

  // Save water intake to Firestore
  const saveWaterIntake = async () => {
    try {
      await new UpdateFitnessData().fetchdata({ waterIntake });
      Alert.alert("Success", `You drank ${waterIntake} ml today!`);
    } catch (error) {
      console.error("Error updating water intake:", error);
      Alert.alert("Error", "Failed to save water intake. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Intake</Text>
      <Text style={styles.label}>Total Water Intake</Text>
      <TextInput
        style={styles.waterInput}
        value={`${waterIntake}`}
        editable={false} // Prevent manual editing
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => addWater(250)}>
          <Text style={styles.buttonText}>+250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addWater(500)}>
          <Text style={styles.buttonText}>+500ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addWater(750)}>
          <Text style={styles.buttonText}>+750ml</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveWaterIntake}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 18, marginBottom: 8 },
  waterInput: {
    fontSize: 24,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  button: { backgroundColor: "#4C4CFF", padding: 10, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  saveButton: { backgroundColor: "#4C4CFF", padding: 12, borderRadius: 8, alignItems: "center" },
  saveButtonText: { color: "white", fontWeight: "bold" },
});

export default WaterIntakeTracker;
