import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button, Alert, Modal, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as SQLite from 'expo-sqlite';
import {useFonts, Montserrat_600SemiBold_Italic } from '@expo-google-fonts/montserrat';
import * as Font from 'expo-font';
const Note = () => {
    //téléchergement des fontes
    let [fontLoaded] = useFonts({
        Montserrat_600SemiBold_Italic,
    });
    Font.loadAsync({
        Montserrat_600SemiBold_Italic
    })

    const db = SQLite.openDatabase('my_notes.db');
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
    
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    // récupération de la note choisie 
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM notes WHERE id = ?',
                [id],
                (txObj, resultSet) => {
                    if (resultSet.rows.length > 0) {
                        const note = resultSet.rows.item(0);
                        setTitle(note.title);
                        setDate(note.date);
                        setContent(note.content);
                        setPriority(note.priority);
                    } else {
                        Alert.alert('Error', 'Note not found');
                        navigation.goBack();
                    }
                },
                (txObj, err) => {
                    console.log(err);
                }
            );
        });
    }, [id]);
    //Navigation entre les pages
    const handleEditNote = () => {
        navigation.navigate('Formulaire', { id: id });
    };
    // fonction du delete
    const handleDeleteNote = () => {
        setModalVisible(true);
    };
    // confirmation du delete 
    const confirmDeleteNote = () => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM notes WHERE id=?',
                [id],
                (txObj, resultSet) => {
                    console.log("Note successfully deleted from database");
                    navigation.goBack();
                },
                (txObj, err) => {
                    console.log(err);
                }
            );
        });
    };
    // Sauvegarde des changements
    const handleSaveNote = () => {
        const db = SQLite.openDatabase('my_notes.db');
        db.transaction(
            tx => {
                tx.executeSql(
                    'UPDATE notes SET title=?, date=?, content=?, priority=? WHERE id=?',
                    [title, date, content, priority, id],
                    (txObj, resultSet) => {
                        console.log('Note updated successfully');
                        navigation.goBack();
                    },
                    (txObj, error) => {
                        console.log('Error updating note:', error);
                    }
                );
            },
            null,
            null
        );
    };
    // Le rendu visuel
    return (
        <View style={styles.container} backgroundColor= '#114b5f'>
            <TextInput
                style={[styles.input, { backgroundColor: '#ffd4ca' }]}
                value={title}
                onChangeText={setTitle}
                placeholder="Title" borderColor='#f45b69'
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
                <Picker.Item label="Important " value="Important"  />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Not that important " value="not that important" />
            </Picker>
            <Button title="SAVE CHANGES" onPress={handleSaveNote} color="#f45b69"   />
            <Button title="DELETE" onPress={handleDeleteNote} color="#f45b69" />
            <Button title="Edit" onPress={handleEditNote} color="#f45b69" />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                backgroundColor= '#114b5f'
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Do you confirm the delete of this note ?</Text>
                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                onPress={() => setModalVisible(!modalVisible)}
                                color="#114b5f" 
                                style={{fontFamily: 'Montserrat_600SemiBold_Italic'}}
                            />
                            <Button
                                title="I confirm"
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    confirmDeleteNote();
                                    
                                }} 
                                color="#114b5f" 
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
// styles 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        fontFamily: 'Montserrat_600SemiBold_Italic'
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "#7ee4ec",
        borderRadius: 20,
        padding: 35,
        fontFamily: 'Montserrat_600SemiBold_Italic',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: 'Montserrat_600SemiBold_Italic'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        fontFamily: 'Montserrat_600SemiBold_Italic'
    },
    deleteButton: {
        marginTop: 10 // Add margin here
    }
});

export default Note;
