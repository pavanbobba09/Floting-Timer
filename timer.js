
let countdown;

document.getElementById("startBtn").addEventListener("click", () => {
  let timeLeft = parseInt(document.getElementById("timeInput").value, 10);
  const timerDisplay = document.getElementById("timerDisplay");
  const alarm = new Audio(chrome.runtime.getURL("alarm.mp3"));

  clearInterval(countdown);

  countdown = setInterval(() => {
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(countdown);
      timerDisplay.textContent = "Time's up!";
      alarm.play();
    }
  }, 1000);
});
