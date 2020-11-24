
/**
 * BGR XML item
 * @param {Element} node 
 */
function BgrXmlItem(node) {
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
