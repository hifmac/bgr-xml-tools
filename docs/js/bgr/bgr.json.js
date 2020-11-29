import { compareDeep } from "./bgr.util.js";

export const BgrJsonKeyMap = (function() {
    /** @type {Map<string, Set<string>>} */
    const keyMap = new Map();

    return {
        add(name, object) {
            if (!keyMap.has(name)) {
                keyMap.set(name, new Set);
            }

            if (Array.isArray(object)) {
                for (let elem of object) {
                    for (let key in elem) {
                        keyMap.get(name).add(key);
                    }    
                }
            }
            else {
                for (let key in object) {
                    keyMap.get(name).add(key);
                }
            }
        },
        get(name) {
            return keyMap.get(name);
        },
        keys() {
            return keyMap.keys();
        }
    };
}());

/**
 * BGR JSON battle action
 */
export function BgrJsonBattleAction () {
    /** @type {BgrJsonBattleStart} */
    this.battleStart = [];
    /** @type {BgrJsonHeroJoin[]} */
    this.heroJoin = [];

    /** @type {BgrJsonHeroMove[]} */
    this.heroMove = [];
    /** @type {BgrJsonSkillAction[]} */
    this.skillAction = [];
    /** @type {BgrJsonUpdateBattleEndTime[]} */
    this.updateBattleEndTime = [];
    /** @type {BgrJsonUpdateDamageChallengeRecord[]} */
    this.updateDamageChallengeRecord = [];
    /** @type {BgrJsonUpdateHeroBuffer[]} */
    this.updateHeroBuffer = [];
    /** @type {BgrJsonUpdateHeroHpSp[]} */
    this.updateHeroHpSp = [];
    /** @type {BgrJsonUpdateLineIndex[]} */
    this.updateLineIndex = [];
    /** @type {BgrJsonUpdatePlayerInfo[]} */
    this.updatePlayerInfo = [];

    /** @type {BgrJsonOnCastSkill} */
    this.onCastSkill = [];
    /** @type {BgrJsonOnNormalCastingSkill} */
    this.onNormalCastingSkill = [];
    /** @type {BgrJsonJsonOnAreaCastingSkill} */
    this.onAreaCastingSkill = [];
    /** @type {BgrJsonOffCastSkill} */
    this.offCastSkill = [];
    /** @type {BgrJsonOffCastingSkill} */
    this.offCastingSkill = [];
}

BgrJsonBattleAction.TYPENAME_MAP = {
    /*
     * events occured just once in a battle
     */
    BAction_BattleStart: { attrName: 'battleStart', ctor: BgrJsonBattleStart },
    BAction_HeroJoin: { attrName: 'heroJoin', ctor: BgrJsonHeroJoin },

    /*
     * events caused by unit activity
     */
    BAction_HeroMove: { attrName: 'heroMove', ctor: BgrJsonHeroMove },
    BAction_SkillAct: { attrName: 'skillAction', ctor: BgrJsonSkillAction },
    BAction_UpdateBattleEndTime: { attrName: 'updateBattleEndTime', ctor: BgrJsonUpdateBattleEndTime },
    BAction_UpdateDamageChallengeRecord: { attrName: 'updateDamageChallengeRecord', ctor: BgrJsonUpdateDamageChallengeRecord },
    BAction_UpdateHeroBuff: { attrName: 'updateHeroBuffer', ctor: BgrJsonUpdateHeroBuffer },
    BAction_UpdateHeroHPSP: { attrName: 'updateHeroHpSp', ctor: BgrJsonUpdateHeroHpSp },
    BAction_UpdateLineIndex: { attrName: 'updateLineIndex', ctor: BgrJsonUpdateLineIndex },
    BAction_UpdatePlayerInfo: { attrName: 'updatePlayerInfo', ctor: BgrJsonUpdatePlayerInfo },

    /*
     * skill cast events
     */
    BAction_OnCastSkill: { attrName: 'onCastSkill', ctor: BgrJsonOnCastSkill },
    BAction_OnNormalCastingSkill: { attrName: 'onNormalCastingSkill', ctor: BgrJsonOnNormalCastingSkill },
    BAction_OnAreaCastingSkill: { attrName: 'onAreaCastingSkill', ctor: BgrJsonJsonOnAreaCastingSkill },
    BAction_OffCastSkill: { attrName: 'offCastSkill', ctor: BgrJsonOffCastSkill },
    BAction_OffCastingSkill: { attrName: 'offCastingSkill', ctor: BgrJsonOffCastingSkill },
};

/**
 * @param {Object} obj 
 * @param {Object[]} obj.BActionS
 */
BgrJsonBattleAction.prototype.load = function BgrJsonBattleAction_load(obj) {
    if (!('BActionS' in obj)) {
        throw new Error('BActionS not in the Object!');
    }

    for (let action of obj.BActionS) {
        const typeName = action.typeName;
        if (typeName in BgrJsonBattleAction.TYPENAME_MAP) {
            const type = BgrJsonBattleAction.TYPENAME_MAP[typeName];
            this[type.attrName].push(new type.ctor(action));
            BgrJsonKeyMap.add(typeName, action);
        }
        else {
            console.log(typeName + ' is not handled!');
        }
    }
};

/**
 * merge 2 battle actions
 * @param {BgrJsonBattleAction} baction 
 */
BgrJsonBattleAction.prototype.merge = function BgrJsonBattleAction_merge(baction) {
    const ret = new BgrJsonBattleAction();
    for (let key in BgrJsonBattleAction.TYPENAME_MAP) {
        const type = BgrJsonBattleAction.TYPENAME_MAP[key];
        ret[type.attrName] = this[type.attrName].slice();
        for (let item of baction[type.attrName]) {
            if (!ret[type.attrName].some((x) => compareDeep(x, item))) {
                ret[type.attrName].push(item);
            }
        }
    }
    console.log(ret);
    return ret;
};

/**
 * BGR JSON battle start
 * @param {Object} action
 */
export function BgrJsonBattleStart(action) {
    this.uid = 0;
}

/**
 * BGR JSON hero data
 * @param {Object} hero
 * @param {number} hero.uXID unit id
 * @param {number} hero.lUID unique id
 * @param {number} hero.nLevel unit level
 * @param {number} hero.uGP the point granted by gift items
 * @param {number} hero.uTP the point granted by the charch
 * @param {number} hero.nHp HP
 * @param {number} hero.cDamageChallengePos damage challenge party position
 */
export function BgrJsonHeroData(hero) {
    this.xid = hero.uXID;
    this.uid = hero.lUID;
    this.level = hero.nLevel;
    this.gp = hero.uGP;
    this.tp = hero.uTP;
    this.hp = hero.nHp;
    this.position = hero.cDamageChallengePos;
};

/**
 * BGR JSON hero join
 * @param {Object} action hero join event
 * @param {Object[]} action.CHeroDataS hero data list
 */
export function BgrJsonHeroJoin(action) {
    if (!('CHeroDataS' in action)) {
        throw new Error('CHeroDataS is not in Object!');
    }

    this.heroes = Array.from(action.CHeroDataS, (hero) => new BgrJsonHeroData(hero));
    BgrJsonKeyMap.add('CHeroDataS', action.CHeroDataS);
}

/**
 * BGR JSON hero move
 * @param {Object} action 
 * @param {number} action.lUID
 * @param {Object} action.vPos
 * @param {boolean} action.bDirectLeft
 */
export function BgrJsonHeroMove(action) {
    this.uid = action.lUID;
    this.position = action.vPos;
    this.isDirectionLeft = action.bDirectLeft;
}

/**
 * BGR JSON skill hit included by BgrJsonSkillAction
 * @param {Object} hit
 * @param {number} hit.lUID
 * @param {number} hit.nHP
 * @param {number} hit.nHPVal
 * @param {boolean} hit.bCrit
 * @param {Object[]} hit.buffers
 */
export function BgrJsonSkillHit(hit) {
    this.uid = hit.lUID;
    this.hp = hit.nHP;
    this.hpDiff = hit.nHPVal
    this.isCritical = hit.bCrit;
    this.buffers = [];
}

/**
 * BGR JSON skill action
 * @param {Object} obj skill action
 * @param {Object} obj.aBSkillAct skill action attribute
 * @param {number} obj.aBSkillAct.lUID unique id
 * @param {number} obj.aBSkillAct.uSkillID skill id
 * @param {Object[]} obj.aBSkillAct.BSkillHitS hit events
 */
export function BgrJsonSkillAction(obj) {
    if (!('aBSkillAct' in obj)) {
        throw new Error('aBSkillAct is not in Object!');
    }

    const skillact = obj.aBSkillAct;
    this.uid= skillact.lUID;
    this.skillId = skillact.uSkillID;
    this.hits = Array.from(skillact.BSkillHitS, (hit) => new BgrJsonSkillHit(hit));

    BgrJsonKeyMap.add('aBSkillAct', skillact);
    BgrJsonKeyMap.add('BSkillHitS', skillact.BSkillHitS);
}

/**
 * @param {Object} action
 * @param {number} action.lBattileEndTime estimated battle end time
 */
export function BgrJsonUpdateBattleEndTime(action) {
    this.battleEndTime = action.lBattileEndTime;
}

/**
 * @param {Object} action
 * @param {number} action.lTotalDamageCauseByLeft the total damage of a damage challenge battle
 */
export function BgrJsonUpdateDamageChallengeRecord(action) {
    this.damage = action.lTotalDamageCauseByLeft;
}

/**
 * BGR JSON buffer value
 * @param {Object} buffer
 * @param {number} buffer.uBuffID
 * @param {number} buffer.fDurTime
 * @param {boolean} buffer.bPassive
 * @param {number} buffer.nLevel
 * @param {number} buffer.nTimes
 * @param {number} buffer.fTerrorScale
 * @param {number} buffer.fTerrorAdd
 */
export function BgrJsonBufferValue(buffer) {
    this.bufferID = buffer.uBuffID;
    this.durationTime = buffer.fDurTime;
    this.isPassive = buffer.bPassive;
    this.level = buffer.nLevel;
    this.times = buffer.nTimes;
    this.terrorScale = buffer.fTerrorScale;
    this.terrorAdd = buffer.fTerrorAdd;
}

/**
 * BGR JSON hero buffer
 * @param {Object} action 
 * @param {number} action.lUID
 * @param {Object[]} action.BuffValS
 * @param {boolean} action.bClearDebuff
 */
export function BgrJsonUpdateHeroBuffer(action) {
    if (!('BuffValS' in action)) {
        throw new Error('BuffValS is not in Object!');
    }

    this.uid = action.lUID;
    this.buffers = Array.from(action.BuffValS, (buffer) => new BgrJsonBufferValue(buffer));
    this.isClearDebuff = action.bClearDebuff;
    BgrJsonKeyMap.add('BuffValS', action.BuffValS);
}

/**
 * BGR JSON update hero hp sp
 * @param {Object} action update hero hp sp
 */
export function BgrJsonUpdateHeroHpSp (action) {
    this.uid = action.lUID;
    this.hp = action.nHP;
    this.hpDiff = action.nHPVal;
}

/**
 * BGR JSON line index
 * @param {Object} action 
 * @param {number} action.nIndex line index to move
 */
export function BgrJsonUpdateLineIndex(action) {
    this.index = action.nIndex;
}

/**
 * BGR JSON update player info
 * @param {Object} action 
 * @param {number} action.fSP current SP
 * @param {boolean} bSummonAuto whether auto unit summon is enabled
 * @param {boolean} bSkillAuto  whether auto skinn use is enabled
 */
export function BgrJsonUpdatePlayerInfo(action) {
    if (!('BattlePlayerInfoS' in action)) {
        throw new Error('BattlePlayerInfoS is not in Object!');
    }

    for (let info of action.BattlePlayerInfoS) {
        this.sp = info.fSP;
        this.isSummonAuto = info.bSummonAuto;
        this.isSkillAuto = info.bSkillAuto;
    }
    BgrJsonKeyMap.add('BattlePlayerInfoS', action.BattlePlayerInfoS);
}

/**
 * BGR JSON on cast skill
 * @param {Object} action 
 * @param {number} action.lUID unit id
 */
export function BgrJsonOnCastSkill(action) {
    this.uid = action.lUID;
}

/**
 * BGR JSON normal casting skill
 * @param {Object} action 
 * @param {number} action.lUID unit id
 * @param {number} action.fCastTime cast time to use
 * @param {number} action.fCD cooldown to cast next
 * @param {boolean} action.bFirstCD is first cooldown or not
 */
export function BgrJsonOnNormalCastingSkill(action) {
    this.uid = action.lUID;
    this.castTime = action.fCastTime;
    this.cooldown = action.fCD;
    this.isFirstCooldown = action.bFirstCD;
}

/**
 * BGR JSON normal casting skill
 * @param {Object} action 
 * @param {number} action.lUID unit id
 * @param {number} action.fCastTime cast time to use
 * @param {number} action.fCD cooldown to cast next
 * @param {boolean} action.bFirstCD is first cooldown or not
 * @param {Object} action.vPos
 */
export function BgrJsonJsonOnAreaCastingSkill(action) {
    this.uid = action.lUID;
    this.castTime = action.fCastTime;
    this.cooldown = action.fCD;
    this.isFirstCooldown = action.bFirstCD;
    this.position = action.vPos;
}

/**
 * BGR JSON off cast skill
 * @param {Object} action 
 * @param {number} action.lUID unit id
 */
export function BgrJsonOffCastSkill(action) {
    this.uid = action.lUID;
}

/**
 * BGR JSON off casting skill
 * @param {Object} action 
 * @param {number} action.lUID unit id
 */
export function BgrJsonOffCastingSkill(action) {
    this.uid = action.lUID;
}

