import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealsList from "../screens/mealsList";
import WelcomeScreen from "../screens/welcomeScreen";
import { RootStackParamList } from "../types/RootStackParamList";
import MealDetailsScreen from "../screens/mealDetails";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MealsList"
          component={MealsList}
          options={{
            title: "",
            headerBackButtonDisplayMode: "minimal",
            headerTintColor: "#fe6b03",
          }}
        />
        <Stack.Screen
          name="MealDetails"
          component={MealDetailsScreen}
          options={{
            title: "",
            headerBackButtonDisplayMode: "minimal",
            headerTintColor: "#fe6b03",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
