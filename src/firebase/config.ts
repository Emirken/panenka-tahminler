// src/firebase/config.ts

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase Console'dan aldığınız config bilgileri
const firebaseConfig = {
    apiKey: "AIzaSyAKUQFzF2R2_tHzNZn6sElRWxjf_isKANg",
    authDomain: "panenka-tahminler.firebaseapp.com",
    projectId: "panenka-tahminler",
    storageBucket: "panenka-tahminler.firebasestorage.app",
    messagingSenderId: "617401815613",
    appId: "1:617401815613:web:8a31ef6501ba3344e31054",
    measurementId: "G-T6JGZSB6QM"
}

// Firebase'i başlat
const app = initializeApp(firebaseConfig)

// Firestore ve Auth'u export et
export const db = getFirestore(app)
export const auth = getAuth(app)