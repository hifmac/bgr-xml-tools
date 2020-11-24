/**
 * BGR unit base
 * @param {Element} node 
 */
function BgrXmlUnitBase(node) {
    if (node.nodeName != 'hero') {
        throw new Error(node.nodeName + ' is not hero!');
    }
    if (!node.hasAttribute('id')) {
        throw new Error('no hero id!');
    }

    this.id = node.getAttribute('id');
    this.groupId = node.getAttribute('group_id');
    this.name = node.getAttribute('name');
    this.attribute = node.getAttribute('attr');
    this.maxLv = node.getAttribute('max_lv');
    this.summonCooldown = node.getAttribute('summon_cd');

    this.rank = node.getAttribute('rank');
    this.bgRank = node.getAttribute('bg_rank');

    this.hp = node.getAttribute('hp');
    this.hpRank = node.getAttribute('hprate');
    this.attack = node.getAttribute('atk');
    this.attackRate = node.getAttribute('atkrate');
    this.defense = node.getAttribute('def');
    this.defenseRate = node.getAttribute('defrate');
    this.speed = node.getAttribute('spd');
    this.speedRate = node.getAttribute('spdrate');
    this.move = node.getAttribute('move');
    this.critical = node.getAttribute('crit');

    this.leaderSkill = node.getAttribute('lskill');
    this.attackSkill = node.getAttribute('askill');
    this.normalSkill = node.getAttribute('nskill');

    this.monsterAi = node.getAttribute('monster_ai');
    this.monsterSkill = node.getAttribute('monster_skill');

    this.comment = node.getAttribute('comment');
}

