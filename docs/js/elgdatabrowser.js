/**
 * @file databrowser.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */
'use strict';

import { zip } from "./bgr/bgr.util.js";
import { ElgXmlLoader } from "./bgr/elg.xml.js";

function createTable(data) {
    const theadRow = document.createElement('tr');
    for (const column of data.head) {
        const th = document.createElement('th');
        th.textContent = column;
        theadRow.appendChild(th);
    }
    const thead = document.createElement('thead');
    thead.classList.add('thead-dark');
    thead.appendChild(theadRow);

    const tbody = document.createElement('tbody');
    for (const row of data.body) {
        const tr = document.createElement('tr');
        for (const column of row) {
            const td = document.createElement('td');
            td.textContent = column;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-striped', 'table-bordered', 'table-prewrap');
    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

function createCollapse(id, name, data) {
    const button = document.createElement('button');
    button.classList.add("btn", "btn-primary", "collapsed");
    button.setAttribute('data-toggle', 'collapse');
    button.setAttribute('data-target', '#' + id);
    button.setAttribute('aria-expanded', false);
    button.setAttribute('aria-controls', id);
    button.textContent = name;

    const div = document.createElement('div');
    div.id = id;
    div.classList.add('collapse');
    Array.from(data, (x) => createTable(x)).forEach((e) => { 
        div.appendChild(e);
    });

    const group = document.createElement('div');
    group.classList.add('mb-1');
    group.appendChild(button);
    group.appendChild(div);

    return group;
}

/**
 * @param {ElgXmlLoader} loader
 * @param {number} skillId 
 */
function createComboList(loader, skillId) {
    const nskills = [];
    while (true) {
        const nskillId = nskills.length ? nskills[nskills.length - 1].combo_id : skillId;
        if (!nskillId) {
            break;
        }
        const nskill = loader.skill.get(nskillId);
        if (!nskill) {
            break;
        }
        nskills.push(nskill);
    }
    return nskills;
}

/**
 * @param {ElgXmlLoader} loader
 * @param {number} skillId 
 */
function lastSkill(loader, skillId) {
    let skill = loader.skill.get(skillId);
    if (skill) {
        while (skill.nextskill) {
            skill = loader.skill.get(skill.nextskill);
        }
        return skill.id;
    }
    else {
        return skillId;
    }
}

export class ElgDataBrowser {
    constructor() {
        /** @type {HTMLSelectElement} */
        this.#dataBrowserType = document.getElementById('elg-data-browser-type');
        this.#dataBrowserType.addEventListener('change', () => this.onDataTypeChanged());

        this.#table = document.getElementById('elg-data-browser-table');
    }
    /**
     * set loader
     * @param {ElgXmlLoader} loader 
     */
    setLoader(loader) {
        this.#loader = loader;
        this.onDataTypeChanged();
    }

    onDataTypeChanged() {
        while (this.#table.firstChild) {
            this.#table.removeChild(this.#table.firstChild);
        }

        for (const id of this.#loader.hero.keys()) {
            const hero = this.#loader.hero.get(id);
            if (hero.book_id) {
                const nskillTable = {
                    head: [ '名前', '倍率', '射程','範囲', '行動時間', '連撃確率' ],
                    body: []
                };
                for (const nskill of createComboList(this.#loader, hero.nskill)) {
                    nskillTable.body.push([
                        nskill.name,
                        nskill.atkscale,
                        nskill.atkrange,
                        nskill.atkarea,
                        nskill.act_time,
                        nskill.combo_prob,
                    ]);
                }

                const askillTable = {
                    head: [ '名前', '説明', '倍率', '固定値', '射程','範囲', '対象', '行動時間', '連撃確率' ],
                    body: [],
                }
                for (const askill of createComboList(this.#loader, lastSkill(this.#loader, hero.askill))) {
                    askillTable.body.push([
                        askill.name,
                        askill.comment,
                        askill.atkscale,
                        askill.atkadd,
                        askill.atkrange,
                        askill.atkarea,
                        askill.target,
                        askill.act_time,
                        askill.combo_prob,
                    ]);
                }

                const pskillTable = {
                    head: [ '名前', '説明', '倍率', '固定値', '射程','範囲', '対象', '行動時間', '連撃確率' ],
                    body: [],
                }
                for (const pskill of createComboList(this.#loader, lastSkill(this.#loader, hero.pick_skill))) {
                    pskillTable.body.push([
                        pskill.name,
                        pskill.comment,
                        pskill.atkscale,
                        pskill.atkadd,
                        pskill.atkrange,
                        pskill.atkarea,
                        pskill.target,
                        pskill.act_time,
                        pskill.combo_prob,
                    ]);
                }

                let name = hero.rank + ' ';
                if (hero.sub_name) {
                    name += `[${hero.sub_name}]`;
                }
                name += `${hero.name} Lv${hero.maxLevel()}`;

                const totalEffect = {
                    HP: 0,
                    ATK: 0,
                    DEF: 0,
                    LUK: 0,
                    SPD: 0,
                    MOV: 0,
                };
                const heroStrSet = this.#loader.heroStrengthenSet.get(hero.id);
                if (heroStrSet) {
                    const effectIds = [];
                    effectIds.push(...heroStrSet.n_eff_g);
                    for (const exeff of heroStrSet.ex_eff_g) {
                        effectIds.push(...exeff);
                    }

                    for (const effId of effectIds) {
                        for (const eff of this.#loader.heroStrengthenEff.values()) {
                            if (eff.gid === effId) {
                                if (eff.effect_type in totalEffect) {
                                    totalEffect[eff.effect_type] += eff.sp_val | 0;
                                }
                            }
                        }
                    }
                }

                const favor = this.#loader.favor.get(hero.favor_id);
                if (favor) {
                    for (const status of zip(favor.status_type, favor.status_val)) {
                        totalEffect[status[0]] += status[1] | 0;
                    }
                }

                console.log(name, totalEffect,hero.hp, hero.hp_add * hero.maxLevel());

                this.#table.appendChild(createCollapse('elg-hero-' + id, name, [
                    {
                        head: [
                            '名前',
                            '称号',
                            'ランク',
                            'コスト',
                            '配置',

                            '所属',
                            '武器',
                            'HP',
                            'ATK',
                            'DEF',

                            'LUK',
                            'SPD',
                            'MOVE'
                        ],
                        body: [[
                            hero.name,
                            hero.sub_name,
                            hero.rank,
                            hero.cost,
                            hero.is_front ? '前衛' : '後衛',

                            hero.attr,
                            hero.job,
                            (parseInt(hero.hp) + hero.hp_add * hero.maxLevel() + totalEffect.HP) * 1.4 | 0,
                            (parseInt(hero.atk) + hero.atk_add * hero.maxLevel() + totalEffect.ATK) * 1.4 | 0,
                            (parseInt(hero.def) + hero.def_add * hero.maxLevel() + totalEffect.DEF) * 1.4 | 0,

                            (parseInt(hero.luk) + totalEffect.LUK) * 1.4 | 0,
                            (parseInt(hero.spd) + totalEffect.SPD) * 1.4 | 0,
                            parseInt(hero.move) + totalEffect.MOV | 0
                        ]],
                    },
                    nskillTable,
                    askillTable,
                    pskillTable,
                ]));
            }
        }
    }

    /** @type {ElgXmlLoader} */
    #loader;

    /** @type {HTMLSelectElement} */
    #dataBrowserType;

    /** @type {HTMLDivElement} */
    #table;
}
