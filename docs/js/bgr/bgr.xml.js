/**
 * @file bgr.xml.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

 import { translate } from './bgr.util.js'

/**
 * @constructor BGR xml loader
 * @param {boolean} dynamic_import 
 */
export function BgrXmlLoader(dynamic_import) {
    this.__is_dynamic_import_enabled = dynamic_import;

    /** @type {Array<function(BgrXmlLoader): void>} */
    this.__listeners = [];

    /** @type {Map<string, Set<string>>} */
    this.__keySet = new Map();
}

/**
 * @template T type to be created by constructor
 * @param {Document} doc xml document
 * @param {string} name tag name to find element in the document
 * @param {new() => T} ctor object constructor
 * @returns {Map<number, T>} mapped object
 */
function BgrXmlLoader_mapElementsByTagName(doc, name, ctor) {
    /** @type {Map<number, T>} */
    const map = new Map();

    const elems = doc.getElementsByTagName(name);
    for (let elem of elems) {
        if (elem.hasAttribute('id')) {
            /*
             * collect tag name attributes
             */
            for (let attr of elem.getAttributeNames()) {
                if (!this.__keySet.has(elem.tagName)) {
                    this.__keySet.set(elem.tagName, new Set());
                }
        
                this.__keySet.get(elem.tagName).add(attr);
            }

            /*
             * create and register object
             */
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
        this.__characterMap = this.mapElementsByTagName(bgrxml, 'herogroup', BgrXmlCharacter);
        this.__skillBaseMap = this.mapElementsByTagName(bgrxml, 'skill', BgrXmlSkillBase);
        this.__equipBaseMap = this.mapElementsByTagName(bgrxml, 'equip', BgrXmlEquipBase);
        this.__bufferBaseMap = this.mapElementsByTagName(bgrxml, 'buff', BgrXmlBufferBase);
        this.__itemMap = this.mapElementsByTagName(bgrxml, 'item', BgrXmlItem);
        this.__specialItemMap = this.mapElementsByTagName(bgrxml, 'specialitem', BgrXmlSpecialItem);
        this.__achievementMap = this.mapElementsByTagName(bgrxml, 'achievement', BgrXmlAchievement);
        this.__questMap = this.mapElementsByTagName(bgrxml, 'quest', BgrXmlQuest);

        this.__stageMap = this.mapElementsByTagName(bgrxml, 'stage', BgrXmlStage);
        this.__stageListMap = this.mapElementsByTagName(bgrxml, 'stagelist', BgrXmlStageList);
        this.__stageAreaMap = this.mapElementsByTagName(bgrxml, 'stagearea', BgrXmlStageArea);
        this.__stageGroupMap = this.mapElementsByTagName(bgrxml, 'stage_group', BgrXmlStageGroup);
        this.__chapterGroupMap = this.mapElementsByTagName(bgrxml, 'chapter_group', BgrXmlChapterGroup);

        console.log(this.__keySet);

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
 * call functor for each character
 * @param {function(BgrXmlCharacter): void} f functor
 */
BgrXmlLoader.prototype.forEachCharacter = function BgrXmlLoader_forEachCharacter(f) {
    this.forEach(this.__characterMap, f);
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
 * call functor for each achievement
 * @param {function(BgrXmlAchievement): void} f functor
 */
BgrXmlLoader.prototype.forEachAchievement = function BgrXmlLoader_forEachAchievement(f) {
    this.forEach(this.__achievementMap, f);
};

/**
 * call functor for each quest
 * @param {function(BgrXmlQuest): void} f functor
 */
BgrXmlLoader.prototype.forEachQuest = function BgrXmlLoader_forEachQuest(f) {
    this.forEach(this.__questMap, f);
};

/**
 * call functor for each special item
 * @param {function(BgrXmlSpecialItem): void} f functor
 */
BgrXmlLoader.prototype.forEachSpecialItem = function BgrXmlLoader_forEachSpecialItem(f) {
    this.forEach(this.__specialItemMap, f);
};

/**
 * call functor for each stage
 * @param {function(BgrXmlStage): void} f functor
 */
BgrXmlLoader.prototype.forEachStage = function BgrXmlLoader_forEachStage(f) {
    this.forEach(this.__stageMap, f);
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
};

BgrXmlLoader.prototype.getEquipBase = function BgrXmlLoader_getEquipBase(equipId) {
    return this.__equipBaseMap.get(String(equipId));
};

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
};

BgrXmlLoader.prototype.getSkillBase = function BgrXmlLoader_getSkillBase(skillId) {
    return this.__skillBaseMap.get(String(skillId));
};

BgrXmlLoader.prototype.getBufferBase = function BgrXmlLoader_getBufferBase(bufferId) {
    return this.__bufferBaseMap.get(String(bufferId));
};

BgrXmlLoader.prototype.getItem = function BgrXmlLoader_getItem(itemid) {
    return this.__itemMap.get(String(itemid));
};

BgrXmlLoader.prototype.getStage = function BgrXmlLoader_getStage(stageid) {
    return this.__stageMap.get(String(stageid));
};

BgrXmlLoader.prototype.getStageListByStageId = function BgrXmlLoader_getStageList(stageid) {
    return this.__stageListMap.get(String(stageid / 100 | 0));
};

BgrXmlLoader.prototype.getStageAreaByStageId = function BgrXmlLoader_getStageArea(stageid) {
    return this.__stageAreaMap.get(String(stageid / 10000 | 0));
};

BgrXmlLoader.prototype.getStageGroup = function BgrXmlLoader_getStageGroup(stagegroupid) {
    return this.__stageGroupMap.get(String(stagegroupid));
};

BgrXmlLoader.prototype.getChapterGroup = function BgrXmlLoader_getChapterGroup(chaptergroupid) {
    return this.__chapterGroupMap.get(String(chaptergroupid));
};

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
    this.rank = node.getAttribute('rank');
    this.point = node.getAttribute('point');
    this.maxLv = node.getAttribute('max_lv');
    this.rankUpLv = node.getAttribute('rank_up_lv');
    this.cost = node.getAttribute('cost');
    this.normalSkill = node.getAttribute('nskill');
    this.hp = node.getAttribute('hp');
    this.hpRate = node.getAttribute('hprate');
    this.attack = node.getAttribute('atk');
    this.attackRate = node.getAttribute('atkrate');
    this.defense = node.getAttribute('def');
    this.defenseRate = node.getAttribute('defrate');
    this.speed = node.getAttribute('spd');
    this.speedRate = node.getAttribute('spdrate');
    this.move = node.getAttribute('move');
    this.critical = node.getAttribute('crit');
    this.rankup = node.getAttribute('rankup');
    this.attribute = node.getAttribute('attr');
    this.gpItem = node.getAttribute('gpitem');
    this.attackSkill = node.getAttribute('askill');
    this.leaderSkill = node.getAttribute('lskill');
    this.damageDead = node.getAttribute('damage_dead');
    this.damageScore = node.getAttribute('damage_score');
    this.summonCooldown = node.getAttribute('summon_cd');
    this.sell = node.getAttribute('sell');
    this.stoneSell = node.getAttribute('stone_sell');
    this.rareStone = node.getAttribute('rare_stone');
    this.exp = node.getAttribute('exp');
    this.over1Item = node.getAttribute('over1_item');
    this.over2Item = node.getAttribute('over2_item');
    this.over3Item = node.getAttribute('over3_item');
    this.over4Item = node.getAttribute('over4_item');
    this.awakenAtttak = node.getAttribute('awaken_atk');
    this.awakenDefense = node.getAttribute('awaken_def');
    this.awakenCritical = node.getAttribute('awaken_crit');
    this.onlyGpItem = node.getAttribute('onlygpitem');
    this.plusAdd = node.getAttribute('plus_add');
    this.bgRank = node.getAttribute('bg_rank');
    this.plusAddMaterial = node.getAttribute('plus_add_material');
    this.deadVoice = node.getAttribute('dead_voice');
    this.comment = node.getAttribute('comment');
    this.monsterSkill = node.getAttribute('monster_skill');
    this.monsterAi = node.getAttribute('monster_ai');
    this.suicideTime = node.getAttribute('suicide_time');
    this.suicideHp = node.getAttribute('suicide_hp');
    this.countPoint = node.getAttribute('count_point');
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

    this.buffer = [
        {
            probability: node.getAttribute('bprob1'),
            effect: node.getAttribute('buff1'),
            self: node.getAttribute('buff_self1'),
            area: node.getAttribute('buff_area1'),
            areaDuration: node.getAttribute('buff_area_dur1'),
        },
        {
            probability: node.getAttribute('bprob2'),
            effect: node.getAttribute('buff2'),
            self: node.getAttribute('buff_self2'),
            area: null,
            aeraDuration: null,
        }
    ];

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
    this.name = translate(node.getAttribute('name'));
    this.rank = node.getAttribute('rank');
    this.group = node.getAttribute('group');
    this.moneyPrice = node.getAttribute('money_price');
    this.recycle = node.getAttribute('recycle');
    this.stackNumber = node.getAttribute('stack_num');
 
    const changeItem = node.getAttribute('changeitem');
    if (typeof changeItem === 'string') {
        /** @type {string[][]} */
        this.changeItem = Array.from(changeItem.split('/'), (x) => x.split('#'));
    }
    else {
        this.changeItem = changeItem;
    }

    this.class = translate(node.getAttribute('class'));
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
 * @constructor BGR XML character
 * @param {Element} node 
 */
export function BgrXmlCharacter(node) {
    this.id = node.getAttribute('id');
    this.type = translate(node.getAttribute('type'));
    this.open = node.getAttribute('open');
    this.pictureId = node.getAttribute('picid');
    this.iconAtlas = node.getAttribute('icon_atlas');
    this.animeX = node.getAttribute('ani_x');
    this.animeY = node.getAttribute('ani_y');
    this.animeH = node.getAttribute('ani_h');
    this.pictureX = node.getAttribute('pic_x');
    this.pictureY = node.getAttribute('pic_y');
    this.resource = node.getAttribute('resource');
    this.reviewSkillId = node.getAttribute('review_skill_id');
    this.hScene1 = node.getAttribute('hscene1');
    this.hScene2 = node.getAttribute('hscene2');
    this.skillTalk =  [
        node.getAttribute('skilltalk1'),
        node.getAttribute('skilltalk2'),
        node.getAttribute('skilltalk3'),
    ];
    this.name = node.getAttribute('name');
    this.cv = node.getAttribute('cv');
    this.comment = node.getAttribute('comment');
    this.artist = node.getAttribute('artist');
    this.basegptalk = [
        node.getAttribute('basegptalk1'),
        node.getAttribute('basegptalk2'),
        node.getAttribute('basegptalk3'),
    ];
    this.skinOnly = node.getAttribute('skin_only');
    this.addgptalk = [
        node.getAttribute('addgptalk1'),
        node.getAttribute('addgptalk2'),
        node.getAttribute('addgptalk3'),
        node.getAttribute('addgptalk4'),
        node.getAttribute('addgptalk5'),
    ];
    this.pictureCutin = node.getAttribute('pic_cutin');
    this.sportsTalk = node.getAttribute('sportstalk');
    this.bossBattleBonus = node.getAttribute('boss_battle_bonus');
    this.marryTalk = node.getAttribute('marrytalk');
    this.pictureOnly = node.getAttribute('pic_only');    
}

/**
 * @constructor BGR XML achievement
 * @param {Element} node 
 */
export function BgrXmlAchievement(node) {
    this.id = node.getAttribute('id');
    this.open = node.getAttribute('open');
    this.display = node.getAttribute('display');
    this.type = node.getAttribute('type');
    this.groupId = node.getAttribute('group_id');
    this.name = node.getAttribute('name');
    this.level = node.getAttribute('level');
    this.tarInfo = node.getAttribute('tar_info');
    this.comment = node.getAttribute('comment');
    this.fin = [
        {
            type: node.getAttribute('fintype1'),
            cnt: node.getAttribute('fincnt1'),
            tar: node.getAttribute('fintar1'),
        },
        {
            type: node.getAttribute('fintype2'),
            cnt: node.getAttribute('fincnt2'),
            tar: node.getAttribute('fintar2'),
        }
    ];
    this.allfin = node.getAttribute('allfin');
    this.proudstone = node.getAttribute('proudstone');
    this.startTime = node.getAttribute('start_time');
    this.atlas = node.getAttribute('atlas');
    this.icon = node.getAttribute('icon');   
}

/**
 * @constructor BGR XML quest
 * @param {Element} node 
 */
export function BgrXmlQuest(node) {
    this.id = node.getAttribute('id');
    this.open = node.getAttribute('open');
    this.type = node.getAttribute('type');
    this.name = node.getAttribute('name');
    this.tarInfo = node.getAttribute('tarinfo');
    this.comment = node.getAttribute('comment');
    this.fin = [
        {
            type: node.getAttribute('fintype1'),
            cnt: node.getAttribute('fincnt1'),
            tar: node.getAttribute('fintar1'),
        },
        {
            type: node.getAttribute('fintype2'),
            cnt: node.getAttribute('fincnt2'),
            tar: node.getAttribute('fintar2'),
        },
        {
            type: node.getAttribute('fintype3'),
            tar: node.getAttribute('fintar3'),
            cnt: node.getAttribute('fincnt3'),
        }
    ];

    this.money = node.getAttribute('money');
    this.item = [
        node.getAttribute('item1'),
        node.getAttribute('item2'),
    ];
    this.chapterGroupId = node.getAttribute('chapter_gid');
    this.edtalk = node.getAttribute('edtalk');
    this.week = node.getAttribute('week');
    this.createTime = node.getAttribute('create_time');
    this.expeditionGroupId = node.getAttribute('expedition_group_id');
    this.goWindow = node.getAttribute('gowindow');
    this.preQuest = node.getAttribute('pre_quest');
    this.allfin = node.getAttribute('allfin');
    this.onlyFinish = node.getAttribute('only_finish');
    this.rerunGroupId = node.getAttribute('rerun_group_id');
    this.sortOrder = node.getAttribute('sort_order');
    this.startTime = node.getAttribute('start_time');
    this.endTime = node.getAttribute('end_time');
    this.specialActId = node.getAttribute('spe_act_id');
    this.preHGroup1 = node.getAttribute('pre_hg1');        
}

/**
 * @constructor BGR XML stage
 * @param {Element} node 
 */
export function BgrXmlStage(node) {
    this.id = node.getAttribute('id');
    this.open = node.getAttribute('open');
    this.type = node.getAttribute('type');
    this.name = node.getAttribute('name');
    this.atlas = node.getAttribute('atlas');
    this.icon = node.getAttribute('icon');
    this.level = node.getAttribute('lv');
    this.battleBg = node.getAttribute('battle_bg');
    this.mapBuffer = node.getAttribute('map_buff');
    this.moveMinY = node.getAttribute('move_min_y');
    this.moveMaxY = node.getAttribute('move_max_y');
    this.costAP = node.getAttribute('cost_ap');
    this.baseMoney = node.getAttribute('base_money');
    this.rateMoney = node.getAttribute('rate_money');
    this.baseHeroExp = node.getAttribute('base_hero_exp');
    this.rateHeroExp = node.getAttribute('rate_hero_exp');
    this.baseCharacterExp = node.getAttribute('base_char_exp');
    this.rateCharacterExp = node.getAttribute('rate_char_exp');
    this.bgm = node.getAttribute('bgm');
    this.enemy = [
        node.getAttribute('enemy1'),
        node.getAttribute('enemy2'),
        node.getAttribute('enemy3'),
        node.getAttribute('enemy4'),
        node.getAttribute('enemy5'),
    ];
    this.enemy = [
        node.getAttribute('army1'),
        node.getAttribute('army2'),
        node.getAttribute('army3'),
        node.getAttribute('army4'),
        node.getAttribute('army5'),
    
    ];
    this.item_rate = {
        s: this.splitItemRate(node.getAttribute('item_rate_s')),
        a: this.splitItemRate(node.getAttribute('item_rate_a')),
        b: this.splitItemRate(node.getAttribute('item_rate_b')),
        c: this.splitItemRate(node.getAttribute('item_rate_c')),
    };
    this.mainEnemyGo = node.getAttribute('main_enemy_go');
    this.enemyGo = node.getAttribute('enemy_go');
    this.showBattleAgain = node.getAttribute('show_battle_again');
    this.time = node.getAttribute('time');
    this.mainOrder = node.getAttribute('main_order');
    this.showNextStage = node.getAttribute('show_next_stage');
    this.talk = node.getAttribute('talk');
    this.stageClear = node.getAttribute('stage_clear');
    this.autoClearStage = node.getAttribute('auto_clear_stage');
    this.stagePoint = node.getAttribute('stage_point');
    this.findStage = node.getAttribute('find_stage');
    this.findProbability = node.getAttribute('find_prob');
    this.durationTime = node.getAttribute('dur_time');
    this.preId = [
        node.getAttribute('pre_id1'),
        node.getAttribute('pre_id2'),
        node.getAttribute('pre_id3'),
        node.getAttribute('pre_id4'),
        node.getAttribute('pre_id5'),
    ];
    this.comment = node.getAttribute('comment');
    this.countryScore = node.getAttribute('country_score');
    this.mainEnemyPosition = node.getAttribute('main_enemy_pos');
    this.sportsPositionX = node.getAttribute('sports_pos_x');
    this.sportsPositionY = node.getAttribute('sports_pos_y');
    this.costItemId = node.getAttribute('cost_item_id');
    this.costItemNum = node.getAttribute('cost_item_num');
    this.limitPerDay = node.getAttribute('limit_per_day');
    this.rightMapBuffer = node.getAttribute('right_map_buff');
}

/**
 * splite item rate string
 * @param {string} itemRate 
 * @return {{
 *     probability: number,
 *     itemId: number,
 *     numOfItems: number,  
 * }[]}
 */
BgrXmlStage.prototype.splitItemRate = function BgrXmlStage_splitItemRate(itemRate) {
    if (itemRate) {
        return Array.from(itemRate.split('/'), function(x) {
            const params = x.split('#');
            return {
                probability: params[0],
                itemId: params[1],
                numOfItems: params[2],
            };
        });
    }
    return [];
};

/**
 * @constructor BGR XML stage list
 * @param {Element} node 
 */
export function BgrXmlStageList(node) {
    this.id = node.getAttribute('id');
    this.name = node.getAttribute('name');
    this.questId = node.getAttribute('quest_id');
    this.open = node.getAttribute('open');
    this.newCb = node.getAttribute('new_cb');
    this.preId = [
        node.getAttribute('pre_id1'),
        node.getAttribute('pre_id2'),
        node.getAttribute('pre_id3'),
        node.getAttribute('pre_id4'),
        node.getAttribute('pre_id5'),
    ];
    this.type = node.getAttribute('type');
    this.parameter1 = node.getAttribute('parameter1');
    this.parameter2 = node.getAttribute('parameter2');   
}

/**
 * @constructor BGR XML stage area
 * @param {Element} node 
 */
export function BgrXmlStageArea(node) {
    this.id = node.getAttribute('id');
    this.open = node.getAttribute('open');
    this.type = node.getAttribute('type');
    this.bg = node.getAttribute('bg');
    this.bgName = node.getAttribute('bgname');
    this.name = node.getAttribute('name');
    this.color = node.getAttribute('color');
    this.pointX = node.getAttribute('pointx');
    this.pointY = node.getAttribute('pointy');
    this.groupId = node.getAttribute('group_id');
    this.item = node.getAttribute('item');
    this.comment = node.getAttribute('comment');
    this.areaAttribute = node.getAttribute('area_attr');
    this.openCycle = node.getAttribute('open_cycle');
    this.startTime = node.getAttribute('start_time');
    this.endTime = node.getAttribute('end_time');
    this.serverId = node.getAttribute('server_id');
    this.duration = node.getAttribute('duration');
    this.preId = [
        node.getAttribute('pre_id1'),
        node.getAttribute('pre_id2'),
        node.getAttribute('pre_id3'),
        node.getAttribute('pre_id4'),
        node.getAttribute('pre_id5'),
    ];
    this.infinityLevel = node.getAttribute('infinity_level');
    this.infinityPoint = node.getAttribute('infinity_point');
    this.infinityTime = node.getAttribute('infinity_time');
}

/**
 * @constructor BGR XML stage group
 * @param {Element} node 
 */
export function BgrXmlStageGroup(node) {
    this.id = node.getAttribute('id');
    this.name = node.getAttribute('name');
    this.open = node.getAttribute('open');
    this.type = node.getAttribute('type');
    this.hero = node.getAttribute('hero');
    this.face = node.getAttribute('face');
    this.heroPictureX = node.getAttribute('hero_pic_x');
    this.heroPictureY = node.getAttribute('hero_pic_y');
    this.heroPictureSizeX = node.getAttribute('hero_pic_size_x');
    this.heroPictureRotationZ = node.getAttribute('hero_pic_rotation_z');
    this.bg = node.getAttribute('bg');
    this.bgX = node.getAttribute('bg_x');
    this.bgY = node.getAttribute('bg_y');
    this.bgSizeX = node.getAttribute('bg_size_x');
    this.bgSizeY = node.getAttribute('bg_size_y');
    this.sortOrder = node.getAttribute('sort_order');
    this.activityShop = node.getAttribute('activity_shop');
    this.itemAtlas = node.getAttribute('item_atlas');
    this.itemIcon = node.getAttribute('item_icon');
    this.startTime = node.getAttribute('start_time');
    this.endTime = node.getAttribute('end_time');
}

/**
 * @constructor BGR XML chapter group
 * @param {Element} node 
 */
export function BgrXmlChapterGroup(node) {
    this.id = node.getAttribute('id');
    this.name = node.getAttribute('name');
    this.hero = node.getAttribute('hero');
    this.face = node.getAttribute('face');
    this.heroPictureX = node.getAttribute('hero_pic_x');
    this.heroPictureY = node.getAttribute('hero_pic_y');
    this.heroPictureSizeX = node.getAttribute('hero_pic_size_x');
    this.heroPictureSizeY = node.getAttribute('hero_pic_size_y');
    this.heroPictureRotationZ = node.getAttribute('hero_pic_rotation_z');
    this.bg = node.getAttribute('bg');
    this.bgX = node.getAttribute('bg_x');
    this.bgY = node.getAttribute('bg_y');
    this.bgSizeX = node.getAttribute('bg_size_x');
    this.bgSizeY = node.getAttribute('bg_size_y');
}

/**
 * @constructor BGR XML special item
 * @param {Element} node 
 */
export function BgrXmlSpecialItem(node) {
    this.comment = node.getAttribute('comment');
    this.group = node.getAttribute('group');
    this.icon = node.getAttribute('icon');
    this.id = node.getAttribute('id');
    this.name = node.getAttribute('name');

    /**
     * @type {{
     *     content: string,
     *     probability: number,
     * }[]}
     */
    this.item = [];
    for (let i = 1; node.getAttribute('item' + i) || node.getAttribute('prob' + i); ++i) {
        const prob = node.getAttribute('prob' + i);
        this.item.push({
            content: node.getAttribute('item' + i),
            probability: prob ? parseFloat(prob) : prob,
        });
    }
 
    this.sp_num1 = node.getAttribute('sp_num1');
    this.sp_num2 = node.getAttribute('sp_num2');
    this.sp_val = node.getAttribute('sp_val');
}

/**
 * @constructor BGR xml element hook
 * @param {HTMLElement} node
 */
export function BgrXmlElementHook(node) {
    this.id = node.getAttribute('id');
}
