/**
 * BGR xml loader
 * @param {boolean} dynamic_import 
 */
function BgrXmlLoader(dynamic_import) {
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
 * import modules dynamically
 * @param {string[]} module_paths 
 * @param {function(Object): void} callback
 */
BgrXmlLoader.prototype.dynamicImport = function BgrXmlLoader_dynamicImport(module_paths, callback) {
    let index = 0;
    const modules = {};

    const importer = function(module) {
        for (let key in module) {
            modules[key] = module[key];
        }

        if (index < module_paths.length) {
            const module_name = module_paths[index++];
            import(module_name).then(importer);
        }
        else {
            callback(modules);
        }
    }

    importer(null)
};

/**
 * @param {Document} doc xml document
 * @param {string} name tag name to find element in the document
 * @param {function(Element): Object} ctor object constructor
 * @returns {Map<number, Object>} mapped object
 */
BgrXmlLoader.prototype.mapElementsByTagName = function BgrXmlLoader_mapElementsByTagName(doc, name, ctor) {
    const map = new Map();
    const elems = doc.getElementsByTagName(name);
    for (let elem of elems) {
        if (elem.hasAttribute('id')) {
            map.set(elem.getAttribute('id'), new ctor(elem));
        }
    }
    return map;
};

/**
 * initialize BGR XML tool
 * @param {Object} modules loaded modules
 * @param {BgrXmlUnitBase} modules.BgrXmlUnitBase unit base class
 * @param {BgrXmlEquipBase} modules.BgrXmlEquipBase equip base class
 * @param {BgrXmlSkillBase} modules.BgrXmlSkillBase skill base class
 * @param {BgrXmlBufferBase} modules.BgrXmlBufferBase buffer base class
 * @param {BgrXmlItem} modules.BgrXmlItem item base class
 */
BgrXmlLoader.prototype.load = function BgrXmlLoader_load(modules) {
    /** @type {HTMLInputElement} */
    const xmlFile = document.getElementById('xml-file');
    /** @type {HTMLLabelElement} */
    const xmlFileLabel = document.getElementById('xml-file-label');

    const self = this;
    xmlFile.addEventListener('change', function () {
        console.log(this);
        if (xmlFile.files.length) {
            console.log(this);
            xmlFileLabel.textContent = xmlFile.files[0].name;
            const xmlreader = new FileReader();
            xmlreader.onload = function() {
                console.log(self);

                const parser = new DOMParser();
                const bgrxml = parser.parseFromString(xmlreader.result, "text/xml");

                self.__unitBaseMap = self.mapElementsByTagName(bgrxml, 'hero', modules.BgrXmlUnitBase);
                self.__skillBaseMap = self.mapElementsByTagName(bgrxml, 'skill', modules.BgrXmlSkillBase);
                self.__equipBaseMap = self.mapElementsByTagName(bgrxml, 'equip', modules.BgrXmlEquipBase);
                self.__bufferBaseMap = self.mapElementsByTagName(bgrxml, 'buff', modules.BgrXmlBufferBase);
                self.__itemMap = self.mapElementsByTagName(bgrxml, 'item', modules.BgrXmlItem);

                for (let listener of self.__listeners) {
                    listener(self);
                }
            };
            xmlreader.readAsText(xmlFile.files[0], 'UTF-8');
        }
    });
}

BgrXmlLoader.prototype.initialize = function BgrXmlLoader_initialize() {
    if (this.__is_dynamic_import_enabled) {
        this.dynamicImport([
            './bgrxml.unit.js',
            './bgrxml.equip.js',
            './bgrxml.skill.js',
            './bgrxml.buffer.js',
            './bgrxml.item.js',
            './bgrxml.dmglog.js',
        ], this.load.bind(this));
    }
    else {
        this.load({
            BgrXmlUnitBase,
            BgrXmlSkillBase,
            BgrXmlEquipBase,
            BgrXmlBufferBase,
            BgrXmlItem,
        });
    }    
}

/**
 * add xml load listener
 * @param {function(BgrXmlLoader): void} listener 
 */
BgrXmlLoader.prototype.addListener = function BgrXmlLoader_addListener(listener) {
    this.__listeners.push(listener);
}

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

