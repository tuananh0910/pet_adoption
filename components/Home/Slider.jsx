import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './../../config/FirebaseConfig'
import Colors from './../../constants/Colors'

export default function Slider() {
    const [sliderList, setSliderList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Quản lý vị trí hiện tại
    const flatListRef = useRef(null); // Tham chiếu đến FlatList
    const intervalRef = useRef(null); // Giữ tham chiếu đến interval

    useEffect(() => {
        GetSliders();
    }, []);

    useEffect(() => {
        if (sliderList.length > 0) {
            startAutoScroll(); // Bắt đầu tự động cuộn khi có dữ liệu
        }
        return () => stopAutoScroll(); // Dọn dẹp khi component unmount
    }, [sliderList]);

    const GetSliders = async () => {
        setSliderList([]);
        const snapshot = await getDocs(collection(db, 'Sliders'));
        const tempList = [];
        snapshot.forEach((doc) => {
            console.log(doc.data());
            tempList.push(doc.data());
        });
        setSliderList(tempList);
    };

    const startAutoScroll = () => {
        stopAutoScroll(); // Dừng interval trước đó nếu có
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % sliderList.length;
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
                return nextIndex;
            });
        }, 3000); // Tự động chuyển sau 3 giây
    };

    const stopAutoScroll = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const onScroll = (event) => {
        const slideWidth = Dimensions.get('screen').width * 0.9;
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
        setCurrentIndex(newIndex);
        startAutoScroll(); // Reset interval khi người dùng cuộn
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                style={{ borderRadius: 15 }}
                data={sliderList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                renderItem={({ item }) => (
                    <View>
                        <Image
                            source={{ uri: item?.imageUrl }}
                            style={styles.sliderList}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                onScroll={onScroll} // Lắng nghe sự kiện cuộn
            />

            {/* Hiển thị các chấm tròn */}
            <View style={styles.dotContainer}>
                {sliderList.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex ? styles.activeDot : null,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginTop: 15
    },
    sliderList: {
        width: Dimensions.get('screen').width * 0.9,
        height: 160,
        borderRadius: 15,
        marginRight: 1,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.white,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: Colors.primary, // Chấm sáng
    },
});
