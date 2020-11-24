/**
 * 
 * @param {Object} obj 
 */
function BgrJsonUpdatePlayerInfo(obj) {
    if (!('BattlePlayerInfoS' in obj)) {
        throw new Error('BattlePlayerInfoS is not in Object!');
    }

    for (let info of obj.BattlePlayerInfoS) {
        this.sp = info.fSP;
        this.isSummonAuto = info.bSummonAuto;
        this.isSkillAuto = info.bSkillAuto;
    }
}
