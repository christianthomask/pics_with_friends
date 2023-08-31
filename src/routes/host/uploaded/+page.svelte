<script>
    import { roomCode, localPlayer } from "../../../Store"
    import { goto } from "$app/navigation"
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, onValue, get } from "firebase/database";

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

onValue(ref(database, room_code + "/submitted"), async (snapshot) => {
    if (snapshot.exists()) {
        let playerCount;
        await get(ref(database, room_code + "/player_count")).then((snapshot) => {
            if (snapshot.exists()) {
                playerCount = snapshot.val()
            }
            }).catch((error) => {
            console.error(error);
        });

        console.log(snapshot)
        if(snapshot.size === playerCount) {
            goto("/host/guess")
        }
    }
});

</script>

<ion-content class="ion-padding">
    <h1>Hang tight! Everyone else is a little slower than you. Once everyone's pics are in the game will truley start!</h1>
</ion-content>