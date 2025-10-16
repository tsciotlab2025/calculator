let display = document.getElementById('display');

// Basic input functions
function appendSymbol(symbol) {
    display.value += symbol;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    try {
        let expression = display.value.replace(/%/g, '/100');
        display.value = eval(expression);
    } catch (e) {
        display.value = 'Error';
    }
}

function calculateSqrt() {
    try {
        display.value = Math.sqrt(eval(display.value));
    } catch (e) {
        display.value = 'Error';
    }
}

// Voice Recognition
const voiceBtn = document.getElementById('voice-btn');

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = function(event) {
        let voiceInput = event.results[0][0].transcript;
        voiceInput = voiceInput.replace(/plus/gi, '+')
                               .replace(/minus/gi, '-')
                               .replace(/times|multiply/gi, '*')
                               .replace(/divide/gi, '/')
                               .replace(/percent/gi, '%')
                               .replace(/square root/gi, 'Math.sqrt(');
        display.value += voiceInput;
    };

    recognition.onerror = function(event) {
        alert('Voice recognition error: ' + event.error);
    };
} else {
    voiceBtn.disabled = true;
    voiceBtn.title = "Voice recognition not supported";
}
