const tableId = ".datasource-scroll-table";
const dateCheckbox = document.querySelector("#date-column-checkbox");
const timeCheckbox = document.querySelector("#time-column-checkbox");
const typeCheckbox = document.querySelector("#type-column-checkbox");
const profitCheckbox = document.querySelector("#profit-column-checkbox");
const expensesCheckbox = document.querySelector("#expenses-column-checkbox");
const checkboxes = [dateCheckbox, timeCheckbox, typeCheckbox, profitCheckbox, expensesCheckbox];
const groupSelector = document.querySelector('#group-select');
const nonGrouping = document.querySelector('#non');
const dateGrouping = document.querySelector('#date');
let activeCheckboxCounter = 0;

myStatementData.sort(function (a, b) {
    return Date.parse(a.date) - Date.parse(b.date);
});

function writeRowStatement(table, date, time, typeOperation, profit, expenses) {
    let row = document.createElement("TR");
    let dateColumn = document.createElement("TD");
    let timeColumn = document.createElement("TD");
    let typeColumn = document.createElement("TD");
    let profitColumn = document.createElement("TD");
    let expensesColumn = document.createElement("TD");

    dateColumn.setAttribute('class', 'date-column');
    timeColumn.setAttribute('class', 'time-column');
    typeColumn.setAttribute('class', 'type-column');
    profitColumn.setAttribute('class', 'profit-column');
    expensesColumn.setAttribute('class', 'expenses-column');

    dateColumn.appendChild(document.createTextNode(date));
    timeColumn.appendChild(document.createTextNode(time));
    typeColumn.appendChild(document.createTextNode(typeOperation));

    if (profit !== null && profit !== 0) {
        profitColumn.appendChild(document.createTextNode('+' + profit));
    }
    if (expenses !== null && expenses !== 0) {
        expensesColumn.appendChild(document.createTextNode(expenses));
    }
    row.appendChild(dateColumn);
    row.appendChild(timeColumn);
    row.appendChild(typeColumn);
    row.appendChild(profitColumn);
    row.appendChild(expensesColumn);
    table.appendChild(row);
}

function printFullDateStatement(tableId) {
    groupByDateCheckboxMod(false);
    removeOldTable(tableId);
    let table = document.querySelector(tableId).querySelector('tbody');
    myStatementData.forEach(function (elem) {
        const elemDateTime = new Date(elem.date);
        const elemDate = elemDateTime.toLocaleDateString();
        const elemTime = elemDateTime.toLocaleTimeString();
        const elemType = elem.type;
        const elemMoney = Number(elem.amount);
        const localeStringMoney = elemMoney.toLocaleString('default', {style: 'currency', currency: 'RUB'});
        if (elemMoney > 0) {
            writeRowStatement(table, elemDate, elemTime, elemType, localeStringMoney, null);
        } else if (elemMoney < 0) {
            writeRowStatement(table, elemDate, elemTime, elemType, null, localeStringMoney);
        } else {
            writeRowStatement(table, elemDate, elemTime, elemType, null, null);
        }
    });
    updateVisibility();
}

function changeColumnVisibility(checkbox) {
    let columnClass;
    switch (checkbox) {
        case dateCheckbox:
            columnClass = '.date-column';
            break;
        case timeCheckbox:
            columnClass = '.time-column';
            break;
        case typeCheckbox:
            columnClass = '.type-column';
            break;
        case profitCheckbox:
            columnClass = '.profit-column';
            break;
        case expensesCheckbox:
            columnClass = '.expenses-column';
            break;
    }
    let columnArray = document.querySelectorAll(columnClass);
    if (checkbox.checked) {
        activeCheckboxCounter++;
        columnArray.forEach(function (elem) {
            elem.style.display = "";
        });
    } else {
        activeCheckboxCounter--;
        columnArray.forEach(function (elem) {
            elem.style.display = "none";
        });
    }
}

function updateVisibility() {
    checkboxes.forEach(function (elem) {
        changeColumnVisibility(elem);
    });
}

dateCheckbox.addEventListener('change', () => {
    changeColumnVisibility(dateCheckbox);
    checkCheckboxesForBlocking();
})

timeCheckbox.addEventListener('change', () => {
    changeColumnVisibility(timeCheckbox);
    checkCheckboxesForBlocking();
})
typeCheckbox.addEventListener('change', () => {
    changeColumnVisibility(typeCheckbox);
    checkCheckboxesForBlocking();
})
profitCheckbox.addEventListener('change', () => {
    changeColumnVisibility(profitCheckbox);
    checkCheckboxesForBlocking();
})
expensesCheckbox.addEventListener('change', () => {
    changeColumnVisibility(expensesCheckbox);
    checkCheckboxesForBlocking();
})

function checkCheckboxesForBlocking() {
    if (activeCheckboxCounter === 1) {
        checkboxes.forEach(function (elem) {
            if (elem.checked) {
                elem.disabled = true;
            }
        });
    } else {
        checkboxes.forEach(function (elem) {
            elem.disabled = false;
        });
    }
}

function groupByDate(tableId) {
    groupByDateCheckboxMod(true);
    removeOldTable(tableId);
    let table = document.querySelector(tableId).querySelector('tbody');
    let pastDate = null;
    let profitSum = 0;
    let expensesSum = 0;
    myStatementData.forEach(function (elem) {
        const currentDate = new Date(elem.date).toLocaleDateString();
        const elemMoney = Number(elem.amount);
        const currentProfit = elemMoney > 0 ? elemMoney : 0;
        const currentExpenses = elemMoney < 0 ? elemMoney : 0;
        if (pastDate === null) {
            pastDate = currentDate;
        } else if (pastDate !== new Date(elem.date).toLocaleDateString()) {
            writeRowStatement(table, pastDate, null, null, profitSum, expensesSum);
            pastDate = new Date(elem.date).toLocaleDateString()
            profitSum = 0;
            expensesSum = 0;
        }
        profitSum += currentProfit;
        expensesSum += currentExpenses;
    });
    updateVisibility();
}

function groupByDateCheckboxMod(isGroupByDateMod) {
    activeCheckboxCounter = 0;
    if (isGroupByDateMod) {
        checkboxes.forEach(function (elem) {
            elem.checked = elem !== timeCheckbox && elem !== typeCheckbox;
            elem.disabled = true;
        });
    } else {
        checkboxes.forEach(function (elem) {
            elem.checked = true;
            elem.disabled = false;
        });
    }
}

function removeOldTable(tableId) {
    let oldTable = document.querySelector(tableId).querySelector('tbody');
    let newTable = document.createElement('tbody');
    oldTable.parentNode.replaceChild(newTable, oldTable);
}

groupSelector.addEventListener('change', () => {
    if (nonGrouping.selected) {
        printFullDateStatement(tableId);
    }
    if (dateGrouping.selected) {
        groupByDate(tableId);
    }
});

printFullDateStatement(tableId);