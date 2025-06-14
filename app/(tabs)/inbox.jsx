import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { db } from '../../config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import UserItem from '../../components/Inbox/UserItem';

export default function Inbox() {
    const { user } = useUser();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        user && GetUserList();
    }, [user])

    const GetUserList = async () => {
        setLoading(true);
        setUserList([]);
        const q = query(collection(db, 'Chat'),
            where('userIds', 'array-contains', user?.primaryEmailAddress?.emailAddress));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            setUserList(prevList => [...prevList, doc.data()]);
        })

        setLoading(false);
    }

    const MapOtherUserList = () => {
        const list = [];
        const currentUserEmail = user?.primaryEmailAddress?.emailAddress; // Lưu email của user hiện tại

        userList.forEach((record) => {
            // Lọc ra user khác với user hiện tại
            const otherUser = record.users?.find(u => u.email !== currentUserEmail);

            if (otherUser) {
                list.push({
                    docId: record.id,
                    ...otherUser
                });
            }
        });

        return list;
    };

    return (
        <View style={{
            padding: 20,
            marginTop: 20
        }}>
            <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 30
            }}>Inbox</Text>

            <FlatList
                data={MapOtherUserList()}
                refreshing={loading}
                onRefresh={GetUserList}
                style={{
                    marginTop: 20
                }}
                renderItem={({ item, index }) => (
                    <UserItem userInfo={item} key={index} />
                )}
            />
        </View>
    )
}