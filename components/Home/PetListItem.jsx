import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'
import MarkFav from '../MarkFav';

export default function PetListItem({ pet }) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/pet-details',
                params: {
                    ...pet,
                    imageUrl: encodeURIComponent(pet.imageUrl) // Đảm bảo mã hóa đúng URL
                }
            })}
            style={{
                padding: 10,
                backgroundColor: Colors.white,
                borderRadius: 10
            }}
        >
            <View style={{
                position: 'absolute',
                zIndex: 10,
                right: 12,
                top: 12,
            }}>
                <MarkFav pet={pet} color={Colors.primary} />
            </View>
            <Image source={{ uri: pet?.imageUrl }}
                style={{
                    width: 150,
                    height: 185,
                    objectFit: 'cover',
                    borderRadius: 10
                }}
            />
            <Text
                style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 18
                }}
            >{pet?.name}</Text>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        color: Colors.gray,
                        fontFamily: 'outfit',
                        fontSize: 14,
                        maxWidth: 90,
                        overflow: 'hidden'
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{pet?.breed}</Text>
                <Text
                    style={{
                        fontFamily: 'outfit',
                        color: Colors.primary,
                        backgroundColor: Colors.light_primary,
                        paddingHorizontal: 7,
                        borderRadius: 10,
                        fontSize: 14
                    }}
                >{pet?.age} YRS</Text>
            </View>
        </TouchableOpacity>
    )
}