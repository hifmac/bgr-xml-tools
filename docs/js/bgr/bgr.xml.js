/**
 * @file bgr.xml.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

import { translate, calculateParameter } from './bgr.util.js'

export class XmlMapper {
    constructor() {
        /** @type {Map<string, Set<string>>} */
        this.#keySet = new Map();
    }

    /**
     * @template T type to be created by constructor
     * @param {Document} doc xml document
     * @param {string} name tag name to find element in the document
     * @param {new(elem: Element) => T} ctor object constructor
     * @returns {Map<number, T>} mapped object
     */
    mapElementsByTagName(doc, name, ctor) {
        /*
        * make tagName - attr key set for debug
        */
        if (!this.#keySet.has(name)) {
            this.#keySet.set(name, new Set());
        }
        const keySet = this.#keySet.get(name);

        /** @type {Map<number, T>} */
        const map = new Map();
        for (const elem of doc.getElementsByTagName(name)) {
            if (elem.hasAttribute('id')) {
                /*
                * collect tag name attributes
                */
                for (const attr of elem.getAttributeNames()) {
                    keySet.add(attr);
                }

                /*
                * create and register object
                */
                const obj = new ctor(elem);
                if (obj.id) {
                    map.set(obj.id, obj);
                }
            }
        }
        return map;
    }

    get keySet() {
        return this.#keySet;
    }

    #keySet;
 }

/**
 * @constructor BGR xml loader
 */
export class BgrXmlLoader {
    constructor() {
    }

    /**
     * @template T type to be created by constructor
     * @param {Document} doc xml document
     * @param {string} name tag name to find element in the document
     * @param {new() => T} ctor object constructor
     * @returns {Map<number, T>} mapped object
     */
    mapElementsByTagName(doc, name, ctor) {
        /*
        * make tagName - attr key set for debug
        */
        if (!this.__keySet.has(name)) {
            this.__keySet.set(name, new Set());
        }
        const keySet = this.__keySet.get(name);

        /** @type {Map<number, T>} */
        const map = new Map();
        for (let elem of doc.getElementsByTagName(name)) {
            if (elem.hasAttribute('id')) {
                /*
                * collect tag name attributes
                */
                for (let attr of elem.getAttributeNames()) {
                    keySet.add(attr);
                }

                /*
                * create and register object
                */
                const obj = new ctor(elem);
                if (obj.id) {
                    map.set(obj.id, obj);
                }
            }
        }
        return map;
    }

    /**
     * load BGR XML
     * @param {string} xml bgr xml
     */
    loadXml(xml) {
        const parser = new DOMParser();
        const bgrxml = parser.parseFromString(xml, "text/xml");

        if (bgrxml.firstChild.nodeName == 'BGR') {
            this.#unitBaseMap = this.#mapper.mapElementsByTagName(bgrxml, 'hero', BgrXmlUnitBase);
            this.#characterMap = this.#mapper.mapElementsByTagName(bgrxml, 'herogroup', BgrXmlCharacter);
            this.#skillBaseMap = this.#mapper.mapElementsByTagName(bgrxml, 'skill', BgrXmlSkillBase);
            this.#equipBaseMap = this.#mapper.mapElementsByTagName(bgrxml, 'equip', BgrXmlEquipBase);
            this.#bufferBaseMap = this.#mapper.mapElementsByTagName(bgrxml, 'buff', BgrXmlBufferBase);
            this.#itemMap = this.#mapper.mapElementsByTagName(bgrxml, 'item', BgrXmlItem);
            this.#specialItemMap = this.#mapper.mapElementsByTagName(bgrxml, 'specialitem', BgrXmlSpecialItem);
            this.#achievementMap = this.#mapper.mapElementsByTagName(bgrxml, 'achievement', BgrXmlAchievement);
            this.#questMap = this.#mapper.mapElementsByTagName(bgrxml, 'quest', BgrXmlQuest);

            this.#stageMap = this.#mapper.mapElementsByTagName(bgrxml, 'stage', BgrXmlStage);
            this.#stageListMap = this.#mapper.mapElementsByTagName(bgrxml, 'stagelist', BgrXmlStageList);
            this.#stageAreaMap = this.#mapper.mapElementsByTagName(bgrxml, 'stagearea', BgrXmlStageArea);
            this.#stageGroupMap = this.#mapper.mapElementsByTagName(bgrxml, 'stage_group', BgrXmlStageGroup);
            this.#chapterGroupMap = this.#mapper.mapElementsByTagName(bgrxml, 'chapter_group', BgrXmlChapterGroup);
            this.#characterEventMap = this.#mapper.mapElementsByTagName(bgrxml, 'heroevent', BgrXmlCharacterEvent);

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
    forEach(map, f) {
        for (let key of map.keys()) {
            f(map.get(key));
        }
    }

    /**
     * call functor for each unit
     * @param {function(BgrXmlUnitBase): void} f functor
     */
    forEachUnitBase(f) {
        this.forEach(this.#unitBaseMap, f);
    };

    /**
     * call functor for each character
     * @param {function(BgrXmlCharacter): void} f functor
     */
    forEachCharacter(f) {
        this.forEach(this.#characterMap, f);
    };


    /**
     * call functor for each equip
     * @param {function(BgrXmlEquipBase): void} f functor
     */
    forEachEquipBase(f) {
        this.forEach(this.#equipBaseMap, f);
    };

    /**
     * call functor for each skill
     * @param {function(BgrXmlSkillBase): void} f functor
     */
    forEachSkillBase(f) {
        this.forEach(this.#skillBaseMap, f);
    };

    /**
     * call functor for each buffer
     * @param {function(BgrXmlBufferBase): void} f functor
     */
    forEachBufferBase(f) {
        this.forEach(this.#bufferBaseMap, f);
    };

    /**
     * call functor for each achievement
     * @param {function(BgrXmlAchievement): void} f functor
     */
    forEachAchievement(f) {
        this.forEach(this.#achievementMap, f);
    };

    /**
     * call functor for each quest
     * @param {function(BgrXmlQuest): void} f functor
     */
    forEachQuest(f) {
        this.forEach(this.#questMap, f);
    };

    /**
     * call functor for each special item
     * @param {function(BgrXmlSpecialItem): void} f functor
     */
    forEachSpecialItem(f) {
        this.forEach(this.#specialItemMap, f);
    };

    /**
     * call functor for each stage
     * @param {function(BgrXmlStage): void} f functor
     */
    forEachStage(f) {
        this.forEach(this.#stageMap, f);
    };

    /**
     * call functor for each item
     * @param {function(BgrXmlItem): void} f functor
     */
    forEachItem(f) {
        this.forEach(this.#itemMap, f);
    };

    getCharacterEvent(charid) {
        return this.#characterEventMap.get(String(charid));
    };

    getUnitBase(unitId) {
        return this.#unitBaseMap.get(String(unitId));
    };

    getEquipBase(equipId) {
        return this.#equipBaseMap.get(String(equipId));
    };

    getEquipBase(skillId) {
        for (let equipBase of this.#equipBaseMap.values()) {
            if (equipBase.skill == skillId) {
                return equipBase;
            }
        }
        return null;
    };

    getUnitBase(skillId) {
        skillId = String(skillId);
        let candidate = null
        for (let unit of this.#unitBaseMap.values()) {
            if (unit.normalSkill == skillId || unit.attackSkill == skillId || (unit.monsterSkill && unit.monsterSkill.indexOf(skillId) != -1)) {
                candidate = unit;
                if (candidate.rank == '5' && candidate.name.indexOf('+') != -1) {
                    break;
                }
            }
        }
        return candidate;
    };

    getUnitBase(groupid) {
        groupid = String(groupid);
        for (let unit of this.#unitBaseMap.values()) {
            if (unit.groupId == groupid) {
                return unit;
            }
        }
        return null;
    };

    getSkillBase(skillId) {
        return this.#skillBaseMap.get(String(skillId));
    };

    getBufferBase(bufferId) {
        return this.#bufferBaseMap.get(String(bufferId));
    };

    getItem(itemid) {
        return this.#itemMap.get(String(itemid));
    };

    getStage(stageid) {
        return this.#stageMap.get(String(stageid));
    };

    getStageList(stageid) {
        return this.#stageListMap.get(String(stageid / 100 | 0));
    };

    getStageArea(stageid) {
        return this.#stageAreaMap.get(String(stageid / 10000 | 0));
    };

    getStageGroup(stagegroupid) {
        return this.#stageGroupMap.get(String(stagegroupid));
    };

    getChapterGroup(chaptergroupid) {
        return this.#chapterGroupMap.get(String(chaptergroupid));
    };

    #mapper = new XmlMapper();

    /** @type {Map<string, BgrXmlUnitBase>} */
    #unitBaseMap;
    /** @type {Map<string, BgrXmlCharacter>} */
    #characterMap;
    /** @type {Map<string, BgrXmlSkillBase>} */
    #skillBaseMap;
    /** @type {Map<string, BgrXmlEquipBase>} */
    #equipBaseMap;
    /** @type {Map<string, BgrXmlBufferBase>} */
    #bufferBaseMap;
    /** @type {Map<string, BgrXmlItem>} */
    #itemMap;
    /** @type {Map<string, BgrXmlSpecialItem>} */
    #specialItemMap;
    /** @type {Map<string, BgrXmlAchievement>} */
    #achievementMap;
    /** @type {Map<string, BgrXmlQuest>} */
    #questMap;

    /** @type {Map<string, BgrXmlStage>} */
    #stageMap;
    /** @type {Map<string, BgrXmlStageList>} */
    #stageListMap;
    /** @type {Map<string, BgrXmlStageArea>} */
    #stageAreaMap;
    /** @type {Map<string, BgrXmlStageGroup>} */
    #stageGroupMap;
    /** @type {Map<string, BgrXmlChapterGroup>} */
    #chapterGroupMap;
    /** @type {Map<string, BgrXmlCharacterEvent>} */
    #characterEventMap;
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
    this.leaderSkill = this.leaderSkill ? this.leaderSkill.split('/') : [];
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

BgrXmlEquipBase.prototype.getMaxLevel = function BgrXmlEquipBase_getMaxLevel() {
    return calculateParameter(this.baseLvMax, this.over, 5);
};

/**
 * @constructor BGR skill base
 * @param {Element} node 
 */
export function BgrXmlSkillBase(node) {
    this.id = node.getAttribute('id');
    this.name = node.getAttribute('name');
    this.attribute = translate(node.getAttribute('attr'));

    this.hp = node.getAttribute('hp');
    this.sp = node.getAttribute('sp');
    this.bp = node.getAttribute('bp');
    this.bpRate = node.getAttribute('bp_rate');
    this.firstCooldown = node.getAttribute('first_cd');
    this.cooldown = node.getAttribute('cd');

    this.target = translate(node.getAttribute('target'));
    this.type = translate(node.getAttribute('type'));

    this.attackAdd = node.getAttribute('atkadd');
    this.attackAddRate = node.getAttribute('atkadd_rate');
    this.attackScale = node.getAttribute('atkscale');
    this.attackScaleRate = node.getAttribute('atkscale_rate');

    this.attackType = translate(node.getAttribute('atktype'));
    this.attackArea = node.getAttribute('atkarea');
    this.attackNumberType = node.getAttribute('atknum_type');
    this.attackNumber = node.getAttribute('atknumber');

    this.attackRange = node.getAttribute('atkrange');
    this.attackStandardRange = node.getAttribute('atkstandardrange');
    this.sortestAttackRange = node.getAttribute('shortest_atkrange');

    this.buffer = [
        {
            id: node.getAttribute('buff1'),
            probability: node.getAttribute('bprob1'),
            self: node.getAttribute('buff_self1'),
            area: node.getAttribute('buff_area1'),
            areaDuration: node.getAttribute('buff_area_dur1'),
        },
        {
            id: node.getAttribute('buff2'),
            probability: node.getAttribute('bprob2'),
            self: node.getAttribute('buff_self2'),
            area: null,
            aeraDuration: null,
        }
    ];

    for (let buffer of this.buffer) {
        buffer.id = buffer.id ? buffer.id.split('/') : [];
    }

    this.comment = translate(node.getAttribute('comment'));
}

/**
 * @constructor BGR buffer base
 * @param {Element} node 
 */
export function BgrXmlBufferBase(node) {
    this.id = node.getAttribute('id');
    this.name = translate(node.getAttribute('name'));
    this.attribute = node.getAttribute('attr');
    this.battleType = node.getAttribute('battletype');

    this.bufferType = translate(node.getAttribute('bufftype'));
    this.clearBuffer = translate(node.getAttribute('clear_buff'));
    this.clearDebuff = translate(node.getAttribute('clear_debuff'));
    this.debuff = node.getAttribute('debuff');
    this.steal = translate(node.getAttribute('steal'));

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
 * @constructor BGR XML character
 * @param {Element} node 
 */
export function BgrXmlCharacterEvent(node) {
    if (!node.hasAttribute('marryPic1')) {
        return ;
    }

    this.id = node.getAttribute('id');
    this.marryPic1 = node.getAttribute('marryPic1');
    this.marryPic2 = node.getAttribute('marryPic2');
    this.marryFace1 = node.getAttribute('marryface1');
    this.marryFace2 = node.getAttribute('marryface2');
    this.marryTalk = node.getAttribute('marrytalk');

    this.hwPhoto1 = node.getAttribute('hwphoto1');
    this.hwPhoto2 = node.getAttribute('hwphoto2');
    this.hwPhoto3 = node.getAttribute('hwphoto3');
    this.hwTalk = node.getAttribute('hwtalk');

    this.xmasPhoto1 = node.getAttribute('xmasphoto1');
    this.xmasPhoto2 = node.getAttribute('xmasphoto2');
    this.xmasPhoto3 = node.getAttribute('xmasphoto3');
    this.xmasTalk = node.getAttribute('xmastalk');

    this.newYearFace1 = node.getAttribute('newyearface1');
    this.newYearFace2 = node.getAttribute('newyearface2');
    this.newYearFace3 = node.getAttribute('newyearface3');
    this.newYearTalk = node.getAttribute('newyeartalk');

    this.valentineFace1 = node.getAttribute('valentineface1');
    this.valentineFace2 = node.getAttribute('valentineface2');
    this.valentineFace3 = node.getAttribute('valentineface3');
    this.valentineTalk = node.getAttribute('valentinetalk');

    this.whiteDayFace1 = node.getAttribute('whitedayface1');
    this.whiteDayFace2 = node.getAttribute('whitedayface2');
    this.whiteDayFace3 = node.getAttribute('whitedayface3');
    this.whiteDayTalk = node.getAttribute('whitedaytalk');

    this.springFace1 = node.getAttribute('springface1');
    this.springFace2 = node.getAttribute('springface2');
    this.springFace3 = node.getAttribute('springface3');
    this.springTalk = node.getAttribute('springtalk');

    this.kodomoFace1 = node.getAttribute('kodomoface1');
    this.kodomoFace2 = node.getAttribute('kodomoface2');
    this.kodomoFace3 = node.getAttribute('kodomoface3');
    this.kodomoTalk = node.getAttribute('kodomotalk');

    this.weddingFace1 = node.getAttribute('weddingface1');
    this.weddingFace2 = node.getAttribute('weddingface2');
    this.weddingFace3 = node.getAttribute('weddingface3');
    this.weddingTalk = node.getAttribute('weddingtalk');

    this.summerFace1 = node.getAttribute('summerface1');
    this.summerFace2 = node.getAttribute('summerface2');
    this.summerFace3 = node.getAttribute('summerface3');
    this.summerTalk = node.getAttribute('summertalk');

    this.natumaturiFace1 = node.getAttribute('natumaturiface1');
    this.natumaturiFace2 = node.getAttribute('natumaturiface2');
    this.natumaturiFace3 = node.getAttribute('natumaturiface3');
    this.natumaturiTalk = node.getAttribute('natumaturitalk');

    this.fallFace1 = node.getAttribute('fallface1');
    this.fallFace2 = node.getAttribute('fallface2');
    this.fallFace3 = node.getAttribute('fallface3');
    this.fallTalk = node.getAttribute('falltalk');

    this.winterFace1 = node.getAttribute('winterface1');
    this.winterFace2 = node.getAttribute('winterface2');
    this.winterFace3 = node.getAttribute('winterface3');
    this.winterTalk = node.getAttribute('wintertalk');
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
    /**
     * convert enemy string
     * @param {string} enemyString 
     */
    const convertEnemy = function(enemyString) {
        if (enemyString) {
            const enemies = enemyString.split('/');
            return Array.from(enemies.map((x) => x.split('#')), function(enemy) {
                return {
                    id: enemy[0],
                    level: enemy[1],
                    time: enemy[2],
                };
            });
        }
        return null;
    }
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
    this.army = Array.from([
        node.getAttribute('army1'),
        node.getAttribute('army2'),
        node.getAttribute('army3'),
        node.getAttribute('army4'),
        node.getAttribute('army5'),
    ], convertEnemy);

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
