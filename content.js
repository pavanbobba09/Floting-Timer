
if (!document.getElementById("floating-timer")) {
  const timerBox = document.createElement("div");
  timerBox.id = "floating-timer";
  timerBox.innerHTML = `
    <input type="number" id="timeInput" placeholder="Seconds" />
    <button id="startBtn">Run</button>
    <p id="timerDisplay"></p>
  `;
  document.body.appendChild(timerBox);

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('timer.js');
  document.body.appendChild(script);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("style.css");
  document.head.appendChild(link);
}
