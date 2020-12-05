/**
 * @file databrowser.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

import { BgrXmlLoader } from './bgr/bgr.xml.js'
import {
    concat,
    rankNumber2String,
    getProperty,
    isTrue,
    sortBy
} from './bgr/bgr.util.js'
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

    switch (this.__dataBrowserType.value) {
    case 'unit':
        this.setUnitTable();
        break;
    case 'equip':
        this.setEquipTable();
        break;
    case 'skill':
        break;
    case 'buffer':
        break;
    case 'item':
        this.setItemTable();
        break;
    case 'achievement':
        this.setAchievementTable();
        break;
    case 'quest':
        this.setQuestTable();
        break;            
    case 'specialitem':
        this.setSpecialItemTable();
        break;
    case 'stage':
        this.setStageTable();
        break;
    }
};

DataBrowser.prototype.setUnitTable = function DataBrowser_setUnitTable() {
    const rows = [];

    this.__loader.forEachUnitBase(function(unitBase) {
        rows.push([
            parseInt(unitBase.id),
            parseInt(unitBase.groupId),
            unitBase.name,
            isTrue(unitBase.bgRank) ? 'BG' : rankNumber2String(parseInt(unitBase.rank)),
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
}

DataBrowser.prototype.setEquipTable = function DataBrowser_setEquipTable() {
    const rows = [];

    this.__loader.forEachEquipBase((equipBase) => rows.push([
        parseInt(equipBase.id),
        this.__loader.getItem(equipBase.id).name,
        equipBase.open,
        equipBase.over,
        equipBase.rank,
        equipBase.baseLvMax,
        concat(equipBase.hp, equipBase.hpRate ? concat('(' , equipBase.hpRate, ')') : ''),
        concat(equipBase.attack, equipBase.attackRate ? concat('(' , equipBase.attackRate, ')') : ''),
        concat(equipBase.speed, equipBase.speedRate ? concat('(' , equipBase.speedRate, ')') : ''),
        concat(equipBase.defense, equipBase.defenseRate ? concat('(' , equipBase.defenseRate, ')') : ''),
        concat(parseInt(equipBase.critical * 1000) / 10, '%'),
        equipBase.move,
    ]));

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
}

DataBrowser.prototype.setItemTable = function DataBrowser_setItemTable() {
    /**
     * format change item in item
     * @param {BgrXmlLoader} loader 
     * @param {string[][]} changeItem 
     */
    const formatChangeItem = function(loader, changeItem) {
        if (changeItem) {
            return Array.from(
                changeItem,
                (x) => concat(getProperty(loader.getItem(x[0]), 'name', x[0]), 'x', x[1])).join('\n');
        }
        return changeItem;
    };

    const rows = [];
    this.__loader.forEachItem((itemBase) => rows.push([
        parseInt(itemBase.id),
        itemBase.mergeId,
        itemBase.name,
        itemBase.open,
        rankNumber2String(parseInt(itemBase.rank)),
        itemBase.group,
        itemBase.moneyPrice,
        itemBase.recycle,
        itemBase.stackNumber,
        formatChangeItem(this.__loader, itemBase.changeItem),
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
    ]));

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
};

DataBrowser.prototype.setAchievementTable = function DataBrowser_setAchievementTable() {
    const rows = [];

    this.__loader.forEachAchievement((achievement) => rows.push([
        parseInt(achievement.id),
        achievement.groupId,
        achievement.open,
        achievement.name,
        achievement.type,
        achievement.level,
        achievement.proudstone,
        achievement.tarInfo,
        achievement.comment,
        achievement.display,
        Array.from(achievement.fin, (x) => concat(x.type, '/', x.cnt, '/', x.tar)).join('\n'),
        achievement.allfin,
    ]));

    this.__table.update([
            'ID',
            'グループID',
            '開放',
            '名前',
            '種類',
            'レベル',
            '栄誉石',
            '条件',
            '説明',
            'display',
            'fin',
            'allfin',
        ],
        rows);

    this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
};

DataBrowser.prototype.setQuestTable = function DataBrowser_setQuestTable() {
    const rows = [];

    this.__loader.forEachQuest((quest) => rows.push([
        parseInt(quest.id),
        quest.open,
        quest.type,
        quest.name,
        Array.from(
            quest.item.filter((x) => x),
            (x) => getProperty(this.__loader.getItem(x), 'name', x)),
        quest.money,
        quest.startTime,
        quest.endTime,
        quest.week,
        quest.comment,
        quest.expeditionGroupId,
        quest.specialActId,
    ]));

    this.__table.update([
            'ID',
            '開放',
            '種類',
            '名前',
            'アイテム',
            'シルバ',
            '開始時間',
            '終了時間',
            '曜日',
            '説明',
            '大遠征グループID',
            'specialActId',
        ],
        rows);

    this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
};

DataBrowser.prototype.setSpecialItemTable = function DataBrowser_setSpecialItemTable() { 
    /**
     * format items
     * @param {BgrXmlLoader} loader 
     * @param {BgrXmlSpecialItem[]} spitems
     */
    const formatItem = function(loader, spitems) {
        if (spitems.length) {
            /*
             * concat all items in spitem 
             */
            let items = [];
            for (let spitem of spitems) {
                items.push(...spitem.item)
            }
            sortBy(items, 'probability', false);

            /*
             * sum total probability 
             */
            let totalProb = 0;
            for (let item of items) {
                if (item.probability) {
                    totalProb += parseInt(item.probability);
                }
            }

            /*
             * make item name string 
             */
            const ret = [];
            for (let i of items) {
                const unit = loader.getUnitBase(i.content);
                const item = loader.getItem(i.content);
                let prob;
                if (100 <= totalProb) {
                        prob = concat('(', parseInt(i.probability / totalProb * 10000) / 100, '%)');
                }
                else if (totalProb && i.probability) {
                    prob = concat('(', i.probability, ')');
                }
                else {
                    prob = '';
                }
                if (item) {
                    ret.push(item.name + prob);
                }
                else if (unit) {
                    ret.push(unit.name + prob);
                }
                else if (i.content) {
                    ret.push(i.content + prob);
                }
            }

            return ret.join('\n');
        }
        return item;
    }

    /** @type {Map<number, BgrXmlSpecialItem[]} */
    const groupMap = new Map();
    this.__loader.forEachSpecialItem(function(spitem) {
        const groupId = spitem.group || spitem.id;
        if (!groupMap.has(groupId)) {
            groupMap.set(groupId, []);
        }

        if (spitem.sp_val) {
            groupMap.get(groupId).unshift(spitem);
        }
        else {
            groupMap.get(groupId).push(spitem);
        }
    });

    const rows = [];
    groupMap.forEach((spitems) => rows.push([
        parseInt(spitems[0].group || spitems[0].id),
        Array.from(spitems, (x) => x.id).join('\n'),
        spitems[0].name,
        spitems[0].comment,
        formatItem(this.__loader, spitems),
        spitems[0].sp_num1,
        spitems[0].sp_num2,
        spitems[0].sp_val,
    ]));

    this.__table.update([
            'グループID',
            'ID',
            '名前',
            '説明',
            'アイテム',
            'SP数1',
            'SP数2',
            'SP値',
        ],
        rows);

    this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
};

/**
 * set loader
 * @param {BgrXmlLoader} loader 
 */
DataBrowser.prototype.setLoader = function DataBrowser_setLoader(loader) {
    this.__loader = loader;
};
