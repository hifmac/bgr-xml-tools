/**
 * @file databrowser.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

import { BgrXmlLoader } from './bgr/bgr.xml.js'
import { concat, rankNumber2String } from './bgr/bgr.util.js'
import { Table } from './bgr/bgr.table.js'

export function DataBrowser() {
    /** @type {HTMLSelectElement} */
    this.__dataBrowserType = document.getElementById('data-browser-type');
    this.__dataBrowserType.addEventListener('change', this.onDataTypeChanged.bind(this));

    /** @type {(BgrXmlLoader | null)} */
    this.__loader = null;

    this.__table = new Table(document.getElementById('data-browser-table'));
}

DataBrowser.prototype.onDataTypeChanged = function DataBrowser_onDataTypeChanged() {
    if (!this.__loader) {
        alert('XMLがないのじゃ！');
        return 
    }

    const rows = [];
    const self = this;
    switch (this.__dataBrowserType.value) {
    case 'unit':
        this.__loader.forEachUnitBase(function(unitBase) {
            rows.push([
                parseInt(unitBase.id),
                parseInt(unitBase.groupId),
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
            ]);
        });

        this.__table.update([
                'ID',
                'キャラID',
                '名前',
                'ランク',
                '最大レベル',
                '所属',
                '召喚CD',
                'HP',
                '攻撃力',
                '攻撃速度',
                '防御力',
                'クリティカル',
                '移動速度',
            ],
            rows);

        this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
        break;
    case 'equip':
        this.__loader.forEachEquipBase(function(equipBase) {
            rows.push([
                parseInt(equipBase.id),
                self.__loader.getItem(equipBase.id).name,
                equipBase.open,
                equipBase.over,
                rankNumber2String(parseInt(equipBase.rank)),
                equipBase.baseLvMax,
                concat(equipBase.hp, equipBase.hpRate ? concat('(' , equipBase.hpRate, ')') : ''),
                concat(equipBase.attack, equipBase.attackRate ? concat('(' , equipBase.attackRate, ')') : ''),
                concat(equipBase.speed, equipBase.speedRate ? concat('(' , equipBase.speedRate, ')') : ''),
                concat(equipBase.defense, equipBase.defenseRate ? concat('(' , equipBase.defenseRate, ')') : ''),
                concat(parseInt(equipBase.critical * 1000) / 10, '%'),
                equipBase.move,
            ]);
        });

        this.__table.update([
                'ID',
                '名前',
                '開放',
                '上限解放',
                'ランク',
                'ベース最大レベル',
                'HP',
                '攻撃力',
                '攻撃速度',
                '防御力',
                'クリティカル',
                '移動速度',
            ],
            rows);

        this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
        break;
    case 'skill':
        break;
    case 'buffer':
        break;
    case 'item':
        this.__loader.forEachItem(function(itemBase) {
            rows.push([
                parseInt(itemBase.id),
                itemBase.mergeId,
                itemBase.name,
                itemBase.open,
                rankNumber2String(parseInt(itemBase.rank)),
                itemBase.group,
                itemBase.moneyPrice,
                itemBase.recycle,
                itemBase.stackNumber,
                itemBase.changeItem,
                itemBase.class,
                itemBase.comment,
                itemBase.effectValue,
                itemBase.goWindow,
                itemBase.windowId,
                itemBase.spPresentStart,
                itemBase.spPresentEnd,
                itemBase.spValue1,
                itemBase.spValue2,
                itemBase.specialPresent,
            ]);
        });

        this.__table.update([
                'ID',
                'マージID',
                '名前',
                '開放',
                'ランク',
                'グループ',
                '価格',
                'リサイクル',
                'スタック',
                '変化アイテム',
                'クラス',
                '説明',
                '効果値',
                'goWindow',
                'windowId',
                'spPresentStart',
                'spPresentEnd',
                'SP値1',
                'SP値2',
                'スペシャルプレゼント'
            ],
            rows);

        this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
        break;                                        
    }
};

/**
 * set loader
 * @param {BgrXmlLoader} loader 
 */
DataBrowser.prototype.setLoader = function DataBrowser_setLoader(loader) {
    this.__loader = loader;
};
