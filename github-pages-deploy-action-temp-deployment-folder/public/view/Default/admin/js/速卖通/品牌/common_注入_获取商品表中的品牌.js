var fun =
{
  T: [],
  a01: function (bind) {
    this.b01($('input[name="brandName"]'), bind)
    $('.next-search-btn').children(":first").click();
  },
  a02: function () {
    $('[type="radio"]').attr("type","xxxxxxxxxx");//�����Ҫ�����һ�£���ֹ�´λᱻ�ҳ���  
  },
  b01: function (oo, value) {
    let casess = oo.get(0);
    casess.value = value;
    var event = document.createEvent('HTMLEvents');
    event.initEvent("input", true, true);
    event.eventType = 'message';
    casess.dispatchEvent(event);
  },
 
 
}