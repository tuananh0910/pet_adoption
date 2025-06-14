import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import PetListByCategory from '../../components/Home/PetListByCategory'
import { MaterialIcons } from '@expo/vector-icons'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'

export default function Home() {
    const router = useRouter();
    return (
        <View
            style={{
                marginTop: 20,
                padding: 20
            }}
        >
            {/* Header */}
            <Header />
            {/* Slider */}
            <Slider />
            {/* List Of Pets + Category */}
            <PetListByCategory />
            {/* Add New Pet Option */}
            <TouchableOpacity
                onPress={() => router.push('/add-new-pet')}
                style={styles.addNewPetContainer}
            >
                <MaterialIcons style={{ marginBottom: 2 }} name='pets' size={24} color={Colors.primary} />
                <Text
                    style={{
                        fontFamily: 'outfit-medium',
                        color: Colors.primary,
                        fontSize: 20
                    }}
                >Add New Pet</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    addNewPetContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 35,
        padding: 15,
        backgroundColor: Colors.light_primary,
        borderColor: Colors.primary,
        borderRadius: 15,
        borderStyle: 'dashed',
        borderWidth: 2,
        justifyContent: 'center',
        gap: 10
    }
})