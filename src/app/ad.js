import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';

const setupAdmin = async () => {
  await setDoc(doc(db, 'admin', 'adminCredentials'), {
    email: 'iiixyxz6@gmail.com',
    password: '11111111',
    createdAt: new Date().toISOString()
  });
  
  console.log('Admin credentials created');
};

setupAdmin();