/**
 * @file xmltools.js
 * @author hifmac(E32456 of the Frea server)
 * @copyright (c) 2020 hifmac
 * @license MIT-License
 */

import { BgrXmlLoader } from './bgr/bgr.xml.js'
import { ElgXmlLoader } from './bgr/elg.xml.js'
import { readFile } from './bgr/bgr.util.js'
import { DamageLog } from './dmglog.js'
import { DataBrowser } from './databrowser.js'
import { ElgDataBrowser } from './elgdatabrowser.js'

onload = function() {
    const dmglog = new DamageLog();
    const dataBrowser = new DataBrowser();
    const elgDataBrowser = new ElgDataBrowser();

    /** @type {HTMLInputElement} */
    const xmlFile = document.getElementById('xml-file');
    /** @type {HTMLLabelElement} */
    const xmlFileLabel = document.getElementById('xml-file-label');

    xmlFile.addEventListener('change', function() {
        if (xmlFile.files.length) {
            const file = xmlFile.files[0];
            readFile(file, function(ev) {
                const loader = new BgrXmlLoader();
                const elgLoader = new ElgXmlLoader();
                if (loader.loadXml(ev.target.result)) {
                    xmlFileLabel.textContent = file.name + ' [ブレガ]';
                    dmglog.setLoader(loader);
                    dataBrowser.setLoader(loader);
                }
                else if (elgLoader.loadXml(ev.target.result)) {
                    xmlFileLabel.textContent = file.name + ' [ズリッター]';
                    elgDataBrowser.setLoader(elgLoader);
                }
                else {
                    xmlFileLabel.textContent = 'ファイルが間違っているか壊れています';
                }
            });
        }
    });
}
