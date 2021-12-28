function secsToTime(sec: number) {
    const minutes = Math.floor(sec / (60));
    const secs = Math.floor((sec % 60));
    let minutesString = `${minutes}`;
    let secsString = `${secs}`;
    if (minutes < 10) minutesString = `0${minutes}`;
    if (secs < 10) secsString = `0${secs}`;
    return `${minutesString}:${secsString}`;
  }


function timetoSec(minutes: string, secs:string) {
  const safeMinutes = minutes !== "" ? minutes : "0";
  const safeSecs = secs !== "" ? secs : "0";
  const seconds = parseInt(safeMinutes) * 60  + parseInt(safeSecs);
  return seconds
}