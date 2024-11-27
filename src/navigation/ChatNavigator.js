// src/navigation/ChatNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatPage } from "../components/Tabs/ChatsScreen";
import { Creategroup } from "../components/Tabs/ChatScreens/CreateGroup";
import { Messages_page } from "../components/Tabs/ChatScreens/Messages";

const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Chats Page" component={ChatPage} />
    <Stack.Screen name="Create Group" component={Creategroup} />
    <Stack.Screen name="Messages" component={Messages_page} />
  </Stack.Navigator>
);

export default ChatNavigator;
