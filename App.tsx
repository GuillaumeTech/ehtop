import "reflect-metadata";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import "react-native-get-random-values";
import { StorageContextProvider } from "./components/contexts/StorageContext";
import { NativeBaseProvider } from "native-base";
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider>
          <StorageContextProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </StorageContextProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
