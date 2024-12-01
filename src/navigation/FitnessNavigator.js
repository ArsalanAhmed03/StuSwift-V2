import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import Screens
import FitnessScreen from "../components/Tabs/FitnessScreen";
import ActivitySettings from "../components/Tabs/FitnessScreens/ActivitySetting";
import SleepDuration from "../components/Tabs/FitnessScreens/SleepDuration";
import WaterIntakeTracker from "../components/Tabs/FitnessScreens/WaterIntakeTracker";

const Stack = createStackNavigator();

const FitnessNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FitnessScreen" component={FitnessScreen} />
      <Stack.Screen name="ActivitySettings" component={ActivitySettings} />
      <Stack.Screen name="SleepDuration" component={SleepDuration} />
      <Stack.Screen name="WaterIntakeTracker" component={WaterIntakeTracker} />
    </Stack.Navigator>
  );
};

export default FitnessNavigator;
