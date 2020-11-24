/**
 * 
 * @param {Object} obj 
 */
function BgrJsonHeroJoin(obj) {
    if (!('CHeroDataS' in obj)) {
        throw new Error('CHeroDataS is not in Object!');
    }

    this.heroes = [];
    for (let hero of obj.CHeroDataS) {
        this.heroes.push({
            xid: hero.uXID,
            uid: hero.lUID,
            level: hero.nLevel,
            gp: hero.uGP,
            tp: hero.uTP,
            hp: hero.nHp,
        });
    }
}
