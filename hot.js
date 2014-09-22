function exports() {

    var hot = {};
    
    function ccToUnd(str) {
        return str.replace(/([A-Z])/g, function ($1) {
            return "-" + $1.toLowerCase();
        });
    }
    
    hot.extend = function (base, extended) {
        base = base || {};
        extended = extended || {};
        var aCls = extended.class;
        if (aCls) {
            base.class = base.class ? base.class + ' ' + aCls : aCls;
            delete extended.class;
        }
        for (var k in extended) {
            base[k] = extended[k];
        }
        return base;
    }
    
    function Tag(tag) {
        this.tag = tag;
    }
    Tag.prototype.mixin = function(mixin) {
        if(typeof 'mixin' === 'function') {
            mixin(this.tag);
        } else {
            hot.extend(this.tag.attrs, mixin)
        }
        return this;
    }
    Tag.prototype.toString = function() {
        var conf = this.tag;
        var attrArr = [''];
        for (var k in conf.attrs) {
            var val = conf.attrs[k];
            if(val) {
                if(val === true) val = k;
                val = JSON.stringify(val);
                if(val.indexOf('{') === 0) val = '"' + val.replace(/"/g, '&quot;') + '"';
                attrArr.push( ccToUnd(k) + '=' + val );    
            }
        }
        var body = typeof body === 'function'
        return '<' + conf.name + attrArr.join(' ') + '>' + ( !conf.isVoid ? conf.body + '</' + conf.name + '>' : '') ;
    }
    
    function makeTag(name, isVoid) {
        hot[name] = function (attrs, body) {
            if(typeof attrs === 'string' || attrs instanceof Tag ) {
                body = attrs;
                attrs = {};
            }
            return new Tag({
                name: name,
                attrs: attrs || {},
                body: body || '',
                isVoid: isVoid
            });
           
        }
    }
    var voidTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    var nvTags = ['a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'blockquote', 'body', 'button', 'canvas', 'caption', 'cite', 'code', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'html', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'map', 'mark', 'menu', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video'];
    
    for (var i = 0; i < voidTags.length; i++) {
        makeTag(voidTags[i], true);
    }
    for (var j = 0; j < nvTags.length; j++) {
        makeTag(nvTags[j], false);
    }
    
    return hot;

};

if(typeof module !== 'undefined') {
    module.exports = exports();
} else {
    this.hot = exports();
}