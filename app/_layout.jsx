import { Stack } from "expo-router";
import { useFonts } from "expo-font"
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '@/cache'
import { StatusBar } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
    'outfit-black': require('./../assets/fonts/Outfit-Black.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-light': require('./../assets/fonts/Outfit-Light.ttf'),
    'outfit-thin': require('./../assets/fonts/Outfit-Thin.ttf'),
  });

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!fontsLoaded) {
    return null; // Không render nếu font chưa load xong
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <StatusBar hidden={true} />
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)"
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen name="login/index"
            options={{
              headerShown: false
            }}
          />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
