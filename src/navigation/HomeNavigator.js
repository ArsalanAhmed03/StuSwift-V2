// src/navigation/HomeNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../components/Tabs/HomeScreen";

const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
