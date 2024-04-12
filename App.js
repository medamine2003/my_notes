import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './components/Home'
import Formulaire from './components/Formulaire'
import Note from './components/Note'
export default function App() {

  const Stack= createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Home">
       
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Formulaire" component={Formulaire}/>
        <Stack.Screen name="Note" component={Note}/>
       
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
