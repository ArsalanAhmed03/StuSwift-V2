import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { FetchAlarms, UpdateOrAddAlarm } from "../../services/Firebase/Fetching";
import { Audio } from "expo-av";
import { getAuth } from "firebase/auth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
  }),
});

const AlarmScreen = ({ navigation }) => {
  const [alarms, setAlarms] = useState([]);
  const [sound, setSound] = useState(null);

  // Fetch alarms from Firebase
  const fetchAlarms = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const alarmInstance = new FetchAlarms();
      const alarmsList = await alarmInstance.fetchdata(user.uid); // Filter by userId
      setAlarms(alarmsList);

      // Schedule notifications for active alarms
      alarmsList.forEach((alarm) => {
        if (alarm.enabled) {
          scheduleAlarm(alarm);
        }
      });
    } catch (error) {
      console.error("Error fetching alarms:", error);
      Alert.alert("Error", "Failed to fetch alarms.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAlarms();
    }, [])
  );

  // Schedule an alarm
  const scheduleAlarm = async (alarm) => {
    const [time, period] = alarm.time.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const alarmTime = new Date();
    alarmTime.setHours(period === "PM" ? hours + 12 : hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);

    const now = new Date();
    const timeToAlarm = alarmTime.getTime() - now.getTime();

    if (timeToAlarm > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Alarm Ringing!",
          body: `It's time! (${alarm.time})`,
        },
        trigger: { seconds: Math.floor(timeToAlarm / 1000) },
      });
    } else {
      console.warn("Alarm time has already passed.");
    }
  };

  // Handle Notification
  const handleNotification = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/alarm.mp3")
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Stop Alarm Sound
  const stopAlarm = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  // Toggle alarm enabled/disabled state
  const toggleSwitch = async (id, currentState) => {
    try {
      const updatedAlarm = { enabled: !currentState };
      const updateAlarmInstance = new UpdateOrAddAlarm();
      await updateAlarmInstance.fetchdata(updatedAlarm, id);

      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        )
      );

      // Schedule or cancel alarm
      if (!currentState) {
        const alarm = alarms.find((alarm) => alarm.id === id);
        scheduleAlarm(alarm);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error("Error updating alarm:", error);
      Alert.alert("Error", "Failed to update alarm.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.alarmContainer}>
      <View>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.days}>{item.days}</Text>
      </View>
      <Switch
        trackColor={{ false: "#ccc", true: "#9E77ED" }}
        thumbColor={item.enabled ? "#fff" : "#fff"}
        ios_backgroundColor="#ccc"
        onValueChange={() => toggleSwitch(item.id, item.enabled)}
        value={item.enabled}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Alarms</Text>
      </View>
      <FlatList
        data={alarms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Add Alarm")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      {sound && (
        <TouchableOpacity style={styles.stopButton} onPress={stopAlarm}>
          <Text style={styles.stopButtonText}>Stop Alarm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  alarmContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
  },
  days: {
    fontSize: 14,
    color: "gray",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#9E77ED",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  stopButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  stopButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AlarmScreen;
