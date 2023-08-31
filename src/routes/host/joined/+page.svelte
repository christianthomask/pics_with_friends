<script>
    import { roomCode, localPlayer } from "../../../Store"
    import { goto } from "$app/navigation"
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, update, onValue } from "firebase/database";

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

    const local_player = $localPlayer;
    const room_code = $roomCode;

    onValue(ref(database, room_code + "/players"), async (snapshot) => {
    if (snapshot.exists()) {
        console.log(snapshot)
        const playerCount = snapshot.size
        const pak = {}
        pak[room_code + "/player_count"] = playerCount
        await update(ref(database), pak);
        }
    });

    async function start() {
        const pak = {}
        pak[room_code + "/state"] = "upload";
        await update(ref(database), pak);
        goto("/host/upload");
    }

</script>

<ion-content class="ion-padding">
    <h1>Lets go! Alright {local_player} your in room {room_code} </h1>
    <h4>When everyone is in hit go!</h4>
    <ion-button on:click={start} expand="block">GO!</ion-button>
</ion-content>