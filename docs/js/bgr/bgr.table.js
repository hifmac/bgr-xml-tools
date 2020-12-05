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
    lastElement,
} from './bgr.util.js'

/**
 * create table header
 * @param {(string | number)[]} columns
 * @returns {HTMLTableCaptionElement}
 */
function createHeader(columns) {
    /** @type {HTMLTableRowElement} */
    const row = document.createElement('tr');
    for (let column of columns) {
        row.appendChild(createElement('th', column));
    }

    /** @type {HTMLTableCaptionElement} */
    const thead = document.createElement('thead');
    thead.classList.add('thead-dark');
    thead.appendChild(row);
    return thead;
};

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
 * @param {(number | string)[]} columns 
 * @param {(number | string)[][]} rows 
 */
Table.prototype.update = function Table_update(columns, rows) {
    if (this.__dataTable) {
        this.__dataTable.destroy();
        this.__dataTable = null;
    }

    clearChild(this.__element);
    this.__element.classList.add('table-prewrap');
    this.__element.appendChild(createHeader(columns));

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
        order: [ [0, 'asc'] ],
        paging: true,
        lengthMenu,
        pageLength: rows.length < 1000 ? -1 : 1000,
        pagingType: 'full_numbers',
    });
    this.__dataTable.rows.add(rows);
    this.__dataTable.draw();
}

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
        const checkbox = new Checkbox(tableId + '-' + i, column.header().textContent);
        checkbox.input.addEventListener('change', () => column.visible(checkbox.input.checked));
        element.appendChild(checkbox.div);
    }
}

