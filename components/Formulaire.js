import  { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import {useFonts, Montserrat_600SemiBold_Italic } from '@expo-google-fonts/montserrat';
import * as Font from 'expo-font';

const Formulaire = () => {
    let [fontLoaded] = useFonts({
        Montserrat_600SemiBold_Italic,
    });
    Font.loadAsync({
        Montserrat_600SemiBold_Italic
    })
    const db = SQLite.openDatabase('my_notes.db');
    const navigation = useNavigation();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('Normal');
    // la fonction pour rajouter la note à la base de données 
    const addNoteToDb = ({ title, date, content, priority }) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO notes (title, date, content, priority) VALUES (?, ?, ?, ?)',
                [title, date, content, priority],
                (txObj, resultSet) => {
                    console.log("Note successfully inserted into database",resultSet);
                
                },
                (txObj, err) => {
                    console.log("Error inserting note into database:", err)
                }
            );
        });
    };
    //Sauvegarde de la note crée
    const handleSaveNote = () => {
        console.log('hi')
        if (title.trim() === '' || date.trim() === '' || content.trim() === '') {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs du formulaire');
        } else {
            addNoteToDb({ title, date, content, priority });
            navigation.navigate('Home');
        }
    };
    // le rendu visuel
    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { backgroundColor: '#ffd4ca' }]}
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                borderColor='#f45b69'
            />
            <TextInput
                style={[styles.input, { backgroundColor: '#ffd4ca' }]}
                value={date}
                onChangeText={setDate}
                placeholder="Date"
                borderColor='#f45b69'
            />
            <TextInput
                style={[styles.input, { backgroundColor: '#ffd4ca', height: 100 }]}
                value={content}
                onChangeText={setContent}
                placeholder="Content"
                multiline
                borderColor='#f45b69'
            />
            <Picker
                selectedValue={priority}
                style={[styles.input, { backgroundColor: '#ffd4ca' ,borderColor:'#f45b69'}]}
                onValueChange={(itemValue, itemIndex) =>
                    setPriority(itemValue)
                }
                >
                <Picker.Item label="Important " value="Important" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Not that important " value="not that important" />
            </Picker>
            <Button title="SAVE" onPress={handleSaveNote} color="#f45b69" />
        </View>
    );
};
// style 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#114b5f'
    },
    input: {
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        fontFamily: 'Montserrat_600SemiBold_Italic'
    },
});

export default Formulaire;
