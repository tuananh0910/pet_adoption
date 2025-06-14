import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'

export default function UserItem({ userInfo }) {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.push('/chat?id=' + userInfo.docId)}>
            <View style={{
                marginVertical: 10,
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.gray,
                borderRadius: 15,
                padding: 10,
                marginBottom: 10
            }}>
                <Image source={{ uri: userInfo?.imageUrl }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50
                    }}
                />
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 18
                }}>{userInfo?.name}</Text>
            </View>

        </TouchableOpacity >
    )
}