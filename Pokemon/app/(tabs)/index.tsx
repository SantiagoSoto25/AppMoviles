import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";

//const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=50";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchPokemon = async () => {
    try {
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Network error");

      const json = await res.json();
      setData(json.results);
    } catch (err) {
      setError("Error de red. Deslizá para reintentar.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPokemon();
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E3350D" />
        <Text style={styles.loadingText}>Cargando Pokémon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* TÍTULO */}
      <Text style={styles.title}>Pokédex</Text>

      {/* BUSCADOR */}
      <View style={styles.searchBox}>
        <Image
          style={styles.searchIcon}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2811/2811806.png",
          }}
        />
        <TextInput
          placeholder="Buscar Pokémon..."
          placeholderTextColor="#666"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          underlineColorAndroid="transparent" 
          />
      </View>

      {/* ERROR */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* SIN RESULTADOS */}
      {filteredData.length === 0 && !loading && (
        <Text style={styles.noResults}>No hay resultados para “{search}”.</Text>
      )}

      {/* LISTA */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.name}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              style={styles.pokemonImage}
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                  item.url.split("/")[6]
                }.png`,
              }}
            />
            <Text style={styles.pokemonName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDE00",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFDE00",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#E3350D",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E3350D",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
    marginBottom: 15,
  },

  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#333",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E3350D",
    elevation: 3,
  },

  pokemonImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },

  pokemonName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c2c2c",
    textTransform: "capitalize",
  },

  errorBox: {
    backgroundColor: "#ffb3b3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  errorText: {
    color: "#a10000",
    fontWeight: "bold",
    textAlign: "center",
  },

  noResults: {
    textAlign: "center",
    color: "#333",
    marginVertical: 20,
    fontSize: 16,
  },
});


