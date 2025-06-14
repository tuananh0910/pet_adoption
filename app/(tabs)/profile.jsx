import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router'; // Import useRouter từ expo-router
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
    const Menu = [
        {
            id: 1,
            name: 'Add New Pet',
            icon: 'add-circle',
            path: '/add-new-pet'
        },
        {
            id: 2,
            name: 'My Post',
            icon: 'bookmark',
            path: '/../user-post'
        },
        {
            id: 3,
            name: 'Favorites',
            icon: 'heart',
            path: '/(tabs)/favorite'
        },
        {
            id: 4,
            name: 'Inbox',
            icon: 'chatbubble',
            path: '/(tabs)/inbox'
        },
        {
            id: 5,
            name: 'Logout',
            icon: 'exit',
            path: 'logout'
        },
    ]

    const { user } = useUser();
    const router = useRouter();
    const { signOut } = useClerk()

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        setUserData(user); // Cập nhật dữ liệu khi user thay đổi
    }, [user]);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (err) {
            console.error('Error during sign-out:', err);
        }
    };

    const onPressMenu = (menu) => {
        if (menu.path === 'logout') {
            handleSignOut();
        } else {
            router.push(menu.path);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titlePage}>Profile</Text>
            <View style={{
                display: 'flex',
                alignItems: 'center',
                marginVertical: 25
            }}>
                <Image source={{ uri: userData?.imageUrl }} style={styles.avatar} />
                <Text style={styles.userName}>{userData?.fullName || 'User'}</Text>
                <Text style={styles.userEmail}>{userData?.primaryEmailAddress?.emailAddress || 'No email'}</Text>
            </View>
            <FlatList
                data={Menu}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => onPressMenu(item)}
                        key={item?.id} style={{
                            marginVertical: 10,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            backgroundColor: Colors.white,
                            padding: 5,
                            borderRadius: 15
                        }}>
                        <Ionicons
                            style={{
                                padding: 20,
                                backgroundColor: Colors.light_primary,
                                borderRadius: 10
                            }}
                            name={item?.icon} size={30} color={Colors.primary} />

                        <Text style={styles.label}>{item?.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 20
    },
    titlePage: {
        fontFamily: 'outfit-medium',
        fontSize: 30
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50
    },
    userName: {
        fontFamily: 'outfit-bold',
        fontSize: 25,
        marginTop: 10
    },
    userEmail: {
        fontFamily: 'outfit',
        fontSize: 18,
        color: Colors.gray
    },
    label: {
        fontFamily: 'outfit',
        fontSize: 18,
    }
});
