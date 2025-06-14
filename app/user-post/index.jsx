import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { collection, deleteDoc, doc, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { query } from 'firebase/database';
import PetListItem from './../../components/Home/PetListItem';

export default function UserPost() {
    const navigation = useNavigation();
    const { user } = useUser();
    const [userPostList, setUserPostList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: false,
            headerTitle: () => (
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 30,
                    marginTop: 33,
                    color: Colors.primary
                }}
                >UserPost</Text>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={{ marginTop: 30 }} name='chevron-back' size={30} color={Colors.primary} />
                </TouchableOpacity>
            )
        })

        user && GetUserPost();
    }, [user])

    const GetUserPost = async () => {
        setLoading(true);
        setUserPostList([]);
        const q = query(collection(db, 'Pets'), where('email', '==', user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            setUserPostList(prev => [...prev, doc.data()])
        })

        setLoading(false);
    }

    const OnDeletePost = (docId) => {
        Alert.alert('Do you want to delete', "Do you relly want to delete this post", [
            {
                text: 'Cancel',
                onPress: () => console.log("Cancel Click"),
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => deletePost(docId)
            }
        ])
    }

    const deletePost = async (docId) => {
        await deleteDoc(doc(db, 'Pets', docId));
        GetUserPost();
    }

    return (
        <View style={{
            padding: 20
        }}>
            <FlatList
                data={userPostList}
                numColumns={2}
                refreshing={loading}
                onRefresh={GetUserPost}
                columnWrapperStyle={{ justifyContent: 'center', marginBottom: 20, gap: 20 }}
                renderItem={({ item, index }) => (
                    <View >
                        <PetListItem pet={item} key={index} />
                        <TouchableOpacity onPress={() => OnDeletePost(item?.id)} style={{
                            padding: 5,
                            backgroundColor: Colors.light_primary,
                            borderRadius: 10,
                            marginTop: 5
                        }}>
                            <Text style={{
                                fontFamily: 'outfit',
                                textAlign: 'center',
                                fontSize: 16
                            }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {userPostList?.length == 0 && <Text style={{
                fontFamily: 'outfit',
                textAlign: 'center',
                fontSize: 16
            }}>No Post Found</Text>}
        </View>
    )
}