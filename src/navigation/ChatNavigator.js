// src/navigation/ChatNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {ChatPage} from '../../Shared/Ahmed Shahzad/Chats';
import {Creategroup} from '../../Shared/Ahmed Shahzad/CreateGroup';
import {Messages_page} from '../../Shared/Ahmed Shahzad/Messages';
const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Chats Page" component={ChatPage} />
    <Stack.Screen name="Create Group" component={Creategroup} />
    <Stack.Screen name="Messages" component={Messages_page} />
  </Stack.Navigator>
);

export default ChatNavigator;
