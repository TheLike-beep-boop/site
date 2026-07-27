// Configurația Firebase - copiată din Firebase Console > Project Settings > Your apps
// Aceste valori sunt PUBLICE (nu sunt secrete), securitatea reală vine din
// regulile Firestore + Authentication, nu din ascunderea acestor date.
const firebaseConfig = {
  apiKey: "AIzaSyDswtP0fbl8d_sWvyVJ3ZkseGTYMf9G_lY",
  authDomain: "prodmet-srl.firebaseapp.com",
  projectId: "prodmet-srl",
  storageBucket: "prodmet-srl.firebasestorage.app",
  messagingSenderId: "470498713048",
  appId: "1:470498713048:web:eafb75c54a7df9ce43e6ad"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
