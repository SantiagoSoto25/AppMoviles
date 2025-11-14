import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { initDatabase } from '@/database/conferences.db';
import { seedIfEmpty } from '@/database/seed';
import { getDb } from '@/database/conferences.db';

type Conference = {
  id: number;
  title: string;
  speaker: string;
  start: string;
  end: string;
  image: string;
};

const imageMap: Record<string, any> = {
  'hop.png': require('../assets/img/hop.png'),
  'water.png': require('../assets/img/water.png'),
  'beer.png': require('../assets/img/beer.png')
};

export default function Home() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const router = useRouter();

  useEffect(() => {
    const db = initDatabase();
    seedIfEmpty();

    // small delay to make sure seed finishes (seed uses same tx, usually OK)
    const t = setTimeout(() => {
      try {
        const dbRef = getDb();
        dbRef.transaction((tx: { executeSql: (arg0: string, arg1: never[], arg2: (_: any, result: any) => void) => void; }) => {
          tx.executeSql('SELECT * FROM conferences ORDER BY id LIMIT 10', [], (_: any, result: { rows: { _array: React.SetStateAction<Conference[]>; }; }) => {
            // @ts-ignore
            setConferences(result.rows._array);
          });
        });
      } catch (err) {
        console.error(err);
      }
    }, 200);

    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={conferences}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
          >
            <Image source={imageMap[item.image] ?? imageMap['beer.png']} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.speaker}>{item.speaker}</Text>
            <Text style={styles.time}>{item.start} - {item.end}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f7f1e3',
    alignItems: 'center'
  },
  image: { width: '100%', height: 100, borderRadius: 8, resizeMode: 'cover' },
  title: { marginTop: 8, fontWeight: '700' },
  speaker: { color: '#444' },
  time: { marginTop: 6, color: '#666' }
});