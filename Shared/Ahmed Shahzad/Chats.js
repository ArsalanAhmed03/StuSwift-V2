import React, { useState,useEffect } from 'react';
import {Text,View,StyleSheet,ScrollView,Image,TouchableOpacity,FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {FetchChatGroups} from './Fetching';
import { LinearGradient } from 'expo-linear-gradient';

export function ChatPage({navigation}){
    const[showgroups,setgroups]=useState([]);

const groupclicked=(groupName,groupID)=>{
navigation.navigate("Messages",{groupName,groupID});
}

const Groups=async()=>{
const chatgroups=new FetchChatGroups();
const allGroups=await chatgroups.fetchdata();
setgroups(allGroups);
}
Groups();

    return (
        <View style={mainstyles.maincontainer}>
         <>
            <View style={mainstyles.HeadingContainer}>
                <Text style={mainstyles.Heading}>Chat Groups</Text>
            </View>
            <FlatList style={mainstyles.groupsContainer}
              data={showgroups}
              keyExtractor={(item, index)=>index.toString()}
              renderItem={({ item,index }) => (
                <TouchableOpacity onPress={()=>groupclicked(item.groupName,item.groupID)}>
                    <View key={index}>
                        <LinearGradient
                        colors={["#747FBB", "#1C214A"]} style={mainstyles.groupContainer}>
                        <View>
                        <Ionicons style={{top:10}} color={"white"} size={40} name="people-circle" />
                        </View>
                        <Text style={mainstyles.groupText}>{item.groupName}</Text>
                        </LinearGradient>
                    </View>

                    </TouchableOpacity>
                     )}
                     />
            <View style={mainstyles.PlusContainer}>
            <LinearGradient
            colors={["#747FBB", "#1C214A"]} style={mainstyles.ahmed}>
                <TouchableOpacity style={mainstyles.ahmed} onPress={()=>navigation.navigate('Create Group')}>
                <Ionicons name="add-outline" size={40} color="white" />
                 </TouchableOpacity>
                 </LinearGradient>
            </View>
            </>
        </View>
    );
}
const mainstyles=StyleSheet.create({
    ahmed:{
        borderRadius:20,
    },
    maincontainer:{
        flex:1,
        backgroundColor:'white',
    },
    HeadingContainer:{
        flexDirection: 'row',
        justifyContent: 'center', 
    },
    Heading:{
        fontSize:30,
        fontWeight:'bold',
    },
    scrollContainer: {
        paddingBottom: 100, 
        left:10
    },
    PlusContainer:{
        position: 'absolute', 
        bottom: 100, 
        alignItems:'center',
        right:10,
    },
    groupsContainer: {
        marginTop: 60,
        // paddingHorizontal: 10,
        paddingBottom: 100, 
    },
    groupContainer: {
        width: '100%',
        height: 70,
        justifyContent: 'centre',
        alignItems: 'flex-start',
        marginVertical: 0,
        borderColor:'white',
        borderWidth:1,
    },
    groupText: {
        position:'absolute',
        color: 'white',
        fontSize: 18,
        padding:17.5,
        left:50,
    },

});

