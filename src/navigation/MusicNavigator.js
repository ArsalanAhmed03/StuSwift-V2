// src/navigation/MusicNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MusicScreen from "../components/Tabs/MusicScreen";

const Stack = createStackNavigator();

const MusicNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MusicScreen"
      component={MusicScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default MusicNavigator;
