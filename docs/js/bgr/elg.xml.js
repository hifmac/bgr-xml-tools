/**
 * @file elg.xml.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2021 hifmac
 * @license MIT-License
 */

import { translate, calculateParameter } from './bgr.util.js'
import { XmlMapper } from './bgr.xml.js';

/**
 * 
 * @param {Element} elem 
 * @param {string} name
 */
function makeList(elem, name) {
    const list = [];
    for (let i = 1; i <= 99; ++i) {
        const attr = name + i;
        if (!elem.hasAttribute(attr)) {
            break;
        }
        list.push(elem.getAttribute(attr));
    }
    return list;
}

/**
 * @constructor BGR xml loader
 * @param {boolean} dynamic_import 
 */
export class ElgXmlLoader {
    constructor() {
        this.#mapper = new XmlMapper();
    }

    /**
     * load ELG XML
     * @param {string} xml bgr xml
     */
    loadXml(xml) {
        const parser = new DOMParser();
        const elgxml = parser.parseFromString(xml, "text/xml");

        console.log(elgxml);
        if (elgxml.firstChild.nodeName == 'ELG') {
            this.hero = this.#mapper.mapElementsByTagName(elgxml, 'hero', ElgHero);
            this.herobook = this.#mapper.mapElementsByTagName(elgxml, 'herobook', ElgHeroBook);
            this.skill = this.#mapper.mapElementsByTagName(elgxml, 'skill', ElgSkill);
            this.buff = this.#mapper.mapElementsByTagName(elgxml, 'buff', ElgBuff);
            this.talent = this.#mapper.mapElementsByTagName(elgxml, 'talent', ElgTalent);
            this.talentMap = this.#mapper.mapElementsByTagName(elgxml, 'talent_map', ElgTalentMap);

            console.log(this.#mapper.keySet);

            return true;
        }

        return false;
    }

    #mapper = new XmlMapper();
}

class ElgHero {
    constructor(element) {
        this.#element = element;
    }

    get id() {
        return this.#element.getAttribute("id");
    }
    
    get party_group_id() {
        return this.#element.getAttribute("party_group_id");
    }
    
    get group_id() {
        return this.#element.getAttribute("group_id");
    }
    
    get name() {
        return this.#element.getAttribute("name");
    }
    
    get rank() {
        return this.#element.getAttribute("rank");
    }
    
    get cost() {
        return this.#element.getAttribute("cost");
    }
    
    get attr() {
        return this.#element.getAttribute("attr");
    }
    
    get job() {
        return this.#element.getAttribute("job");
    }
    
    get is_front() {
        return this.#element.getAttribute("is_front");
    }
    
    get nskill() {
        return this.#element.getAttribute("nskill");
    }
    
    get askill() {
        return this.#element.getAttribute("askill");
    }
    
    get passive_skill() {
        return this.#element.getAttribute("passive_skill");
    }
    
    get pick_skill() {
        return this.#element.getAttribute("pick_skill");
    }
    
    get pick_range() {
        return this.#element.getAttribute("pick_range");
    }
    
    get pick_cd() {
        return this.#element.getAttribute("pick_cd");
    }
    
    get monster_ai() {
        return this.#element.getAttribute("monster_ai");
    }
    
    get hp() {
        return this.#element.getAttribute("hp");
    }
    
    get hp_add() {
        return this.#element.getAttribute("hp_add");
    }
    
    get atk() {
        return this.#element.getAttribute("atk");
    }
    
    get atk_add() {
        return this.#element.getAttribute("atk_add");
    }
    
    get def() {
        return this.#element.getAttribute("def");
    }
    
    get def_add() {
        return this.#element.getAttribute("def_add");
    }
    
    get spd() {
        return this.#element.getAttribute("spd");
    }
    
    get move() {
        return this.#element.getAttribute("move");
    }
    
    get luk() {
        return this.#element.getAttribute("luk");
    }
    
    get width() {
        return this.#element.getAttribute("width");
    }
    
    get favor_id() {
        return this.#element.getAttribute("favor_id");
    }
    
    get book_id() {
        return this.#element.getAttribute("book_id");
    }
    
    get talent_map_id() {
        return this.#element.getAttribute("talent_map_id");
    }
    
    get aide_tech() {
        return this.#element.getAttribute("aide_tech");
    }
    
    get monster_skill() {
        return this.#element.getAttribute("monster_skill");
    }
    
    get slave_hero_id() {
        return this.#element.getAttribute("slave_hero_id");
    }
    
    get slave_fix_x() {
        return this.#element.getAttribute("slave_fix_x");
    }
    
    get slave_fix_y() {
        return this.#element.getAttribute("slave_fix_y");
    }
    
    get is_big() {
        return this.#element.getAttribute("is_big");
    }
    
    get rankup_material() {
        return this.#element.getAttribute("rankup_material");
    }
    
    get skillup_material() {
        return this.#element.getAttribute("skillup_material");
    }
    
    get dup_material() {
        return makeList(this.#element, 'dup_material');
    }
    
    get dup_num() {
        return makeList(this.#element, 'dup_num');
    }
    
    get teleport_delay() {
        return this.#element.getAttribute("teleport_delay");
    }
    
    get tele_dir_delay() {
        return this.#element.getAttribute("tele_dir_delay");
    }
    
    get sub_name() {
        return this.#element.getAttribute("sub_name");
    }
    
    get back_passive_skill() {
        return makeList(this.#element, 'back_passive_skill');
    }
        
    get talent_skill_id() {
        return makeList(this.#element, 'talent_skill_id');
    }
    
    get battle_magnify() {
        return this.#element.getAttribute("battle_magnify");
    }

    #element;
}

class ElgHeroBook {
    constructor(element) {
        this.#element = element;
    }

    get id() {
        return this.#element.getAttribute("id");
    }
    
    get name() {
        return this.#element.getAttribute("name");
    }
    
    get hero_id() {
        return this.#element.getAttribute("hero_id");
    }
    
    get illustrator() {
        return this.#element.getAttribute("illustrator");
    }
    
    get illustrator_sort_name() {
        return this.#element.getAttribute("illustrator_sort_name");
    }
    
    get cv() {
        return this.#element.getAttribute("cv");
    }
    
    get introl() {
        return this.#element.getAttribute("introl");
    }

    #element;
}

class ElgSkill {
    constructor(element) {
        this.#element = element;
    }
 
    get id() {
        return this.#element.getAttribute("id");
    }
    
    get name() {
        return this.#element.getAttribute("name");
    }
    
    get sub_name() {
        return this.#element.getAttribute("sub_name");
    }
    
    get atlas() {
        return this.#element.getAttribute("atlas");
    }
    
    get icon() {
        return this.#element.getAttribute("icon");
    }
    
    get type() {
        return this.#element.getAttribute("type");
    }
    
    get target() {
        return this.#element.getAttribute("target");
    }
    
    get atktype() {
        return this.#element.getAttribute("atktype");
    }
    
    get add_buff1() {
        return this.#element.getAttribute("add_buff1");
    }
    
    get add_prob1() {
        return this.#element.getAttribute("add_prob1");
    }
    
    get add_tar1() {
        return this.#element.getAttribute("add_tar1");
    }
    
    get add_if1() {
        return this.#element.getAttribute("add_if1");
    }
    
    get add_tar_if1() {
        return this.#element.getAttribute("add_tar_if1");
    }
    
    get add_tar_when1() {
        return this.#element.getAttribute("add_tar_when1");
    }
    
    get comment() {
        return this.#element.getAttribute("comment");
    }
    
    get nextskill() {
        return this.#element.getAttribute("nextskill");
    }
    
    get atkscale() {
        return this.#element.getAttribute("atkscale");
    }
    
    get skpic_id() {
        return this.#element.getAttribute("skpic_id");
    }
    
    get atkrange() {
        return this.#element.getAttribute("atkrange");
    }
    
    get atkarea() {
        return this.#element.getAttribute("atkarea");
    }
    
    get act_time() {
        return this.#element.getAttribute("act_time");
    }
    
    get sp() {
        return this.#element.getAttribute("sp");
    }
    
    get cd() {
        return this.#element.getAttribute("cd");
    }
    
    get combo_id() {
        return this.#element.getAttribute("combo_id");
    }
    
    get combo_prob() {
        return this.#element.getAttribute("combo_prob");
    }
    
    get atkadd() {
        return this.#element.getAttribute("atkadd");
    }
    
    get add_buff2() {
        return this.#element.getAttribute("add_buff2");
    }
    
    get add_prob2() {
        return this.#element.getAttribute("add_prob2");
    }
    
    get add_tar2() {
        return this.#element.getAttribute("add_tar2");
    }
    
    get add_tar_if2() {
        return this.#element.getAttribute("add_tar_if2");
    }
    
    get add_tar_when2() {
        return this.#element.getAttribute("add_tar_when2");
    }
    
    get condition_type() {
        return this.#element.getAttribute("condition_type");
    }
    
    get condition_val() {
        return this.#element.getAttribute("condition_val");
    }
    
    get add_when1() {
        return this.#element.getAttribute("add_when1");
    }

    #element;
}

class ElgBuff {
    constructor(element) {
        this.#element = element;
    }

    get id() {
        return this.#element.getAttribute("id");
    }
    
    get group() {
        return this.#element.getAttribute("group");
    }
    
    get name() {
        return this.#element.getAttribute("name");
    }
    
    get buff_atlas() {
        return this.#element.getAttribute("buff_atlas");
    }
    
    get buff_pic() {
        return this.#element.getAttribute("buff_pic");
    }
    
    get bufftype() {
        return this.#element.getAttribute("bufftype");
    }
    
    get buffscale() {
        return this.#element.getAttribute("buffscale");
    }
    
    get buffdur() {
        return this.#element.getAttribute("buffdur");
    }
    
    get debuff() {
        return this.#element.getAttribute("debuff");
    }
    
    get buffadd() {
        return this.#element.getAttribute("buffadd");
    }
    
    get buff_val() {
        return this.#element.getAttribute("buff_val");
    }
    
    get effect() {
        return this.#element.getAttribute("effect");
    }
    
    get foot() {
        return this.#element.getAttribute("foot");
    }
    
    get buff_info() {
        return this.#element.getAttribute("buff_info");
    }
    
    get not_clear() {
        return this.#element.getAttribute("not_clear");
    }

    #element;
}

class ElgTalent {
    constructor(element) {
        this.#element = element;
    }

    get id() {
        return this.#element.id;
    }
    
    get effect_type() {
        return this.#element.effect_type;
    }
    
    get sp_val() {
        return this.#element.sp_val;
    }
    
    get material() {
        return makeList(this.#element, 'material');
    }
    
    get num() {
        return makeList(this.#element, 'num');
    }

    #element;
}

class ElgTalentMap {
    constructor(element) {
        this.#element = element;
    }

    get id() {
        return this.#element.id;
    }

    get talent_id() {
        return makeList(this.#element, 'talent_id');
    }

    #element;
}