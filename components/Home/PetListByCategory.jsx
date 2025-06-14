import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Category from './Category'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import PetListItem from './PetListItem'

export default function PetListByCategory() {
    const [petList, setPetList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GetPetList('Dogs');
    }, [])

    const GetPetList = async (category) => {
        setLoading(true);
        setPetList([]);
        const q = query(collection(db, 'Pets'), where('category', '==', category ? category : 'Dogs'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            console.log(doc.data());
            setPetList(petList => [...petList, doc.data()]);
        })

        setLoading(false);
    }

    return (
        <View>
            {/* Truyền callback để chọn danh mục */}
            <Category category={(value) => GetPetList(value)} />
            <FlatList
                data={petList}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginRight: 10 }}>
                        <PetListItem pet={item} />
                    </View>
                )}
                ListEmptyComponent={
                    !loading && (
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>
                            No pets found.
                        </Text>
                    )
                }
            />
        </View>
    );
}