// src/components/Tabs/TaskScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const TaskScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Task Screen!</Text>
      <Button
        title="Add Task"
        onPress={() => navigation.navigate("AddTaskScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default TaskScreen;
