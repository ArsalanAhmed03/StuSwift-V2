// src/components/Tabs/CreateChatScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CreateChatScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Chat Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default CreateChatScreen;
