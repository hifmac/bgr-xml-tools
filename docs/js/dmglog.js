/**
 * @file dmglog.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

import { BgrJsonKeyMap, BgrJsonBattleAction, BgrJsonHeroJoin } from './bgr/bgr.json.js'
import { lastElement, concat, updateTooltip, convertServerTimeToDate } from './bgr/bgr.util.js'
import { Table } from './bgr/bgr.table.js'
import { BgrXmlLoader } from './bgr/bgr.xml.js';

/**
 * damage log
 */
export function DamageLog() {
    /** @type {BgrXmlLoader} */
    this.__loader = null;

    /** @type {HTMLInputElement} */
    this.__logFile = document.getElementById('damage-log-file');
    this.__logFile.addEventListener('change', this.onChanged.bind(this));

    /** @type {HTMLLabelElement} */
    this.__logFileLabel = document.getElementById('damage-log-file-label');

    this.__logTable = new Table(document.getElementById('damage-log-table'));
    this.__logPerUnitTable = new Table(document.getElementById('damage-log-per-unit-table'));
}

/**
 * the function called when the file chooser is changed
 */
DamageLog.prototype.onChanged = function DamageLog_onChanged() {
    if (this.__logFile.files.length) {
        this.__logFileLabel.textContent = this.__logFile.files[0].name;
        const xmlreader = new FileReader();
        xmlreader.onload = this.onFileRead.bind(this);
        xmlreader.readAsText(this.__logFile.files[0], 'UTF-8');
    }
};

/**
 * the function called when the file is read successfully
 * @param {ProgressEvent<FileReader>} ev 
 */
DamageLog.prototype.onFileRead = function DamageLog_onFileRead(ev) {
    if (!this.__loader) {
        alert('XMLファイルを読み込んでください！');
        return ;
    }

    /** @type {BgrJsonBattleAction[]} */
    const bactions = [];
    for (let json of ev.target.result.split('\n')) {
        try {
            const baction = new BgrJsonBattleAction();
            baction.load(JSON.parse(json));
            bactions.push(baction);
        }
        catch (e) {
            console.log(e);
            console.log(e.stack);
        }
    }

    /*
     * print JSON key mapping for debug
     */
    for (let key of BgrJsonKeyMap.keys()) {
        console.log(key, BgrJsonKeyMap.get(key));
    }

    /** @type {Map<number, { name: string, hero: BgrJsonHeroData }>} make uid map */
    const uid_map = new Map();
    for (let baction of bactions) {
        for (let join of baction.heroJoin) {
            for (let hero of join.heroes) {
                if (!uid_map.has(hero.uid)) {
                    uid_map.set(hero.uid, {
                        name: this.__loader.getUnitBase(hero.xid).name + '[' + hero.position + ']',
                        hero,
                    });
                }
            }
        }
    }

    const xid_map = new Map();
    for (let baction of bactions) {
        for (let skillact of baction.skillAction) {
            if (!uid_map.has(skillact.uid)) {
                const unit = this.__loader.getUnitBaseBySkillID(skillact.skillId);
                if (unit) {
                    const num = xid_map.has(unit.id) ? xid_map.get(unit.id) : 1;
                    xid_map.set(unit.id, num + 1);
                    uid_map.set(skillact.uid, { name: unit.name + '(' + num + ')' });
                }
            }
        }
    }

    for (let baction of bactions) {
        for (let skillact of baction.skillAction) {
            if (!uid_map.has(skillact.uid)) {
                uid_map.set(skillact.uid, { name: '？？？(' + skillact.uid + ')' });
            }
            for (let hit of skillact.hits) {
                if (!uid_map.has(hit.uid)) {
                    uid_map.set(hit.uid, { name: '？？？(' + hit.uid + ')' });
                }
            }
        }
    }

    /** @type {Map<number, BgrJsonBattleAction>} */
    const action_map = new Map();
    for (let baction of bactions) {
        if (baction.updateDamageChallengeRecord.length) {
            const damage = lastElement(baction.updateDamageChallengeRecord).damage;
            action_map.set(damage, (action_map.has(damage)
                ? action_map.get(damage).merge(baction)
                : baction));
        }
    }

    this.setLogDatetime(bactions);
    this.createDamageLog(action_map, uid_map);
    this.createUnitLog(action_map, uid_map);
    updateTooltip();
};

/**
 * set log file datetime
 * @param {BgrJsonBattleAction[]} bactions 
 */
DamageLog.prototype.setLogDatetime = function DamageLog_setLogDatetime(bactions) {
    let battleEndTime = 0;
    for (let baction of bactions) {
        for (let endTime of baction.updateBattleEndTime) {
            battleEndTime = Math.max(battleEndTime, endTime.battleEndTime);
        }
    }
    const serverEndDate = convertServerTimeToDate(battleEndTime);
    const serverStartDate = new Date(serverEndDate);
    serverStartDate.setMinutes(serverStartDate.getMinutes() - 1);
    document.getElementById('log-datetime').textContent =
        concat(serverStartDate.toLocaleString(), '～',  serverEndDate.toLocaleString());
}

/**
 * create damage log table
 * @param {Map<number, BgrJsonBattleAction>} action_map 
 * @param {Map<number, { name: string, hero: BgrJsonHeroData }>} uid_map
 */
DamageLog.prototype.createDamageLog = function DamageLog_createDamageLog(action_map, uid_map) {
    const rows = [];

    const damages = Array.from(action_map.keys()).sort((a, b) => a - b);
    let sp = '?';
    let isSummonAuto = '?';
    let isSkillAuto = '?';
    for (let damage of damages) {
        const baction = action_map.get(damage);

        if (baction.updatePlayerInfo.length) {
            const playerInfo = lastElement(lastElement(baction.updatePlayerInfo).playerInfo);
            sp = playerInfo.sp;
            isSummonAuto = (playerInfo.isSummonAuto ? 'ON' : 'OFF');
            isSkillAuto = (playerInfo.isSkillAuto ? 'ON' : 'OFF');
        }

        for (let skillact of baction.skillAction) {
            rows.push([
                damage,
                sp,
                isSummonAuto,
                isSkillAuto,
                uid_map.get(skillact.uid).name,
                this.__loader.getSkillBase(skillact.skillId).name,
                Array.from(skillact.hits, (x) => [
                    uid_map.get(x.uid).name,
                    concat('HP：', x.hp, '(', x.hpDiff, ')'),
                    (x.isCritical ? 'クリティカル' : '命中')
                ].join('/')).join('\n')
            ]);
        }
    }

    this.__logTable.update([
            'ダメージ',
            'SP',
            '自動出撃',
            '自動スキル',
            'ユニット',
            'スキル',
            'アクション',
        ],
        rows
    );
}

/**
 * create damage log table
 * @param {Map<number, BgrJsonBattleAction[]>} action_map 
 * @param {Map<number, { name: string, hero: BgrJsonHeroData }>} uid_map
 */
DamageLog.prototype.createUnitLog = function DamageLog_createCharacterLog(action_map, uid_map) {
    const data = {};

    for (let uid of uid_map.keys()) {
        data[uid] = {
            take: {
                damage: 0,
                critical: 0,
                hit: 0,
                miss: 0,
            },

            give: {
                damage: 0,
                critical: 0,
                hit: 0,
            }
        }
    }

    /*
     * collect unit data
     */
    for (let baction of action_map.values()) {
        for (let act of baction.skillAction) {
            let isCritical = false;
            for (let hit of act.hits) {
                data[act.uid].take.damage -= hit.hpDiff
                data[hit.uid].give.damage -= hit.hpDiff;
                if (hit.isCritical) {
                    data[hit.uid].give.critical += 1;
                    isCritical = true;
                }
                else {
                    data[hit.uid].give.hit += 1;
                }
            }

            if (act.hits.length) {
                if (isCritical) {
                    data[act.uid].take.critical += 1;
                }
                else {
                    data[act.uid].take.hit += 1;
                }
            }
            else {
                data[act.uid].take.miss += 1;
            }
        }
    }

    const rows = [];
    for (let uid of uid_map.keys()) {
        const row = [
            uid_map.get(uid).name,
            data[uid].take.damage,
            concat(
                data[uid].take.critical + data[uid].take.hit + data[uid].take.miss,
                '(', data[uid].take.critical, '/', data[uid].take.hit, '/', data[uid].take.miss, ')'),
            data[uid].give.damage,
            concat(
                data[uid].give.critical + data[uid].give.hit,
                '(', data[uid].give.critical, '/', data[uid].give.hit, ')'),
        ];

        if (uid_map.get(uid).hero) {
            const self = this;

            row.push(uid_map.get(uid).hero.equips.map(function (x) {
                const item = self.__loader.getItem(x.xid);
                return concat(item.name, ' lv', x.level);
            }).join('\n'));

            row.push(uid_map.get(uid).hero.buffers.map(function (x) {
                const buffer = self.__loader.getBufferBase(x.bufferID);
                if (buffer) {
                    return x.level ? concat(buffer.name, ' lv', x.level) : buffer.name;
                }
                return '';
            }).join('\n'));
        }
        else {
            row.push('');
            row.push('');
        }

        rows.push(row);
    }

    this.__logPerUnitTable.update([
            'ユニット',
            '与ダメ',
            '回数(CRIT/通常)',
            '被ダメ',
            '回数(CRIT/通常)',
            '装備',
            'バフ',
        ],
        rows);
}

/**
 * set loader for the loaded xml
 * @param {BgrXmlLoader} loader 
 */
DamageLog.prototype.setLoader = function DamageLog_setLoader(loader) {
    this.__loader = loader;
}
