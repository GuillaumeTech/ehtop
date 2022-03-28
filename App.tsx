import "reflect-metadata";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import "react-native-get-random-values";
import { StorageContextProvider } from "./components/contexts/StorageContext";
import { NativeBaseProvider, extendTheme } from "native-base";
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const theme = extendTheme({
    colors: {
      // Add new color

      light: {
        400: "#FFFDF9",
      },
      purple: {
        400: "#231139",
      },

      accent: {
        300: "#1BDE7A",
        400: "#1BDE7A",
        500: "#1BDE7A",
        600: "#1BDE7A",
        700: "#1BDE7A",
      },
    },
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider theme={theme}>
          <StorageContextProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </StorageContextProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
