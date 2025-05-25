
const alarm = new Audio(chrome.runtime.getURL("alarm.mp3"));

document.getElementById("startBtn").addEventListener("click", () => {
  const timeInput = parseInt(document.getElementById("timeInput").value, 10);
  if (timeInput > 0) {
    chrome.runtime.sendMessage({
      type: 'START_TIMER',
      duration: timeInput
    });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  const timerDisplay = document.getElementById("timerDisplay");
  
  if (message.type === 'TIMER_UPDATE') {
    const timeLeft = message.timerState.timeLeft;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  } else if (message.type === 'TIMER_COMPLETE') {
    timerDisplay.textContent = "Time's up!";
    alarm.play();
  }
});

chrome.runtime.sendMessage({ type: 'GET_TIMER_STATE' }, (response) => {
  if (response && response.timerState) {
    const timerDisplay = document.getElementById("timerDisplay");
    const state = response.timerState;
    
    if (state.isRunning) {
      timerDisplay.textContent = `Time Left: ${state.timeLeft}s`;
    } else if (state.timeLeft === 0 && state.duration > 0) {
      timerDisplay.textContent = "Time's up!";
    }
  }
});
