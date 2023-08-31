<script>

    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, update, get, onValue } from "firebase/database";
    import { getStorage, ref as storageRef, getDownloadURL  } from "firebase/storage";
    import { roomCode, localPlayer, otherPlayers } from "../../../Store";
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
    let displayPlayer;
    let guess;

    async function getOtherPlayers() {
        await get(ref(database, room_code + "/players")).then(async (snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                let arr = [];
                Object.keys(obj).forEach((e) => {
                    if (e !== local_player) {
                        arr.push(e);
                    }
                })
                otherPlayers.set(arr);
                console.log(otherPlayers)
            }
        });
    }

    async function checkGuess(g) {
        if (g === displayPlayer) {
            const pak = {}
            pak[room_code + "/players/" + local_player + "/score"] += 100;
            await update(ref(database), pak);
            guess = "correct";
        } else {
            guess = "incorrect";
        }
        const pak = {}
        pak[room_code + "/players/" + local_player + "/guessed"] = "true";
        await update(ref(database), pak);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    async function pickNext() {
        let players;
        await get(ref(database, room_code + "/players")).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())
                players = snapshot.val();
            }
        }).catch((error) => {
            console.error(error);
        });

        let cursor = getRandomInt(Object.keys(players).length)
        let imgCursor

        displayPlayer = Object.keys(players)[cursor];
        const pak = {}
        pak[room_code + "/display_player"] = displayPlayer;
        await update(ref(database), pak);

        await get(ref(database, room_code + "/players/" + displayPlayer + "/shown")).then(async (snapshot) => {
            if (snapshot.exists() && snapshot.val() < 3) {
                imgCursor = snapshot.val();
                const pak = {}
                pak[room_code + "/" + displayPlayer + "/shown"] = imgCursor + 1;
                await update(ref(database), pak);
            } else {
                pickNext();
            }
        });

        getDownloadURL(storageRef(storage, "/images/" + room_code + "/" + displayPlayer + "/" + imgCursor))
        .then((url) => {
            const img = document.getElementById('displayImg');
            img.setAttribute('src', url);
        })
    }

    onValue(ref(database, room_code + "/guessed"), async (snapshot) => {
    if (snapshot.exists()) {
        console.log(snapshot)
        pickNext();
        }
    });

    pickNext();
    getOtherPlayers();

</script>

<ion-content class="ion-padding">
    {#if guess === "correct"}
        <h1>Good Job! That's correct!!</h1>
        <h4>+100!</h4>
    {:else if guess === "incorrect"}
        <h1>Sorry, that's incorrect.</h1>
        <h4>No points this time.</h4>
    {:else}
        <h1>Alright! Time to guess!!</h1>
        <h4>Who's pic is this??</h4>
        <ion-card >
            <img id="displayImg" src="" alt="img">
        </ion-card>
        {#if $otherPlayers}
            {#key $otherPlayers}
                {#each $otherPlayers as player}
                    <ion-button expand="block" on:click={() => {checkGuess(player)}}>{player}</ion-button>
                {/each}
            {/key}
        {/if}
    {/if}
</ion-content> 