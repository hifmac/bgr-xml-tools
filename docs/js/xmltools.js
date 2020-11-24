/** flag for dynamic import  */
const DYMAMIC_IMPORT = false;


onload = function() {
    const loader = new BgrXmlLoader(DYMAMIC_IMPORT);
    const dmglog = new DamageLog();
    
    loader.addListener(function() {
        dmglog.setLoader(loader);
    });

    loader.initialize();
}
