import { ScrollView, StyleSheet, Image, View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Meal } from "../types/Meal";
import { useEffect, useState } from "react";
import axios from "axios";

function MealDetailsScreen({ route }: { route: any }) {
  const { mealId } = route.params;

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => {
        const mealData =
          response.data.meals && response.data.meals.length > 0
            ? response.data.meals[0]
            : null;
        setMeal(mealData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch meal details");
        setLoading(false);
      });
  }, [mealId]);

  // Helper to extract ingredients
  const getIngredients = (meal: Meal) => {
    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof Meal];
      const measure = meal[`strMeasure${i}` as keyof Meal];

      if (ingredient && ingredient.trim()) {
        ingredients.push(
          `${measure?.trim() ?? ""} ${ingredient.trim()}`.trim()
        );
      }
    }

    return ingredients;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating color="#fe6b03" />
        <Text>Loading meal details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.center}>
        <Text>No meal details found.</Text>
      </View>
    );
  }

  const ingredients = getIngredients(meal);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      <Text variant="headlineMedium" style={styles.title}>
        {meal.strMeal}
      </Text>
      <Text style={styles.subtitle}>
        {meal.strCategory} | {meal.strArea}
      </Text>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Ingredients:
      </Text>
      {ingredients.map((item, index) => (
        <Text key={index} style={styles.ingredient}>
          • {item}
        </Text>
      ))}

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Instructions:
      </Text>
      <Text style={styles.instructions}>{meal.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    backgroundColor: "white",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 16,
    textAlign: "center",
    color: "#888",
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  ingredient: {
    marginBottom: 4,
    fontSize: 15,
  },
  instructions: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 40,
  },
});

export default MealDetailsScreen;
