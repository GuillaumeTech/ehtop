import { Audio } from "expo-av";
const startBip = require("../assets/sounds/startBip.mp3");
const endBip = require("../assets/sounds/endBip.mp3");
const a321Bip = require("../assets/sounds/321Bip.mp3");

let soundStart: any;
let soundEnd: any;
let sound321: any;

export async function loadSounds() {
  ({ sound: soundStart } = await Audio.Sound.createAsync(startBip));
  ({ sound: soundEnd } = await Audio.Sound.createAsync(endBip));
  ({ sound: sound321 } = await Audio.Sound.createAsync(a321Bip));
}

export async function unloadSounds() {
  soundStart.unloadAsync();
  soundEnd.unloadAsync();
  sound321.unloadAsync();
}

export async function playEndBipSound() {
  await soundEnd.replayAsync()
}

export async function playStartBipSound() {
    await soundStart.replayAsync()
  }

export async function play321BipSound() {
    await sound321.replayAsync()
}
