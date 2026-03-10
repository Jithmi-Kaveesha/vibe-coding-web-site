// ============================================
// Dark Mode Toggle
// ============================================

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.getElementById('darkModeToggle').checked = isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
}

// Load dark mode preference on page load
document.addEventListener('DOMContentLoaded', function () {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }

    // Initialize Pomodoro timer display
    updatePomodoroTimerDisplay();
    
    // Initialize study timer display
    updateTimerDisplay();

    // Add event listeners to sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function () {
            alert(`Event: ${this.textContent}`);
        });
    });
});

// ============================================
// Section Visibility Management
// ============================================

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

// ============================================
// GPA Calculator with Credits
// ============================================

function calculateGPA() {
    // Get input values for all courses
    const credits = [
        parseFloat(document.getElementById('credits1').value),
        parseFloat(document.getElementById('credits2').value),
        parseFloat(document.getElementById('credits3').value)
    ];

    const grades = [
        parseFloat(document.getElementById('grade1').value),
        parseFloat(document.getElementById('grade2').value),
        parseFloat(document.getElementById('grade3').value)
    ];

    // Validate inputs
    let validCourses = 0;
    for (let i = 0; i < 3; i++) {
        if (!isNaN(credits[i]) && !isNaN(grades[i])) {
            if (credits[i] < 0 || grades[i] < 0 || grades[i] > 100) {
                displayGPAResult('❌ Invalid input: Credits and grades must be non-negative. Grades must be 0-100.', true);
                return;
            }
            if (credits[i] > 0) {
                validCourses++;
            }
        }
    }

    if (validCourses === 0) {
        displayGPAResult('❌ Please enter at least one course with credits and grade.', true);
        return;
    }

    // Calculate weighted GPA
    let totalWeightedGPA = 0;
    let totalCredits = 0;
    let averageGrade = 0;
    let courseCount = 0;

    for (let i = 0; i < 3; i++) {
        if (!isNaN(credits[i]) && !isNaN(grades[i]) && credits[i] > 0) {
            // Convert grade (0-100) to 4.0 scale
            const gpa = (grades[i] / 100) * 4.0;
            totalWeightedGPA += gpa * credits[i];
            totalCredits += credits[i];
            averageGrade += grades[i];
            courseCount++;
        }
    }

    const weightedGPA = totalWeightedGPA / totalCredits;
    const avgGrade = averageGrade / courseCount;

    const resultMessage = `
        <strong>📊 Weighted GPA: ${weightedGPA.toFixed(2)} / 4.0</strong><br>
        Average Grade: ${avgGrade.toFixed(2)}%<br>
        Total Credits: ${totalCredits.toFixed(1)}<br>
        Courses Calculated: ${courseCount}
    `;
    displayGPAResult(resultMessage, true);
}

function displayGPAResult(message, show = true) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = message;
    if (show) {
        resultElement.classList.add('show');
    } else {
        resultElement.classList.remove('show');
    }
}

function clearGPAInputs() {
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`credits${i}`).value = '';
        document.getElementById(`grade${i}`).value = '';
    }
    document.getElementById('result').classList.remove('show');
}

// ============================================
// Pomodoro Timer (25 minutes) - Sidebar Widget
// ============================================

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

let pomodoroInterval = null;
let pomodoroTimeLeft = POMODORO_DURATION;
let pomodoroRunning = false;
let pomodoroSessionsCompleted = 0;

function startPomodoro() {
    if (pomodoroRunning) return; // Already running

    pomodoroRunning = true;
    const startBtn = document.getElementById('pomodoroStartBtn');
    startBtn.textContent = '⏸ Pause';

    pomodoroInterval = setInterval(() => {
        if (pomodoroTimeLeft > 0) {
            pomodoroTimeLeft--;
            updatePomodoroTimerDisplay();
        } else {
            // Timer completed
            completePomodoroSession();
        }
    }, 1000);
}

function pausePomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        pomodoroRunning = false;
        const startBtn = document.getElementById('pomodoroStartBtn');
        startBtn.textContent = '▶ Start';
    }
}

function resetPomodoro() {
    pausePomodoro();
    pomodoroTimeLeft = POMODORO_DURATION;
    updatePomodoroTimerDisplay();
    const startBtn = document.getElementById('pomodoroStartBtn');
    startBtn.textContent = '▶ Start';
}

function updatePomodoroTimerDisplay() {
    const minutes = Math.floor(pomodoroTimeLeft / 60);
    const seconds = pomodoroTimeLeft % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const pomodoroTimeElement = document.getElementById('pomodoroTime');
    if (pomodoroTimeElement) {
        pomodoroTimeElement.textContent = display;
    }
}

function completePomodoroSession() {
    pausePomodoro();
    pomodoroSessionsCompleted++;
    
    // Update sessions counter
    const sessionsElement = document.getElementById('pomodoroSessions');
    if (sessionsElement) {
        sessionsElement.textContent = pomodoroSessionsCompleted;
    }

    // Play bell notification
    playPomodoromBellNotification();

    // Show alert
    alert('🎉 Pomodoro session complete! Time for a break! Take 5 minutes to rest.');

    // Reset timer
    pomodoroTimeLeft = POMODORO_DURATION;
    updatePomodoroTimerDisplay();
    const startBtn = document.getElementById('pomodoroStartBtn');
    startBtn.textContent = '▶ Start';
}

function playPomodoromBellNotification() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // First bell chime
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(800, audioContext.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.4);
        
        gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        osc1.start(audioContext.currentTime);
        osc1.stop(audioContext.currentTime + 0.4);

        // Second bell chime
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1000, audioContext.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.4);
            
            gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.4);
        }, 500);

        // Third bell chime
        setTimeout(() => {
            const osc3 = audioContext.createOscillator();
            const gain3 = audioContext.createGain();
            
            osc3.connect(gain3);
            gain3.connect(audioContext.destination);
            
            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(1200, audioContext.currentTime);
            osc3.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
            
            gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            osc3.start(audioContext.currentTime);
            osc3.stop(audioContext.currentTime + 0.5);
        }, 1000);
    } catch (error) {
        console.log('Bell notification played');
    }
}

// ============================================
// Study Timer Functionality
// ============================================

let timerInterval = null;
let totalSeconds = 0;
let isRunning = false;

function setTimerDuration() {
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;

    if (minutes < 0 || seconds < 0 || (minutes === 0 && seconds === 0)) {
        alert('Please enter a valid time duration');
        return;
    }

    totalSeconds = minutes * 60 + seconds;
    updateTimerDisplay();
}

function startTimer() {
    if (totalSeconds === 0) {
        alert('Please set a time duration first');
        return;
    }

    if (isRunning) {
        return;
    }

    isRunning = true;

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
        } else {
            stopTimer();
            alert('⏰ Study session complete! Great work!');
            playNotificationSound();
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    totalSeconds = 0;
    document.getElementById('timerMinutes').value = '';
    document.getElementById('timerSeconds').value = '';
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('time').textContent = display;
}

function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio notification played');
    }
}
