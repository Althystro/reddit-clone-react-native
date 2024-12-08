import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPost, getAllPosts } from "../api/posts";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const Posts = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const {
    data: posts,
    isLoading,
    error,
    refetch: refetchPosts,
  } = useQuery({
    queryFn: getAllPosts,
    queryKey: ["posts"],
  });

  const postCreated = {
    title: newPostTitle,
    description: newPostDescription,
  };
  const { mutate } = useMutation({
    mutationFn: () => createPost(postCreated),
    mutationKey: [`post created`],
    onSuccess: () => {
      alert("hello");
      refetchPosts();
      setNewPostTitle("");
      setNewPostDescription("");
      console.log(postCreated);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error fetching posts</Text>
      </View>
    );
  }

  const filteredPosts = posts?.map((post) => (
    <TouchableOpacity
      key={post.id}
      onPress={() => navigation.navigate("Post Details", { post })}
    >
      <View style={styles.postContainer}>
        <Text style={styles.postId}>ID: {post.id}</Text>
        <Text style={styles.postTitle}>Title: {post.title}</Text>
        <Text style={styles.postDescription}>{post.description}</Text>
      </View>
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
        <AntDesign name="pluscircle" size={50} color="#007bff" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Ionicons name="close-circle" size={30} color="#dc3545" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Add New Post</Text>
            <TextInput
              placeholder="Enter Title"
              value={newPostTitle}
              onChangeText={(text) => setNewPostTitle(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter Description"
              value={newPostDescription}
              onChangeText={(text) => setNewPostDescription(text)}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                console.log("New Post:", {
                  title: newPostTitle,
                  description: newPostDescription,
                });
                toggleModal();
                mutate();
              }}
            >
              <Text style={styles.saveButtonText}>Save Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Posts List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredPosts}
      </ScrollView>
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 18,
    color: "#6c757d",
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
  },
  postContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6c757d",
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 5,
  },

  postDescription: { fontSize: 14, color: "#495057" },
  addButton: { position: "absolute", bottom: 20, right: 20, zIndex: 1 },

  // Modal overlay to center the modal and darken background
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    // backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    height: "50%",
    width: "100%",
    alignSelf: "center",
  },
  closeButton: { position: "absolute", top: -10, right: -10, zIndex: 1 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#343a40",
  },
  input: {
    backgroundColor: "#f1f3f4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontWeight: "600", fontSize: 16 },
});
