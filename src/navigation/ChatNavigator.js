// src/navigation/ChatNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "../components/Tabs/ChatScreen";
import CreateChatScreen from "../components/Tabs/CreateChatScreen";

const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="CreateChat" component={CreateChatScreen} />
  </Stack.Navigator>
);

export default ChatNavigator;
