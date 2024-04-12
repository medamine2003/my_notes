import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {useFonts, Montserrat_600SemiBold_Italic } from '@expo-google-fonts/montserrat';
import * as Font from 'expo-font';

const Home = () => {
    //téléchargement des fontes
    let [fontLoaded] = useFonts({
        Montserrat_600SemiBold_Italic,
    });
    Font.loadAsync({
        Montserrat_600SemiBold_Italic
    })
    
    const db = SQLite.openDatabase('my_notes.db');
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const maxContentLines = 2; 
    //création de la table dans la base de données 
    const fetchNotes = () => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, content TEXT, priority TEXT)'
            );
            tx.executeSql(
                'SELECT * FROM notes',
                null,
                (txObj, resultSet) => {
                    console.log('test get',resultSet.rows)
                    setNotes(resultSet.rows._array);
                    setIsLoading(false);
                },
                (txObj, error) => console.log(error)
            );
        });
    };

    
    useEffect(() => {
        fetchNotes();
    }, []);
    // mettre à jour la page home quand on modifie son contenu 
    useFocusEffect(
        React.useCallback(() => {
            fetchNotes();
        }, [])
    );
    // navigation entre les screens
    const navigation = useNavigation();

    const editNote = (id) => {
        navigation.navigate('Note', { id: id });
    };

    // la couleur qui change selon la priorité de la note 
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Important':
                return { borderColor: '#f45b69', backgroundColor: '#f45b69' };
            case 'Normal':
                return { borderColor: '#456990', backgroundColor: '#ffd4ca' };
            case 'not that important':
                return { borderColor: '#114b5f', backgroundColor: '#7ee4ec' };
            default:
                return { borderColor: '#ccc', backgroundColor: '#fff' };
        }
    };

    // fonction qui permet de tronquer le contenu par définir un certain nombre de lignes à afficher 
    const truncateContent = (content) => {
        const contentLines = content.split('\n');
        const truncatedContent = contentLines.slice(0, maxContentLines).join('\n');
        return truncatedContent;
    };
    // le rendu visuel
    return (
        <View>
            <ScrollView>
                {isLoading ? (
                    <View>
                        <Text>No notes for the moment</Text>
                    </View>
                ) : (
                    notes.map((note) => (
                        <TouchableOpacity key={note.id} onPress={() => editNote(note.id)}>
                            <View style={[styles.card, getPriorityColor(note.priority)]}>
                                <Text style={styles.title}>{note.title}</Text>
                                <Text style={styles.date}>{note.date}</Text>
                                <Text style={styles.content}>
                                    {truncateContent(note.content)}
                                </Text>
                                <Text>{note.priority}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
                <Button title="ADD" onPress={() => navigation.navigate('Formulaire')} color="#456990" />
            </ScrollView>
        </View>
    );
};
  // styles 
const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontFamily: 'Montserrat_600SemiBold_Italic'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Montserrat_600SemiBold_Italic'
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        fontFamily: 'Montserrat_600SemiBold_Italic'
    },
    content: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold_Italic'
    },
});

export default Home;
