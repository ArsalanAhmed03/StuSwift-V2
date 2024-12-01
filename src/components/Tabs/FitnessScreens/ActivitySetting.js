import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  FetchFitnessData,
  UpdateFitnessData,
} from "../../../services/Firebase/Fetching";

const ActivitySettings = () => {
  const [settings, setSettings] = useState([
    { label: "Time Asleep Goal", value: "8", unit: "hrs" },
    { label: "Weight", value: "60", unit: "kg" },
    { label: "Height", value: "5.4", unit: "ft" },
    { label: "Water Intake Goal", value: "2", unit: "ml" },
    { label: "Daily Calories Goal", value: "2020", unit: "kCal" },
    { label: "Steps Goal", value: "10000", unit: "steps" },
  ]);

  useEffect(() => {
    const fetchFitness = async () => {
      const data = await new FetchFitnessData().fetchdata();
      console.log(data);
      if (data) {
        setSettings([
          {
            label: "Time Asleep Goal",
            value: String(data.sleepGoal || 8),
            unit: "hrs",
          },
          { label: "Weight", value: String(data.weight || 60), unit: "kg" },
          { label: "Height", value: String(data.height || 5.4), unit: "ft" },
          {
            label: "Water Intake Goal",
            value: String(data.waterGoal || 2000),
            unit: "ml",
          },
          {
            label: "Daily Calories Goal",
            value: String(data.goalCalories || 2020),
            unit: "kCal",
          },
          {
            label: "Steps Goal",
            value: String(data.stepGoal || 10000),
            unit: "steps",
          },
        ]);
      }
    };
    fetchFitness();
  }, []);

  const handleInputChange = (text, index) => {
    const updatedSettings = [...settings];
    updatedSettings[index].value = text;
    setSettings(updatedSettings);
  };

  const saveSettings = async () => {
    const updatedData = {
      sleepGoal: Number(settings[0].value),
      weight: Number(settings[1].value),
      height: Number(settings[2].value),
      waterGoal: Number(settings[3].value),
      goalCalories: Number(settings[4].value),
      stepGoal: Number(settings[5].value),
    };

    try {
      await new UpdateFitnessData().fetchdata(updatedData);
      Alert.alert(
        "Settings Saved!",
        "Your activity settings have been updated."
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-left" size={24} color="#000" />
        <Text style={styles.title}>Activity Settings</Text>
      </View>
      {settings.map((item, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={item.value}
              onChangeText={(text) => handleInputChange(text, index)}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>{item.unit}</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 30 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: { fontSize: 16, color: "#5B5E90" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 100,
  },
  input: { fontSize: 16, color: "#000", textAlign: "center", flex: 1 },
  unit: { fontSize: 14, color: "#5B5E90", marginLeft: 4 },
  saveButton: {
    backgroundColor: "#4C4CFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  saveButtonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
});

export default ActivitySettings;
