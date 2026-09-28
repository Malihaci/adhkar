/**
 * Audio personnel importé par l'utilisateur (§3 mission Mawāqīt —
 * notifications/Adhān) — choisi explicitement via un <input type="file">
 * natif (jamais d'accès arbitraire au stockage du téléphone), puis
 * conservé DURABLEMENT dans IndexedDB (pas un chemin/blob temporaire qui
 * cesserait de fonctionner après un rechargement). Un seul fichier à la
 * fois pour cette V1 — remplacer réécrit l'entrée existante.
 */

const DB_NAME = "adhkar-personal-audio";
const STORE = "files";
const KEY = "current";

export interface PersonalAudioMeta {
  name: string;
  type: string;
  size: number;
  savedAtISO: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePersonalAudio(file: File): Promise<PersonalAudioMeta> {
  const db = await openDB();
  const meta: PersonalAudioMeta = {
    name: file.name,
    type: file.type,
    size: file.size,
    savedAtISO: new Date().toISOString(),
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ meta, blob: file }, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return meta;
}

export async function getPersonalAudioMeta(): Promise<PersonalAudioMeta | null> {
  try {
    const db = await openDB();
    const record = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return record?.meta ?? null;
  } catch {
    return null;
  }
}

/** Object URL valable pour la session courante — régénéré à chaque appel. */
export async function getPersonalAudioURL(): Promise<string | null> {
  try {
    const db = await openDB();
    const record = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (!record?.blob) return null;
    return URL.createObjectURL(record.blob as Blob);
  } catch {
    return null;
  }
}

export async function deletePersonalAudio(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* ignore */
  }
}
