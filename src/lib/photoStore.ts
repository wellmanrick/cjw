export interface StoredPhoto {
  id: string;
  blob: Blob;
  createdAt: number;
}

const DB_NAME = 'cjw-toddler';
const DB_VERSION = 1;
const STORE = 'photos';
const MAX_DIMENSION = 512;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function requestToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Downscale to fit MAX_DIMENSION and re-encode as JPEG to keep records small. */
async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), 'image/jpeg', 0.85);
  });
}

export async function addPhoto(file: File): Promise<string> {
  const blob = await downscale(file);
  const photo: StoredPhoto = { id: crypto.randomUUID(), blob, createdAt: Date.now() };
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  await requestToPromise(tx.objectStore(STORE).add(photo));
  return photo.id;
}

export async function listPhotos(): Promise<StoredPhoto[]> {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readonly');
  const photos = await requestToPromise(tx.objectStore(STORE).getAll());
  return photos.sort((a, b) => a.createdAt - b.createdAt);
}

export async function getPhoto(id: string): Promise<StoredPhoto | undefined> {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readonly');
  return requestToPromise(tx.objectStore(STORE).get(id));
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  await requestToPromise(tx.objectStore(STORE).delete(id));
}
