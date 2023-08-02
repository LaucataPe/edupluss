// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANn-jYYcxVemh9MiLDCuNc2W7iVeXwl0k",
  authDomain: "edupluss-6368c.firebaseapp.com",
  projectId: "edupluss-6368c",
  storageBucket: "edupluss-6368c.appspot.com",
  messagingSenderId: "150430365383",
  appId: "1:150430365383:web:42f906d6b913dda94bf0e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFile(file: File | undefined) {
    const storageRef = ref(storage, `descargables/${v4()}`)
    if(file){
        try {
            return await uploadBytes(storageRef, file)
        } catch (error) {
            return error
        }
    }
}      

