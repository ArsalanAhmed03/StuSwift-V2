import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // For navigation
import AuthService from "../../services/Firebase/AuthService"; // Auth logic

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation(); // React Navigation hook

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      await AuthService.login(email, password);
      Alert.alert("Success", `Welcome, ${email}!`);
      navigation.replace("Main"); // Navigate to Main tab navigator
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const handleSignupNavigation = () => {
    navigation.navigate("Signup"); // Navigate to Signup screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Sign In Into Your Account</Text>
      <Text style={styles.subText}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={handleSignupNavigation}>
          <Text style={styles.signupText}> Sign Up Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#cccccc",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#333333",
    color: "#ffffff",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#7b7fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  footerText: {
    color: "#ffffff",
    fontSize: 14,
  },
  signupText: {
    color: "#7b7fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
});
