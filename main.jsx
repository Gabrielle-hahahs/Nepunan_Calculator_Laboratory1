import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const buttons = [
  ["AC", "clear"],
  ["⌫", "backspace"],
  ["÷", "operator"],
  ["×", "operator"],
  ["7", "number"],
  ["8", "number"],
  ["9", "number"],
  ["−", "operator"],
  ["4", "number"],
  ["5", "number"],
  ["6", "number"],
  ["+", "operator"],
  ["1", "number"],
  ["2", "number"],
  ["3", "number"],
  ["=", "equals"],
  ["0", "zero"],
  [".", "number"],
];

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);
  const [error, setError] = useState(false);

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustCalculated(false);
    setError(false);
  };

  const inputNumber = (number) => {
    if (error || justCalculated || waitingForOperand) {
      setDisplay(number);
      setWaitingForOperand(false);
      setJustCalculated(false);
      setError(false);
      return;
    }

    setDisplay((current) => current === "0" ? number : current + number);
  };

  const inputDecimal = () => {
    if (error || justCalculated || waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      setJustCalculated(false);
      setError(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const calculate = (first, second, selectedOperator) => {
    switch (selectedOperator) {
      case "+": return first + second;
      case "−": return first - second;
      case "×": return first * second;
      case "÷":
        if (second === 0) return null;
        return first / second;
      default: return second;
    }
  };

  const chooseOperator = (nextOperator) => {
    if (error) return;

    const inputValue = Number(display);

    if (operator && previousValue !== null && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operator);

      if (result === null || !Number.isFinite(result)) {
        setDisplay("Cannot divide by 0");
        setError(true);
        setPreviousValue(null);
        setOperator(null);
        return;
      }

      setDisplay(String(Number(result.toFixed(10))));
      setPreviousValue(result);
    } else {
      setPreviousValue(inputValue);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
    setJustCalculated(false);
  };

  const performCalculation = () => {
    if (operator === null || previousValue === null || error) return;

    const secondValue = Number(display);
    const result = calculate(previousValue, secondValue, operator);

    if (result === null || !Number.isFinite(result)) {
      setDisplay("Cannot divide by 0");
      setError(true);
      setPreviousValue(null);
      setOperator(null);
      return;
    }

    setDisplay(String(Number(result.toFixed(10))));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustCalculated(true);
  };

  const backspace = () => {
    if (error || justCalculated || waitingForOperand) return;

    setDisplay((current) => {
      if (current.length <= 1) return "0";
      return current.slice(0, -1);
    });
  };

  const handleButton = (value) => {
    if (value === "AC") clear();
    else if (value === "⌫") backspace();
    else if (value === ".") inputDecimal();
    else if (/^\d$/.test(value)) inputNumber(value);
    else if (value === "=") performCalculation();
    else chooseOperator(value);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (/^\d$/.test(key)) handleButton(key);
      else if (key === ".") handleButton(".");
      else if (key === "+") handleButton("+");
      else if (key === "-") handleButton("−");
      else if (key === "*") handleButton("×");
      else if (key === "/") {
        event.preventDefault();
        handleButton("÷");
      } else if (key === "Enter" || key === "=") handleButton("=");
      else if (key === "Escape" || key.toLowerCase() === "c") handleButton("AC");
      else if (key === "Backspace") handleButton("⌫");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="calculator-card">
      <div className="display">
        <div className="operation-label">
          {previousValue !== null && operator ? `${previousValue} ${operator}` : "Calculator"}
        </div>
        <div className={`display-value ${error ? "error-text" : ""}`}>
          {display}
        </div>
      </div>

      <div className="button-grid">
        {buttons.map(([label, type]) => (
          <button
            key={label}
            onClick={() => handleButton(label)}
            className={`calc-button ${type} ${label === "0" ? "zero" : ""}`}
            aria-label={`Calculator ${label} button`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function UserGuide() {
  return (
    <section className="guide-card">
      <h2>How to Use</h2>
      <ol>
        <li>Click a number button to enter a value.</li>
        <li>Select an operator: +, −, ×, or ÷.</li>
        <li>Enter the second number.</li>
        <li>Press <strong>=</strong> to display the result.</li>
        <li>Press <strong>AC</strong> to reset the calculator.</li>
      </ol>

      <h3>Supported Operations</h3>
      <div className="operation-list">
        <span>＋ Addition</span>
        <span>− Subtraction</span>
        <span>× Multiplication</span>
        <span>÷ Division</span>
      </div>

      <div className="keyboard-note">
        <strong>Keyboard support:</strong> You can also use your keyboard
        for numbers, operators, Enter, Escape, and Backspace.
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="course">DCIT 26 • Laboratory 1</p>
          <h1>Nepunan Calculator</h1>
          <p className="subtitle">
            A simple responsive calculator built with React and Tailwind CSS.
          </p>
        </div>
        <div className="badge">React + Tailwind</div>
      </header>

      <div className="content">
        <Calculator />
        <UserGuide />
      </div>

      <footer>
        <p>Created for DCIT 26: Application Development and Emerging Technologies</p>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);