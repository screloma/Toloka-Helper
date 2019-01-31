$.fn.attrchange = function(a, b) {
        if (typeof a == 'object') {//core
            var cfg = {
                trackValues : false,
                callback : $.noop
            };
            //backward compatibility
            if (typeof a === "function") { cfg.callback = a; } else { $.extend(cfg, a); }

            if (cfg.trackValues) { //get attributes old value
                this.each(function(i, el) {
                    var attributes = {};
                    for ( var attr, i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
                        attr = attrs.item(i);
                        attributes[attr.nodeName] = attr.value;
                    }
                    $(this).data('attr-old-value', attributes);
                });
            }

            if (MutationObserver) { //Modern Browsers supporting MutationObserver
                var mOptions = {
                    subtree : false,
                    attributes : true,
                    attributeOldValue : cfg.trackValues
                };
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(e) {
                        var _this = e.target;
                        //get new value if trackValues is true
                        if (cfg.trackValues) {                          
                            e.newValue = $(_this).attr(e.attributeName);
                        }                       
                        if ($(_this).data('attrchange-status') === 'connected') { //execute if connected
                            cfg.callback.call(_this, e);
                        }
                    });
                });

                return this.data('attrchange-method', 'Mutation Observer').data('attrchange-status', 'connected')
                        .data('attrchange-obs', observer).each(function() {
                            observer.observe(this, mOptions);
                        });
            } else if (isDOMAttrModifiedSupported()) { //Opera
                //Good old Mutation Events
                return this.data('attrchange-method', 'DOMAttrModified').data('attrchange-status', 'connected').on('DOMAttrModified', function(event) {
                    if (event.originalEvent) { event = event.originalEvent; }//jQuery normalization is not required 
                    event.attributeName = event.attrName; //property names to be consistent with MutationObserver
                    event.oldValue = event.prevValue; //property names to be consistent with MutationObserver
                    if ($(this).data('attrchange-status') === 'connected') { //disconnected logically
                        cfg.callback.call(this, event);
                    }
                });
            } else if ('onpropertychange' in document.body) { //works only in IE        
                return this.data('attrchange-method', 'propertychange').data('attrchange-status', 'connected').on('propertychange', function(e) {
                    e.attributeName = window.event.propertyName;
                    //to set the attr old value
                    checkAttributes.call($(this), cfg.trackValues, e);
                    if ($(this).data('attrchange-status') === 'connected') { //disconnected logically
                        cfg.callback.call(this, e);
                    }
                });
            }
            return this;
        };
    };