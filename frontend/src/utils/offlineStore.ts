import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PolarisDB extends DBSchema {
  cached_expeditions: {
    key: string;
    value: any;
  };
  outbox_submissions: {
    key: string;
    value: {
      id: string;
      entityType: 'expedition_log' | 'sensor_entry';
      payload: any;
      timestamp: number;
      status: 'QUEUED' | 'SYNCING' | 'FAILED';
      retries: number;
    };
    indexes: { 'by-status': string };
  };
}

let dbPromise: Promise<IDBPDatabase<PolarisDB>>;

if (typeof window !== 'undefined') {
  dbPromise = openDB<PolarisDB>('polaris_field_db', 1, {
    upgrade(db) {
      db.createObjectStore('cached_expeditions');
      const outbox = db.createObjectStore('outbox_submissions', { keyPath: 'id' });
      outbox.createIndex('by-status', 'status');
    },
  });
}

export async function saveToOutbox(entityType: 'expedition_log' | 'sensor_entry', payload: any) {
  const db = await dbPromise;
  const id = crypto.randomUUID();
  await db.add('outbox_submissions', {
    id,
    entityType,
    payload,
    timestamp: Date.now(),
    status: 'QUEUED',
    retries: 0,
  });
  return id;
}

export async function getPendingOutboxItems() {
  const db = await dbPromise;
  return db.getAllFromIndex('outbox_submissions', 'by-status', 'QUEUED');
}

export async function updateOutboxItemStatus(id: string, status: 'QUEUED' | 'SYNCING' | 'FAILED') {
  const db = await dbPromise;
  const item = await db.get('outbox_submissions', id);
  if (item) {
    item.status = status;
    await db.put('outbox_submissions', item);
  }
}

export async function removeFromOutbox(id: string) {
  const db = await dbPromise;
  await db.delete('outbox_submissions', id);
}

export async function syncOutbox() {
  const pending = await getPendingOutboxItems();
  for (const item of pending) {
    await updateOutboxItemStatus(item.id, 'SYNCING');
    try {
      let url = '';
      if (item.entityType === 'expedition_log') url = '/api/expeditions/logs';
      else if (item.entityType === 'sensor_entry') url = '/api/sensors/logs';

      if (!url) continue;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload)
      });
      if (res.ok) {
        await removeFromOutbox(item.id);
      } else {
        await updateOutboxItemStatus(item.id, 'FAILED');
      }
    } catch (e) {
      await updateOutboxItemStatus(item.id, 'QUEUED');
    }
  }
}
