/**
 * BGR skill base
 * @param {Element} node 
 */
function BgrXmlSkillBase(node) {
    this.id = node.getAttribute('id');
    this.name = node.getAttribute('name');
    this.attribute = node.getAttribute('attr');

    this.hp = node.getAttribute('hp');
    this.sp = node.getAttribute('sp');
    this.bp = node.getAttribute('bp');
    this.bpRate = node.getAttribute('bp_rate');
    this.firstCooldown = node.getAttribute('first_cd');
    this.cooldown = node.getAttribute('cd');

    this.target = node.getAttribute('target');
    this.type = node.getAttribute('type');

    this.attackAdd = node.getAttribute('atkadd');
    this.attackAddRate = node.getAttribute('atkadd_rate');
    this.attackScale = node.getAttribute('atkscale');
    this.attackScaleRate = node.getAttribute('atkscale_rate');

    this.attackType = node.getAttribute('atktype');
    this.attackArea = node.getAttribute('atkarea');
    this.attackNumberType = node.getAttribute('atknum_type');
    this.attackNumber = node.getAttribute('atknumber');

    this.attackRange = node.getAttribute('atkrange');
    this.attackStandardRange = node.getAttribute('atkstandardrange');
    this.sortestAttackRange = node.getAttribute('shortest_atkrange');

    this.buffer1 = {
        probability: node.getAttribute('bprob1'),
        effect: node.getAttribute('buff1'),
        self: node.getAttribute('buff_self1'),
        area: node.getAttribute('buff_area1'),
        areaDuration: node.getAttribute('buff_area_dur1'),
    };
    this.buffer2 = {
        probability: node.getAttribute('bprob2'),
        effect: node.getAttribute('buff2'),
        self: node.getAttribute('buff_self2'),
        area: null,
        aeraDuration: null,
    };

    this.comment = node.getAttribute('comment');
}
