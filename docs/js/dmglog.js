import { BgrJsonBattleAction, BgrJsonHeroJoin } from './bgr/bgr.json.js'
import { lastElement, clearChild, createHeader, createRow } from './bgr/bgr.util.js'
import { BgrXmlUnitBase } from './bgr/bgr.xml.js';

/**
 * damage log
 */
export function DamageLog() {
    this.__loader = null;

    /** @type {HTMLInputElement} */
    this.__logFile = document.getElementById('damage-log-file');
    this.__logFile.addEventListener('change', this.onChanged.bind(this));

    /** @type {HTMLLabelElement} */
    this.__logFileLabel = document.getElementById('damage-log-file-label');

    /** @type {HTMLTableElement} */
    this.__logPerUnitTable = document.getElementById('damage-log-per-unit-table');
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
            bactions.push(new BgrJsonBattleAction(JSON.parse(json)));
        }
        catch (e) {
            console.log(e);
        }
    }

    /** @type {Map<number, string>} make uid map */
    const uid_map = new Map();
    for (let baction of bactions) {
        for (let join of baction.heroJoin) {
            for (let hero of join.heroes) {
                if (!uid_map.has(hero.uid)) {
                    uid_map.set(hero.uid, this.__loader.getUnitBase(hero.xid).name + '[' + hero.position + ']');
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
                    uid_map.set(skillact.uid, unit.name + '(' + num + ')');
                }
            }
        }
    }

    for (let baction of bactions) {
        for (let skillact of baction.skillAction) {
            if (!uid_map.has(skillact.uid)) {
                uid_map.set(skillact.uid, '？？？(' + skillact.uid + ')');
            }
            for (let hit of skillact.hits) {
                if (!uid_map.has(hit.uid)) {
                    uid_map.set(hit.uid, '？？？(' + hit.uid + ')');
                }
            }
        }
    }

    /** @type {Map<number, BgrJsonBattleAction>} */
    const action_map = new Map();
    for (let baction of bactions) {
        if (baction.updateDamageChallengeRecord.length) {
            const damage = lastElement(baction.updateDamageChallengeRecord).damage;
            if (!action_map.has(damage)) {
                action_map.set(damage, baction);
            }
        }
    }

    this.createDamageLog(action_map, uid_map);

    this.createUnitLog(action_map, uid_map);
};

/**
 * create damage log table
 * @param {Map<number, BgrJsonBattleAction>} action_map 
 * @param {Map<number, string>} uid_map
 */
DamageLog.prototype.createDamageLog = function DamageLog_createDamageLog(action_map, uid_map) {
    /** @type {HTMLTableElement} */
    const logTable = document.getElementById('damage-log-table');

    clearChild(logTable);

    logTable.appendChild(createHeader(['ダメージ', 'イベント', '行動ユニット', '行動', '内容']));

    const tbody = document.createElement('tbody');
    const damages = Array.from(action_map.keys()).sort((a, b) => a - b);
    for (let damage of damages) {
        const baction = action_map.get(damage);

        if (baction.updatePlayerInfo.length) {
            /** @type {BgrJsonUpdatePlayerInfo} */
            const playerInfo = lastElement(baction.updatePlayerInfo);
            tbody.appendChild(createRow([
                damage,
                '状態',
                '団長',
                [
                    'SP：' + playerInfo.sp,
                    '出撃：' + (playerInfo.isSummonAuto ? '自動' : '手動'),
                    'スキル：' + (playerInfo.isSkillAuto ? '自動' : '手動'),
                ].join('\n'),
                null
            ]));
        }

        for (let skillact of baction.skillAction) {
            tbody.appendChild(createRow([
                damage,
                'スキル',
                uid_map.get(skillact.uid),
                this.__loader.getSkillBase(skillact.skillId).name,
                skillact.hits.map((x) => [
                    uid_map.get(x.uid),
                    'HP：' + x.hp + '(' + x.hpDiff + ')',
                    (x.isCritical ? 'クリティカル' : '命中')
                ].join('/')).join('\n')
            ]));
        }
    }

    logTable.appendChild(tbody);
}

/**
 * create damage log table
 * @param {Map<number, BgrJsonBattleAction>} action_map 
 * @param {Map<number, string>} uid_map
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

    /** @type {HTMLTableElement} */
    const unitlogTable = document.getElementById('damage-log-per-unit-table');

    clearChild(unitlogTable);

    unitlogTable.appendChild(createHeader(['名前', '与ダメ', '回数(CRIT/通常)', '被ダメ', '回数(CRIT/通常)']));

    const tbody = document.createElement('tbody');
    for (let uid of uid_map.keys()) {
        if (data[uid].take.damage || data[uid].take.hit || data[uid].take.critical) {
            tbody.appendChild(createRow([
                uid_map.get(uid),
                data[uid].take.damage,
                (data[uid].take.critical + data[uid].take.hit + data[uid].take.miss) + '(' + data[uid].take.critical + '/' + data[uid].take.hit + '/' + data[uid].take.miss + ')',
                data[uid].give.damage,
                (data[uid].give.critical + data[uid].give.hit) + '(' + data[uid].give.critical + '/' + data[uid].give.hit + ')',
            ]));
        }
    }

    unitlogTable.appendChild(tbody);
}

/**
 * set loader for the loaded xml
 * @param {BgrXmlLoader} loader 
 */
DamageLog.prototype.setLoader = function DamageLog_setLoader(loader) {
    this.__loader = loader;
}
