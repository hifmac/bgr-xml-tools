
/**
 * BGR equip base
 * @param {Element} node 
 */
function BgrXmlEquipBase(node) {
    this.id = node.getAttribute('id');
    this.open = node.getAttribute('open');
    this.over = node.getAttribute('over');
    this.rank = node.getAttribute('rank');
    this.baseLvMax = node.getAttribute('base_lv_max');

    this.hp = node.getAttribute('hp');
    this.hpRate = node.getAttribute('hp_rate');
    this.attack = node.getAttribute('atk');
    this.attackRate = node.getAttribute('atk_rate');
    this.defense = node.getAttribute('def');
    this.defenseRate = node.getAttribute('def_rate');
    this.speed = node.getAttribute('spd');
    this.speedRate = node.getAttribute('spd_rate');
    this.move = node.getAttribute('move');
    this.critical = node.getAttribute('crit');

    this.skill = node.getAttribute('skill');
}
