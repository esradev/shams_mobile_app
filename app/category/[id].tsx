import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";

export default function Index() {
  const { id } = useLocalSearchParams();
  const [posts, setPosts] = useState<{ id: number; title: { rendered: string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://shams-almaarif.com/wp-json/wp/v2/posts?categories=${id}&per_page=100`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>در حال بارگذاری پست‌ها...</Text>
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPostsText}>پستی در این دسته‌بندی یافت نشد.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>پست‌های این دسته‌بندی</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }: { item: { id: number; title: { rendered: string } } }) => (
          <TouchableOpacity style={styles.postItem}>
            <Link
              style={styles.postLink}
              href={`/post/${item.id}`} // Navigate to the post detail page
            >
              {item.title.rendered}
            </Link>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.postList}
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
  noPostsText: {
    fontSize: 18,
    color: "#1f2937",
    textAlign: "center"
  },
  postList: {
    alignItems: "flex-end"
  },
  postItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: "100%"
  },
  postLink: {
    fontSize: 18,
    color: "#1f2937",
    textAlign: "right"
  }
});
