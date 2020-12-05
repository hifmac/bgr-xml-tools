/**
 * @file bgr.xml.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */


/**
 * @constructor BGR xml loader
 * @param {boolean} dynamic_import 
 */
export function BgrXmlLoader(dynamic_import) {
    this.__is_dynamic_import_enabled = dynamic_import;
    this.__listeners = [];
}

/** @type {Map<string, BgrXmlUnitBase} */
BgrXmlLoader.prototype.__unitBaseMap = null;

/** @type {Map<string, BgrXmlEquipBase} */
BgrXmlLoader.prototype.__equipBaseMap = null;

/** @type {Map<string, BgrXmlSkillBase} */
BgrXmlLoader.prototype.__skillBaseMap = null;

/** @type {Map<string, BgrXmlBufferBase} */
BgrXmlLoader.prototype.__bufferBaseMap = null;

/** @type {Map<string, BgrXmlItem} */
BgrXmlLoader.prototype.__itemMap = null;

/** @type {Array<function(BgrXmlLoader): void>} */
BgrXmlLoader.prototype.__listeners = null;

/**
 * @template T type to be created by constructor
 * @param {Document} doc xml document
 * @param {string} name tag name to find element in the document
 * @param {new() => T} ctor object constructor
 * @returns {Map<number, T>} mapped object
 */
function BgrXmlLoader_mapElementsByTagName(doc, name, ctor) {
    const map = new Map();
    const elems = doc.getElementsByTagName(name);
    for (let elem of elems) {
        if (elem.hasAttribute('id')) {
            map.set(elem.getAttribute('id'), new ctor(elem));
        }
    }
    return map;
}
BgrXmlLoader.prototype.mapElementsByTagName = BgrXmlLoader_mapElementsByTagName;

/**
 * load BGR XML
 * @param {string} xml bgr xml
 */
BgrXmlLoader.prototype.loadXml = function BgrXmlLoader_loadXml(xml) {
    const parser = new DOMParser();
    const bgrxml = parser.parseFromString(xml, "text/xml");

    if (bgrxml.firstChild.nodeName == 'BGR') {
        this.__unitBaseMap = this.mapElementsByTagName(bgrxml, 'hero', BgrXmlUnitBase);
        this.__characterMap = this.mapElementsByTagName(bgrxml, 'herogroup', BgrXmlElementHook);
        this.__skillBaseMap = this.mapElementsByTagName(bgrxml, 'skill', BgrXmlSkillBase);
        this.__equipBaseMap = this.mapElementsByTagName(bgrxml, 'equip', BgrXmlEquipBase);
        this.__bufferBaseMap = this.mapElementsByTagName(bgrxml, 'buff', BgrXmlBufferBase);
        this.__specialItemMap = this.mapElementsByTagName(bgrxml, 'specialitem', BgrXmlElementHook);
        this.__achievementMap = this.mapElementsByTagName(bgrxml, 'achievement', BgrXmlElementHook);
        this.__questMap = this.mapElementsByTagName(bgrxml, 'quest', BgrXmlElementHook);

        this.__stageMap = this.mapElementsByTagName(bgrxml, 'stage', BgrXmlElementHook);
        this.__stageListMap = this.mapElementsByTagName(bgrxml, 'stagelist', BgrXmlElementHook);
        this.__stageAreaMap = this.mapElementsByTagName(bgrxml, 'stagearea', BgrXmlElementHook);
        this.__stageGroupMap = this.mapElementsByTagName(bgrxml, 'stage_group', BgrXmlElementHook);
        this.__chapterGroupMap = this.mapElementsByTagName(bgrxml, 'chapter_group', BgrXmlElementHook);

        console.log(Array.from(this.__stageMap.values())[0].keySet);
        return true;
    }

    return false;
}

/**
 * call functor for each unit
 * @template T
 * @param {Map<string, T>} map
 * @param {function(T): void} f functor
 */
function BgrXmlLoader_forEach(map, f) {
    for (let key of map.keys()) {
        f(map.get(key));
    }
}
BgrXmlLoader.prototype.forEach = BgrXmlLoader_forEach;

/**
 * call functor for each unit
 * @param {function(BgrXmlUnitBase): void} f functor
 */
BgrXmlLoader.prototype.forEachUnitBase = function BgrXmlLoader_forEachUnitBase(f) {
    this.forEach(this.__unitBaseMap, f);
};

/**
 * call functor for each equip
 * @param {function(BgrXmlEquipBase): void} f functor
 */
BgrXmlLoader.prototype.forEachEquipBase = function BgrXmlLoader_forEachEquipBase(f) {
    this.forEach(this.__equipBaseMap, f);
};

/**
 * call functor for each skill
 * @param {function(BgrXmlSkillBase): void} f functor
 */
BgrXmlLoader.prototype.forEachSkillBase = function BgrXmlLoader_forEachSkillBase(f) {
    this.forEach(this.__skillBaseMap, f);
};

/**
 * call functor for each buffer
 * @param {function(BgrXmlBufferBase): void} f functor
 */
BgrXmlLoader.prototype.forEachBufferBase = function BgrXmlLoader_forEachBufferBase(f) {
    this.forEach(this.__bufferBaseMap, f);
};

/**
 * call functor for each item
 * @param {function(BgrXmlItem): void} f functor
 */
BgrXmlLoader.prototype.forEachItem = function BgrXmlLoader_forEachItem(f) {
    this.forEach(this.__itemMap, f);
};

BgrXmlLoader.prototype.getUnitBase = function BgrXmlLoader_getUnitBase(unitId) {
    return this.__unitBaseMap.get(String(unitId));
}

BgrXmlLoader.prototype.getUnitBaseBySkillID = function BgrXmlLoader_getUnitBase(skillId) {
    skillId = String(skillId);
    let candidate = null
    for (let unit of this.__unitBaseMap.values()) {
        if (unit.normalSkill == skillId || unit.attackSkill == skillId || (unit.monsterSkill && unit.monsterSkill.indexOf(skillId) != -1)) {
            if (candidate) {
                if (unit.rank == '5' && unit.name.indexOf('+') != -1) {
                    candidate = unit;
                    break;
                }
            }
            else {
                candidate = unit;
            }
        }
    }
    return candidate;
}

BgrXmlLoader.prototype.getSkillBase = function BgrXmlLoader_getSkillBase(skillId) {
    return this.__skillBaseMap.get(String(skillId));
}

BgrXmlLoader.prototype.getBufferBase = function BgrXmlLoader_getBufferBase(bufferId) {
    return this.__bufferBaseMap.get(String(bufferId));
}

BgrXmlLoader.prototype.getItem = function BgrXmlLoader_getItem(itemid) {
    return this.__itemMap.get(String(itemid));
}

/**
 * @constructor BGR unit base
 * @param {Element} node
 */
export function BgrXmlUnitBase(node) {
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

/**
 * @constructor BGR equip base
 * @param {Element} node 
 */
export function BgrXmlEquipBase(node) {
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

/**
 * @constructor BGR skill base
 * @param {Element} node 
 */
export function BgrXmlSkillBase(node) {
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

/**
 * @constructor BGR buffer base
 * @param {Element} node 
 */
export function BgrXmlBufferBase(node) {
    this.id = node.getAttribute('id');
    this.name = node.getAttribute('name');
    this.attribute = node.getAttribute('attr');
    this.battleType = node.getAttribute('battletype');

    this.bufferType = node.getAttribute('bufftype');
    this.clearBuffer = node.getAttribute('clear_buff');
    this.clearDebuff = node.getAttribute('clear_debuff');
    this.debuff = node.getAttribute('debuff');
    this.steal = node.getAttribute('steal');

    this.bufferTimes = node.getAttribute('buff_times');
    this.bufferAdd = node.getAttribute('buffadd');
    this.bufferAddRate = node.getAttribute('buffadd_rate');
    this.bufferDuration = node.getAttribute('buffdur');
    this.bufferDurationRate = node.getAttribute('buffdur_rate');
    this.bufferScale = node.getAttribute('buffscale');
    this.bufferScaleRate = node.getAttribute('buffscale_rate');

    this.group = node.getAttribute('group');
    this.overlap = node.getAttribute('overlap');
}

/**
 * @constructor BGR XML item
 * @param {Element} node 
 */
export function BgrXmlItem(node) {
    this.id = node.getAttribute('id');
    this.mergeId = node.getAttribute('merge_id');
    this.type = node.getAttribute('type');
    this.open = node.getAttribute('open');
    this.name = node.getAttribute('name');
    this.rank = node.getAttribute('rank');
    this.group = node.getAttribute('group');
    this.moneyPrice = node.getAttribute('money_price');
    this.recycle = node.getAttribute('recycle');
    this.stackNumber = node.getAttribute('stack_num');
 
    this.changeItem = node.getAttribute('changeitem');
    this.class = node.getAttribute('class');
    this.comment = node.getAttribute('comment');
    this.effectValue = node.getAttribute('effect_val');

    this.goWindow = node.getAttribute('gowindow');
    this.windowId = node.getAttribute('wnd_id');

    this.spPresentEnd = node.getAttribute('sp_present_end');
    this.spPresentStart = node.getAttribute('sp_present_start');
    this.spValue1 = node.getAttribute('sp_val');
    this.spValue2 = node.getAttribute('sp_val2');
    this.specialPresent = node.getAttribute('special_present');
}

/**
 * @constructor BGR xml element hook
 * @param {HTMLElement} node
 */
export function BgrXmlElementHook(node) {
    for (let attr of node.getAttributeNames()) {
        if (!this.keySet.has(node.tagName)) {
            this.keySet.set(node.tagName, new Set());
        }

        this.keySet.get(node.tagName).add(attr);
    }

    this.id = node.getAttribute('id');
}

/**
 * @type {Map<string, Set<string>>}
 */
BgrXmlElementHook.prototype.keySet = new Map();
