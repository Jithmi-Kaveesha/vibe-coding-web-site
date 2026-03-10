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

    // Initialize timers
    updatePomodoroDisplay();
    updateTotalTime();

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
// Pomodoro Timer (25 minutes)
// ============================================

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes break

let pomodoroInterval = null;
let pomodoroTimeLeft = WORK_DURATION;
let isPomodoroPaused = false;
let sessionsCompleted = 0;
let totalStudySeconds = 0;
let isWorkSession = true;

function startPomodoro() {
    if (pomodoroInterval) return; // Already running

    if (pomodoroTimeLeft === WORK_DURATION) {
        // Starting fresh work session
    }

    isPomodoroPaused = false;

    pomodoroInterval = setInterval(() => {
        if (pomodoroTimeLeft > 0) {
            pomodoroTimeLeft--;
            totalStudySeconds++;
            updatePomodoroDisplay();
        } else {
            // Session completed
            completePomodoroSession();
        }
    }, 1000);
}

function pausePomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        isPomodoroPaused = true;
    }
}

function resetPomodoro() {
    pausePomodoro();
    pomodoroTimeLeft = WORK_DURATION;
    isWorkSession = true;
    updatePomodoroDisplay();
}

function completePomodoroSession() {
    pausePomodoro();
    sessionsCompleted++;
    updateTotalTime();

    // Play bell notification
    playBellNotification();

    // Show alert
    alert('🎉 Great work! 25-minute Pomodoro session completed!\n\nTime for a 5-minute break!');

    // Reset timer for next session
    pomodoroTimeLeft = WORK_DURATION;
    isWorkSession = true;
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTimeLeft / 60);
    const seconds = pomodoroTimeLeft % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('time').textContent = display;

    const sessionLabel = document.getElementById('sessionLabel');
    if (sessionLabel) {
        sessionLabel.textContent = isWorkSession ? '💪 Work Session' : '☕ Break Time';
    }

    document.getElementById('sessionsCompleted').textContent = sessionsCompleted;
}

function updateTotalTime() {
    const hours = Math.floor(totalStudySeconds / 3600);
    const minutes = Math.floor((totalStudySeconds % 3600) / 60);
    const seconds = totalStudySeconds % 60;
    const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('totalTime').textContent = display;
}

function playBellNotification() {
    try {
        // Create bell sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create nodes
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Bell sound characteristics
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        // Second bell chime
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1000, audioContext.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.4);
            
            gain2.gain.setValueAtTime(0.25, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.4);
        }, 600);
    } catch (error) {
        console.log('Audio notification played (Web Audio API not available)');
    }
}
