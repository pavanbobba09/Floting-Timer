
let timerInterval;

chrome.runtime.onInstalled.addListener(() => {
  console.log("Floating Timer Extension Installed.");
  chrome.storage.local.set({
    timerState: {
      isRunning: false,
      timeLeft: 0,
      startTime: 0,
      duration: 0
    }
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['timerState'], (result) => {
    if (result.timerState && result.timerState.isRunning) {
      const elapsed = Math.floor((Date.now() - result.timerState.startTime) / 1000);
      const timeLeft = Math.max(0, result.timerState.duration - elapsed);
      
      if (timeLeft > 0) {
        startTimer(timeLeft);
      } else {
        timerComplete();
      }
    }
  });
});

function startTimer(duration) {
  clearInterval(timerInterval);
  
  const startTime = Date.now();
  let timeLeft = duration;
  
  chrome.storage.local.set({
    timerState: {
      isRunning: true,
      timeLeft: timeLeft,
      startTime: startTime,
      duration: duration
    }
  });
  
  timerInterval = setInterval(() => {
    timeLeft--;
    
    const state = {
      isRunning: true,
      timeLeft: timeLeft,
      startTime: startTime,
      duration: duration
    };
    
    chrome.storage.local.set({ timerState: state });
    
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TIMER_UPDATE',
          timerState: state
        }).catch(() => {});
      });
    });
    
    if (timeLeft <= 0) {
      timerComplete();
    }
  }, 1000);
}

function timerComplete() {
  clearInterval(timerInterval);
  
  const state = {
    isRunning: false,
    timeLeft: 0,
    startTime: 0,
    duration: 0
  };
  
  chrome.storage.local.set({ timerState: state });
  
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'TIMER_COMPLETE',
        timerState: state
      }).catch(() => {});
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_TIMER') {
    startTimer(message.duration);
    sendResponse({ success: true });
  } else if (message.type === 'STOP_TIMER') {
    clearInterval(timerInterval);
    const state = {
      isRunning: false,
      timeLeft: 0,
      startTime: 0,
      duration: 0
    };
    chrome.storage.local.set({ timerState: state });
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TIMER_STOPPED',
          timerState: state
        }).catch(() => {});
      });
    });
    sendResponse({ success: true });
  } else if (message.type === 'GET_TIMER_STATE') {
    chrome.storage.local.get(['timerState'], (result) => {
      sendResponse({ timerState: result.timerState || { isRunning: false, timeLeft: 0 } });
    });
    return true;
  }
});
