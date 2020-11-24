/**
 * 
 * @param {Object} obj 
 */
function BgrJsonSkillAction(obj) {
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
