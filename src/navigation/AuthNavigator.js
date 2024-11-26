// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {L} from '../../Shared/Ahmed Shahzad/Login';
import {S} from '../../Shared/Ahmed Shahzad/Signup';

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={L} />
        <Stack.Screen name="SignUp" component={S} />
    </Stack.Navigator>
);

export default AuthNavigator;
