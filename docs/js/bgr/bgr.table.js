/**
 * @file bgr.table.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

import {
    clearChild,
    createElement,
    Checkbox,
} from './bgr.util.js'

/**
 * create empty table header
 * @param {number} num number of columns
 * @returns {HTMLTableCaptionElement}
 */
function createHeader(num) {
    /** @type {HTMLTableRowElement} */
    const row = document.createElement('tr');
    while (row.childNodes.length < num) {
        row.appendChild(document.createElement('th'));
    }

    /** @type {HTMLTableCaptionElement} */
    const thead = document.createElement('thead');
    thead.classList.add('thead-dark');
    thead.appendChild(row);
    return thead;
}

/**
 * DataTables interface
 * @param {HTMLTableElement} element table element 
 */
export function Table(element) {
    this.__element = element;

    /**
     * @type {{
     *     destroy: () => void,
     *     draw: () => void,
     *     rows: {
     *         add: (Object[][]) => void,
     *     },
     * }}
     */
    this.__dataTable = null;
}

/**
 * update and redraw table
 * @param {Table.Column[]} columns 
 * @param {(number | string)[][]} rows 
 */
Table.prototype.update = function Table_update(columns, rows) {
    if (this.__dataTable) {
        this.__dataTable.destroy();
        this.__dataTable = null;
    }

    clearChild(this.__element);
    this.__element.classList.add('table-prewrap');
    this.__element.appendChild(createHeader(columns.length));

    const lengthMenu = [ [], [] ];
    const maxLength = Math.min(1000, rows.length / 3 | 0);
    for (let i = 10; i <= maxLength;) {
        lengthMenu[0].push(i);
        lengthMenu[1].push(i);
        if (i % 3 == 0) {
            i = i * 10 / 3;
        }
        else {
            i *= 3;
        }
    }
    lengthMenu[0].push(-1);
    lengthMenu[1].push('All');

    this.__dataTable = $(this.__element).DataTable({
        columns,
        order: [ [0, 'asc'] ],
        paging: true,
        lengthMenu,
        pageLength: rows.length < 3000 ? -1 : 1000,
        pagingType: 'full_numbers',
    });
    this.__dataTable.rows.add(rows);
    this.__dataTable.draw();
};

/**
 * set column selector
 * @param {HTMLElement} element 
 */
Table.prototype.setColumnSelector = function Table_setColumnSelector(element) {
    element.textContent = '列：';

    clearChild(element);
    const tableId = this.__dataTable.table().node().id;
    for (let i = 0, length = this.__dataTable.columns().nodes().length; i < length; ++i) {
        const column = this.__dataTable.column(i);
        const checkbox = new Checkbox(tableId + '-' + i, column.header().textContent, column.visible());
        checkbox.input.addEventListener('change', () => column.visible(checkbox.input.checked));
        element.appendChild(checkbox.div);
    }
}

Table.columnType = {
    NUM: 'num',
    NUM_FMT: 'num-fmt',
    STRING: 'string',
    DATE: 'date',
}

/**
 * @constructor table column
 * @param {string} title column title string
 * @param {string} [type] column data type
 */
Table.Column = function TableColumn(title, type) {
    this.title = title;
    if (type) {
        this.type = type;
    }
};

/**
 * @constructor system column to be hidden
 * @param {string} title column title string
 * @param {string} type column data type
 */
Table.SystemColumn = function TableSystemColumn(title, type) {
    this.title = title;
    this.type = type;
    this.visible = false;
    this.searchable = false;
};
