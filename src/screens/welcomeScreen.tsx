import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/RootStackParamList";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to MyMeals 🍽️
      </Text>
      <Image
        source={require("../assets/app-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text variant="bodyMedium" style={styles.subtitle}>
        Discover delicious recipes, plan your meals, and get inspired to cook
        something new every day!
      </Text>

      <Button
        mode="contained"
        onPress={() => {
          console.log("Navigating to MealsList");
          navigation.navigate("MealsList");
        }}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Get Started
      </Button>
      <Text style={styles.footer}>No account needed — just explore!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  logo: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    marginBottom: 32,
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 12,
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#fe6b03",
    borderRadius: 50,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 24,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});

export default WelcomeScreen;
