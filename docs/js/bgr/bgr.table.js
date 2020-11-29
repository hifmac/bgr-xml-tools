import {
    clearChild,
    compareAsc,
    compareDesc,
    createElement,
    updateElement,
} from './bgr.util.js'

/*return {
    'data-toggle': 'tooltip',
    'data-placement': 'top',
    title,
};*/

/**
 * @class table column class
 */
export function Column(name, format) {
    this.name = name;
    this.format = format;
}

/**
 * @member column column name
 * @type {string}
 */
Column.prototype.name = '';

/**
 * @member isEnabled controls this column is visible or not
 * @type {boolean}
 */
Column.prototype.isEnabled = true;

/**
 * @member format column value formatter
 * @type {function((number | string)): string}
 */
Column.prototype.format = null;

/**
 * @returns {string} human readable column string
 */
Column.prototype.string = function Column_string(value) {
    return (this.format ? this.format(value) : value);
};

/**
 * table row
 * @param {(number | string)[]} cells 
 * @param {{
 *     styles: Object,
 *     classes: string[],
 *     attributes: Object,
 * }} options 
 */
export function Row(cells, options) {
    this.cells = cells;
    this.options = options;
}

/** @type {(number | string)[]} */
Row.prototype.cells = null;

/**
 * @type {{
 *     styles: Object,
 *     classes: string[],
 *     attributes: Object,
 * }}
 */
Row.prototype.options = null;

export function Table() {
}

/**
 * table columns
 * @type {Column[]}
 */
Table.prototype.columns = null;

/**
 * data rows to show
 * @type {Row[]}
 */
Table.prototype.rows = null;

/**
 * table element
 * @type {HTMLTableElement}
 */
Table.prototype.element = null

/**
 * table sort column
 * @type {number}
 */
Table.prototype.sortColumn = null;

/**
 * data sort is whether ascending or descending
 * @type {boolean}
 */
Table.prototype.sortDescending = false;

/**
 * update table column
 */
Table.prototype.update = function Table_update() {
    if (this.columns && this.rows && this.element) {
        clearChild(this.element);
        this.element.classList.add('table-prewrap');
        this.element.appendChild(this.createHeader());
        this.element.appendChild(this.createBody());
    }
}


/**
 * create table header
 * @returns {HTMLTableCaptionElement}
 */
Table.prototype.createHeader = function Table_createHeader() {
    /** @type {HTMLTableRowElement} */
    const row = document.createElement('tr');
    for (let column of this.columns) {
        const columnName = column.name + (this.sortColumn === column ? (this.sortDescending ? '▽' : '△') : ''); 
        const cell = createElement('th', columnName);
        cell.addEventListener('click', this.onHeaderClicked.bind(this, column));
        row.append(cell);
    }

    /** @type {HTMLTableCaptionElement} */
    const thead = document.createElement('thead');
    thead.classList.add('thead-dark');
    thead.append(row);
    return thead;
};

/**
 * create table body
 * @returns {HTMLTableSectionElement}
 */
Table.prototype.createBody = function Table_createBody() {
    /*
     * sort table objects if there is a sorter
     */
    if (this.sortColumn) {
        for (let i in this.columns) {
            if (this.sortColumn === this.columns[i]) {
                const compare = this.sortDescending ? compareDesc : compareAsc;
                this.rows.sort((a, b) => compare(a.cells[i], b.cells[i]));
                break;
            }
        }
    }

    /** @type {HTMLTableSectionElement} */
    const tbody = document.createElement('tbody');
    for (let row of this.rows) {
        /** @type {HTMLTableRowElement} */
        const tr = document.createElement('tr');
        if (row.options) {
            updateElement(tr, row.options);
        }
        for (let i in row.cells) {
            if (this.columns[i].isEnabled) {
                tr.append(createElement('td', this.columns[i].string(row.cells[i])));
            }
        }
        tbody.append(tr);
    }

    return tbody;
};

/**
 * update sort column and table when the header is clicked
 * @param {Column} column 
 */
Table.prototype.onHeaderClicked = function Table_onHeaderClicked(column) {
    if (this.sortColumn === column) {
        this.sortDescending = !this.sortDescending;
    }
    else {
        this.sortColumn = column;
        this.sortDescending = true;
    }
    this.update();
};
