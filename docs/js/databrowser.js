/**
 * @file databrowser.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

import { BgrXmlCharacter, BgrXmlLoader, BgrXmlStage } from './bgr/bgr.xml.js'
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

    /** @type {HTMLInputElement} */
    this.__level = document.getElementById('data-browser-level');
    this.__level.addEventListener('change', this.onLevelChanged.bind(this));

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
        this.setUnitTable(this.__level.value);
        break;
    case 'character':
        this.setCharacterTable();
        break;
    case 'equip':
        this.setEquipTable(this.__level.value);
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

DataBrowser.prototype.onLevelChanged = function DataBrowser_onLevelChanged() {
    if (!this.__loader) {
        alert('XMLがないのじゃ！');
        return 
    }

    switch (this.__dataBrowserType.value) {
    case 'unit':
        this.setUnitTable(this.__level.value);
        break;
    case 'equip':
        this.setEquipTable(this.__level.value);
        break;
    case 'skill':
        break;
    case 'buffer':
        break;
    }
};

DataBrowser.prototype.setUnitTable = function DataBrowser_setUnitTable(level) {
    const rows = [];

    this.__loader.forEachUnitBase(function(unitBase) {
        const maxLevel = parseInt(getProperty(unitBase, 'maxLv', 0)) + 20;
        const unitLevel = Math.max(1, level < 0 ? maxLevel : level) - 1;
        rows.push([
            unitBase.id,
            unitBase.groupId,
            unitBase.name,
            isTrue(unitBase.bgRank) ? 'BG' : rankNumber2String(parseInt(unitBase.rank)),
            unitBase.maxLv,
            unitBase.attribute,
            unitBase.summonCooldown,
            parseInt(unitBase.hp) + getProperty(unitBase, 'hpRate', 0) * unitLevel | 0,
            unitBase.hpRate,
            parseInt(unitBase.attack) + getProperty(unitBase, 'attackRate', 0) * unitLevel | 0,
            unitBase.attackRate,
            parseInt(unitBase.speed) + getProperty(unitBase, 'speedRate', 0) * unitLevel | 0,
            unitBase.speedRate,
            parseInt(unitBase.defense) + getProperty(unitBase, 'defenseRate', 0) * unitLevel | 0,
            unitBase.defenseRate,
            concat(parseInt(unitBase.critical * 1000) / 10, '%'),
            unitBase.move,
            unitBase.suicideTime,
            unitBase.suicideHp,
        ]);
    });

    this.__table.update([
            new Table.Column('ID', Table.columnType.NUM),
            new Table.Column('キャラID', Table.columnType.NUM),
            new Table.Column('名前'),
            new Table.Column('ランク'),
            new Table.Column('最大レベル', Table.columnType.NUM),
            new Table.Column('所属'),
            new Table.Column('召喚CD', Table.columnType.NUM),
            new Table.Column('HP', Table.columnType.NUM),
            new Table.SystemColumn('HP(成長)', Table.columnType.NUM),
            new Table.Column('攻撃力', Table.columnType.NUM),
            new Table.SystemColumn('攻撃力(成長)', Table.columnType.NUM),
            new Table.Column('攻撃速度', Table.columnType.NUM),
            new Table.SystemColumn('攻撃速度(成長)', Table.columnType.NUM),
            new Table.Column('防御力', Table.columnType.NUM),
            new Table.SystemColumn('防御力(成長)', Table.columnType.NUM),
            new Table.Column('クリティカル', Table.columnType.NUM_FMT),
            new Table.Column('移動速度', Table.columnType.NUM),
            new Table.SystemColumn('自殺時間', Table.columnType.NUM),
            new Table.SystemColumn('自殺HP', Table.columnType.NUM),
        ],
        rows);

    this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
}

DataBrowser.prototype.setCharacterTable = function DataBrowser_setCharacterTable() {
    /**
     * format gp talk
     * @param {BgrXmlCharacter} character 
     */
    const formatGpTalk = function(character) {
        const ret = [];
    
        let num = 1;
        for (let talk of character.basegptalk) {
            if (talk) {
                ret.push(concat(num, '：「', talk , '」'));
            }
            ++num;
        }

        num = 4;
        for (let talk of character.addgptalk) {
            if (talk) {
                ret.push(concat(num, '：「', talk , '」'));
            }
            ++num;
        }

        return ret.join('\n');
    };

        /**
     * format skill talk
     * @param {BgrXmlCharacter} character 
     */
    const formatSkillTalk = function(character) {
        const ret = [];
    
        let num = 1;
        for (let talk of character.skillTalk) {
            if (talk) {
                ret.push(concat(num++, '：「', talk , '」'));
            }
        }

        return ret.join('\n');
    };

    const rows = [];
    this.__loader.forEachCharacter(function(character) {
        rows.push([
            character.id,
            character.open,
            character.type,
            character.name,
            character.cv,
            character.artist,
            character.skinOnly ? '〇' : '',
            character.comment,
            formatGpTalk(character),
            formatSkillTalk(character),
            character.marryTalk,
            character.sportsTalk,
            character.resource,
            character.bossBattleBonus,
        ]);
    });

    this.__table.update([
            new Table.Column('ID', Table.columnType.NUM),
            new Table.Column('開放'),
            new Table.Column('種類'),
            new Table.Column('名前'),
            new Table.Column('ユニット名'),
            new Table.Column('アーティスト'),
            new Table.Column('スキンキャラ'),
            new Table.Column('説明'),
            new Table.Column('タッチボイス'),
            new Table.Column('スキルボイス'),
            new Table.Column('結婚'),
            new Table.Column('体育祭'),
            new Table.SystemColumn('リソース'),
            new Table.SystemColumn('ボスバトルボーナス'),
        ],
        rows);

    this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
}

DataBrowser.prototype.setEquipTable = function DataBrowser_setEquipTable(level) {
    const rows = [];
    const loader = this.__loader;
    this.__loader.forEachEquipBase(function(equipBase) {
        const maxLevel = parseInt(getProperty(equipBase, 'baseLvMax', 0)) + parseInt(getProperty(equipBase, 'over', 0)) * 5;
        const equipLevel = level < 0 ? maxLevel : level;
        rows.push([
            equipBase.id,
            loader.getItem(equipBase.id).name,
            equipBase.open,
            equipBase.over,
            equipBase.rank,
            equipBase.baseLvMax,
            parseInt(equipBase.hp) + getProperty(equipBase, 'hpRate') * equipLevel | 0,
            equipBase.hpRate,
            parseInt(equipBase.attack) + getProperty(equipBase, 'attackRate') * equipLevel | 0,
            equipBase.attackRate,
            parseInt(equipBase.speed) + getProperty(equipBase, 'speedRate') * equipLevel | 0,
            equipBase.speedRate,
            parseInt(equipBase.defense) + getProperty(equipBase, 'defenseRate') * equipLevel | 0,
            equipBase.defenseRate,
            concat(parseInt(equipBase.critical * 1000) / 10, '%'),
            equipBase.move,
        ])
    });

    this.__table.update([
            new Table.Column('ID', Table.columnType.NUM),
            new Table.Column('名前'),
            new Table.Column('開放'),
            new Table.Column('上限解放', Table.columnType.NUM),
            new Table.Column('ランク'),
            new Table.Column('基本最大レベル', Table.columnType.NUM),
            new Table.Column('HP', Table.columnType.NUM),
            new Table.SystemColumn('HP(成長)', Table.columnType.NUM),
            new Table.Column('攻撃力', Table.columnType.NUM),
            new Table.SystemColumn('攻撃力(成長)', Table.columnType.NUM),
            new Table.Column('攻撃速度', Table.columnType.NUM),
            new Table.SystemColumn('攻撃速度(成長)', Table.columnType.NUM),
            new Table.Column('防御力', Table.columnType.NUM),
            new Table.SystemColumn('防御力(成長)', Table.columnType.NUM),
            new Table.Column('クリティカル', Table.columnType.NUM_FMT),
            new Table.Column('移動速度', Table.columnType.NUM),
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
            new Table.Column('ID', Table.columnType.NUM),
            new Table.SystemColumn('マージID', Table.columnType.NUM),
            new Table.Column('名前'),
            new Table.Column('開放'),
            new Table.Column('ランク'),
            new Table.Column('グループ'),
            new Table.Column('価格', Table.columnType.NUM),
            new Table.Column('リサイクル'),
            new Table.Column('スタック', Table.columnType.NUM),
            new Table.Column('変化アイテム'),
            new Table.Column('クラス'),
            new Table.Column('説明'),
            new Table.SystemColumn('効果値', Table.columnType.NUM),
            new Table.SystemColumn('goWindow'),
            new Table.SystemColumn('windowId'),
            new Table.SystemColumn('spPresentStart'),
            new Table.SystemColumn('spPresentEnd'),
            new Table.SystemColumn('SP値1', Table.columnType.NUM),
            new Table.SystemColumn('SP値2', Table.columnType.NUM),
            new Table.SystemColumn('スペシャルプレゼント'),
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
            new Table.Column('ID', Table.columnType.NUM),
            new Table.Column('グループID', Table.columnType.NUM),
            new Table.Column('開放'),
            new Table.Column('名前'),
            new Table.Column('種類'),
            new Table.Column('レベル', Table.columnType.NUM),
            new Table.Column('栄誉石', Table.columnType.NUM),
            new Table.Column('条件'),
            new Table.Column('説明'),
            new Table.SystemColumn('display'),
            new Table.SystemColumn('fin'),
            new Table.SystemColumn('allfin'),
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
        getProperty(this.__loader.getChapterGroup(quest.chapterGroupId), 'name', ''),
    ]));

    this.__table.update([
            new Table.Column('ID', Table.columnType.NUM),
            new Table.Column('開放'),
            new Table.Column('種類'),
            new Table.Column('名前'),
            new Table.Column('アイテム'),
            new Table.Column('シルバ', Table.columnType.NUM),
            new Table.Column('開始時間', Table.columnType.DATE),
            new Table.Column('終了時間', Table.columnType.DATE),
            new Table.Column('曜日'),
            new Table.Column('チャプターグループ'),
            new Table.Column('説明'),
            new Table.SystemColumn('大遠征グループID', Table.columnType.NUM),
            new Table.SystemColumn('specialActId', Table.columnType.NUM),
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

    /*
     * aggregate by group id
     */
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

    /*
     * make a table by spitem group
     */
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
            new Table.Column('グループID', Table.columnType.NUM),
            new Table.Column('ID', Table.columnType.NUM),
            new Table.Column('名前'),
            new Table.Column('説明'),
            new Table.Column('アイテム'),
            new Table.SystemColumn('SP数1', Table.columnType.NUM),
            new Table.SystemColumn('SP数2', Table.columnType.NUM),
            new Table.SystemColumn('SP値', Table.columnType.NUM),
        ],
        rows);

    this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
};

DataBrowser.prototype.setStageTable = function DataBrowser_setStageTable() {
    /**
     * format find stage 
     * @param {BgrXmlLoader} loader
     * @param {BgrXmlStage} stage 
     */
    const formatFind = function(loader, stage) {
        const findStage = loader.getItem(stage.findStage);
        if (findStage) {
            return concat(findStage.name, '(', stage.findProbability * 100 | 0, '%)');
        }
        return '';
    };

    /**
     * format cost item 
     * @param {BgrXmlLoader} loader
     * @param {BgrXmlStage} stage 
     */
    const formatCostItem = function(loader, stage) {
        const item = loader.getItem(stage.costItemId);
        if (item) {
            return concat(item.name, ' x', stage.costItemNum);
        }
        return '';
    };

    /**
     * format item rate
     * @param {BgrXmlLoader} loader
     * @param {{
     *     probability: number,
     *     itemId: number,
     *     numOfItems: number,
     * }[]} itemRate 
     */
    const formatItemRate = function(loader, itemRate) {
        const ret = [];
        for (let i of itemRate) {
            const item = loader.getItem(i.itemId);
            if (item) {
                ret.push(concat(100 * i.probability | 0, '%: ', item.name, ' x', i.numOfItems));
            }
            else {
                console.log(concat('Unknown item id: ', i.itemId));
            }
        }
        return ret.join('\n');
    };

    /**
     * format cost item 
     * @param {BgrXmlLoader} loader
     * @param {BgrXmlStage} stage 
     */
    const formatStageGroup = function(loader, stage) {
        const area = loader.getStageAreaByStageId(stage.id);
        if (area) {
            return getProperty(loader.getStageGroup(area.groupId), 'name', '');
        }
        return '';
    };


    const rows = [];
    this.__loader.forEachStage((stage) => rows.push([
        stage.id,
        stage.open,
        formatStageGroup(this.__loader, stage),
        getProperty(this.__loader.getStageAreaByStageId(stage.id), 'name', ''),
        getProperty(this.__loader.getStageListByStageId(stage.id), 'name', ''),
        stage.name,
        stage.comment,
        stage.costAP,
        formatCostItem(this.__loader, stage),
        formatFind(this.__loader, stage),
        formatItemRate(this.__loader, stage.item_rate.s),
        formatItemRate(this.__loader, stage.item_rate.a),
        formatItemRate(this.__loader, stage.item_rate.b),
        formatItemRate(this.__loader, stage.item_rate.c),
        stage.durationTime,
    ]));

    this.__table.update([
            new Table.Column('ID', Table.columnType.NUM),
            new Table.Column('開放'),
            new Table.Column('グループ'),
            new Table.Column('エリア'),
            new Table.Column('リスト'),
            new Table.Column('名前'),
            new Table.Column('説明'),
            new Table.Column('AP', Table.columnType.NUM),
            new Table.Column('消費アイテム'),
            new Table.SystemColumn('発見ステージ'),
            new Table.Column('ドロップ(S)'),
            new Table.SystemColumn('ドロップ(A)'),
            new Table.SystemColumn('ドロップ(B)'),
            new Table.SystemColumn('ドロップ(C)'),
            new Table.SystemColumn('ステージ時間'),
        ],
        rows);

    this.__table.setColumnSelector(document.getElementById('data-browser-column-selector'));
}

/**
 * set loader
 * @param {BgrXmlLoader} loader 
 */
DataBrowser.prototype.setLoader = function DataBrowser_setLoader(loader) {
    this.__loader = loader;
    this.onDataTypeChanged();
};
