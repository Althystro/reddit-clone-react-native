import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Posts from "../components/Posts";
import PostDetails from "../components/PostDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const PostNav = () => {
  return (
    <Stack.Navigator initialRouteName="Posts">
      <Stack.Screen name="Posts" component={Posts} />
      <Stack.Screen name="Post Details" component={PostDetails} />
    </Stack.Navigator>
  );
};

export default PostNav;

const styles = StyleSheet.create({});
