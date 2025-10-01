import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ops!</Text>
      <Text style={styles.text}>Aún estamos trabajando</Text>

      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg",
        }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
});


