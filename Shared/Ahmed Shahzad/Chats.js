import React, { useState,useEffect } from 'react';
import {Text,View,StyleSheet,ScrollView,Image,TouchableOpacity,FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {FetchChatGroups} from './Fetching';
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
            <View style={mainstyles.ArrowContainer}>
                <Ionicons name="arrow-back-sharp" size={30} color="black" cursor="pointer"/>
            </View>
                <Text style={mainstyles.Heading}>Chat Groups</Text>
            </View>
            <ScrollView style={mainstyles.groupsContainer}>
            <FlatList
              data={showgroups}
              keyExtractor={(item, index)=>index.toString()}
              renderItem={({ item,index }) => (
                <TouchableOpacity onPress={()=>groupclicked(item.groupName,item.groupID)}>
                    <View key={index} style={mainstyles.groupContainer}>
                        <View>
                        <Ionicons style={{top:10}} color={"white"} size={40} name="people-circle" />
                        </View>
                        <Text style={mainstyles.groupText}>{item.groupName}</Text>
                    </View>

                    </TouchableOpacity>
                     )}
                     />
            </ScrollView>
            <View style={mainstyles.PlusContainer}>
                <TouchableOpacity style={mainstyles.ahmed} onPress={()=>navigation.navigate('Create Group')}>
                <Ionicons name="add-outline" size={40} color="white" />
                 </TouchableOpacity>
            </View>
            </>
        </View>
    );
}
const mainstyles=StyleSheet.create({
    ahmed:{
        backgroundColor: '#3B3B98',
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
    ArrowContainer:{
        position:'absolute',
        top:10,
        left:8,
        cursor:"pointer"
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
        backgroundColor: '#3B3B98',
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

