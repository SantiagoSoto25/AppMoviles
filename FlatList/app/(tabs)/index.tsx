import React, { useEffect, useState } from "react";
import {
  Alert, FlatList, KeyboardAvoidingView, Platform,
  SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface Task { id: string; text: string; completed: boolean; }

const INPUT_BAR_HEIGHT = 60;

export default function App() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"todas" | "activas" | "completadas">("todas");
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => { (async () => {
    const stored = await AsyncStorage.getItem("@tasks");
    if (stored) setTasks(JSON.parse(stored) as Task[]);
  })(); }, []);

  useEffect(() => { AsyncStorage.setItem("@tasks", JSON.stringify(tasks)); }, [tasks]);

  const addTask = () => {
    const t = task.trim();
    if (!t) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text: t, completed: false }]);
    setTask("");
  };

  const toggleTask = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const deleteTask = (id: string) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const filtered = tasks.filter(t =>
    filter === "activas" ? !t.completed : filter === "completadas" ? t.completed : true
  );

  const completedCount = tasks.filter(t => t.completed).length;

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      onPress={() => toggleTask(item.id)}
      onLongPress={() =>
        Alert.alert("Eliminar tarea", "¿Seguro?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", onPress: () => deleteTask(item.id) },
        ])
      }
      style={[styles(isDark).card, item.completed && styles(isDark).cardCompleted]}
    >
      <View style={styles(isDark).cardContent}>
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.completed ? "#4A90E2" : isDark ? "#666" : "#aaa"}
        />
        <Text style={[styles(isDark).cardText, item.completed && styles(isDark).cardTextCompleted]}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles(isDark).container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        {/* Header */}
        <Text style={styles(isDark).title}>Tareas</Text>

        {/* Filtros + toggle tema */}
        <View style={styles(isDark).filters}>
          {[
            { key: "todas", label: "Todas" },
            { key: "activas", label: "Activas" },
            { key: "completadas", label: "Completadas" },
          ].map(f => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key as any)}
              style={[styles(isDark).filterBtn, filter === f.key && styles(isDark).filterBtnActive]}
            >
              <Text style={[styles(isDark).filterText, filter === f.key && styles(isDark).filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setIsDark(v => !v)} style={styles(isDark).filterBtn}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={20} color={isDark ? "#FFD700" : "#4A90E2"} />
          </TouchableOpacity>
        </View>

        <Text style={styles(isDark).counter}>
          Total: {tasks.length} | Completadas: {completedCount}
        </Text>

        {/* Contenido + barra de input al final (no absoluta) */}
        <View style={{ flex: 1 }}>
          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: INPUT_BAR_HEIGHT + 20 }}
          />

          {/* Barra de input SIEMPRE visible y movible con el teclado */}
          <View style={styles(isDark).inputContainer}>
            <TextInput
              style={styles(isDark).input}
              placeholder="Nueva tarea..."
              placeholderTextColor={isDark ? "#aaa" : "#888"}
              value={task}
              onChangeText={setTask}
              returnKeyType="done"
              onSubmitEditing={addTask}
            />
            <TouchableOpacity style={styles(isDark).fab} onPress={addTask}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? "#121212" : "#fff", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10, color: "#4A90E2" },

  filters: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 10 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: isDark ? "#222" : "#f0f0f0", marginHorizontal: 4 },
  filterBtnActive: { backgroundColor: "#4A90E2" },
  filterText: { color: isDark ? "#ddd" : "#555", fontWeight: "500" },
  filterTextActive: { color: "#fff" },

  counter: { textAlign: "center", marginVertical: 8, color: isDark ? "#aaa" : "#777" },

  card: {
    flexDirection: "row", alignItems: "center", padding: 15, marginVertical: 6,
    backgroundColor: isDark ? "#1e1e1e" : "#fff", borderRadius: 12,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardCompleted: { backgroundColor: isDark ? "#2c2c2c" : "#f7f7f7" },
  cardContent: { flexDirection: "row", alignItems: "center" },
  cardText: { marginLeft: 10, fontSize: 16, color: isDark ? "#eee" : "#333" },
  cardTextCompleted: { textDecorationLine: "line-through", color: "#aaa" },

  inputContainer: {
    height: INPUT_BAR_HEIGHT, flexDirection: "row", alignItems: "center",
    paddingTop: 6,
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: isDark ? "#333" : "#ddd",
    padding: 12, borderRadius: 30, paddingLeft: 20,
    backgroundColor: isDark ? "#1c1c1c" : "#fafafa", color: isDark ? "#fff" : "#000",
  },
  fab: {
    marginLeft: 10, backgroundColor: "#4A90E2", width: 55, height: 55, borderRadius: 30,
    justifyContent: "center", alignItems: "center", shadowColor: "#000",
    shadowOpacity: 0.2, shadowRadius: 5, elevation: 4,
  },
});
