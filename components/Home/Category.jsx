import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import Colors from '../../constants/Colors';

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Dogs');
    const [animationValue] = useState(new Animated.Value(1)); // Giá trị ban đầu cho hiệu ứng

    useEffect(() => {
        GetCategories();
    }, []);

    useEffect(() => {
        // Kích hoạt hiệu ứng khi selectedCategory thay đổi
        Animated.timing(animationValue, {
            toValue: 1.1, // Kích thước to hơn khi chọn
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            // Sau khi to lên thì quay về bình thường
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        });
    }, [selectedCategory]);

    // Dùng để lấy danh sách category từ DB
    const GetCategories = async () => {
        setCategoryList([]);
        const snapshot = await getDocs(collection(db, 'Category'));
        snapshot.forEach((doc) => {
            setCategoryList(categoryList => [...categoryList, doc.data()]);
        });
    };

    console.log(categoryList);

    return (
        <View style={{ marginTop: 20 }}>
            <Text
                style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 20
                }}
            >Category</Text>

            <FlatList
                data={categoryList}
                numColumns={4}
                renderItem={({ item }) => {
                    const isSelected = selectedCategory === item.name;

                    // Hiệu ứng thay đổi kích thước ảnh và text
                    const scale = isSelected ? animationValue : 1;

                    return (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedCategory(item.name);
                                category(item.name)
                            }}
                            style={{ flex: 1 }}
                        >
                            <View style={styles.container}>
                                <Animated.View
                                    style={[
                                        styles.imageWrapper,
                                        { transform: [{ scale }] } // Áp dụng scale
                                    ]}
                                >
                                    <Image
                                        source={{ uri: item?.imageUrl }}
                                        style={[
                                            styles.imageItems,
                                            isSelected && styles.seletedCategoryItem,
                                        ]}
                                    />
                                    {!isSelected && <View style={styles.overlay} />}
                                </Animated.View>
                                <Animated.Text
                                    style={[
                                        styles.textName,
                                        isSelected && styles.seletedCategoryName,
                                        {
                                            fontSize: isSelected ? scale.interpolate({
                                                inputRange: [1, 1.2],
                                                outputRange: [14, 18]
                                            }) : 14
                                        } // Thay đổi kích thước chữ
                                    ]}
                                >
                                    {item?.name}
                                </Animated.Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 15,
        alignItems: 'center',
    },
    imageWrapper: {
        position: 'relative',
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageItems: {
        width: 70,
        height: 70,
        borderRadius: 15,
        borderColor: Colors.primary,
        borderWidth: 1,
    },
    seletedCategoryItem: {
        width: 85,
        height: 85,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Lớp phủ tối
        borderRadius: 15, // Cùng bán kính với ảnh
    },
    textName: {
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.gray,
    },
    seletedCategoryName: {
        marginTop: 12,
        textAlign: 'center',
        fontFamily: 'outfit',
        color: Colors.primary,
    },
});
