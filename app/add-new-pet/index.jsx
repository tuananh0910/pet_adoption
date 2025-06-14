import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, ScrollView, Pressable, ToastAndroid, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddNewPet() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        category: 'Fishs', gender: 'Male'
    });
    const [gender, setGender] = useState();
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [image, setImage] = useState();
    const [loader, setLoader] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 5],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const GetCategories = async () => {
        setCategoryList([]);
        const snapshot = await getDocs(collection(db, 'Category'));
        snapshot.forEach((doc) => {
            setCategoryList(categoryList => [...categoryList, doc.data()]);
        });
    };

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev, [fieldName]: fieldValue
        }));
    }

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: false,
            headerTitle: () => (
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 30,
                    color: Colors.primary,
                    marginTop: 35
                }}>
                    Add New Pet
                </Text>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={{ marginTop: 33 }} name='chevron-back-outline' size={35} color={Colors.primary} />
                </TouchableOpacity>
            )
        })
        GetCategories();
    }, [])

    const onSubmit = () => {
        if (!image) {
            ToastAndroid.show('Please select an image', ToastAndroid.SHORT);
            return;
        }
        if (Object.keys(formData).length != 8) {
            ToastAndroid.show('Enter All Details', ToastAndroid.SHORT);
            return;
        }
        UploadImage();
    };

    const UploadImage = async () => {
        setLoader(true);

        const resp = await fetch(image);
        const bolbImage = await resp.blob();
        const storageRef = ref(storage, '/PetAdopt/' + Date.now() + '.jpg');

        uploadBytes(storageRef, bolbImage).then((snapshot) => {
            console.log('File Uploaded');
        }).then(resp => {
            getDownloadURL(storageRef).then(async (downloadUrl) => {
                console.log(downloadUrl);
                SaveFormData(downloadUrl);
            })
        })
    }

    const SaveFormData = async (imageUrl) => {
        const docId = Date.now().toString();
        try {
            await setDoc(doc(db, 'Pets', docId), {
                ...formData,
                imageUrl: imageUrl,
                userName: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
                userImage: user?.imageUrl,
                id: docId,
            });
            setLoader(false);
            ToastAndroid.show('Pet added successfully!', ToastAndroid.SHORT);
            router.replace('/(tabs)/home')
            console.log('imageUrl', imageUrl);
        } catch (error) {
            console.error('Error saving form data:', error);
            ToastAndroid.show('Failed to save pet data', ToastAndroid.SHORT);
            setLoader(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <Text style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 20
                        }}>Add new pet from adoption</Text>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Pressable onPress={imagePicker}>
                                <Image
                                    source={require('./../../assets/images/placeholder.png')}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 15,
                                        borderWidth: 2,
                                        borderColor: Colors.gray,
                                        marginTop: 10,
                                    }}
                                />
                            </Pressable>

                            <View style={{
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    fontFamily: 'outfit',
                                    fontSize: 14
                                }}>Picture of pet</Text>
                                <Image
                                    source={require('./../../assets/images/swap.png')}
                                    style={{
                                        width: 60,
                                        height: 60
                                    }}
                                />
                                <Text style={{
                                    fontFamily: 'outfit',
                                    fontSize: 14,
                                    maxWidth: 100
                                }}> Choose picture for pet</Text>
                            </View>

                            <View>
                                {!image ?
                                    <Image
                                        source={require('./../../assets/images/imagenull.png')}
                                        style={{
                                            width: 140,
                                            height: 170,
                                            borderRadius: 15,
                                            borderWidth: 2,
                                            borderColor: Colors.gray,
                                            marginTop: 10,
                                        }}
                                    />
                                    :
                                    <Image
                                        source={{ uri: image }}
                                        style={{
                                            width: 140,
                                            height: 170,
                                            borderRadius: 15,
                                            marginTop: 10
                                        }}
                                    />
                                }
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Pet name *</Text>
                            <TextInput style={styles.input} onChangeText={(value) => handleInputChange('name', value)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Pet Category *</Text>
                            <View style={[styles.input, { padding: 0 }]}>
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedCategory(itemValue);
                                        handleInputChange('category', itemValue)
                                    }
                                    }>
                                    {categoryList.map((categoty, index) => (
                                        <Picker.Item key={index} label={categoty.name} value={categoty.name} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Breed *</Text>
                            <TextInput style={styles.input} onChangeText={(value) => handleInputChange('breed', value)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Age *</Text>
                            <TextInput style={styles.input}
                                keyboardType='number-pad'
                                onChangeText={(value) => handleInputChange('age', value)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Gender *</Text>
                            <View style={[styles.input, { padding: 0 }]}>
                                <Picker
                                    selectedValue={gender}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setGender(itemValue);
                                        handleInputChange('gender', itemValue)
                                    }
                                    }>
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Weight *</Text>
                            <TextInput style={styles.input}
                                keyboardType='number-pad'
                                onChangeText={(value) => handleInputChange('weight', value)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Address *</Text>
                            <TextInput style={styles.input} onChangeText={(value) => handleInputChange('address', value)} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>About *</Text>
                            <TextInput style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
                                numberOfLines={5}
                                multiline={true}
                                onChangeText={(value) => handleInputChange('about', value)} />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={onSubmit}
                            disabled={loader}
                        >
                            {loader ? <ActivityIndicator size={'large'} /> :
                                <Text style={{
                                    fontFamily: 'outfit-medium',
                                    fontSize: 18,
                                }}>Submit</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView >
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 50
    },
    inputContainer: {
        marginVertical: 10
    },
    input: {
        padding: 10,
        fontFamily: 'outfit',
        backgroundColor: Colors.white,
        borderRadius: 10,
        fontSize: 18
    },
    label: {
        fontSize: 18,
        fontFamily: 'outfit',
        marginVertical: 5
    },
    button: {
        padding: 15,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        marginVertical: 10,
        alignItems: 'center',
        marginBottom: 20
    }

})