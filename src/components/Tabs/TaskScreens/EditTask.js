import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIRESTORE_DB } from "../../../services/Firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import { AuthService,UpdateTask } from "../../../services/Firebase/AuthService";
export function EditTaskScreen({ route, navigation }) {
  const { taskId } = route.params;
  const [loading, setLoading] = useState(true);


  const [formData, setFormData] = useState({
    taskId:taskId,
    title:'',
    dueDate:'',
    chapter:'',
    description:'',
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskRef = doc(FIRESTORE_DB, "tasks", taskId);
        const taskDoc = await getDoc(taskRef);
        if (taskDoc.exists()) {
          const taskData = taskDoc.data();
          setFormData({
            taskId: taskId,  // Preserve taskId
            title: taskData.title,
            dueDate: taskData.dueDate,
            chapter: taskData.chapter,
            description: taskData.description,
          });
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSavePress = async () => {
    const updatetaskInstance=new UpdateTask();
    const TaskUpadted=new AuthService(updatetaskInstance);
    TaskUpadted.authenticate(formData);
    alert("Task Updated Succesfully!");
    navigation.navigate("TaskScreen");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B3B98" />
        <Text>Loading task...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Task</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text)=>setFormData({...formData,title:text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Due Date"
          value={formData.dueDate}
          onChangeText={(text)=>setFormData({...formData,dueDate:text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Chapter"
          value={formData.chapter}
          onChangeText={(text)=>setFormData({...formData,chapter:text})}
        />
        <TextInput
          style={styles.descriptionInput}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text)=>setFormData({...formData,description:text})}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
        <LinearGradient
            colors={["#747FBB", "#1C214A"]} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#3B3B98" },
  backButton: { position: "absolute", left: 10 },
  formContainer: { padding: 20 },
  input: {
    height: 50,
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    padding: 15,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: "top",
    fontSize: 16,
  },
  saveButton: {
    // backgroundColor: "#3B3B98",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default EditTaskScreen;
