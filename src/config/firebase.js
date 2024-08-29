import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// function getFileName(fileName){
//   return fileName + toString(new Date().getTime())
// }
export default async function uploadProfilePicture(file, userId) {
  // const storageRef = ref(storage,`/${userId}/images/`);
  const imagesRef = ref(storage, `users/${String(userId)}/images/${file.name}`);
  const data = await uploadBytes(imagesRef, file);
  console.log(data);
  const url = await getDownloadURL(imagesRef);
  return url;
}

export const uploadAudioMessage = async function (audioFile, userId) {
  const audioRef = ref(
    storage,
    `users/${String(userId)}/audios/${audioFile.name}`
  );
  const data = await uploadBytes(audioRef, audioFile);
  console.log(data);
  const url = await getDownloadURL(audioRef);
  return url;
};
