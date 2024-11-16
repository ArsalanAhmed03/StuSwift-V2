// src/navigation/TaskNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TaskScreen from "../components/Tabs/TaskScreen";
// import AddTaskScreen from "../components/Tabs/AddTaskScreen";

const Stack = createStackNavigator();

const TaskNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TaskScreen"
      component={TaskScreen}
      options={{ headerShown: false }}
    />
    {/* <Stack.Screen
      name="AddTaskScreen"
      component={AddTaskScreen}
      options={{ title: "Add Task" }}
    /> */}
  </Stack.Navigator>
);

export default TaskNavigator;
