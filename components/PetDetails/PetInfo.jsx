import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import MarkFav from '../MarkFav'

export default function PetInfo({ pet }) {

    return (
        <View>
            <Image source={{ uri: pet?.imageUrl }}
                style={{
                    width: '100%',
                    height: 500,
                    objectFit: 'cover',
                }}
            />
            <View style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 28
                        }}
                    >{pet?.name}</Text>
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: 16,
                            color: Colors.gray,
                        }}
                    >{pet?.address}</Text>
                </View>
                <MarkFav pet={pet} />
            </ View>
        </View>
    )
}