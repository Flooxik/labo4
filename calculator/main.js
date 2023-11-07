function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

function isNumeric(str) {
    return /^\d+(.\d+)?$/g.test(str);
}

function isDigit(str) {
    return /^\d$/g.test(str);
}

function isOperation(str) {
    return /^[\+\-\*\/]$/g.test(str);
}

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (const char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function compile(str) {
    let out = [];
    let stack = [];
    for (const token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

function evaluate(rpn) {
    let stack = [];
    let tokens = rpn.split(' ');
    tokens.forEach(token => {
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else {
            let b = stack.pop();
            let a = stack.pop();
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    if (b === 0) throw new Error("Division by zero.");
                    stack.push(a / b);
                    break;
                default:
                    throw new Error("Invalid operator.");
            }
        }
    });
    if (stack.length !== 1) throw new Error("Invalid RPN expression.");
    return stack[0];
}

function clickHandler(event) {
    let screen = document.querySelector('.screen span');
    let clickedElement = event.target;
    
    if (clickedElement.classList.contains('digit') || clickedElement.classList.contains('operation') || clickedElement.classList.contains('bracket')) {
        screen.textContent += clickedElement.textContent;
    } else if (clickedElement.classList.contains('clear')) {
        screen.textContent = '';
    } else if (clickedElement.classList.contains('result')) {
        try {
            let compiledExpression = compile(screen.textContent);
            let result = evaluate(compiledExpression);
            screen.textContent = parseFloat(result).toFixed(2);
        } catch (error) {
            screen.textContent = 'Ошибка';
            console.error(error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.buttons').addEventListener('click', clickHandler);
});
