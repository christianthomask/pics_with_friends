<script>

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get } from "firebase/database";
import { roomCode, localPlayer } from "../../Store";
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

async function joinRoom() {
    const name = document.getElementById("name").value
    const room = document.getElementById("room").value.toUpperCase()
    await get(ref(database, room + "/" + name)).then(async (snapshot) => {
        if (snapshot.exists()) {
            document.getElementById("name").value = "";
            document.getElementById("name").placeholder = "Oops! That name is already taken!";
            return
        } else {
            const pak = {}
            pak[room + "/players/" + name + "/score"] = "0"
            pak[room + "/players/" + name + "/shown"] = "0"
            pak[room + "/players/" + name + "/guessed"] = "false"
            await update(ref(database), pak);
            await roomCode.set(room);
            await localPlayer.set(name);
            goto("/join/joined")
        }
        }).catch((error) => {
        console.error(error);
    });
}

</script>

<ion-content class="ion-padding">
    <h1>Awesome! What room are you joining? </h1>
    <ion-item>
        <ion-input id="room" label="Room" placeholder="It should be 4 letters."></ion-input>
    </ion-item>
    <h4>And what would you like your name to be?</h4>
    <ion-item>
        <ion-input id="name" label="Name" placeholder="Pick something fun!"></ion-input>
    </ion-item>
    <ion-button expand="block" on:click={joinRoom}>Join!</ion-button>
</ion-content>
