// /src/lib/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// We don't need initializeApp with react-native-firebase
// It's initialized natively via google-services.json

const db = firestore();
const firebaseAuth = auth();

export {
  db,
  firebaseAuth as auth
};
