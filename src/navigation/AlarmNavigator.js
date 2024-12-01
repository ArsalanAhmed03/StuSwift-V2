// src/navigation/ChatNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AlarmScreen from "../components/Tabs/AlarmScreen";
import AlarmTracker from "../components/Tabs/AlarmScreens/addAlarms";

const Stack = createStackNavigator();

const AlarmNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Alarm Page" component={AlarmScreen} />
    <Stack.Screen name="Add Alarm" component={AlarmTracker} />
  </Stack.Navigator>
  
);

export default AlarmNavigator;
