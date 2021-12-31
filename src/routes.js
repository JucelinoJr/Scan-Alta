import React from 'react';
import {Feather} from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import RequestCamera from './pages/RequestCamera';
import Home from './pages/Home';
// import { Container } from './styles';

const Tab = createBottomTabNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
          <Tab.Navigator screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarItemStyle: { width: 100 },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#000000',
          tabBarStyle: { backgroundColor: '#00995D' },
        }}>
          <Tab.Screen options={{tabBarIcon: () => <Feather name="camera" size={22}/>}} 
            name="Consultar Paciente" component={RequestCamera} />
          </Tab.Navigator>

        </NavigationContainer>
      );
}

