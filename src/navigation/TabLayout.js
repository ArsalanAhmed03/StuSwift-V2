import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Import Screens
import HomeNavigator from "./HomeNavigator";
import ChatNavigator from "./ChatNavigator";
import MusicNavigator from "./MusicNavigator";
import ProfileNavigator from "./ProfileNavigator";
import TaskNavigator from "./TaskNavigator";
import FitnessNavigator from "./FitnessNavigator";

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Gradient background for the tab bar
        tabBarBackground: () => (
          <LinearGradient
            colors={["#747FBB", "#1C214A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, position: "absolute", width: "100%", height: "100%" }}
          />
        ),
        // Tab bar styles
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          color: "white",
          paddingBottom: 5,
        },
        tabBarActiveTintColor: "#283593",
        tabBarInactiveTintColor: "#ffffff",
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          // Map route names to Ionicons
          if (route.name === "Task") {
            iconName = "checkbox";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Chat") {
            iconName = "chatbox";
          } else if (route.name === "Music") {
            iconName = "musical-notes";
          } else if (route.name === "Fitness") {
            iconName = "fitness";
          }

          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 20, // Circular shape
                backgroundColor: focused ? "white" : "transparent", // Dome effect
              }}
            >
              <Ionicons
                name={iconName}
                color={focused ? "#283593" : color}
                size={24} // Consistent icon size
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
        options={{
          title: "Chats",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Music"
        component={MusicNavigator}
        options={{
          title: "Music",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Task"
        component={TaskNavigator}
        options={{
          title: "Tasks",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Fitness"
        component={FitnessNavigator}
        options={{
          title: "Fitness",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
