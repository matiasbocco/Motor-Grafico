import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Montserrat_500Medium } from "@expo-google-fonts/montserrat";
import { BowlbyOneSC_400Regular } from "@expo-google-fonts/bowlby-one-sc";
import { NavigationContainer } from "@react-navigation/native";
import { HomeStack } from "./navigation/Stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";

export default function App() {
  // Estado para controlar si las fuentes están cargadas
  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    BowlbyOneSC_400Regular,
  });

  const [isReady, setIsReady] = useState(false); // Estado adicional para manejar la visibilidad de la splash screen

  // Preparar y ocultar la splash screen
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync(); // Evita que la splash screen se oculte automáticamente
      if (fontsLoaded) {
        setIsReady(true); // Cuando las fuentes están listas, podemos ocultar la splash screen
        await SplashScreen.hideAsync(); // Oculta la splash screen
      }
    };
    prepare();
  }, [fontsLoaded]);

  if (!isReady) {
    return null; // No renderizamos nada hasta que las fuentes estén listas y la splash screen se oculte
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
          <HomeStack />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
