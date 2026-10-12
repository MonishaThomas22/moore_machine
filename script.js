/* =====================================================
   MOORE MACHINE SIMULATOR
   ===================================================== */


/* ================= MACHINE DEFINITION =================

   States:
   q0, q1, q2

   Input alphabet:
   {0, 1}

   Output:
   q0 -> 0
   q1 -> 0
   q2 -> 1

   Transition function:

   q0:
      0 -> q0
      1 -> q1

   q1:
      0 -> q0
      1 -> q2

   q2:
      0 -> q0
      1 -> q2

========================================================= */


let transitionFunction = {

    q0: {
        0: "q0",
        1: "q1"
    },

    q1: {
        0: "q0",
        1: "q2"
    },

    q2: {
        0: "q0",
        1: "q2"
    }

};


let outputFunction = {

    q0: "0",

    q1: "0",

    q2: "1"

};


/* ================= SIMULATION VARIABLES ================= */

let inputString = "";

let currentState = "q0";

let currentPosition = 0;

let outputSequence = [];

let stateSequence = ["q0"];

let transitionHistory = [];

let simulationStarted = false;


/* ================= DOM ELEMENTS ================= */

const inputElement =
    document.getElementById("inputString");

const startButton =
    document.getElementById("startBtn");

const nextButton =
    document.getElementById("nextBtn");

const runButton =
    document.getElementById("runBtn");

const resetButton =
    document.getElementById("resetBtn");

const errorMessage =
    document.getElementById("errorMessage");

const currentStateElement =
    document.getElementById("currentState");

const currentInputElement =
    document.getElementById("currentInput");

const currentOutputElement =
    document.getElementById("currentOutput");

const stepCountElement =
    document.getElementById("stepCount");

const totalStepsElement =
    document.getElementById("totalSteps");

const statusTextElement =
    document.getElementById("statusText");

const latestTitleElement =
    document.getElementById("latestTitle");

const latestMessageElement =
    document.getElementById("latestMessage");

const resultInputElement =
    document.getElementById("resultInput");

const stateSequenceElement =
    document.getElementById("stateSequence");

const outputSequenceElement =
    document.getElementById("outputSequence");

const historyBody =
    document.getElementById("historyBody");

const transitionCountElement =
    document.getElementById("transitionCount");


/* ================= START SIMULATION ================= */

function startSimulation() {

    const value =
        inputElement.value.trim();


    /* Validate input */

    if (value === "") {

        showError(
            "Please enter a binary input string."
        );

        return;
    }


    if (!/^[01]+$/.test(value)) {

        showError(
            "Invalid input. Only 0 and 1 are allowed."
        );

        return;
    }


    /* Clear error */

    errorMessage.textContent = "";


    /* Save input */

    inputString = value;


    /* Reset simulation */

    currentState = "q0";

    currentPosition = 0;

    simulationStarted = true;


    /*
       IMPORTANT:

       Moore Machine produces the output
       of the INITIAL state before reading
       the first input.
    */

    outputSequence = [
        outputFunction[currentState]
    ];

    stateSequence = ["q0"];

    transitionHistory = [];


    /* Update interface */

    resultInputElement.textContent =
        inputString;

    totalStepsElement.textContent =
        inputString.length;

    stepCountElement.textContent = "0";

    currentStateElement.textContent =
        currentState;

    currentInputElement.textContent =
        "—";

    currentOutputElement.textContent =
        outputFunction[currentState];


    stateSequenceElement.textContent =
        stateSequence.join(" → ");

    outputSequenceElement.textContent =
        outputSequence.join("");


    statusTextElement.textContent =
        "Running";


    latestTitleElement.textContent =
        "Simulation started";


    latestMessageElement.textContent =
        `Initial state is q0 and its Moore output is λ(q0) = 0. ` +
        `Press Next Step to process the first input symbol.`;


    clearHistory();

    updateStateDiagram();

    highlightTableRow(currentState);

}


/* ================= NEXT STEP ================= */

function nextStep() {

    if (!simulationStarted) {

        showError(
            "Please enter an input and click Start Simulation first."
        );

        return;
    }


    /* Check whether input is finished */

    if (currentPosition >= inputString.length) {

        statusTextElement.textContent =
            "Completed";

        latestTitleElement.textContent =
            "Simulation completed";

        latestMessageElement.textContent =
            `All ${inputString.length} input symbols have been processed.`;

        return;
    }


    /* Get current input */

    const inputSymbol =
        inputString[currentPosition];


    /* Save old state */

    const oldState =
        currentState;


    /* Find next state */

    const nextState =
        transitionFunction[
            currentState
        ][inputSymbol];


    /* Move to next state */

    currentState =
        nextState;


    /* Moore output depends on NEW current state */

    const output =
        outputFunction[currentState];


    /* Save output */

    outputSequence.push(output);


    /* Save state */

    stateSequence.push(currentState);


    /* Create transition record */

    const transition = {

        step:
            currentPosition + 1,

        currentState:
            oldState,

        input:
            inputSymbol,

        nextState:
            currentState,

        output:
            output

    };


    transitionHistory.push(transition);


    /* Move position */

    currentPosition++;


    /* Update interface */

    currentStateElement.textContent =
        currentState;

    currentInputElement.textContent =
        inputSymbol;

    currentOutputElement.textContent =
        output;

    stepCountElement.textContent =
        currentPosition;


    stateSequenceElement.textContent =
        stateSequence.join(" → ");

    outputSequenceElement.textContent =
        outputSequence.join("");


    /* Latest transition */

    latestTitleElement.textContent =
        `${oldState} -- ${inputSymbol} --> ${currentState}`;

    latestMessageElement.textContent =
        `δ(${oldState}, ${inputSymbol}) = ${currentState}. ` +
        `The output of the new state is ` +
        `λ(${currentState}) = ${output}.`;


    /* Status */

    if (
        currentPosition >= inputString.length
    ) {

        statusTextElement.textContent =
            "Completed";

    } else {

        statusTextElement.textContent =
            "Running";

    }


    /* Update everything */

    updateStateDiagram();

    highlightTableRow(currentState);

    updateHistory();


}


/* ================= RUN ALL ================= */

function runAll() {

    if (!simulationStarted) {

        showError(
            "Please start the simulation first."
        );

        return;
    }


    while (
        currentPosition < inputString.length
    ) {

        nextStep();

    }

}


/* ================= RESET ================= */

function resetSimulation() {

    inputString = "";

    currentState = "q0";

    currentPosition = 0;

    outputSequence = [];

    stateSequence = ["q0"];

    transitionHistory = [];

    simulationStarted = false;


    inputElement.value = "";

    errorMessage.textContent = "";


    currentStateElement.textContent =
        "q0";

    currentInputElement.textContent =
        "—";

    currentOutputElement.textContent =
        "—";

    stepCountElement.textContent =
        "0";

    totalStepsElement.textContent =
        "0";

    statusTextElement.textContent =
        "Ready";


    latestTitleElement.textContent =
        "Awaiting first step";

    latestMessageElement.textContent =
        "Start the simulation, then advance one symbol at a time to inspect δ and λ.";


    resultInputElement.textContent =
        "—";

    stateSequenceElement.textContent =
        "—";

    outputSequenceElement.textContent =
        "—";


    clearHistory();

    updateStateDiagram();

    highlightTableRow("q0");

}


/* ================= UPDATE STATE DIAGRAM ================= */

function updateStateDiagram() {

    const states = Object.keys(transitionFunction);


    states.forEach(function(state) {

        const node =
            document.querySelector(
                `#${state}Node .state-circle`
            );

        const text =
            document.querySelector(
                `#${state}Node .state-name`
            );


        if (!node || !text) return;

        if (state === currentState) {

            node.classList.add("active");

            text.style.fill = "white";

        } else {

            node.classList.remove("active");

            text.style.fill = "#1e294e";

        }

    });

}


/* ================= HIGHLIGHT TABLE ================= */

function highlightTableRow(state) {

    const rows = Object.keys(transitionFunction);


    rows.forEach(function(rowState) {

        const row =
            document.getElementById(
                `row-${rowState}`
            );


        if (rowState === state) {

            row.classList.add(
                "selected-row"
            );

        } else {

            row.classList.remove(
                "selected-row"
            );

        }

    });

}


/* ================= UPDATE HISTORY ================= */

function updateHistory() {

    historyBody.innerHTML = "";


    transitionHistory.forEach(
        function(item) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.step}
                </td>

                <td>
                    ${item.currentState}
                </td>

                <td>
                    <strong>
                        ${item.input}
                    </strong>
                </td>

                <td>
                    ${item.nextState}
                </td>

                <td>
                    <span class="output-badge light">
                        ${item.output}
                    </span>
                </td>

            `;


            historyBody.appendChild(row);

        }
    );


    if (
        transitionHistory.length === 0
    ) {

        clearHistory();

    }


    transitionCountElement.textContent =
        `${transitionHistory.length} ` +
        `transition${transitionHistory.length === 1 ? "" : "s"} recorded`;

}


/* ================= CLEAR HISTORY ================= */

function clearHistory() {

    historyBody.innerHTML = `

        <tr>

            <td
                colspan="5"
                class="empty"
            >
                No transitions yet.
                Your execution trace will appear here.
            </td>

        </tr>

    `;


    transitionCountElement.textContent =
        "0 transitions recorded";

}


/* ================= ERROR ================= */

function showError(message) {

    errorMessage.textContent =
        message;

}


/* ================= CUSTOM STATE CREATION ================= */
const customStateList = document.getElementById("customStateList");
const addStateButton = document.getElementById("addStateBtn");
const newStateNameInput = document.getElementById("newStateName");
const newStateOutputSelect = document.getElementById("newStateOutput");
const customStateMessage = document.getElementById("customStateMessage");

function getStates() { return Object.keys(transitionFunction); }

function renderCustomStates() {
    if (!customStateList) return;
    const states = getStates();
    customStateList.innerHTML = states.map(state => `
        <div class="state-editor" data-state="${state}">
            <h3>${state} ${state === "q0" ? "· Initial state" : ""}</h3>
            <label for="output-${state}">Output λ(${state})</label>
            <select id="output-${state}" data-output-state="${state}">
                <option value="0" ${outputFunction[state] === "0" ? "selected" : ""}>0</option>
                <option value="1" ${outputFunction[state] === "1" ? "selected" : ""}>1</option>
            </select>
            <label for="zero-${state}">Next state for input 0</label>
            <select id="zero-${state}" data-transition-state="${state}" data-symbol="0">
                ${states.map(target => `<option value="${target}" ${transitionFunction[state]["0"] === target ? "selected" : ""}>${target}</option>`).join("")}
            </select>
            <label for="one-${state}">Next state for input 1</label>
            <select id="one-${state}" data-transition-state="${state}" data-symbol="1">
                ${states.map(target => `<option value="${target}" ${transitionFunction[state]["1"] === target ? "selected" : ""}>${target}</option>`).join("")}
            </select>
            ${state !== "q0" ? `<button type="button" class="delete-state-btn" data-delete-state="${state}">Delete ${state}</button>` : ""}
        </div>`).join("");

    customStateList.querySelectorAll("[data-output-state]").forEach(select => {
        select.addEventListener("change", () => {
            outputFunction[select.dataset.outputState] = select.value;
            resetForMachineChange(`Output for ${select.dataset.outputState} updated.`);
        });
    });
    customStateList.querySelectorAll("[data-transition-state]").forEach(select => {
        select.addEventListener("change", () => {
            transitionFunction[select.dataset.transitionState][select.dataset.symbol] = select.value;
            resetForMachineChange(`Transition updated for ${select.dataset.transitionState}.`);
        });
    });
    customStateList.querySelectorAll("[data-delete-state]").forEach(button => {
        button.addEventListener("click", () => deleteCustomState(button.dataset.deleteState));
    });
    renderDynamicDiagram();
    renderDynamicTransitionTable();
}

function resetForMachineChange(message) {
    simulationStarted = false;
    currentState = "q0";
    currentPosition = 0;
    outputSequence = [];
    stateSequence = ["q0"];
    transitionHistory = [];
    if (typeof clearHistory === "function") clearHistory();
    if (typeof updateStateDiagram === "function") updateStateDiagram();
    if (typeof highlightTableRow === "function") highlightTableRow("q0");
    customStateMessage.textContent = message + " Start a new simulation to apply the updated machine.";
}

function addCustomState() {
    const name = newStateNameInput.value.trim();
    if (!/^[A-Za-z][A-Za-z0-9_]{0,11}$/.test(name)) {
        customStateMessage.textContent = "Use a valid state name (letters/numbers/underscore, starting with a letter).";
        return;
    }
    if (transitionFunction[name]) {
        customStateMessage.textContent = `State ${name} already exists.`;
        return;
    }
    const states = getStates();
    transitionFunction[name] = { "0": "q0", "1": "q0" };
    outputFunction[name] = newStateOutputSelect.value;
    // Keep every state's transition options valid and default new targets to q0.
    renderCustomStates();
    newStateNameInput.value = "";
    resetForMachineChange(`State ${name} created successfully.`);
}

function deleteCustomState(name) {
    if (name === "q0") return;
    delete transitionFunction[name];
    delete outputFunction[name];
    Object.keys(transitionFunction).forEach(state => {
        ["0", "1"].forEach(symbol => {
            if (transitionFunction[state][symbol] === name) transitionFunction[state][symbol] = "q0";
        });
    });
    renderCustomStates();
    resetForMachineChange(`State ${name} deleted. Transitions pointing to it were redirected to q0.`);
}

function renderDynamicTransitionTable() {
    const table = document.querySelector(".result-grid table");
    if (!table) return;
    const oldBody = table.querySelector("tbody");
    if (!oldBody) return;
    oldBody.innerHTML = getStates().map(state => `
        <tr id="row-${state}" class="${state === currentState ? "selected-row" : ""}">
            <td>${state}</td><td>${transitionFunction[state]["0"]}</td><td>${transitionFunction[state]["1"]}</td>
            <td><span class="output-badge">${outputFunction[state]}</span></td>
        </tr>`).join("");
}

function renderDynamicDiagram() {
    const svg = document.querySelector(".state-svg");
    if (!svg) return;
    const states = getStates();
    const width = Math.max(900, states.length * 190 + 100);
    const height = 340;
    const positions = {};
    states.forEach((state, i) => positions[state] = { x: 80 + i * ((width - 160) / Math.max(1, states.length - 1)), y: 160 });
    const edges = [];
    states.forEach(state => ["0", "1"].forEach(symbol => {
        const target = transitionFunction[state][symbol];
        const a = positions[state], b = positions[target];
        if (!a || !b) return;
        if (state === target) {
            edges.push(`<path d="M ${a.x-24} ${a.y-24} C ${a.x-65} ${a.y-90}, ${a.x+65} ${a.y-90}, ${a.x+24} ${a.y-24}" fill="none" stroke="#3949d8" stroke-width="2" marker-end="url(#customArrow)"/><text x="${a.x}" y="${a.y-65}" text-anchor="middle" fill="#3949d8" font-size="14">${symbol}</text>`);
        } else {
            const midX = (a.x+b.x)/2, curve = symbol === "0" ? -22 : 22;
            edges.push(`<path d="M ${a.x+30} ${a.y} Q ${midX} ${a.y+curve} ${b.x-30} ${b.y}" fill="none" stroke="${symbol === "0" ? "#3949d8" : "#8b5cf6"}" stroke-width="2" marker-end="url(#customArrow)"/><text x="${midX}" y="${a.y+curve-7}" text-anchor="middle" fill="#3949d8" font-size="14">${symbol}</text>`);
        }
    }));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = `<defs><marker id="customArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3949d8"/></marker></defs>${edges.join("")}${states.map(state => { const p=positions[state]; return `<g id="${state}Node"><circle class="state-circle ${state === currentState ? "active" : ""}" cx="${p.x}" cy="${p.y}" r="30" fill="${state === currentState ? "#3949d8" : "white"}" stroke="#3949d8" stroke-width="3"/><text class="state-name" x="${p.x}" y="${p.y-3}" text-anchor="middle" fill="${state === currentState ? "white" : "#1e294e"}" font-size="15" font-weight="700">${state}</text><text x="${p.x}" y="${p.y+15}" text-anchor="middle" fill="${state === currentState ? "white" : "#6b4ce6"}" font-size="12">out:${outputFunction[state]}</text>${state === "q0" ? `<path d="M ${p.x-58} ${p.y} L ${p.x-34} ${p.y}" stroke="#3949d8" stroke-width="2" marker-end="url(#customArrow)"/>` : ""}</g>`; }).join("")}`;
}

if (addStateButton) addStateButton.addEventListener("click", addCustomState);
if (newStateNameInput) newStateNameInput.addEventListener("keydown", e => { if (e.key === "Enter") addCustomState(); });

/* ================= BUTTON EVENTS ================= */

startButton.addEventListener(
    "click",
    startSimulation
);

nextButton.addEventListener(
    "click",
    nextStep
);

runButton.addEventListener(
    "click",
    runAll
);

resetButton.addEventListener(
    "click",
    resetSimulation
);


/* ================= ENTER KEY ================= */

inputElement.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            startSimulation();

        }

    }
);


/* ================= INITIAL STATE ================= */

updateStateDiagram();

highlightTableRow("q0");