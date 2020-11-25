
export function clearChild(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }    
}

export function createHeader(columns) {
    const thead = document.createElement('thead');
    thead.setAttribute('class', 'thead-dark');
    const tr = document.createElement('tr');
    for (let col of columns) {
        const th = document.createElement('th');
        th.textContent = col;
        tr.appendChild(th);
    }
    thead.append(tr);
    return thead;
}

export function createRow(columns) {
    const tr = document.createElement('tr');
    for (let col of columns) {
        const td = document.createElement('td');
        td.style.whiteSpace = 'pre-wrap';
        td.textContent = col;
        tr.appendChild(td);
    }
    return tr;
}

/**
 * returns the last element of an array
 * @param {Array<Object>} arr 
 * @returns {Object} the last element of the array
 */
export function lastElement(arr) {
    return arr[arr.length - 1];
}

/**
 * 
 * @param {File} file 
 * @param {function(ProgessEvent<FileReader>): void} onload 
 * @param {function(ProgessEvent<FileReader>): void} onerror 
 */
export function readFile(file, onload, onerror) {
    const xmlreader = new FileReader();
    xmlreader.onload = onload;
    xmlreader.onerror = onerror;
    xmlreader.readAsText(file, 'UTF-8');
}
