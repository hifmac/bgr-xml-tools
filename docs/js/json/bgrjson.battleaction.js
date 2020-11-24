/**
 * BGR JSON battle action
 * @param {Object} obj 
 */
function BgrJsonBattleAction (obj) {
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
