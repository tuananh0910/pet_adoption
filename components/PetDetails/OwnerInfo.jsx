import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { FontAwesome } from '@expo/vector-icons'

export default function OwnerInfo({ pet }) {
    return (
        <View style={styles.container}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 20
            }}>
                <Image source={{ uri: pet.userImage }}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50
                    }}
                />
                <View>
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 20,
                    }}>{pet?.userName}</Text>
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 16,
                        color: Colors.gray
                    }}>Pet Owner</Text>
                </View>
            </View>
            <FontAwesome name='send-o' size={30} color={Colors.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 20,
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        marginHorizontal: 20,
        borderRadius: 15,
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
        marginBottom: 100,
        justifyContent: 'space-between'
    }
})