import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getDb, initDatabase } from '../database/conferences.db';

const imageMap: Record<string, any> = {
  'hop.png': require('../assets/img/hop.png'),
  'water.png': require('../assets/img/water.png'),
  'beer.png': require('../assets/img/beer.png')
};

export default function Detail() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    initDatabase();
    try {
      const db = getDb();
      db.transaction((tx: { executeSql: (arg0: string, arg1: number[], arg2: (_: any, result: { rows: { _array: any; }; }) => void) => void; }) => {
        tx.executeSql('SELECT * FROM conferences WHERE id = ?', [Number(id)], (_: any, result: { rows: { _array: any; }; }) => {
          // @ts-ignore
          const rows = result.rows._array;
          if (rows.length) setItem(rows[0]);
        });
      });
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  if (!item) return <View style={styles.center}><Text>Cargando...</Text></View>;

  return (
    <View style={styles.container}>
      <Image source={imageMap[item.image] ?? imageMap['beer.png']} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.speaker}>{item.speaker}</Text>
      <Text style={styles.time}>{item.start} - {item.end}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 240, borderRadius: 12 },
  title: { marginTop: 12, fontSize: 20, fontWeight: '700' },
  speaker: { marginTop: 6, fontSize: 16 },
  time: { marginTop: 8, color: '#666' }
});