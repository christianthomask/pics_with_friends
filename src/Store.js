import { writable } from "svelte/store"

export const roomCode = writable();

export const localPlayer = writable();

export const otherPlayers = writable();
