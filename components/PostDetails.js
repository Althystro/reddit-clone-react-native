import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addCommentToPost,
  deletePostById,
  getPostById,
  deleteCommentFromPost,
} from "../api/posts";
import { useNavigation } from "@react-navigation/native";

const PostDetails = ({ route }) => {
  const { post } = route.params;
  const postId = post.id;
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryFn: () => getPostById(postId),
    queryKey: ["post by id", postId],
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: () => deletePostById(postId),
    mutationKey: [`post delete`],
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const addedComment = {
    username: username,
    comment: newComment,
  };

  const { mutate: addComment } = useMutation({
    mutationFn: () => addCommentToPost(postId, addedComment),
    mutationKey: [`Comment added`],
    onSuccess: () => {
      refetch();
      setNewComment("");
      setUsername("");
      toggleModal();
    },
  });

  //   const commentId = data?.map((post) => {
  //     return post.comments;
  //   });

  console.log(data);
  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId) => deleteCommentFromPost(commentId),
    mutationKey: [`comment delete`],
    onSuccess: () => {
      refetch();
      alert("hi");
    },
  });

  //   const { mutate: deleteComment } = useMutation({
  //     mutationFn: () => deletePostById(post.comment.id),
  //     mutationKey: [`post delete`],
  //     onSuccess: () => {
  //       navigation.goBack();
  //     },
  //   });

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
        <Text style={styles.errorText}>Error fetching post details</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Title: {data?.title}</Text>
        <Text style={styles.description}>Description: {data?.description}</Text>
        <Text style={styles.commentsTitle}>Comments:</Text>

        <FlatList
          data={data?.comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={styles.commentUsername}>{item.username}:</Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteComment(item.id)}
                  style={styles.deleteCommentButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noComments}>No comments yet</Text>
          }
        />

        <TouchableOpacity
          onPress={toggleModal}
          style={[styles.button, styles.addButton]}
        >
          <Text style={styles.buttonText}>Add Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={deletePost}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Delete Post</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Add a Comment</Text>
            <TextInput
              placeholder="Enter your username"
              value={username}
              onChangeText={(text) => setUsername(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter your comment"
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
            <TouchableOpacity
              onPress={() => addComment()}
              style={[styles.button, styles.saveButton]}
            >
              <Text style={styles.buttonText}>Save Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 10,
  },
  description: { fontSize: 16, color: "#495057", marginBottom: 10 },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 10,
  },
  commentItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f1f3f4",
  },
  commentUsername: { fontWeight: "bold", color: "#007bff" },
  commentText: { color: "#495057" },
  noComments: { fontStyle: "italic", color: "#6c757d" },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: { backgroundColor: "#007bff" },
  deleteButton: { backgroundColor: "#dc3545" },
  deleteCommentButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: { color: "white", fontWeight: "600" },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    width: "80%",
  },
  closeButton: { position: "absolute", top: 10, right: 10, zIndex: 1 },
  closeButtonText: { fontSize: 18, fontWeight: "bold", color: "#dc3545" },
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
  saveButton: { backgroundColor: "#007bff" },
});
