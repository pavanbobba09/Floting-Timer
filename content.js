
if (!document.getElementById("floating-timer")) {
  const timerBox = document.createElement("div");
  timerBox.id = "floating-timer";
  timerBox.innerHTML = `
    <div id="dragHandle">≡≡</div>
    <input type="number" id="timeInput" placeholder="Sec" />
    <button id="startBtn">▶</button>
    <p id="timerDisplay"></p>
  `;
  document.body.appendChild(timerBox);

  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  const dragHandle = timerBox.querySelector('#dragHandle');
  
  dragHandle.addEventListener('mousedown', (e) => {
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
      timerBox.style.bottom = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    timerBox.style.cursor = 'grab';
  });

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('timer.js');
  document.body.appendChild(script);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("style.css");
  document.head.appendChild(link);
}
