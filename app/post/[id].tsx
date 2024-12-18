import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

export default function PostDetails() {
  const { width } = useWindowDimensions();

  const { id } = useLocalSearchParams(); // Get the dynamic post ID
  const [post, setPost] = useState<{ title: { rendered: string }; content: { rendered: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://shams-almaarif.com/wp-json/wp/v2/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>در حال بارگذاری پست...</Text>
      </View>
    );
  }

  const source = {
    html: post ? post.content.rendered : "" // The HTML content from the WordPress API
  };
  return (
    <ScrollView style={styles.container}>
      {post && (
        <>
          <Text style={styles.title}>{post.title.rendered}</Text>
          <RenderHTML
            contentWidth={width}
            source={source}
            tagsStyles={{
              body: { color: "#1f2937", fontSize: 16 },
              h1: { color: "#000", fontSize: 22 },
              h2: { color: "#000", fontSize: 18 },
              p: { color: "#1f2937", fontSize: 16, lineHeight: 24 },
              a: { color: "#CD3837", textDecorationLine: "underline" }
            }}
          />
        </>
      )}
    </ScrollView>
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
    marginBottom: 20
  },
  loadingText: {
    marginTop: 10,
    color: "#1f2937",
    textAlign: "center"
  },
  content: {
    fontSize: 16,
    color: "#1f2937",
    textAlign: "right"
  }
});
