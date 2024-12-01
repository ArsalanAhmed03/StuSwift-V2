import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  FetchFitnessData,
  FetchTasksData,
  FetchChatGroupsData,
} from "../../services/Firebase/Fetching";

const HomeScreen = () => {
  const navigation = useNavigation();

  const [fitnessStats, setFitnessStats] = useState({
    steps: 0,
    stepGoal: 10000,
    workouts: 0,
    workoutGoal: 7,
  });

  const [tasks, setTasks] = useState([]);
  const [chatGroups, setChatGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch fitness data
      const fitnessData = await new FetchFitnessData().fetchdata();
      if (fitnessData) {
        setFitnessStats({
          steps: fitnessData.stepCount || 0,
          stepGoal: fitnessData.stepGoal || 10000,
          workouts: fitnessData.workouts || 0,
          workoutGoal: fitnessData.workoutGoal || 7,
        });
      }

      // Fetch tasks data
      const tasksData = await new FetchTasksData().fetchdata();
      setTasks(tasksData || []);

      // Fetch chat groups data
      const groupsData = await new FetchChatGroupsData().fetchdata();
      setChatGroups(groupsData || []);
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Tasks Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("TaskScreen")} // Change this to focus on Tasks tab
      >
        <Text style={styles.cardTitle}>Tasks</Text>
        <Text style={styles.subtitle}>Upcoming deadlines</Text>
        {tasks.slice(0, 2).map((task, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{task.title}</Text>
            <Text style={styles.itemDeadline}>Due {task.deadline}</Text>
          </View>
        ))}
        <Text style={styles.linkText}>View All Tasks</Text>
      </TouchableOpacity>

      {/* Fitness Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("FitnessScreen")} // Focus on Fitness tab
      >
        <Text style={styles.cardTitle}>Fitness</Text>
        <Text style={styles.subtitle}>Your Progress</Text>
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>
            Steps: {fitnessStats.steps}/{fitnessStats.stepGoal}
          </Text>
        </View>
        <Text style={styles.linkText}>View Fitness Dashboard</Text>
      </TouchableOpacity>

      {/* Chat Groups Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Chats Page")} // Focus on Chat tab
      >
        <Text style={styles.cardTitle}>Chat Groups</Text>
        <Text style={styles.subtitle}>Connect with classmates</Text>
        {chatGroups.slice(0, 2).map((group, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{group.groupName}</Text>
            <Text style={styles.itemMembers}>{group.membersCount} members</Text>
          </View>
        ))}
        <Text style={styles.linkText}>View All Groups</Text>
      </TouchableOpacity>

      {/* Music Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("MusicScreen")} // Focus on Chat tab
      >
        <Text style={styles.cardTitle}>Spotify</Text>
        <Text style={styles.subtitle}>Connect with your tunes</Text>
        {/* {chatGroups.slice(0, 2).map((group, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{group.groupName}</Text>
            <Text style={styles.itemMembers}>{group.membersCount} members</Text>
          </View>
        ))} */}
        <Text style={styles.linkText}>Open Music</Text>
      </TouchableOpacity>

      {/* Alarm Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AlarmScreen")} // Focus on Chat tab
      >
        <Text style={styles.cardTitle}>Alarms</Text>
        <Text style={styles.subtitle}>Set your tasks on time</Text>
        {/* {chatGroups.slice(0, 2).map((group, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{group.groupName}</Text>
            <Text style={styles.itemMembers}>{group.membersCount} members</Text>
          </View>
        ))} */}
        <Text style={styles.linkText}>Open Alarms</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white", paddingTop: 50 },
  card: {
    backgroundColor: "#3a3b5c",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  subtitle: { fontSize: 14, color: "#cccccc", marginBottom: 10 },
  itemRow: { flexDirection: "row", justifyContent: "space-between" },
  itemText: { color: "white", fontSize: 14 },
  itemDeadline: { color: "#cccccc", fontSize: 12 },
  itemMembers: { color: "#cccccc", fontSize: 12 },
  linkText: {
    color: "#4C4CFF",
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default HomeScreen;
