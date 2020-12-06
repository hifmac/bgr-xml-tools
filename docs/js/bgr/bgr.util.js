/**
 * @file bgr.util.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

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
 * @template T
 * @param {Array<T>} array
 * @param {string} param
 * @param {asc} whether whether array should be sorted by ascending or not
 */
export function sortBy(array, param, asc=true) {
    if (asc) {
        array.sort(function(a, b){
            if (a[param] > b[param]) {
                return 1;
            }
            else if (a[param] < b[param]) {
                return -1;
            }
            return 0;
        });
    }
    else {
        array.sort(function(a, b){
            if (a[param] < b[param]) {
                return 1;
            }
            else if (a[param] > b[param]) {
                return -1;
            }
            return 0;
        });
    }
}

/**
 * translate Chinese to Japanese hopefully
 * @param {string} str 
 */
export function translate(str) {
    return str ? str.replace('集換證書', '交換チケット') : null;
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
 * }} properties 
 */
export function updateElement(element, properties) {
    if (properties.styles) {
        for (let key of Object.keys(properties.styles)) {
            element.style[key] = properties.styles[key];
        }        
    }

    if (properties.classes) {
        for (let cls of properties.classes) {
            element.classList.add(cls);
        }
    }

    if (properties.attributes) {
        for (let key of Object.keys(properties.attributes)) {
            element.setAttribute(key, properties.attributes[key]);
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

/**
 * convert rank number to string
 * @param {number} ranknum rank number
 * @returns {string} rank string
 */
export function rankNumber2String(ranknum) {
    switch(ranknum) {
    case 1:
        return 'N';
    case 2:
        return 'R';
    case 3:
        return 'SR';
    case 4:
        return 'SSR';
    case 5:
        return 'UR';
    default:
        return '不明';
    }
}

/**
 * get property or default value
 * @param {object} object 
 * @param {string} prop 
 * @param {*} defval 
 */
export function getProperty(object, prop, defval) {
    return object && prop in object ? object[prop] : defval;
}

/**
 * BGR XML boolean is true or not
 * @param {string} value 
 */
export function isTrue(value) {
    if (typeof value === 'string') {
        return value === '是';
    }
    return value;
}

/**
 * inline form checkbox
 * @param {string} id 
 * @param {string} text
 * @param {boolean} checked
 */
export function Checkbox(id, text, checked) {
    /**
     * @type {HTMLInputElement}
     */
    this.input = document.createElement('input');
    this.input.id = id;
    this.input.classList.add('form-check-input');
    this.input.setAttribute('type', 'checkbox');
    this.input.checked = typeof checked === 'undefined' ? true : checked;

    /**
     * @type {HTMLLabelElement}
     */
    this.label =document.createElement('label');
    this.label.classList.add('form-check-label');
    this.label.classList.add('mr-2');
    this.label.setAttribute('for', id);
    this.label.textContent = text;

    /**
     * @type {HTMLDivElement}
     */
    this.div = document.createElement('div');
    this.div.classList.add('form-check');
    this.div.classList.add('form-check-inline');
    this.div.appendChild(this.input);
    this.div.appendChild(this.label);
}

/**
 * inline form textbox
 * @param {string} id 
 * @param {string} text
 */
export function Textbox(id, text) {
    /**
     * @type {HTMLInputElement}
     */
    this.input = document.createElement('input');
    this.input.id = id;
    this.input.classList.add('form-control');
    this.input.classList.add('mr-2');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('placeholder', text);
    this.input.checked = true;

    /**
     * @type {HTMLLabelElement}
     */
    this.label = document.createElement('label');
    this.label.setAttribute('for', id);
    this.label.textContent = text + "：";

    /**
     * @type {HTMLDivElement}
     */
    this.div = document.createElement('div');
    this.div.classList.add('form-group');
    this.div.appendChild(this.label);
    this.div.appendChild(this.input);
}
