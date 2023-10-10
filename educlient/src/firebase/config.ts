// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANn-jYYcxVemh9MiLDCuNc2W7iVeXwl0k",
  authDomain: "edupluss-6368c.firebaseapp.com",
  projectId: "edupluss-6368c",
  storageBucket: "edupluss-6368c.appspot.com",
  messagingSenderId: "150430365383",
  appId: "1:150430365383:web:42f906d6b913dda94bf0e2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

function generateRandomId() {
  const id = v4();
  return id.slice(3, 5);
}
const session = window.localStorage.getItem("token");
const metadata = {
  customMetadata: {
    session: `${session}`,
  },
};

export async function uploadFile(file: File | undefined): Promise<string> {
  if (!file) {
    throw new Error("No se proporcionó ningún archivo.");
  }

  const extension = file.name.split(".").pop();
  if (!extension) {
    throw new Error("No se pudo obtener la extensión del archivo.");
  }

  const randomId = generateRandomId(); // Genera un identificador de 6 caracteres
  const filename = `${file.name.split(".").shift()}-${randomId}.${extension}`;
  const storageRef = ref(storage, `descargables/${filename}`);

  try {
    await uploadBytes(storageRef, file, metadata);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error: any) {
    throw new Error("Error al subir el archivo: " + error.message);
  }
}
