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
 * @template T type in the array
 * @param {Array<T>} arr to get last element
 * @returns {T} the last element of the array
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

export const updateTooltip = (function() {
    let updateTimer = null;
    let isPending = false;

    function updater() {
        if (isPending) {
            isPending = false;

            const tooltips = document.getElementsByClassName('tooltip');
            for (let i in tooltips) {
                if (tooltips[i].parentNode) {
                    tooltips[i].parentNode.removeChild(tooltips[i]);
                }
            }

            updateTimer = setTimeout(updater, 2000);
            $('[data-toggle="tooltip"]').tooltip({html: true});
        }
        else {
            updateTimer = null;
        }
    };

    return function() {
        isPending = true;
        if (updateTimer == null) {
            updater();
        }
    };
}());

/**
 * create element attributes
 * @param {HTMLElement} element 
 * @param {{
 *     styles: Object,
 *     classes: string[],
 *     attributes: Object,
 * }} options 
 */
export function updateElement(element, options) {
    if (options.styles) {
        for (let key of Object.keys(options.styles)) {
            element.style[key] = options.styles[key];
        }        
    }

    if (options.classes) {
        for (let cls of options.classes) {
            element.classList.add(cls);
        }
    }

    if (options.attributes) {
        for (let key of Object.keys(options.attributes)) {
            element.setAttribute(key, options.attributes[key]);
        }
    }
}

/**
 * create element
 * @param {string} elementName 
 * @param {(number | string)} text 
 * @returns {HTMLElement}
 */
export function createElement(elementName, text) {
    /** @type {HTMLElement} */
    const elem = document.createElement(elementName);
    elem.textContent = text;
    return elem;
}

/**
 * convert BGR server time to Date class
 * @param {number} serverTime BGR server time
 * @returns {Date} date
 */
export function convertServerTimeToDate(serverTime) {
    /**
     * maybe the seconds from year 1 to 1970
     */
    const OFFSET = 62135629207000;
    return new Date(serverTime / 10000 - OFFSET);
}
