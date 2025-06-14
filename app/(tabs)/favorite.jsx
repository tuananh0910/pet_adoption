import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Shared from './../../Shared/Shared'
import { useUser } from '@clerk/clerk-expo'
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import PetListItem from './../../components/Home/PetListItem'

export default function Favorite() {

    const { user } = useUser();
    const [favIds, setFavIds] = useState([]);
    const [favPetList, setFavPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        user && GetFavPetIds();
    }, [user])

    // Fav Ids
    const GetFavPetIds = async () => {
        setLoader(true);
        const result = await Shared.GetFavList(user);
        setFavIds(result?.favorites);
        setLoader(false);

        GetFavPetList(result?.favorites);
    }

    // Fetch Related Pet List
    const GetFavPetList = async (favIds_) => {
        setLoader(true);
        setFavPetList([]);
        const q = query(collection(db, 'Pets'), where('id', 'in', favIds_));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            setFavPetList(prev => [...prev, doc.data()])
        })
        setLoader(false);
    }

    return (
        <View style={{ padding: 20, marginTop: 20 }}>
            <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 30
            }}>Favorites</Text>

            <FlatList
                data={favPetList}
                numColumns={2}
                onRefresh={GetFavPetIds}
                refreshing={loader}
                columnWrapperStyle={{ justifyContent: 'center', marginBottom: 20, gap: 20 }}
                renderItem={({ item, index }) => (
                    <PetListItem pet={item} />
                )}
                keyExtractor={(item, index) => index.toString()}
            />

        </View>
    )
}