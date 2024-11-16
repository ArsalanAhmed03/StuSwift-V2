// src/navigation/ProfileNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../components/Tabs/ProfileScreen";

const Stack = createStackNavigator();

const ProfileNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default ProfileNavigator;
