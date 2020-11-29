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
 * load battle action from object
 * @param {{
 *     BActionS: Object[]
 * }} action battle action
 */
BgrJsonBattleAction.prototype.load = function BgrJsonBattleAction_load(action) {
    if (!('BActionS' in action)) {
        throw new Error('BActionS not in the Object!');
    }

    for (let baction of action.BActionS) {
        const typeName = baction.typeName;
        if (typeName in BgrJsonBattleAction.TYPENAME_MAP) {
            const type = BgrJsonBattleAction.TYPENAME_MAP[typeName];
            this[type.attrName].push(new type.ctor(baction));
            BgrJsonKeyMap.add(typeName, baction);
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
 * BGR JSON equip
 * @param {{
 *    lUID: number,
 *    uXID: number,
 *    nLevel: number,
 *    lExp: number,
 *    lHero: number,
 *    cSlot: number,
 *    uFlag: number,
 *    nOver: number,
 *    cPartyType: number,
 * }} equip equip data
 */
export function BgrJsonEquipData(equip) {
    this.uid = equip.lUID;
    this.xid = equip.uXID;
    this.level = equip.nLevel;
    this.exp = equip.lExp;
    this.slot = equip.cSlot;
    this.flag = equip.uFlag;
    this.over = equip.nOver;
    this.partyType = equip.cPartyType
}

/**
 * BGR JSON hero data
 * @param {{
 *    bLeft: boolean,
 *    vPos: Object,
 *    nHp: number,
 *    dRealHPScale: number,
 *    nSP: number,
 *    lPlayerAID: number,
 *    bDirectLeft: boolean,
 *    lAddExp: number,
 *    bMainHero: boolean,
 *    fSummonCD: number,
 *    fASkillCD: number,
 *    nLineIndex: number,
 *    bASkillCast: boolean,
 *    bSkillFirstCD: boolean,
 *    BuffValS: Object[],
 *    TechAttrS: Object[],
 *    EquipDataS: Object[],
 *    cPartyType: number,
 *    bDelete: boolean,
 *    lUID: number,
 *    lAID: number,
 *    uXID: number,
 *    nLevel: number,
 *    pLSkill: number,
 *    lLevelTime: number,
 *    lExp: number,
 *    cParty: number,
 *    uFlag: number,
 *    uGP: number,
 *    uTP: number,
 *    cPartyPos: number,
 *    lBID: number,
 *    cPvpPos: number,
 *    lHealFinish: number,
 *    uAdvID: number,
 *    pEquipRecord: number,
 *    nLSkillLevel: number,
 *    lLSkillExp: number,
 *    nASkillLevel: number,
 *    lASkillExp: number,
 *    cFriendPos: number,
 *    cExpeditionParty: number,
 *    cExpeditionPos: number,
 *    cInfiniteParty: number,
 *    cInfinitePos: number,
 *    pInfiniteStageList: number,
 *    nOver: number,
 *    pAwakeInfo: number,
 *    cContinuousParty: number,
 *    cContinuousPos: number,
 *    cCountParty: number,
 *    cCountPos: number,
 *    cDamageChallengeParty: number,
 *    cDamageChallengePos: number,
 *    cEventDamageChallengeParty: number,
 *    cEventDamageChallengePos: number,
 *    cOld: number,
 *    pHTXID: number,
 *    lHTAID: number,
 *    cHTHouse: number,
 *    lHTFinish: number,
 *    InfiniteStagelistS: Object[],
 *    uHTXIDs: number,
 *    IsFailHouseTrip: boolean,
 *    bAwaken: boolean,
 *    IsMain: boolean,
 *    Marry: boolean,
 *    bHalloWeen: boolean,
 *    bXmas: boolean,
 *    bNewYear: boolean,
 *    bValentine: boolean,
 *    bWhiteDay: boolean,
 *    bSpring: boolean,
 *    bKodomo: boolean,
 *    bWedding: boolean,
 *    bSummer: boolean,
 *    bNatumaturi: boolean,
 *    bFall: boolean,
 *    bWinter: boolean,
 *    uDB_LSkillS: number,
 * }} hero hero data object
 */
export function BgrJsonHeroData(hero) {
    this.xid = hero.uXID;
    this.uid = hero.lUID;
    this.level = hero.nLevel;
    this.gp = hero.uGP;
    this.tp = hero.uTP;
    this.hp = hero.nHp;
    this.position = hero.cDamageChallengePos;
    this.equips = Array.from(hero.EquipDataS, (x) => new BgrJsonEquipData(x));
    this.buffers = Array.from(hero.BuffValS, (x) => new BgrJsonBufferValue(x));

    BgrJsonKeyMap.add('EquipDataS', hero.EquipDataS);
    BgrJsonKeyMap.add('BuffValS', hero.BuffValS);
    BgrJsonKeyMap.add('TechAttrS', hero.TechAttrS);
};

/**
 * BGR JSON hero join
 * @param {{
 *     CHeroDataS: Object[]
 * }} action hero join event
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
 * @param {{
 *     lUID: number,
 *     vPos: Object,
 *     bDirectLeft: boolean,
 * }} action hero move action
 */
export function BgrJsonHeroMove(action) {
    this.uid = action.lUID;
    this.position = action.vPos;
    this.isDirectionLeft = action.bDirectLeft;
}

/**
 * BGR JSON skill hit included by BgrJsonSkillAction
 * @param {{
 *     lUID: number,
 *     nHP: number,
 *     nHPVal: number,
 *     bCrit: boolean,
 *     nSP: number,
 *     nSPVal: number,
 *     bBuff: boolean,
 *     BuffValS: Object[],
 *     cAtkResult: number,
 *     bNoShowSkillPic: boolean,
 * }} hit skill hit
 */
export function BgrJsonSkillHit(hit) {
    this.uid = hit.lUID;
    this.hp = hit.nHP;
    this.hpDiff = hit.nHPVal
    this.isCritical = hit.bCrit;
    this.isBuffer = hit.bBuff;
    this.buffers = Array.from(hit.BuffValS, (x) => new BgrJsonBufferValue(x));

    BgrJsonKeyMap.add('BuffValS', hit.BuffValS);
}

/**
 * BGR JSON skill action
 * @param {{
 *     aBSkillAct: {
 *         lUID: number,
 *         uSkillID: number,
 *         BSkillHitS: Object[],
 *     }
 * }} action skill action
 */
export function BgrJsonSkillAction(action) {
    if (!('aBSkillAct' in action)) {
        throw new Error('aBSkillAct is not in Object!');
    }

    const skillact = action.aBSkillAct;
    this.uid= skillact.lUID;
    this.skillId = skillact.uSkillID;
    this.hits = Array.from(skillact.BSkillHitS, (hit) => new BgrJsonSkillHit(hit));

    BgrJsonKeyMap.add('aBSkillAct', skillact);
    BgrJsonKeyMap.add('BSkillHitS', skillact.BSkillHitS);
}

/**
 * BGR JSON update battle end time
 * @param {{
 *     lBattileEndTime: number,
 * }} action update battle end time action
 */
export function BgrJsonUpdateBattleEndTime(action) {
    this.battleEndTime = action.lBattileEndTime;
}

/**
 * BGR JSON update damage challenge record
 * @param {{
 *     lTotalDamageCauseByLeft: number
 * }} action update damage challenge record action
 */
export function BgrJsonUpdateDamageChallengeRecord(action) {
    this.damage = action.lTotalDamageCauseByLeft;
}

/**
 * BGR JSON buffer value
 * @param {{
 *     uBuffID: number,
 *     fDurTime: number,
 *     bPassive: boolean,
 *     nLevel: number,
 *     nTimes: number,
 *     fTerrorScale: number,
 *     fTerrorAdd: number,
 * }} buffer buffer value action
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
 * @param {{
 *     lUID: number,
 *     BuffValS: Object[],
 *     bClearDebuff: boolean
 * }} action hero buffer action
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
 * @param {{
 *     lUID: number,
 *     nHP: number,
 *     nHPVal: number,
 * }} action update hero hp sp action
 */
export function BgrJsonUpdateHeroHpSp (action) {
    this.uid = action.lUID;
    this.hp = action.nHP;
    this.hpDiff = action.nHPVal;
}

/**
 * BGR JSON line index
 * @param {{
 *     nIndex: number
 * }} action 
 */
export function BgrJsonUpdateLineIndex(action) {
    this.index = action.nIndex;
}

/**
 * BGR JSON player info
 * @param {{
 *     lAID: number,
 *     fSP: number,
 *     nPickCnt: number,
 *     nSupport: number,
 *     bSummonAuto: boolean,
 *     nSPLevel: number,
 *     bSkillAuto: boolean,
 *     fEquipSkillCD: number,
 *     uEquipSkill: number,
 *     nEquipLevel: number,
 *     fEquipSkillCastTime: number,
 *     bEquipCasting: boolean,
 *     fLeftTimeStop: number,
 *     fRightTimeStop: number,
 *     nBP: number,
 *     nMoney: number,
 * }} playerInfo player info
 */
export function BgrJsonPlayerInfo(playerInfo) {
    this.sp = playerInfo.fSP;
    this.isSummonAuto = playerInfo.bSummonAuto;
    this.isSkillAuto = playerInfo.bSkillAuto;
}

/**
 * BGR JSON update player info
 * @param {{
 *     BattlePlayerInfoS: Object[]
 * }} action update player info event
 */
export function BgrJsonUpdatePlayerInfo(action) {
    if (!('BattlePlayerInfoS' in action)) {
        throw new Error('BattlePlayerInfoS is not in Object!');
    }

    this.playerInfo = Array.from(action.BattlePlayerInfoS, (x) => new BgrJsonPlayerInfo(x));
    BgrJsonKeyMap.add('BattlePlayerInfoS', action.BattlePlayerInfoS);
}

/**
 * BGR JSON on cast skill
 * @param {{
 *     lUID: number
 * }} action cast skill action
 */
export function BgrJsonOnCastSkill(action) {
    this.uid = action.lUID;
}

/**
 * BGR JSON normal casting skill
 * @param {{
 *     lUID: number,
 *     fCastTime: number,
 *     fCD: number,
 *     bFirstCD: boolean
 * }} action normal casting skill action
 */
export function BgrJsonOnNormalCastingSkill(action) {
    this.uid = action.lUID;
    this.castTime = action.fCastTime;
    this.cooldown = action.fCD;
    this.isFirstCooldown = action.bFirstCD;
}

/**
 * BGR JSON area casting skill
 * @param {{
 *     lUID: number,
 *     fCastTime: number,
 *     fCD: number,
 *     bFirstCD: boolean,
 *     vPos: Object,
 * }} action area casting skill action
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
 * @param {{
 *     lUID: number
 * }} action off cast skill action
 */
export function BgrJsonOffCastSkill(action) {
    this.uid = action.lUID;
}

/**
 * BGR JSON off casting skill
 * @param {{
 *     lUID: number
 * }} action off casting skill action
 */
export function BgrJsonOffCastingSkill(action) {
    this.uid = action.lUID;
}

