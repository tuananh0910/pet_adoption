import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'

export default function DescriptionPet({ pet }) {
    const [readMore, setReadMore] = useState(true);

    return (
        <View style={{
            padding: 20
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center'
            }}>
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 22
                }}>About</Text>
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 22,
                    color: Colors.primary
                }}>{pet?.name}</Text>
            </View>
            <Text numberOfLines={readMore ? 3 : 20} style={{
                fontFamily: 'outfit',
                fontSize: 16
            }}>{pet?.about}</Text>
            {readMore &&
                <TouchableOpacity onPress={() => setReadMore(false)}>
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 16,
                        color: Colors.secondary
                    }}>Read More</Text>
                </TouchableOpacity>
            }
        </View>
    )
}