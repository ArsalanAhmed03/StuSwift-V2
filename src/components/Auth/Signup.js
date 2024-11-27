import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Fetchemails,Fetchusername } from "../../services/Firebase/Fetching";
import { SignUpClass,AuthService } from "../../services/Firebase/AuthService";

export function S({navigation}) {

  const[datausernames,setdatausernames]=useState([]);
  const[dataemails,setdataemails]=useState([]);
  const [formData, setFormData] = useState({
    fullname:'',
    username:'',
    email:'',
    password: '',
    confirmpass:'',
  });

  const fetchData=async()=>{
  const getallusernames=new Fetchusername();
  const usernamesinfo=await getallusernames.fetchdata();
  const getallemails=new Fetchemails();
  const emailsinfo=await getallemails.fetchdata();
  setdatausernames(usernamesinfo);
  setdataemails(emailsinfo);
  }
  fetchData();

  const loginBtnPressed = () => {
    navigation.navigate("Login");
  };

const handlesignup=async()=>{
    if (!formData.fullname || !formData.username || !formData.email || !formData.password || !formData.confirmpass){
        alert('Fill all the feilds');
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (formData.password!=formData.confirmpass){
        alert("Fill both Password feilds same");
        return;
    }
    if (datausernames && datausernames.includes(formData.username))
    {
      alert("Username must be unique!");
      return;
    }
    if(dataemails && dataemails.includes(formData.email))
    {
      alert("Email Address must be unique");
      return;
    }
    const SignUpInstance=new SignUpClass();
    const AuthSignup=new AuthService(SignUpInstance);
    AuthSignup.authenticate(formData);
    navigation.navigate("Login");
}

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Join StuSwift Universe!</Text>
      <Text style={styles.subText}>Embark on your epic college quest</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#ccc"
        value={formData.fullname}
        onChangeText={(text)=>setFormData({...formData,fullname:text})}
      />
      <TextInput
        style={styles.input}
        placeholder="UserName"
        placeholderTextColor="#ccc"
        value={formData.username}
        onChangeText={(text)=>setFormData({...formData,username:text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text)=>setFormData({...formData,email:text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={formData.password}
        onChangeText={(text)=>setFormData({...formData,password:text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={formData.confirmpass}
        onChangeText={(text)=>setFormData({...formData,confirmpass:text})}
      />

      <TouchableOpacity style={styles.button} onPress={handlesignup}>
        <Text style={styles.buttonText}>Confirm Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={loginBtnPressed}>
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
    padding: 20, // Adjust padding as per your design
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
