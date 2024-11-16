import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthService from "../../services/Firebase/AuthService";

export default function SignupScreen() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [datausernames, setDataUsernames] = useState([]);
  const [dataemails, setDataEmails] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch existing usernames and emails from Firebase
    const fetchUserData = async () => {
      const { usernames, emails } = await AuthService.getUserData();
      setDataUsernames(usernames);
      setDataEmails(emails);
    };
    fetchUserData();
  }, []);

  const handleSignup = async () => {
    if (!fullname || !username || !email || !password || !confirmpass) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (password !== confirmpass) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (datausernames.includes(username)) {
      Alert.alert("Error", "Username must be unique.");
      return;
    }

    if (dataemails.includes(email)) {
      Alert.alert("Error", "Email address must be unique.");
      return;
    }

    try {
      await AuthService.signup({ fullname, username, email, password });
      Alert.alert("Success", "Account created successfully!");
      navigation.goBack(); // Navigate back to Login screen
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Join StuSwift Universe!</Text>
      <Text style={styles.subText}>Embark on your epic college quest</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#ccc"
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={confirmpass}
        onChangeText={setConfirmpass}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Confirm Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.signupText}> Login</Text>
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
