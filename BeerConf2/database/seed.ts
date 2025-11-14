import { getDb } from './conferences.db';

export const seedIfEmpty = () => {
  const db = getDb();

  db.transaction((tx: { executeSql: (arg0: string, arg1: string[], arg2: ((_: any, result: any) => void) | undefined) => void; }) => {
    tx.executeSql('SELECT COUNT(*) as count FROM conferences', [], (_, result) => {
      // @ts-ignore
      const count = result.rows._array[0].count;
      if (count === 0) {
        const data = [
          ['Lúpulos Patagónicos', 'Juan Pérez', '12:00', '13:00', 'hop.png'],
          ['Agua y Minerales', 'Laura Gómez', '13:00', '14:00', 'water.png'],
          ['Recetas de Ales', 'Marcelo Díaz', '14:00', '15:00', 'beer.png'],
          ['Fermentación 101', 'Ana Ríos', '15:00', '16:00', 'beer.png'],
          ['Control de Calidad', 'Diego Luna', '16:00', '17:00', 'hop.png'],
          ['Malteado y Perfil', 'Carla Soto', '17:00', '18:00', 'water.png'],
          ['Lúpulos en Latinoamérica', 'Pablo Ruiz', '18:00', '19:00', 'hop.png'],
          ['Packaging Creativo', 'Sofía Herrera', '19:00', '20:00', 'beer.png'],
          ['Marketing Cervecero', 'Gonzalo Rey', '20:00', '21:00', 'water.png'],
          ['Sostenibilidad', 'María Paz', '21:00', '22:00', 'hop.png']
        ];

        data.forEach(([title, speaker, start, end, image]) => {
          tx.executeSql(
            'INSERT INTO conferences (title, speaker, start, end, image) VALUES (?, ?, ?, ?, ?)',
            [title, speaker, start, end, image]
          );
        });
      }
    });
  }, (err: any) => {
    console.error('seed tx error', err);
  });
};