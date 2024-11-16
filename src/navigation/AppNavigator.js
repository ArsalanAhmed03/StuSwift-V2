// AppNavigator.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { View, Text, ActivityIndicator } from "react-native";

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Use `null` for loading state
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Update auth state
    });
    return unsubscribe;
  }, []);

  if (isAuthenticated === null) {
    // Show loading screen while determining auth state
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
