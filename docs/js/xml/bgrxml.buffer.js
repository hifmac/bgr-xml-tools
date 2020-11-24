/**
 * BGR buffer base
 * @param {Element} node 
 */
function BgrXmlBufferBase(node) {
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
