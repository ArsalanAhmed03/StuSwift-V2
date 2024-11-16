// src/components/Tabs/ChatScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const ChatScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Screen</Text>
      <Button
        title="Create Chat"
        onPress={() => navigation.navigate("CreateChat")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default ChatScreen;
