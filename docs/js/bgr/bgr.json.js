/**
 * BGR JSON battle action
 * @param {Object} obj 
 */
export function BgrJsonBattleAction (obj) {
    if (!('BActionS' in obj)) {
        throw new Error('BActionS not in the Object!');
    }

    this.battleStart = [];
    this.heroJoin = [];
    /** @type {BgrJsonSkillAction[]} */
    this.skillAction = [];
    this.heroMove = [];
    this.updateDamageChallengeRecord = [];
    /** @type {BgrJsonUpdatePlayerInfo[]} */
    this.updatePlayerInfo = [];
    this.updateHeroHpSp = [];
    this.updateHeroBuffer = [];

    for (let action of obj.BActionS) {
        switch (action.typeName) {
        case 'BAction_BattleStart':
            this.battleStart.push(new BgrJsonBattleStart(action));
            break;
        case 'BAction_HeroJoin':
            this.heroJoin.push(new BgrJsonHeroJoin(action));
            break;
        case 'BAction_SkillAct':
            this.skillAction.push(new BgrJsonSkillAction(action));
            break;
        case 'BAction_HeroMove':
            this.heroMove.push(new BgrJsonHeroMove(action));
            break;
        case 'BAction_UpdateDamageChallengeRecord':
            this.updateDamageChallengeRecord.push(new BgrJsonUpdateDamageChallengeRecord(action));
            break;
        case 'BAction_UpdatePlayerInfo':
            this.updatePlayerInfo.push(new BgrJsonUpdatePlayerInfo(action));
            break;
        case 'BAction_UpdateHeroHPSP':
            this.updateHeroHpSp.push(new BgrJsonUpdateHeroHpSp(action));
            break;
        case 'BAction_UpdateHeroBuff':
            this.updateHeroBuffer.push(new BgrJsonUpdateHeroBuffer(action));
            break;
        default:
            console.log(action.typeName + ' is not handled!');
            break;                                                
        }
    }
}

/**
 * 
 * @param {Object} obj 
 */
export function BgrJsonBattleStart(obj) {
}

/**
 * 
 * @param {Object} obj 
 */
export function BgrJsonHeroJoin(obj) {
    if (!('CHeroDataS' in obj)) {
        throw new Error('CHeroDataS is not in Object!');
    }

    this.heroes = [];
    for (let hero of obj.CHeroDataS) {
        this.heroes.push(new BgrJsonHeroJoin.HeroData(hero));
    }
}

BgrJsonHeroJoin.HeroData = function BgrJsonHeroData(hero) {
    this.xid = hero.uXID;
    this.uid = hero.lUID;
    this.level = hero.nLevel;
    this.gp = hero.uGP;
    this.tp = hero.uTP;
    this.hp = hero.nHp;
    this.position = hero.cDamageChallengePos;
};

/**
 * 
 * @param {Object} obj 
 */
export function BgrJsonHeroMove(obj) {
}

/**
 * 
 * @param {Object} obj 
 */
export function BgrJsonSkillAction(obj) {
    if (!('aBSkillAct' in obj)) {
        throw new Error('aBSkillAct is not in Object!');
    }

    const skillact = obj.aBSkillAct;

    this.uid= skillact.lUID;
    this.skillId = skillact.uSkillID;
    this.hits = [];
    for (let hit of skillact.BSkillHitS) {
        this.hits.push({
            uid: hit.lUID,
            hp: hit.nHP,
            hpDiff: hit.nHPVal,  
            isCritical: hit.bCrit,
            buffers: [] 
        });
    }
}

/**
 * 
 * @param {Object} obj 
 */
export function BgrJsonUpdateDamageChallengeRecord(obj) {
    this.damage = obj.lTotalDamageCauseByLeft;
}

/**
 * 
 * @param {Object} obj 
 */
export function BgrJsonUpdateHeroBuffer(obj) {
}

/**
 * 
 * @param {Object} obj 
 */
export function BgrJsonUpdateHeroHpSp (obj) {
    this.uid = obj.lUID;
    this.hp = obj.nHP;
    this.hpDiff = obj.nHPVal;
}   

/**
 * 
 * @param {Object} obj 
 */
export function BgrJsonUpdatePlayerInfo(obj) {
    if (!('BattlePlayerInfoS' in obj)) {
        throw new Error('BattlePlayerInfoS is not in Object!');
    }

    for (let info of obj.BattlePlayerInfoS) {
        this.sp = info.fSP;
        this.isSummonAuto = info.bSummonAuto;
        this.isSkillAuto = info.bSkillAuto;
    }
}


