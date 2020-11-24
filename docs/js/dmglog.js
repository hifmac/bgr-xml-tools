
/**
 * damage log
 */
function DamageLog() {
    this.__loader = null;

    /** @type {HTMLInputElement} */
    this.__logFile = document.getElementById('damage-log-file');
    this.__logFile.addEventListener('change', this.onChanged.bind(this));

    /** @type {HTMLLabelElement} */
    this.__logFileLabel = document.getElementById('damage-log-file-label');

    /** @type {HTMLTableElement} */
    this.__logTable = document.getElementById('damage-log-table');

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
 * @param {ProgressEvent<FileReader} ev 
 */
DamageLog.prototype.onFileRead = function DamageLog_onFileRead(ev) {
    if (!this.__loader) {
        alert('XMLファイルを読み込んでください！');
        return ;
    }

    const clearChild = function(elem) {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }    
    };

    const createHeader = function(columns) {
        const thead = document.createElement('thead');
        thead.setAttribute('class', 'thead-dark');
        const tr = document.createElement('tr');
        for (let col of columns) {
            const th = document.createElement('th');
            th.textContent = col;
            tr.appendChild(th);
        }
        thead.append(tr);
        return thead;
    };

    const createRow = function(columns) {
        const tr = document.createElement('tr');
        for (let col of columns) {
            const td = document.createElement('td');
            td.style.whiteSpace = 'pre-wrap';
            td.textContent = col;
            tr.appendChild(td);
        }
        return tr;
    };

    /**
     * 
     * @param {Array<Object>} arr 
     */
    const lastElement = function(arr) {
        return arr[arr.length - 1];
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

    /**
     * @type {Map<number,BgrXmlUnitBase>} make uid map
     */
    const uid_map = new Map();
    for (let baction of bactions) {
        for (let join of baction.heroJoin) {
            for (let hero of join.heroes) {
                uid_map.set(hero.uid, this.__loader.getUnitBase(hero.xid));
            }
        }
    }

    for (let baction of bactions) {
        for (let skillact of baction.skillAction) {
            if (!uid_map.has(skillact.uid)) {
                const unit = this.__loader.getUnitBaseBySkillID(skillact.skillId);
                if (unit) {
                    uid_map.set(skillact.uid, unit);
                }
            }
        }
    }

    /**
     * @type {Map<number, BgrJsonBattleAction>}
     */
    const action_map = new Map();
    for (let baction of bactions) {
        if (baction.updateDamageChallengeRecord.length) {
            const damage = lastElement(baction.updateDamageChallengeRecord).damage;
            if (!action_map.has(damage)) {
                action_map.set(damage, baction);
            }
        }
    }

    clearChild(this.__logTable);
    this.__logTable.appendChild(createHeader(['ダメージ', 'イベント', '行動ユニット', '行動', '内容']));
    {
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
                    uid_map.get(skillact.uid).name,
                    this.__loader.getSkillBase(skillact.skillId).name,
                    Array.from(skillact.hits.map((x) => [
                        (uid_map.has(x.uid) ? uid_map.get(x.uid).name : 'ユニット(' + x.uid + ')'),
                        'HP：' + x.hp + '(' + x.hpDiff + ')',
                        (x.isCritical ? 'クリティカル' : '命中')
                    ].join('/'))).join('\n')
                ]));
            }
        }
        this.__logTable.appendChild(tbody);
    }

    clearChild(this.__logPerUnitTable);

    console.log(uid_map);
};

/**
 * set loader for the loaded xml
 * @param {BgrXmlLoader} loader 
 */
DamageLog.prototype.setLoader = function DamageLog_setLoader(loader) {
    this.__loader = loader;
}
