import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIRESTORE_DB } from "../../services/Firebase/firebaseConfig";
import {doc, updateDoc} from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import { FetchTasks } from "../../services/Firebase/Fetching";
export function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);


    const fetchAllTasks = async () => {
      const taskFetcher = new FetchTasks();
      const fetchedTasks = await taskFetcher.fetchdata();
      setTasks(fetchedTasks);
    };

    fetchAllTasks();


  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(FIRESTORE_DB, "tasks", taskId);
      await updateDoc(taskRef, { completed: !currentStatus }); // Toggle completion status
      fetchAllTasks(); // Refresh the tasks list
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleEditPress = (taskId) => {
    navigation.navigate("Edit Tasks", { taskId });
  };

  const handleAddTaskPress = () => {
    navigation.navigate("Add-Tasks");
  };

  const isPastDueDate = (dueDate) => {
    const currentDate = new Date();
    const taskDate = new Date(dueDate); // Convert dueDate string to Date object
    return taskDate < currentDate;
  };

  const shouldShowOverdueColor = (dueDate, completed) => {
    return !completed && isPastDueDate(dueDate); // Only incomplete overdue tasks show a color change
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          
          <View
            style={[
              styles.taskCard,
              shouldShowOverdueColor(item.dueDate, item.completed)
                ? styles.overdueTaskCard
                : styles.normalTaskCard,
            ]}
          >
            <LinearGradient
                        colors={["#747FBB", "#1C214A"]} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskSubtitle}>Read Chapter: {item.chapter}</Text>
            <Text style={styles.taskDate}>Due: {item.dueDate}</Text>
            <View style={styles.taskActions}>
              <TouchableOpacity
                onPress={() => handleEditPress(item.id)}
                style={[
                  styles.editButton,
                  isPastDueDate(item.dueDate) && styles.disabledButton,
                ]}
                disabled={isPastDueDate(item.dueDate)}
              >
                <Text
                  style={[
                    styles.editButtonText,
                    isPastDueDate(item.dueDate) && styles.disabledText,
                  ]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  {item.completed ? "Completed" : "Incomplete"}
                </Text>
                <Switch
                  value={item.completed || false}
                  onValueChange={() => toggleTaskCompletion(item.id, item.completed || false)}
                  disabled={isPastDueDate(item.dueDate)}
                />
              </View>
            </View>
            </LinearGradient>
          </View>
        )}
      />
      <TouchableOpacity style={styles.floatingAddButton} onPress={handleAddTaskPress}>
      <LinearGradient
            colors={["#747FBB", "#1C214A"]} style={styles.floatingAddButton}>
        <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop:'50'},
  header: {  flexDirection: 'row',
  justifyContent: 'center',  },
  headerTitle: { fontSize:30,
    fontWeight:'bold',},
  backButton: { position: "absolute", left: 10 },
  taskCard: {
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 8,
  },
  overdueTaskCard: { backgroundColor: "#FF6F61" }, // Red for overdue and incomplete tasks
  // normalTaskCard: { backgroundColor: "#3B3B98" }, // Default color
  taskTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  taskDescription: { color: "white", fontSize: 14, marginVertical: 5 },
  taskSubtitle: { color: "white", fontSize: 12 },
  taskDate: { color: "white", fontSize: 12, marginBottom: 10 },
  taskActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  editButton: { backgroundColor: "#f8f8f8", padding: 10, borderRadius: 5 },
  editButtonText: { color: "#3B3B98", fontWeight: "bold" },
  switchContainer: { flexDirection: "row", alignItems: "center" },
  switchLabel: { color: "white", marginRight: 5 },
  floatingAddButton: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  disabledButton: { backgroundColor: "#ccc" },
  disabledText: { color: "#888" },
});

export default TaskListScreen;
