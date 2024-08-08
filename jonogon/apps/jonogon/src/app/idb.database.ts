import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'Jonogon State';
const STORE_NAME = 'Jonogon_Store';

/**
 * IndexedDB storage to be used with persistState of Akita
 */
export class IdbStorage {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db: any) {
        db.createObjectStore(STORE_NAME);
      },
    });
  }

  async setItem(key: string, val: any): Promise<IDBValidKey> {
    const db = await this.dbPromise;
    return db.put(STORE_NAME, val, key);
  }

  async getItem(key: string): Promise<any> {
    const db = await this.dbPromise;
    return db.get(STORE_NAME, key);
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    return db.clear(STORE_NAME);
  }
}
