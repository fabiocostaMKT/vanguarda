// Inicialização do Firebase — só acontece em modo "firebase" e com env presente.
// Em modo mock (default de dev), nada aqui é carregado; o app roda 100% offline.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'mock'

let app, auth, db, storage

if (DATA_MODE === 'firebase') {
  const cfg = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  if (!cfg.apiKey) {
    console.warn('[VanGuarda] VITE_DATA_MODE=firebase mas as chaves não estão definidas.')
  } else {
    app = initializeApp(cfg)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  }
}

export { app, auth, db, storage }
