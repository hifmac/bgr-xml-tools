import { clearChild, compareAsc, compareDesc } from './bgr.util.js'

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

export function Table() {
}

/**
 * table columns
 * @type {Column[]}
 */
Table.prototype.columns = null;

/**
 * data objects to show
 * @type {Object[]}
 */
Table.prototype.objects = null;

/**
 * table element
 * @type {HTMLTableElement}
 */
Table.prototype.element = null

/**
 * header tag class list 
 * @type {string[]}
 */
Table.prototype.headerCellClasses = [];

/**
 * header tag attributes
 * @type {Object}
 */
Table.prototype.headerCellAttributes = {};

/** 
 * header tag class list
 * @type {string[]}
 */
Table.prototype.bodyCellClasses = [];

/** 
 * header tag attributes
 * @type {Object}
 */
Table.prototype.bodyCellAttributes = {};

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
    if (this.columns && this.objects && this.element) {
        clearChild(this.element);
        this.element.appendChild(this.createHeader());
        this.element.appendChild(this.createBody());
    }
}

/**
 * create table row
 * @returns {HTMLTableRowElement}
 */
Table.prototype.createCell = function Table_createCell(cellName, text, classNames, attributes) {
    /** @type {HTMLTableCellElement} */
    const cell = document.createElement(cellName);
    cell.textContent = text;
    for (let className of classNames) {
        cell.classList.add(className);
    }
    for (let attrname in attributes) {
        cell.setAttribute(attrname, attributes[attrname]);
    }
    return cell;
};

/**
 * create table header
 * @returns {HTMLTableCaptionElement}
 */
Table.prototype.createHeader = function Table_createHeader() {
    /** @type {HTMLTableRowElement} */
    const row = document.createElement('tr');
    for (let column of this.columns) {
        const columnName = column.name + (this.sortColumn === column ? (this.sortDescending ? '▽' : '△') : ''); 
        const cell = this.createCell('th', columnName, this.headerCellClasses, this.headerCellAttributes);
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
                this.objects.sort((a, b) => compare(a[i], b[i]));
                break;
            }
        }
    }

    /** @type {HTMLTableSectionElement} */
    const tbody = document.createElement('tbody');
    for (let data of this.objects) {
        /** @type {HTMLTableRowElement} */
        const row = document.createElement('tr');
        for (let i in data) {
            if (this.columns[i].isEnabled) {
                row.append(this.createCell('td', this.columns[i].string(data[i]), this.bodyCellClasses, this.bodyCellAttributes));
            }
        }
        tbody.append(row);
    }

    return tbody;
};

/**
 * update sort column and table when the header is clicked
 * @param {Column} column 
 */
Table.prototype.onHeaderClicked = function Table_onHeaderClicked(column) {
    console.log('clicked!');

    if (this.sortColumn === column) {
        this.sortDescending = !this.sortDescending;
    }
    else {
        this.sortColumn = column;
        this.sortDescending = true;
    }
    this.update();
};
