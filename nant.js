function exports() {
    var nant = {};
    function ccToUnd(str) {
        return str.replace(/([A-Z])/g, function ($1) {
            return "-" + $1.toLowerCase();
        });
    }
    nant.extend = function (base, extended) {
        base = base || {}; extended = extended || {};
        var eCls = extended.class;
        if(eCls) {
            eCls = Array.isArray(extended.class) ? extended.class: [extended.class];
            base.class = base.class || [];
            var bCls = Array.isArray(base.class) ? base.class : [base.class];
            base.class = bCls.concat(eCls);
        }
        
        for (var k in extended) {
            if(k !== 'class') {
                base[k] = extended[k];    
            }
        }
        return base;
    }
    function Uq(str) {
        this.str = str;
    }
    nant.uq = function(str) {
        return new Uq(str);
    }
    function Tag(tag) {
        this.name = tag.name;
        this.attrs = tag.attrs;
        this.body = tag.body;
        this.isVoid = tag.isVoid;
    }
    Tag.prototype.mixin = function(mixin) {
        if(typeof mixin === 'function') {
            return mixin(this);
        } else {
            nant.extend(this.attrs, mixin);
            return this;
        }
    }
    Tag.prototype.toString = function() {
        var self = this;
        var attrArr = [''];
        for (var k in self.attrs) {
            var val = false;
            if( k === 'class' ) {
                val = getClassAttr(self.attrs.class);
            } else {
                val = getAttr( self.attrs[k] );
            }
            var normK = ccToUnd(k);
            if(val === true ) {
                attrArr.push( normK );
            } else if( val !== false ) {
                val = val.toString();
                var qs = val.indexOf('"') !== 0 ? '"' : '';
                attrArr.push( normK + '=' + qs + val + qs );        
            }   
            
        }
        
        return '<' + self.name + attrArr.join(' ') + '>' + ( !self.isVoid ? getBody(self.body) + '</' + self.name + '>' : '') ;
        
        function getClassAttr(aCls) {
            var ret = aCls;
            if (aCls) {
                if(Array.isArray(aCls)) {
                    var strArr = [];
                    for (var i = 0; i < aCls.length; i++) {
                        strArr.push( getClassAttr(aCls[i], true) );
                    }
                   ret = strArr.join(' ');
                } else if( typeof aCls === 'object') {
                    var clsArr = [];
                    for(var clsName in aCls) {
                        if(aCls[clsName]) {
                            clsArr.push(clsName);
                        }
                    }
                    ret = clsArr.join(' ') ;
                }
            }
            return ret || false;
        }
        
        function getAttr(val, nested) {
            if( val === null || val === undefined || val === false ) {
                return nested ? val : false;
            } else if( val instanceof Uq) {
                return val.str;
            }
            var type = typeof val;
            if ( type === 'string' ) {
                if(nested) {
                    return "'" + val.replace(/"/g, '&quot;').replace(/'/g, "\\'") + "'";
                } else {
                    return '"' + val.replace(/"/g, '&quot;') + '"';
                }
            } else if( Array.isArray(val) ) {
                var strArr = [];
                for (var i = 0; i < val.length; i++) {
                    strArr.push( getAttr(val[i], true) );
                }
                return '[' + strArr.join(', ') + ']';
            } else if( type === 'object' ) {
                var strObj = [];
                for(var k in val) {
                    strObj.push( k + ': ' + getAttr(val[k], true) );
                }
                return '{' + strObj.join(', ') + '}';
            }
            
            return val;
        }
        
        function getBody(bodyConf) {
            var body = '';
            if( Array.isArray(bodyConf) ) {
                for (var i = 0; i < bodyConf.length; i++) {
                    body = body + getBody(bodyConf[i]);
                }
            } else if(typeof bodyConf === 'function') {
                body = bodyConf(self);
            } else if(bodyConf !== null && bodyConf !== undefined) {
                body = body + bodyConf;
            }
            return body;
        }
    }
    
    nant.Tag = Tag;
    var ht = nant.ht = {};
    nant.getTagMembers = function(args) {
        var attrs, body;
        if(args.length > 0) {
            var arg0 = args[0];
            if(typeof arg0 === 'string' || typeof arg0 === 'function' || arg0 instanceof Tag || Array.isArray(arg0) ) {
                body = args;
            } else {
                attrs = arg0;
                body = args.length > 1 ? args.slice(1) : '';
            }
        }
        return {
            attrs: attrs || {}, body: body || ''
        }
    }
    nant.makeTag = function(name, isVoid) {
        return function () {
            var config = nant.getTagMembers( Array.prototype.slice.call(arguments) );
            config.name = name;
            config.isVoid = isVoid;
            return new Tag( config );
        }
        
        
    }
    var voidTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    var nvTags = ['a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'blockquote', 'body', 'button', 'canvas', 'caption', 'cite', 'code', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'html', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'map', 'mark', 'menu', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video'];
    
    for (var i = 0; i < voidTags.length; i++) {
        var vtag = voidTags[i];
        ht[vtag] = nant.makeTag(vtag, true);
    }
    for (var ii = 0; ii < nvTags.length; ii++) {
        var nvtag = nvTags[ii];
        ht[nvtag] = nant.makeTag(nvtag, false);
    }
    
    return nant;

};

if(typeof module !== 'undefined') {
    module.exports = exports();
} else {
    this.nant = exports();
}