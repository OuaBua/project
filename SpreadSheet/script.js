const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn")
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, colName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.colName = colName;
        this.active = active;
    }
}

exportBtn.onclick = function (e) {
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++) {
        if (i === 0) continue;
        csv +=
            spreadsheet[i]
                .filter(item => !item.isHeader)
                .map(item => item.data)
                .join(',') + "\r\n";
    }

    const csvObj = new Blob([csv]);
    console.log('csvObj', csvObj);

    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
}

initSpreadsheet();

function initSpreadsheet() {
    
    for(let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++){
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            
            if(i === 0) {
                cellData = alphabet[j-1]
                isHeader = true;
                disabled = true;
            }
            if(j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }
            if(cellData === 0) {
                cellData = '';
            }

            const rowName = i;
            const colName = alphabet[j-1];

            const cell = new Cell(isHeader,disabled,cellData,i,j,rowName,colName,false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
   
    //console.log(spreadsheet);
    drawSheet();
}



function createCell(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader) {
        cellEl.classList.add('header');
    }

    cellEl.onclick = () => cellClickedEvent(cell);
    cellEl.onchange = (e) => onHandeleChange(e.target.value, cell);
    

    return cellEl;
}

function cellClickedEvent(cell) {
    clearStatus();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0]

    const columnHeaderEl = getFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl =getFromRowCol(rowHeader.row, rowHeader.column);

    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');

    document.querySelector('#cell-status').innerHTML = cell.colName + cell.rowName;
    
}

function onHandeleChange(data, cell) {
    cell.data = data;
}

function clearStatus() {
    const header = document.querySelectorAll('.header');

    header.forEach((header) => {
        header.classList.remove('active');
    })
}

function getFromRowCol(row, col) {
    return document.querySelector('#cell_' + row + col)
}
function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement('div');
        rowContainerEl.className = 'cell-row';
        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = createCell(spreadsheet[i][j]);
            rowContainerEl.append(cell);
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}