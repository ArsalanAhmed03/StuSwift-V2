// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { L } from '../components/Auth/Login';
import { S } from '../components/Auth/Signup';
const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={L} />
        <Stack.Screen name="SignUp" component={S} />
    </Stack.Navigator>
);

export default AuthNavigator;
