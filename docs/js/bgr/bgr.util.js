/**
 * remove all children from an element
 * @param {HTMLElement} elem 
 */
export function clearChild(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }    
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
 * @param {function(ProgressEvent<FileReader>): void} onload 
 * @param {function(ProgressEvent<FileReader>): void} onerror 
 */
export function readFile(file, onload, onerror) {
    const xmlreader = new FileReader();
    xmlreader.onload = onload;
    xmlreader.onerror = onerror;
    xmlreader.readAsText(file, 'UTF-8');
}

/**
 * concatanates all arguments
 */
export function concat() {
    return Array.from(arguments).join('');
}


export function compareAsc(a, b) {
    if (a > b) {
        return 1;
    }
    else if (a < b) {
        return -1;
    }
    return 0;
}

export function compareDesc(a, b) {
    if (a < b) {
        return 1;
    }
    else if (a > b) {
        return -1;
    }
    return 0;
}

/**
 * compare 2 objects shallow
 * @param {Object} a 
 * @param {Object} b 
 * @returns {boolean} whether 2 objects look same or not
 */
export function compareDeep(a, b) {
    const aKeys = Object.keys(a);
    if (aKeys.length != Object.keys(b).length) {
        return false;
    }

    for (let key of aKeys) {
        if (a[key] !== b[key]) {
            if (typeof a[key] !== 'object' || typeof b[key] !== 'object' || !compareDeep(a[key], b[key])) {
                return false;
            }
        }
    }

    return true;
}

