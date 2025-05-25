// Modern, fire-themed timer with minutes and stop button
(() => {
  if (document.getElementById("floating-timer")) return;

  // Create timer UI with a fire design
  const timerBox = document.createElement("div");
  timerBox.id = "floating-timer";
  timerBox.innerHTML = `
    <div id="dragHandle">≡≡ <span id="closeBtn">×</span></div>
    <input type="number" id="timeInput" placeholder="Min" value="25" min="1" max="60" />
    <div class="timer-buttons">
      <button id="startBtn">▶</button>
      <button id="stopBtn" disabled>⏹</button>
    </div>
    <div id="timerDisplay" class="timer-display">Ready!</div>
  `;
  
  // Add styles inline to ensure they work in Brave
  const styles = `
    @keyframes fireGlow {
      0%, 100% { box-shadow: 0 0 5px #ff4500, 0 0 10px #ff6500, 0 0 15px #ff8500; }
      50% { box-shadow: 0 0 10px #ff6500, 0 0 20px #ff8500, 0 0 30px #ffa500; }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes urgentPulse {
      0%, 100% { transform: scale(1); background: linear-gradient(135deg, #ff1744, #ff5722); }
      50% { transform: scale(1.1); background: linear-gradient(135deg, #ff5722, #ff9800); }
    }

    #floating-timer {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 90px;
      background: linear-gradient(135deg, #ff7e5f, #feb47b, #ff6b35);
      color: white;
      border: none;
      padding: 4px;
      font-family: 'Arial', sans-serif;
      box-shadow: 0 4px 15px rgba(255, 100, 0, 0.4);
      z-index: 2147483647;
      border-radius: 8px;
      user-select: none;
      animation: fireGlow 2s ease-in-out infinite;
      transition: all 0.3s ease;
    }
    
    #floating-timer.running {
      animation: pulse 1s ease-in-out infinite;
    }
    
    #floating-timer.urgent {
      animation: urgentPulse 0.5s ease-in-out infinite;
    }
    
    #dragHandle {
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 4px;
      margin: -4px -4px 2px -4px;
      border-radius: 8px 8px 0 0;
      cursor: grab;
      font-size: 8px;
      color: rgba(255, 255, 255, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(2px);
    }
    
    #dragHandle:active {
      cursor: grabbing;
      background: rgba(255, 255, 255, 0.3);
    }
    
    #closeBtn {
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.9);
      padding: 0 2px;
      border-radius: 2px;
      transition: all 0.2s ease;
      line-height: 1;
    }
    
    #closeBtn:hover {
      background: rgba(255, 255, 255, 0.3);
      color: #ff1744;
      transform: scale(1.1);
    }
    
    #timeInput {
      width: 100%;
      padding: 3px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.9);
      color: #333;
      font-size: 10px;
      font-weight: bold;
      margin: 2px 0;
      box-sizing: border-box;
      text-align: center;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    }
    
    #timeInput:focus {
      outline: none;
      border-color: #fff;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
    
    .timer-buttons {
      display: flex;
      gap: 2px;
      margin: 2px 0;
    }
    
    #startBtn, #stopBtn {
      flex: 1;
      padding: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s ease;
      text-shadow: 0 1px 1px rgba(0,0,0,0.3);
    }
    
    #startBtn {
      background: linear-gradient(135deg, #ff1744, #ff5722);
      color: white;
      box-shadow: 0 2px 4px rgba(255, 23, 68, 0.3);
    }

    #startBtn:hover {
      background: linear-gradient(135deg, #ff5722, #ff9800);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(255, 87, 34, 0.4);
    }

    #stopBtn {
      background: linear-gradient(135deg, #424242, #616161);
      color: white;
      box-shadow: 0 2px 4px rgba(66, 66, 66, 0.3);
    }

    #stopBtn:hover {
      background: linear-gradient(135deg, #616161, #757575);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(97, 97, 97, 0.4);
    }
    
    #stopBtn:disabled {
      background: #999;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .timer-display {
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      padding: 5px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      margin: 2px 0;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      backdrop-filter: blur(2px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }
    
    .timer-display.low-time {
      color: #ffeb3b;
      animation: pulse 0.8s ease-in-out infinite;
    }
    
    .timer-display.critical-time {
      color: #ff1744;
      animation: urgentPulse 0.4s ease-in-out infinite;
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
  const dragHandle = document.getElementById("dragHandle");
  const closeBtn = document.getElementById("closeBtn");
  
  // Add drag functionality
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  dragHandle.addEventListener('mousedown', (e) => {
    if (e.target.id === 'closeBtn') return; // Don't drag when clicking close button
    isDragging = true;
    const rect = timerBox.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    timerBox.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - timerBox.offsetWidth;
      const maxY = window.innerHeight - timerBox.offsetHeight;
      
      timerBox.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      timerBox.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
      timerBox.style.right = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    timerBox.style.cursor = '';
  });
  
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
    timerBox.classList.add('running');
    
    // Display initial time
    timerDisplay.textContent = formatTime(timeLeft);
    
    // Start the countdown
    countdown = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = formatTime(timeLeft);

      // Add urgency effects as time runs out
      timerDisplay.classList.remove('low-time', 'critical-time');
      timerBox.classList.remove('urgent');
      
      if (timeLeft <= 60) {
        timerDisplay.classList.add('low-time');
      }
      if (timeLeft <= 30) {
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
        timerDisplay.classList.add('critical-time');
        timerBox.classList.add('urgent');
      }
      
      if (timeLeft <= 0) {
        clearInterval(countdown);
        timerDisplay.textContent = "Time's up! 🔥";
        timerDisplay.classList.add('critical-time');
        timerBox.classList.remove('running');
        timerBox.classList.add('urgent');
        startBtn.disabled = false;
        stopBtn.disabled = true;
        timeInput.disabled = false;
        isRunning = false;
        
        // Flash effect with fire colors
        let flashCount = 0;
        const flash = setInterval(() => {
          timerBox.style.background = flashCount % 2 === 0 ? 
            'linear-gradient(135deg, #ff1744, #ff5722)' : 
            'linear-gradient(135deg, #ff5722, #ff9800)';
          flashCount++;
          if (flashCount > 10) {
            clearInterval(flash);
            timerBox.style.background = '';
          }
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
    timerDisplay.classList.remove('low-time', 'critical-time');
    timerBox.classList.remove('running', 'urgent');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    timeInput.disabled = false;
    isRunning = false;
  });
  
  // Close timer
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent dragging
    clearInterval(countdown);
    timerBox.remove();
  });
  
})();