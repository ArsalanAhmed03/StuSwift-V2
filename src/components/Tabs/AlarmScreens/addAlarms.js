import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { UpdateOrAddAlarm } from "../../../services/Firebase/Fetching";

const daysList = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

const AddAlarm = ({ navigation }) => {
  const [hours, setHours] = useState(""); // Default alarm hours
  const [minutes, setMinutes] = useState(""); // Default minutes
  const [isAm, setIsAm] = useState(true); // AM/PM toggle
  const [selectedDays, setSelectedDays] = useState([]); // Selected days

  // Toggle day selection
  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Save alarm to Firebase
  const saveAlarm = async () => {
    const hoursInt = parseInt(hours, 10);
    const minutesInt = parseInt(minutes, 10);

    if (
      isNaN(hoursInt) ||
      isNaN(minutesInt) ||
      hoursInt < 1 ||
      hoursInt > 12 ||
      minutesInt < 0 ||
      minutesInt > 59
    ) {
      Alert.alert("Invalid Time", "Please enter a valid time.");
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert("Error", "Please select at least one day.");
      return;
    }

    const time = `${hoursInt}:${minutesInt.toString().padStart(2, "0")} ${
      isAm ? "AM" : "PM"
    }`;

    const newAlarm = {
      time,
      days: selectedDays.join(", "),
      enabled: true, 
    };

    try {
      const updateAlarmInstance = new UpdateOrAddAlarm();
      await updateAlarmInstance.fetchdata(newAlarm); // Save alarm to Firebase
      Alert.alert("Alarm Saved", `Alarm set for ${time} on ${selectedDays.join(", ")}`);
      navigation.goBack(); // Return to the previous screen
    } catch (error) {
      console.error("Error saving alarm:", error);
      Alert.alert("Error", "Failed to save the alarm. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Alarm</Text>

      {/* Time Input */}
      <View style={styles.timeInputContainer}>
        <TextInput
          style={styles.timeInput}
          placeholder="HH"
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
          maxLength={2}
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          style={styles.timeInput}
          placeholder="MM"
          keyboardType="numeric"
          value={minutes}
          onChangeText={setMinutes}
          maxLength={2}
        />
        <TouchableOpacity onPress={() => setIsAm((prev) => !prev)}>
          <Text style={styles.amPmText}>{isAm ? "AM" : "PM"}</Text>
        </TouchableOpacity>
      </View>

      {/* Day Selection */}
      <Text style={styles.sectionTitle}>Repeat on:</Text>
      <View style={styles.daysContainer}>
        {daysList.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.dayButtonSelected,
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text
              style={[
                styles.dayButtonText,
                selectedDays.includes(day) && styles.dayButtonTextSelected,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveAlarm}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  timeInput: {
    width: 60,
    height: 60,
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#4C4CFF",
    marginHorizontal: 5,
    color: "#4C4CFF",
  },
  colon: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4C4CFF",
  },
  amPmText: {
    fontSize: 24,
    color: "#4C4CFF",
    marginLeft: 10,
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  dayButton: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4C4CFF",
  },
  dayButtonSelected: {
    backgroundColor: "#4C4CFF",
  },
  dayButtonText: {
    fontSize: 14,
    color: "#4C4CFF",
  },
  dayButtonTextSelected: {
    color: "#FFF",
  },
  saveButton: {
    backgroundColor: "#4C4CFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default AddAlarm;
