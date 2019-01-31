$(function () {
  (function ($) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    $.fn.attrChange = function (callback) {
      if (MutationObserver) {
        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (e) {
            callback.call(e.target, e.attributeName, $(e.target).prop(e.attributeName), e.oldValue);
          });
        });

        return this.each(function () {
          observer.observe(this, {subtree: false, attributes: true, attributeOldValue: true});
        });
      }
    }
  })(jQuery);
});

/*var clearAllTimeouts = function () {
    var noop = function () {},
        firstId = window.setTimeout(noop, 0);
    return function () {
        var lastId = window.setTimeout(noop, 0);
        console.log('Removing', lastId - firstId, 'timeout handlers');
        while (firstId != lastId)
            window.clearTimeout(++firstId);
    };
}*/
