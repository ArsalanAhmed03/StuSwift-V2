// src/navigation/HomeNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../components/Tabs/HomeScreen";
import ChatNavigator from "./ChatNavigator";
import FitnessNavigator from "./FitnessNavigator";
import TaskNavigator from "./TaskNavigator";
import SpotifyNav from "./MusicNavigator";
import AlarmNavigator from "./AlarmNavigator"



const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen}/>
    <Stack.Screen name="Chats Page" component={ChatNavigator} />
    <Stack.Screen name="FitnessScreen" component={FitnessNavigator} />
    <Stack.Screen name="TaskScreen" component={TaskNavigator} />
    <Stack.Screen name="MusicScreen" component={SpotifyNav} />
    <Stack.Screen name="AlarmScreen" component={AlarmNavigator} />

  </Stack.Navigator>
);

export default HomeNavigator;
