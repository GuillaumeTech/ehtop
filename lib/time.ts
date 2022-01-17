export function getSeconds(sec: number) {
  const secs = Math.floor(sec % 60);
  let secsString = `${secs}`;
  if (secs < 10) secsString = `0${secs}`;
  return secsString;
}

export function getMinutes(sec: number) {
  const minutes = Math.floor(sec / 60);
  let minutesString = `${minutes}`;
  if (minutes < 10) minutesString = `0${minutes}`;
  return minutesString;
}

export function secsToTime(sec: number) {
  const minutes = getMinutes(sec);
  const secs = getSeconds(sec);
  return `${minutes}:${secs}`;
}

export function timetoSec(minutes: string, secs: string) {
  const safeMinutes = minutes !== "" ? minutes : "0";
  const safeSecs = secs !== "" ? secs : "0";
  const seconds = parseInt(safeMinutes) * 60 + parseInt(safeSecs);
  return seconds;
}
