import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { AddTask,AuthService } from "../../../services/Firebase/AuthService";

export function AddTaskScreen({ navigation }) {

  const [formData, setFormData] = useState({
    title:'',
    dueDate:'',
    chapter:'',
    description:'',
  });

  const handleSavePress = async () => {
    if (!formData.title || !formData.dueDate || !formData.chapter) {
      alert("Please fill in all required fields.");
      return;
    }
    const AddTaskInstance=new AddTask();
    const TaskCreated=new AuthService(AddTaskInstance);
    TaskCreated.authenticate(formData);
    alert("Task Created Successfully!");
    navigation.navigate('TaskScreen');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Task</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={formData.title}
          onChangeText={(text)=>setFormData({...formData,title:text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Due Date (e.g., 2024-11-20)"
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
          placeholder="Description (Optional)"
          value={formData.description}
          onChangeText={(text)=>setFormData({...formData,description:text})}
          multiline
        />
        <TouchableOpacity
          style={[styles.saveButton]}
          onPress={handleSavePress}
        >
            <LinearGradient
                        colors={["#747FBB", "#1C214A"]} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  header: { flexDirection: "row", alignItems: "center", padding: 20 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#3B3B98" },
  backButton: { position: "absolute", left: 10 },
  formContainer: { padding: 20 },
  input: {
    height: 40,
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionInput: {
    height: 100,
    padding: 15,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: "top",
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

export default AddTaskScreen;
