import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

// Inicializa la base de datos
export const initDatabase = async () => {
  if (db) return;

  db = await SQLite.openDatabaseAsync("conferences.db");

  // Crear tabla
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS conferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      speaker TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT
    );
  `);
};

// Devuelve la conexión ya inicializada
export const getDb = () => {
  if (!db) throw new Error("Database has not been initialized. Call initDatabase() first.");
  return db;
};

// Insertar conferencia
export const addConference = async (title: string, speaker: string, date: string, description: string) => {
  const database = getDb();
  await database.runAsync(
    `INSERT INTO conferences (title, speaker, date, description) VALUES (?, ?, ?, ?)`,
    [title, speaker, date, description]
  );
};

// Obtener todas las conferencias
export const getConferences = async () => {
  const database = getDb();
  return await database.getAllAsync(`SELECT * FROM conferences ORDER BY date ASC`);
};
