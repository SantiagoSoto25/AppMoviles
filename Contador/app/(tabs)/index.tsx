import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function App() {
  const [count, setCount] = useState(0);
  const [dark, setDark] = useState(false);
  const [message, setMessage] = useState("");

  const styles = getStyles(dark);

  const handleIncrement = () => {
    if (count < 100) {
      const newCount = count + 1;
      setCount(newCount);
      checkMilestone(newCount);
    }
  };

  const handleDecrement = () => {
    if (count > -100) {
      const newCount = count - 1;
      setCount(newCount);
      checkMilestone(newCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setMessage("");
  };

  const checkMilestone = (value: number) => {
    if (value % 10 === 0 && value !== 0) {
      setMessage(`¡Llegaste a ${value}!`);
    } else {
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con Toggle de Tema */}
      <View style={styles.header}>
        <Pressable onPress={() => setDark(!dark)}>
          <Text style={styles.themeToggle}>{dark ? "🌙" : "☀️"}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.counter}>{count}</Text>

        {/* Botones en fila */}
        <View style={styles.buttonRow}>
          {/* Botón -1 */}
          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonLeft, pressed && styles.buttonPressed]}
            onPress={handleDecrement}
            disabled={count <= -100}
          >
            <Text style={styles.buttonText}>-1</Text>
          </Pressable>

          {/* Botón Reset */}
          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonCenter, pressed && styles.buttonPressed]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>🔄 Reset</Text>
          </Pressable>

          {/* Botón +1 */}
          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonRight, pressed && styles.buttonPressed]}
            onPress={handleIncrement}
            disabled={count >= 100}
          >
            <Text style={styles.buttonText}>+1</Text>
          </Pressable>
        </View>

        {/* Avisos */}
        {message !== "" && <Text style={styles.info}>{message}</Text>}
        {count >= 100 && <Text style={styles.warning}>¡Máximo alcanzado (100)!</Text>}
        {count <= -100 && <Text style={styles.warning}>¡Mínimo alcanzado (-100)!</Text>}
      </View>
    </View>
  );
}

const getStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? "#121212" : "#f5f5f5",
    },
    header: {
      marginTop: 40,
      marginRight: 20,
      alignItems: "flex-end",
    },
    themeToggle: {
      fontSize: 28,
    },
    card: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      borderRadius: 12,
      backgroundColor: dark ? "#1e1e1e" : "#fff",
      marginHorizontal: 20,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    counter: {
      fontSize: 64,
      fontWeight: "bold",
      color: dark ? "#ffffff" : "#000000",
      marginBottom: 20,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginVertical: 10,
    },
    button: {
      flex: 1,
      paddingVertical: 15,
      marginHorizontal: 5,
      borderRadius: 25,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonLeft: {
      backgroundColor: "#FF6B6B", // rojo
    },
    buttonCenter: {
      backgroundColor: "#FFD93D", // amarillo
    },
    buttonRight: {
      backgroundColor: "#4ECDC4", // turquesa
    },
    buttonPressed: {
      opacity: 0.7,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
    },
    info: {
      marginTop: 10,
      color: dark ? "#00c3ff" : "#007AFF",
      fontWeight: "600",
    },
    warning: {
      marginTop: 10,
      color: "red",
      fontWeight: "600",
    },
  });
