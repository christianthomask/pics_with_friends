<script>

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get } from "firebase/database";
import { roomCode, localPlayer } from "../../Store"

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

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

let roomID

async function cycleId() {
    roomID = await makeid(4)
    // console.log(roomID)
    await get(ref(database, roomID)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("already exists")
            cycleId();
        } else {
            roomCode.set(roomID)
            // console.log($roomCode)
        }
        }).catch((error) => {
        console.error(error);
    });
}


async function initRoom() {
    const name = document.getElementById("name").value
    localPlayer.set(name);
    const pak = {}
    pak[roomID + "/players/" + name + "/score"] = "0"
    pak[roomID + "/players/" + name + "/shown"] = "0"
    pak[roomID + "/players/" + name + "/guessed"] = "false"
    pak[roomID + "/state"] = "waiting"
    await update(ref(database), pak);
}

cycleId();

</script>

<ion-content class="ion-padding">
    <h1>Awesome! your room code is: {roomID}</h1>
    <h4>What would you like your name to be?</h4>
    <ion-item>
        <ion-input id="name" label="Name" placeholder="Pick something fun!"></ion-input>
    </ion-item>
    <ion-button expand="block" on:click={initRoom} href="/host/joined">Ready!</ion-button>
</ion-content>
