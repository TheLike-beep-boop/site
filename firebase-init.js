// Configurația Firebase - copiată din Firebase Console > Project Settings > Your apps
// Aceste valori sunt PUBLICE (nu sunt secrete), securitatea reală vine din
// regulile Firestore + Authentication, nu din ascunderea acestor date.
const firebaseConfig = {
  apiKey: "AIzaSyDk_WuvZcgRa-FVr-CdyqiEdL49VJOVD_E",
  authDomain: "stingator-6cf00.firebaseapp.com",
  projectId: "stingator-6cf00",
  storageBucket: "stingator-6cf00.firebasestorage.app",
  messagingSenderId: "672953198248",
  appId: "1:672953198248:web:1949593fd20c2ef229449d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
