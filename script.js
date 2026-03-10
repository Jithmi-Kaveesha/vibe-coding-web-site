// ============================================
// Section Visibility Management
// ============================================

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

// ============================================
// GPA Calculator Functionality
// ============================================

function calculateGPA() {
    // Get input values
    const grade1 = parseFloat(document.getElementById('grade1').value);
    const grade2 = parseFloat(document.getElementById('grade2').value);
    const grade3 = parseFloat(document.getElementById('grade3').value);

    // Validate inputs
    if (isNaN(grade1) || isNaN(grade2) || isNaN(grade3)) {
        alert('Please enter valid numbers for all grades');
        displayResult('❌ Invalid input', true);
        return;
    }

    // Check if grades are in valid range (0-100 or 0-4.0)
    if ((grade1 < 0 || grade1 > 100) || (grade2 < 0 || grade2 > 100) || (grade3 < 0 || grade3 > 100)) {
        alert('Please enter grades between 0 and 100');
        displayResult('❌ Grades must be between 0-100', true);
        return;
    }

    // Calculate average GPA
    const averageGrade = (grade1 + grade2 + grade3) / 3;
    const gpa = (averageGrade / 100) * 4.0; // Convert to 4.0 scale

    // Display result
    const resultMessage = `📊 Your GPA: ${gpa.toFixed(2)} / 4.0 (Average: ${averageGrade.toFixed(2)}%)`;
    displayResult(resultMessage, true);
}

function displayResult(message, show = true) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = message;
    if (show) {
        resultElement.classList.add('show');
    } else {
        resultElement.classList.remove('show');
    }
}

// Clear GPA inputs
function clearGPAInputs() {
    document.getElementById('grade1').value = '';
    document.getElementById('grade2').value = '';
    document.getElementById('grade3').value = '';
    document.getElementById('result').classList.remove('show');
}

// ============================================
// Study Timer Functionality
// ============================================

let timerInterval = null;
let totalSeconds = 0; // Default: 0 seconds
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
    // If timer is not set, ask user to set it
    if (totalSeconds === 0) {
        alert('Please set a time duration first');
        return;
    }

    if (isRunning) {
        return; // Prevent multiple intervals
    }

    isRunning = true;

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
        } else {
            // Timer finished
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
    // Create a simple beep sound notification
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
}

// ============================================
// Upcoming Events Sidebar Interaction
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the page
    updateTimerDisplay();

    // Add event listeners to sidebar items for interactivity
    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function () {
            alert(`Event: ${this.textContent}`);
        });
    });
});
