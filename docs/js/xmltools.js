
import { BgrXmlLoader } from './bgr/bgr.xml.js'
import { readFile } from './bgr/bgr.util.js'
import { DamageLog } from './dmglog.js'
import { DataBrowser } from './databrowser.js'

onload = function() {
    const dmglog = new DamageLog();
    const databrowser = new DataBrowser();

    /** @type {HTMLInputElement} */
    const xmlFile = document.getElementById('xml-file');
    /** @type {HTMLLabelElement} */
    const xmlFileLabel = document.getElementById('xml-file-label');

    xmlFile.addEventListener('change', function() {
        if (xmlFile.files.length) {
            const file = xmlFile.files[0];
            readFile(file, function(ev) {
                const loader = new BgrXmlLoader();
                if (loader.loadXml(ev.target.result)) {
                    xmlFileLabel.textContent = file.name;
                    dmglog.setLoader(loader);
                    databrowser.setLoader(loader);
                }
                else {
                    xmlFileLabel.textContent = 'ファイルが間違っているか壊れています';
                }
            });
        }
    });
}
