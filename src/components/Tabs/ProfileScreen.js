// src/components/Tabs/ProfileScreen.js
import { useState,useEffect } from "react";
import React from "react";
import { View, Text, StyleSheet,TextInput,TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FetchAllData} from "../../services/Firebase/Fetching";
import { updateUserinfo,AuthService } from "../../services/Firebase/AuthService";
const ProfileScreen = () => {
  
  const [updatefullname,setupdatefullname]=useState('');
  const [updateemail,setupdateemail]=useState('');
  const [updateusername,setupdateusername]=useState('');
  const [updatepassword,setupdatepassword]=useState('');

  const profilefetch=async()=>{
    const fetch=new FetchAllData();
    const v=await fetch.fetchdata();
    setupdatefullname(v.fullName);
    setupdateemail(v.email);
    setupdateusername(v.username);
    setupdatepassword(v.password);
  }
  

    useEffect(() => {
      const loadData = async () => {
        await profilefetch();  // Fetch user profile data
      };
      loadData();  // Call the loadData function once on mount
    }, []); 

    const formData={
      fullName:updatefullname,
    };

    
  const handlesave=async()=>{
    if (!updatefullname){
      alert('Fill all the feilds');
      return;
  }
    const ProfileInstance=new updateUserinfo();
    const Updationprofile=new AuthService(ProfileInstance);
    Updationprofile.authenticate(formData);
    alert("Profile Updated Successfully!");
  }
  return (
    <View style={styles.container}>
      <View style={styles.HeadingContainer}>
            <Text style={styles.Heading}>Profile</Text>
        </View>
      <View style={styles.bodyContainer}>
        <TextInput style={styles.bodyText} value={updatefullname} onChangeText={setupdatefullname} placeholder="Full Name"></TextInput>
      </View>
      <View style={styles.bodyContainer}>
        <TextInput style={styles.bodyText} value={updateemail}  placeholder="Email Address"></TextInput>
      </View>
      <View style={styles.bodyContainer}>
        <TextInput style={styles.bodyText} value={updateusername} placeholder="Username"></TextInput>
      </View>
      <View style={styles.bodyContainer}>
        <TextInput style={styles.bodyText} value={updatepassword}  placeholder="Password"></TextInput>
      </View>
      <View style={styles.buttoncontainer}>
        <LinearGradient
            colors={["#747FBB", "#1C214A"]} style={styles.savebutton}>
        <TouchableOpacity style={styles.savebutton} onPress={handlesave}>
            <Text style={styles.savetext} >Save</Text>
        </TouchableOpacity>
        </LinearGradient>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor:'white', paddingTop:'50' },
  text: { fontSize: 20, fontWeight: "bold" },
  HeadingContainer:{
    flexDirection: 'row',
    justifyContent: 'center', 
  },
  Heading:{
    fontSize:30,
    fontWeight:'bold',
  },
  bodyContainer:{
    marginHorizontal: 10, 
    marginTop: 60,
},
bodyText:{
    color: 'black',
    fontSize: 15,
    borderBottomColor: '#3B3B98',
    borderTopColor:'white',
    borderLeftColor:'white',
    borderRightColor:'white',
    borderBottomWidth:2,
    borderRadius: 5,
    padding: 5,
},
buttoncontainer:{
  flexDirection: 'row',
  justifyContent: 'center', 
  marginTop: 20,
},
savebutton:{
  height:50,
  width:160,
  borderRadius:15,
  justifyContent: 'center',
  alignItems: 'center', 
},
savetext:{
  color:'white',
  textAlign: 'center',
 
},
});

export default ProfileScreen;


