const display = document.querySelector('.display');
let expression = '';
let angleMode = 'degrees'; // Default: degrees mode

function updateDisplay() {
    display.textContent = expression || '0';
}

function preprocessExpression(expr) {
    if (angleMode === 'degrees' && expr) {
        try {
            expr = expr.replace(/Math\.sin\$([^)]+)\$/g, 'Math.sin( ($1) * Math.PI / 180 )');
            expr = expr.replace(/Math\.cos\$([^)]+)\$/g, 'Math.cos( ($1) * Math.PI / 180 )');
            expr = expr.replace(/Math\.tan\$([^)]+)\$/g, 'Math.tan( ($1) * Math.PI / 180 )');
            console.log('Preprocessed expression:', expr); // Debug log
        } catch (error) {
            console.error('Preprocessing error:', error);
        }
    }
    return expr;
}

document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        const func = button.dataset.func;

        if (func) {
            expression += func;  // Add function string
        } else if (value === '=') {
            if (expression) {  // Only evaluate if expression is not empty
                try {
                    const processedExpr = preprocessExpression(expression);
                    expression = eval(processedExpr).toString();
                } catch (error) {
                    console.error('Evaluation error:', error);
                    expression = 'Error';
                }
            }
        } else if (value === 'AC') {
            expression = '';
        } else if (value === 'DEL') {
            expression = expression.slice(0, -1);
        } else if (value === '+/-') {
            expression = expression.startsWith('-') ? expression.slice(1) : '-' + expression;  // Improved toggle
        } else if (value === 'Deg/Rad') {
            angleMode = (angleMode === 'degrees') ? 'radians' : 'degrees';
            button.textContent = angleMode === 'degrees' ? 'Deg/Rad' : 'Rad/Deg';
            // Do not add to expression
        } else {
            expression += value.replace('×', '*').replace('÷', '/');
        }
        updateDisplay();
    });
});

// Voice Input Functionality
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.addEventListener('result', e => {
        const transcript = e.results[0][0].transcript.trim().toLowerCase();
        let processed = transcript
            .replace(/plus/gi, '+')
            .replace(/minus/gi, '-')
            .replace(/times/gi, '*')
            .replace(/multiplied by/gi, '*')
            .replace(/divided by/gi, '/')
            .replace(/to the power of/gi, '**')
            .replace(/power/gi, '**')
            .replace(/percentage/gi, '%');
        expression += processed + ' ';
        updateDisplay();
        console.log('Voice input added:', processed);  // Debug log
    });

    document.getElementById('voiceBtn').addEventListener('click', () => {
        recognition.start();
        console.log('Listening...');
    });
} else {
    document.getElementById('voiceBtn').textContent = 'Voice Not Supported';
    document.getElementById('voiceBtn').disabled = true;
}
