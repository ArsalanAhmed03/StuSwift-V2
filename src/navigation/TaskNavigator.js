// src/navigation/TaskNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TaskListScreen from "../components/Tabs/TaskScreen";
import AddTaskScreen from "../components/Tabs/TaskScreens/AddTasks";
import EditTaskScreen from "../components/Tabs/TaskScreens/EditTask";
const Stack = createStackNavigator();

const TaskNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TaskScreen"
      component={TaskListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Add-Tasks"
      component={AddTaskScreen}
      options={{ headerShown: false  }}
    />
    <Stack.Screen
      name="Edit Tasks"
      component={EditTaskScreen}
      options={{ headerShown: false  }}
    />
  </Stack.Navigator>
);

export default TaskNavigator;
