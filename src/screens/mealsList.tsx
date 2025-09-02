import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import MealCard from "../components/mealCard";
import { Meal } from "../types/Meal";

function MealsList() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Refs for debouncing and request cancellation
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const cancelTokenSource = useRef<any>(null);

  // Function to fetch default meals
  const fetchDefaultMeals = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php?f=a"
      );
      const mealsArr = response.data.meals || [];
      mealsArr.sort((a: Meal, b: Meal) => a.strMeal.localeCompare(b.strMeal));
      setMeals(mealsArr);
      setError(null);
    } catch (err) {
      setError("Failed to fetch meals");
    }
  }, []);

  useEffect(() => {
    // Load default meals (starting with 'a') on component mount
    fetchDefaultMeals().then(() => setLoading(false));
  }, [fetchDefaultMeals]);

  // Cleanup function to clear timers and cancel requests
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Component unmounted");
      }
    };
  }, []);

  // Handle search functionality with debouncing
  const performSearch = useCallback(async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    // Cancel previous request if exists
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel("New search initiated");
    }

    // Create new cancel token
    cancelTokenSource.current = axios.CancelToken.source();

    setSearchLoading(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
        { cancelToken: cancelTokenSource.current.token }
      );
      const searchMeals = response.data.meals || [];
      searchMeals.sort((a: Meal, b: Meal) =>
        a.strMeal.localeCompare(b.strMeal)
      );
      setSearchResults(searchMeals);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Search failed:", err);
        setSearchResults([]);
      }
    }
    setSearchLoading(false);
  }, []);

  const handleSearchInput = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Clear existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // If query is empty, immediately clear results
      if (query.trim() === "") {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      // Set loading state immediately for better UX
      setSearchLoading(true);

      // Debounce the search - wait 300ms after user stops typing
      debounceTimer.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    },
    [performSearch]
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Clear search if active
    if (searchQuery.trim() !== "") {
      setSearchQuery("");
      setSearchResults([]);
    }

    // Fetch fresh default meals
    await fetchDefaultMeals();
    setRefreshing(false);
  }, [searchQuery, fetchDefaultMeals]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Determine which meals to display
  const displayMeals = searchQuery.trim() !== "" ? searchResults : meals;
  const isSearching = searchQuery.trim() !== "";

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for meals..."
          value={searchQuery}
          onChangeText={handleSearchInput}
          clearButtonMode="while-editing"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {searchLoading && (
        <View style={styles.searchLoadingContainer}>
          <Text>Searching...</Text>
        </View>
      )}

      {isSearching && searchResults.length === 0 && !searchLoading && (
        <View style={styles.noResultsContainer}>
          <Text>No meals found for "{searchQuery}"</Text>
        </View>
      )}

      <FlatList
        data={displayMeals}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.idMeal ?? index.toString()}
        renderItem={({ item }: { item: Meal }) => <MealCard meal={item} />}
        style={styles.flatList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fe6b03"]} // this is for Android
            tintColor="#fe6b03" // this is for iOS
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    margin: 16,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  searchLoadingContainer: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  flatList: {
    flex: 1,
    width: "100%",
  },
});

export default MealsList;
