<script>
import { Camera, CameraResultType } from '@capacitor/camera';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes  } from "firebase/storage";
import { roomCode, localPlayer } from "../../../Store";
import { goto } from "$app/navigation";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9XZxf3VjXo7JSB3UaPj9667OzIwKm5cA",
  authDomain: "pictures-with-friends.firebaseapp.com",
  projectId: "pictures-with-friends",
  storageBucket: "pictures-with-friends.appspot.com",
  messagingSenderId: "221272069709",
  appId: "1:221272069709:web:34cef30243b9ec3e5f2e04",
  databaseURL: "https://pictures-with-friends-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

const room_code = $roomCode;
const local_player = $localPlayer;

const takePicture = async () => {
  const images = await Camera.pickImages({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  console.log(images);

  for(let i = 0; i < 3; i++) {
    console.log(images.photos[i].webPath);
    const imagesRef = storageRef(storage, 'images/' + room_code + "/" + local_player + "/" + i);
    const response = await fetch(images.photos[i].webPath)
    const blob = await response.blob();
    await uploadBytes(imagesRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    });
  }

  const pak = {}
    pak[room_code + "/submitted/" + local_player] = "true"
    await update(ref(database), pak);
    goto("/join/uploaded")
};


</script>

<ion-content class="ion-padding">
    <h1>Time to pick some pics!</h1>
    <p>Select 3 pictures that you think the other players will guess you took!</p>
    <ion-button expand="block" on:click={takePicture}>Select</ion-button>
</ion-content>