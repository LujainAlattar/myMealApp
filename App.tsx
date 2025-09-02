import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/router/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
