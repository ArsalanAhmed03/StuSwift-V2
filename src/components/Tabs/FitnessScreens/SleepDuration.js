import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { FetchFitnessData } from "../../../services/Firebase/Fetching";
import { UpdateFitnessData } from "../../../services/Firebase/Fetching"; // Fixed the import here

const SleepDuration = () => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => {
    const fetchFitness = async () => {
      try {
        const data = await new FetchFitnessData().fetchdata();
        if (data && data.sleepHours) {
          const sleepHours = data.sleepHours; // Already saved in hours (e.g., 7.5)
          const hrs = Math.floor(sleepHours); // Extract whole hours
          const mins = Math.round((sleepHours - hrs) * 60); // Convert fractional part to minutes
          setHours(hrs.toString());
          setMinutes(mins.toString());
        }
      } catch (error) {
        console.error("Error fetching fitness data:", error);
        Alert.alert("Error", "Failed to fetch fitness data.");
      }
    };
    fetchFitness();
  }, []);

  const handleSave = async () => {
    const hoursAsInt = parseInt(hours, 10);
    const minutesAsInt = parseInt(minutes, 10);

    if (
      isNaN(hoursAsInt) ||
      isNaN(minutesAsInt) ||
      hoursAsInt < 0 ||
      minutesAsInt < 0 ||
      minutesAsInt >= 60
    ) {
      Alert.alert("Invalid Input", "Please enter valid hours and minutes.");
      return;
    }

    const totalHours = hoursAsInt + minutesAsInt / 60;

    try {
      await new UpdateFitnessData().fetchdata({ sleepHours: totalHours }); // Fixed method usage here
      Alert.alert("Success", `Your sleep duration of ${totalHours.toFixed(2)} hours has been updated.`);
    } catch (error) {
      console.error("Error updating sleep duration:", error);
      Alert.alert("Error", "Failed to update sleep duration. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Duration</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hours:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
          placeholder="Enter hours"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Minutes:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={minutes}
          onChangeText={setMinutes}
          placeholder="Enter minutes"
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  label: { fontSize: 18, marginRight: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4C4CFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default SleepDuration;
