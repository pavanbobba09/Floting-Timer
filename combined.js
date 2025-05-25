// Modern, fire-themed timer with minutes and stop button
(() => {
  if (document.getElementById("floating-timer")) return;

  // Create timer UI with a fire design
  const timerBox = document.createElement("div");
  timerBox.id = "floating-timer";
  timerBox.innerHTML = `
    <div class="timer-header">
      <h3>🔥 Focus Timer</h3>
      <span id="close-timer">×</span>
    </div>
    <div class="timer-body">
      <input type="number" id="timeInput" placeholder="Minutes" value="25" min="1" max="60" />
      <div class="timer-buttons">
        <button id="startBtn">Start</button>
        <button id="stopBtn" disabled>Stop</button>
      </div>
      <div id="timerDisplay" class="timer-display">Ready to focus!</div>
    </div>
  `;
  
  // Add styles inline to ensure they work in Brave
  const styles = `
    #floating-timer {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 220px;
      background: linear-gradient(135deg, #ff7e5f, #feb47b);
      color: white;
      border: none;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      z-index: 2147483647;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    #floating-timer:hover {
      box-shadow: 0 15px 30px rgba(0,0,0,0.3);
      transform: translateY(-2px);
    }
    
    .timer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      background-color: rgba(0,0,0,0.1);
    }
    
    .timer-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    #close-timer {
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
    }
    
    .timer-body {
      padding: 15px;
    }
    
    #timeInput {
      width: 100%;
      padding: 10px 12px;
      border: none;
      border-radius: 6px;
      background-color: rgba(255,255,255,0.9);
      color: #333;
      font-size: 16px;
      margin-bottom: 12px;
      box-sizing: border-box;
      text-align: center;
    }
    
    .timer-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }
    
    #startBtn, #stopBtn {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
      text-transform: uppercase;
      font-size: 14px;
    }
    
    #startBtn {
      background-color: #ff5722;
      color: white;
      text-shadow: 0 1px 1px rgba(0,0,0,0.2);
    }

    #startBtn:hover {
      background-color: #ff7043;
      box-shadow: 0 0 10px rgba(255,87,34,0.5);
      transform: scale(1.03);
    }

    #stopBtn {
      background-color: #455a64;
      color: white;
      text-shadow: 0 1px 1px rgba(0,0,0,0.2);
    }

    #stopBtn:hover {
      background-color: #546e7a;
      box-shadow: 0 0 10px rgba(69,90,100,0.5);
      transform: scale(1.03);
    }
    
    #stopBtn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    .timer-display {
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      padding: 12px;
      background-color: rgba(0,0,0,0.15);
      border-radius: 6px;
      margin-top: 10px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      background-image: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.1));
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
    }
  `;
  
  // Add styles to the head
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
  document.body.appendChild(timerBox);
  
  // Timer logic
  let countdown;
  let isRunning = false;
  
  // Get UI elements
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const timeInput = document.getElementById("timeInput");
  const timerDisplay = document.getElementById("timerDisplay");
  const closeBtn = document.getElementById("close-timer");
  
  // Format time as MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Start timer
  startBtn.addEventListener("click", () => {
    let minutes = parseInt(timeInput.value, 10);
    if (isNaN(minutes) || minutes <= 0) {
      minutes = 5; // Default to 5 minutes
      timeInput.value = "5";
    }
    
    let timeLeft = minutes * 60; // Convert to seconds
    
    // Create audio element for alarm
    const alarm = new Audio(chrome.runtime.getURL("alarm.mp3"));
    
    // Clear any existing countdown
    clearInterval(countdown);
    
    // Update UI
    startBtn.disabled = true;
    stopBtn.disabled = false;
    timeInput.disabled = true;
    isRunning = true;
    
    // Display initial time
    timerDisplay.textContent = formatTime(timeLeft);
    
    // Start the countdown
    countdown = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = formatTime(timeLeft);

      // Change color and add motivational messages when time is running out
      if (timeLeft <= 60) {
        timerDisplay.style.color = "#ffcc00";
      }
      if (timeLeft <= 30) {
        timerDisplay.style.color = "#ff6600";

        // Show motivational message every 10 seconds when time is getting low
        if (timeLeft % 10 === 0) {
          // Array of motivational messages
          const messages = [
            "Keep going! 🔥",
            "Almost there! 💪",
            "Stay focused! 👊",
            "You've got this! ⚡",
            "Push through! 🚀"
          ];

          // Show message briefly
          const originalText = timerDisplay.textContent;
          timerDisplay.textContent = messages[Math.floor(Math.random() * messages.length)];

          // Return to timer after 1 second
          setTimeout(() => {
            if (isRunning) {
              timerDisplay.textContent = originalText;
            }
          }, 1000);
        }
      }
      if (timeLeft <= 10) {
        timerDisplay.style.color = "#ff0000";
      }
      
      if (timeLeft <= 0) {
        clearInterval(countdown);
        timerDisplay.textContent = "Time's up!";
        timerDisplay.style.color = "#ff0000";
        startBtn.disabled = false;
        stopBtn.disabled = true;
        timeInput.disabled = false;
        isRunning = false;
        
        // Flash effect
        let flashCount = 0;
        const flash = setInterval(() => {
          timerBox.style.backgroundColor = flashCount % 2 === 0 ? '#ff0000' : '';
          flashCount++;
          if (flashCount > 10) clearInterval(flash);
        }, 300);
        
        // Play alarm
        alarm.play().catch(e => {
          console.error("Could not play alarm:", e);
        });
      }
    }, 1000);
  });
  
  // Stop timer
  stopBtn.addEventListener("click", () => {
    clearInterval(countdown);
    timerDisplay.textContent = "Stopped";
    timerDisplay.style.color = "";
    startBtn.disabled = false;
    stopBtn.disabled = true;
    timeInput.disabled = false;
    isRunning = false;
  });
  
  // Close timer
  closeBtn.addEventListener("click", () => {
    timerBox.style.display = "none";
  });
})();