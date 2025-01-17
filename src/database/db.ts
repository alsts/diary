import * as SQLite from 'expo-sqlite';
import { DiaryEntry } from '../redux/entriesSlice';

const db = SQLite.openDatabase('diary.db');

export const initDatabase = () => {
	return new Promise<void>((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS entries (
          id TEXT PRIMARY KEY NOT NULL,
          date TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          imageUri TEXT
        )`,
				[],
				() => resolve(),
				(_, error) => {
					reject(error);
					return false;
				}
			);
		});
	});
};

export const saveEntry = (entry: DiaryEntry) => {
	return new Promise<void>((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`INSERT OR REPLACE INTO entries (id, date, content, category, imageUri)
         VALUES (?, ?, ?, ?, ?)`,
				[entry.id, entry.date, entry.content, entry.category, entry.imageUri],
				() => resolve(),
				(_, error) => {
					reject(error);
					return false;
				}
			);
		});
	});
};

export const deleteEntryFromDb = (id: string) => {
	return new Promise<void>((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				'DELETE FROM entries WHERE id = ?',
				[id],
				() => resolve(),
				(_, error) => {
					reject(error);
					return false;
				}
			);
		});
	});
};

export const loadEntries = () => {
	return new Promise<DiaryEntry[]>((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				'SELECT * FROM entries ORDER BY date DESC',
				[],
				(_, { rows: { _array } }) => resolve(_array as DiaryEntry[]),
				(_, error) => {
					reject(error);
					return false;
				}
			);
		});
	});
}; 