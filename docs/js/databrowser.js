import { BgrXmlLoader } from './bgr/bgr.xml.js'
import { concat, rankNumber2String } from './bgr/bgr.util.js'
import { Table, Column, Row } from './bgr/bgr.table.js'

export function DataBrowser() {
    /** @type {HTMLSelectElement} */
    this.__dataBrowserType = document.getElementById('data-browser-type');
    this.__dataBrowserType.addEventListener('change', this.onDataTypeChanged.bind(this));

    this.__dataTable = new Table();
    this.__dataTable.element = document.getElementById('data-browser-table');

    /** @type {(BgrXmlLoader | null)} */
    this.__loader = null;
}

DataBrowser.prototype.onDataTypeChanged = function DataBrowser_onDataTypeChanged() {
    if (!this.__loader) {
        alert('XMLがないのじゃ！');
        return 
    }

    const self = this;
    switch (this.__dataBrowserType.value) {
    case 'unit':
        self.__dataTable.columns = [
            new Column('キャラID'),
            new Column('ID'),
            new Column('名前'),
            new Column('ランク'),
            new Column('最大レベル'),
            new Column('所属'),
            new Column('召喚CD'),
            new Column('HP'),
            new Column('攻撃力'),
            new Column('攻撃速度'),
            new Column('防御力'),
            new Column('クリティカル'),
            new Column('移動速度'),
        ];

        self.__dataTable.rows = [];
        this.__loader.forEachUnitBase(function(unitBase) {
            self.__dataTable.rows.push(new Row([
                parseInt(unitBase.groupId),
                parseInt(unitBase.id),
                unitBase.name,
                unitBase.bgRank == '是' ? 'BG' : rankNumber2String(parseInt(unitBase.rank)),
                unitBase.maxLv,
                unitBase.attribute,
                unitBase.summonCooldown,
                concat(unitBase.hp, unitBase.hpRate ? concat('(' , unitBase.hpRate, ')') : ''),
                concat(unitBase.attack, unitBase.attackRate ? concat('(' , unitBase.attackRate, ')') : ''),
                concat(unitBase.speed, unitBase.speedRate ? concat('(' , unitBase.speedRate, ')') : ''),
                concat(unitBase.defense, unitBase.defenseRate ? concat('(' , unitBase.defenseRate, ')') : ''),
                concat(parseInt(unitBase.critical * 1000) / 10, '%'),
                unitBase.move,
            ]));
        });
        break;
    case 'equip':
        break;
    case 'skill':
        break;
    case 'buffer':
        break;
    case 'item':
        break;                                        
    }

    this.__dataTable.update();
};

/**
 * set loader
 * @param {BgrXmlLoader} loader 
 */
DataBrowser.prototype.setLoader = function DataBrowser_setLoader(loader) {
    this.__loader = loader;
};
