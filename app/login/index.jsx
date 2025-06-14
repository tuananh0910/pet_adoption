import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import Colors from './../../constants/Colors'
import * as WebBrowser from 'expo-web-browser'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        void WebBrowser.warmUpAsync()
        return () => {
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

export default function LoginScreen() {

    useWarmUpBrowser()


    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const onPress = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/(tabs)/home'),
            });

            if (createdSessionId) {
                await setActive({ session: createdSessionId }); // Force cập nhật phiên đăng nhập
            }
        } catch (err) {
            console.error('OAuth error', err);
        }
    }, []);

    return (
        <View
            style={{
                paddingTop: 40,
                backgroundColor: Colors.white,
                height: '100%'
            }}
        >
            <Image
                source={require('./../../assets/images/login.png')}
                style={{
                    width: '100%',
                    height: 350,
                    marginTop: 10,
                }}
            />
            <View
                style={{ display: 'flex', alignItems: 'center', padding: 20, marginTop: 30 }}
            >
                <Text
                    style={{ textAlign: 'center', fontSize: 30, fontFamily: 'outfit-bold' }}
                >
                    Ready to make a new friend?
                </Text>
                <Text
                    style={{ textAlign: 'center', fontSize: 18, fontFamily: 'outfit', color: Colors.gray }}
                >
                    Let's adopt the pet which you like and make there life happy again
                </Text>

                <TouchableOpacity
                    style={{
                        width: '100%',
                        backgroundColor: Colors.primary,
                        borderRadius: 14,
                        marginTop: 170,
                        padding: 14
                    }}
                    onPress={onPress}
                >
                    <Text
                        style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 20,
                            textAlign: 'center'
                        }}
                    >
                        Get Started
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}