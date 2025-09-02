import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text, Card } from "react-native-paper";
import { Meal } from "../types/Meal";
import { useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "../types/RootStackParamList";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

type MealCardProps = {
  meal: Meal;
};

function MealCard({ meal }: MealCardProps) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "MealDetails">
    >();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("MealDetails", { mealId: meal.idMeal })
      }
    >
      <Card style={styles.card}>
        <Card.Cover style={styles.cover} source={{ uri: meal.strMealThumb }} />
        <Card.Content>
          <Text variant="titleMedium" style={styles.title}>
            {meal.strMeal}
          </Text>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  cover: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    marginVertical: 8,
  },
});

export default MealCard;
