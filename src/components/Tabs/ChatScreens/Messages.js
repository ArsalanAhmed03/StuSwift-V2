import React, { useState } from 'react';
import {View,StyleSheet,Text,TextInput,ScrollView,TouchableOpacity,FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FetchGroupDescription,FetchMessages  } from '../../../services/Firebase/Fetching';
import { SentMessage,AuthService  } from '../../../services/Firebase/AuthService';
import { LinearGradient } from 'expo-linear-gradient';

export function Messages_page({navigation,route}){

    const {groupName,groupID}=route.params|| {};
    const [showd,setd]=useState('');
    const [messagesList,setmessagesList]=useState([]);
    const [formData, setFormData] = useState({
        message:'',
        groupID:groupID,
      });

    const gotochats=()=>{
        navigation.navigate('Chats Page');
    }

    const getgroupdescription=async()=>{
    const fetchdescriptionInstance=new FetchGroupDescription();
    const Group_Description=await fetchdescriptionInstance.fetchdata(groupName,groupID);
    setd(Group_Description);
    }
    getgroupdescription();

    const fetchmessages=async()=>{
        const fetchmessageInstance=new FetchMessages();
        const messages=await fetchmessageInstance.fetchdata(groupID);
        setmessagesList(messages);
    }
    fetchmessages();

    const handlesend=async()=>{
        const SendMessageInstance=new SentMessage();
        const SENDMESSAGE =new AuthService(SendMessageInstance);
        const sent=SENDMESSAGE.authenticate(formData);
        setFormData({ ...formData, message: '' });
        fetchmessages();
    }
    
    return(
        <View style={messages_style.main}>
        <View style={messages_style.topbar}>
            <View style={messages_style.GroupimgContainer}>
            <Ionicons  size={30} name="people-circle" />
                <Text style={messages_style.Gname}>{groupName}</Text>
            </View>
            <View style={messages_style.groupDescriptionContainer}>
                <Text style={messages_style.GDescription}>Description: {showd}</Text>
            </View>
        </View>
        <FlatList contentContainerStyle={messages_style.scrollContainer}
                style={messages_style.scrollView}
              data={messagesList}
              keyExtractor={(item, index)=>index.toString()}
              renderItem={({ item,index }) => (
                <View style={messages_style.messageContainer} key={index}>
                    <LinearGradient
            colors={["#747FBB", "#1C214A"]} style={messages_style.messageContainer}>
                    <Text style={{color:'white',padding:5,fontWeight:'bold'}}>{item.sendby}</Text>
                    <Text style={{color:'white',padding:5}}>{item.message}</Text>
                    </LinearGradient>
                </View>
              )}
              />
        <View style={messages_style.bottombar}>
            <TextInput style={messages_style.messagesinput} value={formData.message} onChangeText={(text)=>setFormData({...formData,message:text})} placeholder='Text Message'/>
            <TouchableOpacity onPress={handlesend}>
                <Ionicons style={{right:0,color:'#4E5A8C', alignItems:'center',justifyContent:'center',marginTop:10,marginLeft:10}} name='send' size={24} />
            </TouchableOpacity>
        </View>
        </View>
    );
}
const messages_style=StyleSheet.create(
    {
        main:{
        flex:1,
        paddingTop:'50'
        },
        topbar:{
        position: 'absolute',   
        top: 0,
        left: 0,
        right: 0,
        height:105,
        borderBottomColor:"#4E5A8C",
        borderBottomWidth:2,
        backgroundColor:"white",
        zIndex: 10,
        },
        GroupimgContainer:{
        flexDirection: 'row',      
        alignItems: 'center', 
        marginTop:45,
        marginLeft:10,
        },

        Gname: {
            marginLeft: 20,             
            fontSize: 20,               
            color: 'black',             
            fontWeight:'bold'
        },
        groupDescriptionContainer: {
            position: 'absolute',
            top: 70, 
            left: 50, 
            padding: 10,
            width: '100%', 
            zIndex: 10, // Make sure it appears on top of other elements
        },
        GDescription:{
            fontSize: 16,               
            color: 'black',
        },
        scrollContainer: {
            paddingTop: 120, // Add some padding to push content down to avoid overlap with the top bar
            paddingBottom:80,
            paddingLeft:10,
            paddingRight:10
          },
          scrollView: {
            flex: 1,
            paddingBottom: 10,
        },
        bottombar:{
            height:60,
        width:'100%',
        backgroundColor:'white',
        borderTopColor:"#4E5A8C",
        borderTopWidth:2,
        // borderTopLeftRadius:20,
        // borderTopRightRadius:20,
        flexDirection:'row',
        alignItems:'centre',
       padding:10,
        
        position:'absolute',
        bottom:0,
        zIndex: 10,
        },
        messagesinput:{
            height:40,
            width:'90%',
            borderColor:"#4E5A8C",
            borderWidth:1,
            padding:10,
            color:"#4E5A8C",
            borderRadius:15
        },
        messageContainer:{
            borderColor:'white',
            borderWidth:1,
            width:'100%',
            borderRadius:15
        }
    }
);