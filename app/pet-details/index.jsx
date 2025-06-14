import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import DescriptionPet from '../../components/PetDetails/DescriptionPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: () => (
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 30,
                    color: Colors.primary,
                    marginTop: 33
                }}>
                    {pet?.name}
                </Text>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={{ marginTop: 33 }} name="chevron-back" size={35} color={Colors.primary} />
                </TouchableOpacity>
            )
        })
    }, [])

    const InitiateChat = async () => {
        const docId1 = user?.primaryEmailAddress?.emailAddress + '_' + pet?.email;
        const docId2 = pet?.email + '_' + user?.primaryEmailAddress?.emailAddress;

        const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            console.log(doc.data());
            router.push({
                pathname: '/chat',
                params: { id: doc.id }
            })
        })

        if (querySnapshot.docs?.length == 0) {
            await setDoc(doc(db, 'Chat', docId1), {
                id: docId1,
                users: [
                    {
                        email: user?.primaryEmailAddress?.emailAddress,
                        imageUrl: user?.imageUrl,
                        name: user?.fullName
                    },
                    {
                        email: pet?.email,
                        imageUrl: pet?.userImage,
                        name: pet?.userName
                    }
                ],
                userIds: [user?.primaryEmailAddress?.emailAddress, pet?.email]
            });
            router.push({
                pathname: '/chat',
                params: { id: docId1 }
            })
        }
    }

    return (
        <View>
            <ScrollView>
                {/* Pet Info */}
                <PetInfo pet={pet} />
                {/* Pet SubInfo */}
                <PetSubInfo pet={pet} />
                {/* About */}
                <DescriptionPet pet={pet} />
                {/* Owner details */}
                <OwnerInfo pet={pet} />


            </ScrollView>
            {/* Adopt me Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    onPress={InitiateChat}
                    style={styles.adoptBtn}>
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 20
                    }}>Adopt Me</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    adoptBtn: {
        padding: 15,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 20
    },
    bottomContainer: {
        padding: 12,
        position: 'absolute',
        width: '100%',
        bottom: 0,
    }
})