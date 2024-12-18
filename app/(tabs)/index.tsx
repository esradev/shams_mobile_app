import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://shams-almaarif.com/wp-json/wp/v2/categories?per_page=100");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>در حال بارگذاری...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>دسته‌بندی‌ها</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem}>
            <Link href={`/category/${item.id}`} style={styles.categoryLink}>
              {item.name}
            </Link>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
    direction: "rtl"
  },
  title: {
    fontSize: 24,
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center"
  },
  loadingText: {
    marginTop: 10,
    color: "#1f2937",
    textAlign: "center"
  },
  categoryList: {
    alignItems: "flex-end"
  },
  categoryItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: "100%"
  },
  categoryLink: {
    fontSize: 18,
    color: "#1f2937",
    textAlign: "right"
  }
});
