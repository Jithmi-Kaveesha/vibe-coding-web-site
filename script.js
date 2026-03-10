// ============================================
// Dark Mode Toggle
// ============================================

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.getElementById('darkModeToggle').checked = isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
}

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
        console.log('Audio notification');
    }
}

// ============================================
// Page Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }

    updateTimerDisplay();

    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function () {
            alert(`Event: ${this.textContent}`);
        });
    });
});