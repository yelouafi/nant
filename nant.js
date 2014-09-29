function exports() {
    var nant = {};
    function ccToUnd(str) {
        return str.replace(/([A-Z])/g, function ($1) {
            return "-" + $1.toLowerCase();
        });
    }
    function getClass(aCls) {
        var clsArr = [];
        if(Array.isArray(aCls)) {
            for (var i = 0; i < aCls.length; i++) {
                var cls =  getClass(aCls[i]);
                if(cls) {
                    clsArr = clsArr.concat(cls);
                }
            }
        } else if( typeof aCls === 'object') {
            for(var clsName in aCls) {
                if(aCls[clsName]) {
                    clsArr.push(clsName);
                }
            }
            return clsArr;
        } else if(aCls && typeof aCls === 'string') {
            clsArr = aCls.match(/\S+/g);
        }
        for (var i = 0; i < clsArr.length; i++) {
            clsArr[i] = clsArr[i].trim().toLowerCase();
        }
        return clsArr.length ? clsArr : null;
    }
    
    nant.extend = function (base, extended) {
        base = base || {}; extended = extended || {};
        var eCls = getClass(extended.class);
        if(eCls) {
            base.class = base.class || [];
            base.class = base.class.concat(eCls);
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
        this.attrs = { class: []};
        nant.extend(this.attrs, tag.attrs);
        this.body = tag.body;
        this.isVoid = tag.isVoid;
    }
    Tag.prototype.attr = function(attr, val) {
        if(val === undefined) {
            if(typeof attr === 'string') {
                return this.attrs[attr];
            } else if(Array.isArray(attr) ) {
                var ret = {};
                for (var i = 0; i < attr.length; i++) {
                    var attrName = attr[i];
                    ret[attrName] = this.attrs[attrName];
                }
                return ret;
            } else if( typeof attr === 'object') {
                nant.extend(this.attrs, attr);
                return this;
            }
        } else if(typeof attr === 'string') {
            var obj = {};
            obj[attr] = val;
            nant.extend(this.attrs, obj);
            return this;
        }
        
    }
    Tag.prototype.hasClass = function(className) {
        var classes = Array.isArray(className) ? 
                        className : ( typeof className === 'string' ? className.match(/\S+/g) : [] )
        
        for (var i = 0; i < classes.length; i++) {
           if(  this.attrs.class.indexOf( classes[i].toLowerCase() ) < 0 ) {
                return false;
            }
        }
        return true;
    }
    
    Tag.prototype.toggleClass = function(className, toggle) {
        var classes = Array.isArray(className) ? 
                        className : ( typeof className === 'string' ? className.match(/\S+/g) : [] )
        
        for (var i = 0; i < classes.length; i++) {
            var cn = classes[i];
            var ind = this.attrs.class.indexOf(cn);
            console.log('indexOf ',cn, ' ', ind)
            var on = toggle !== undefined ? toggle : (ind < 0);
            if(on) {
                if(ind < 0) {
                    this.attrs.class.push(cn);
                }
            } else {
                if(ind >= 0) {
                    this.attrs.class.splice(ind, 1);
                } 
            }
        }
        return true;
    }
    
        
    Tag.prototype.toString = function() {
        var self = this;
        var attrArr = [''];
        for (var k in self.attrs) {
            var val = false;
            if( k === 'class' ) {
                var ca = self.attrs.class.join(' ');
                val = ca ? ca : false;
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
    var mixins = [];
    nant.mixin = function(selector, fn, name) {
        function getFnName(fn) {
            var f = typeof fn == 'function';
            var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
            return (!f && null) || (s && s[1] || null);
        }
        name = name || getFnName(fn);
        if(!name) {
            throw Error('nant.mixin: either `fn` param must be a non anonymous function or provide a name in 3rd param');
        }
        mixins.push({
            name: name, selector: selector, fn: fn
        });
    }
    nant.makeTag = function(name, isVoid) {
        return function () {
            var config = nant.getTagMembers( Array.prototype.slice.call(arguments) );
            config.name = name;
            config.isVoid = isVoid;
            var tag = new Tag( config );
            for (var i = 0; i < mixins.length; i++) {
                var mx = mixins[i];
                if( match(mx.selector, tag) ) {
                    tag[mx.name] = mx.fn.bind(tag);
                }
            }
            return tag;
        }
        
        function match(selector, tag) {
            if(selector === '*') {
                return true;
            }
            if( typeof selector === 'string' ) {
                return selector === tag.name;
            } else if( typeof selector === 'function' ) {
                return selector(tag);
            } else if(Array.isArray(selector) ) {
                return selector.indexOf(tag.name) >= 0;
            }
            return false;
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