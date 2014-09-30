var assert = require("assert")
var nant = require("../nant"), ht = nant.ht;

describe('nant', function() {
    
    it('should match by tag name', function () {
        var tag = ht.div({ id: 'mydiv', class: ['form', 'group', 'col'] });
        var tag2 = ht.input({ id: 'myinput', class: ['control', 'col'] });
        
        assert.ok( nant.match('div', tag) );
        assert.ok( nant.match('div.form', tag) );
        assert.ok( nant.match('div.form.group', tag) );
        assert.ok( nant.match('#mydiv', tag) );
        assert.ok( nant.match('div#mydiv.form.col', tag) );
        assert.ok( nant.match('*.col', tag) );
        assert.ok( !nant.match('*.sd1s21', tag) );
        assert.ok( !nant.match('*#sd1s2', tag) );
        assert.ok( nant.match('div, input', tag) );
        assert.ok( nant.match(['div', 'input'], tag2) );
        assert.ok( nant.match('*.col', tag) );
        assert.ok( nant.match('*.col', tag2) );
        
        assert.ok( nant.match( function(t) {  return t.name === 'div' } , tag) );
        
    });
    
});

describe('tag', function(){
    
    it('should return scalar attribute value', function () {
        var tag = ht.div({ id: 'mydiv' })
        assert.equal(
            tag.attr('id'),
            'mydiv'
        );
    });
    
    it('should return array of attributes values', function(){
    
        var tag = ht.input({ id: 'myid', name: 'myname' })
        assert.deepEqual(
            tag.attr(['id', 'name']),
            { id: 'myid', name: 'myname' }
        );
    });
    
    it('should build array class attribute from strings', function(){
        var div = ht.div({ class: 'myclass' });
        assert.deepEqual(
            div.attrs.class,
            ['myclass']
        );
        
        div = ht.div({ class: 'myclass1 myclass2 ' });
        assert.deepEqual(
            div.attrs.class,
            ['myclass1', 'myclass2']
        );
    });
    
    it('should build array class attribute from arrays', function(){
        var div = ht.div({ class: ['myclass1', 'myclass2'] });
        assert.deepEqual(
            div.attrs.class,
            ['myclass1', 'myclass2']
        );
    });
    
    it('should build array class attribute from arrays/objects', function(){
        var div = ht.div({ class: [ 'myclass', { myclass1: 1 === 1, myclass2: 1 !== 1 } ] })
        assert.deepEqual(
            div.attrs.class,
            ['myclass', 'myclass1']
        );
    });
    
    it('should build array class attribute from arrays/objects', function(){
        var div = ht.div({ class: [ 'myclass', { myclass1: 1 === 1, myclass2: 1 !== 1 } ] })
        assert.ok( div.hasClass('myclass1') );
        assert.ok( div.hasClass('myclass myclass1') );
        assert.ok( !div.hasClass('myclass2') );
    });
    
    it('should be able to tell if a tag references a css class', function(){
        var div = ht.input({ name: 'myinput', class: ['myclass',  { class1: 1 === 1, class2: 1 !== 1} ] });

        assert.ok( div.hasClass('myclass') );            // true
        assert.ok( div.hasClass('class1') );             // true
        assert.ok( !div.hasClass('class2') );             // false
        assert.ok( div.hasClass('myclass class1') );     // true
        assert.ok( !div.hasClass(['myclass', 'class2']) );     // false
    });
    
    it('should be able to toggle on/off css classes', function(){
        var div = ht.input({ name: 'myinput', class: ['myclass',  { class1: 1 === 1, class2: 1 !== 1} ] });

        div.toggleClass('myclass');
        assert.ok( !div.hasClass('myclass') );
        
        div.toggleClass('class2', true);
        assert.ok( div.hasClass('class2') );
        
        div.toggleClass('class1', true);
        assert.ok( div.hasClass('class1') );
        
        div.toggleClass(['myclass', 'class2']);
        assert.ok( div.hasClass('myclass') );
        assert.ok( !div.hasClass('class2') );
    });
    
    
    it('should return matching children', function() {
        
        function formGroup(id, body) {
            return ht.div({ class: 'form-group row', id: id }, body);
        }
        
        var tag = ht.form(
            formGroup('fg1',
                [ ht.label(), ht.input() ]
            ),
            formGroup('fg2',
                [ ht.label(), ht.input() ]
            ),
            ht.button('submit')
        )
        
        assert.equal(
            tag.children().length, 3    
        )
        
        assert.equal(
            tag.children('.form-group').length, 2    
        )
        
        assert.equal(
            tag.children('div#fg1').length, 1    
        )
            
    });
    
    it('should return matching descendents at any level', function() {
        
        function formGroup(id, body) {
            return ht.div({ class: 'form-group row', id: id }, body);
        }
        
        var tag = ht.form(
            formGroup('fg1', [ 
                    ht.label(), 
                    formGroup('fg1-1', [
                        ht.label(), formGroup('fg1-1-1', [
                            ht.label(), ht.input({ class: 'col'}), ht.input({ class: 'row' })
                        ])
                    ]),
                    formGroup('fg1-2', [ ht.label(), ht.input({ class: 'row' })])
            ]),
            formGroup('fg2', [ ht.label(), ht.input({ class: 'col' })]), 
            ht.button('submit')
        )
        
        assert.equal(
            tag.find().length, 0    
        )
        
        assert.equal(
            tag.find('div.form-group').length, 5    
        )
        
        assert.equal(
            tag.find('.row').length, 7    
        )
        
        assert.equal(
            tag.find('.col').length, 2    
        )
            
    });
    
});
    
describe('html', function(){
    
    it('should build html with class attribute from arrays', function(){
       
        assert.equal(
            ht.div({ class: ['myclass1', 'myclass2'] }).toString(),
            '<div class="myclass1 myclass2"></div>'
        );
    });
    
    it('should build html with class attribute from conditional objects', function(){
       
        assert.equal(
            ht.div({ class: { myclass1: 1 === 1, myclass2: 1 !== 1 } }).toString(),
            '<div class="myclass1"></div>'
        );
    });
    
    it('should build html with class attribute from array of string and/or objects', function(){
       
        assert.equal(
            ht.div({ class: [ 'myclass', { myclass1: 1 === 1, myclass2: 1 !== 1 } ] }).toString(),
            '<div class="myclass myclass1"></div>'
        );
    });
    
    it('should build html with attributes from primitives (number, string, null, undefined, true, false)', function(){
       
        assert.equal(
            ht.div({ strAttr: 'strAttr', numAttr: 1, trueAttr: true, falseAttr: false, nullAttr: null, undefAttr: undefined }).toString(),
            '<div str-attr="strAttr" num-attr="1" true-attr></div>'
        );
    });

    it('should build html with attributes from objects', function(){
       
        assert.equal(
            ht.div({ objAttr: { strAttr: 'strAttr', numAttr: 1, nested: { nestedStr: 'nest\'edStr', nestedNum: 1 } } }).toString(),
            '<div obj-attr="{strAttr: \'strAttr\', numAttr: 1, nested: {nestedStr: \'nest\\\'edStr\', nestedNum: 1}}"></div>'
        );
    });



    it('should build html and let nested props of object attributes unquoted', function(){
       
        assert.equal(
            ht.div({ objAttr: { strAttr: 'strAttr', uqAttr: nant.uq('exp1===true'), nested: { nestedStr: 'nest\'edStr', nestedUq: nant.uq('exp2 > 0') } } }).toString(),
            '<div obj-attr="{strAttr: \'strAttr\', uqAttr: exp1===true, nested: {nestedStr: \'nest\\\'edStr\', nestedUq: exp2 > 0}}"></div>'
        );
    });
    
    it('should build html tag with body', function(){
       
        assert.equal(
            ht.html(
                ht.body(
                    ht.p({ style: 'font-weight: bold;color: gold;'},'hot templating i as easy as writing javascript code')
                )
            ).toString(),
        
            '<html><body><p style="font-weight: bold;color: gold;">hot templating i as easy as writing javascript code</p></body></html>');
    });
    
    it('should build html tag with multiples body tags joined with "+"', function(){
        
        assert.equal(
            
            ht.form({ id: 'myform', class: 'myclass' }, 
                ht.label({ for: 'myinput' }, 'My input') + 
                ht.input({ id:'myinput', name: 'myinput' })
            ).toString(),
            
            '<form class="myclass" id="myform">' +
                '<label for="myinput">My input</label>' +
                '<input id="myinput" name="myinput">' +
            '</form>'
        );
    });
    
    it('should build html tag with multiples body tags passed as array', function(){
        
        assert.equal(
            
            ht.form({ id: 'myform', class: 'myclass' },[ 
                ht.label({ for: 'myinput' }, 'My input'),
                ht.input({ id:'myinput', name: 'myinput' })
            ]).toString(),
            
            '<form class="myclass" id="myform">' +
                '<label for="myinput">My input</label>' +
                '<input id="myinput" name="myinput">' +
            '</form>'
        );
    });
    
    it('should build html tag with multiples body tags passed as explicit arguments', function(){
        
        assert.equal(
            
            ht.form({ id: 'myform', class: 'myclass' },
                ht.label({ for: 'myinput' }, 'My input'),
                ht.input({ id:'myinput', name: 'myinput' })
            ).toString(),
            
            '<form class="myclass" id="myform">' +
                '<label for="myinput">My input</label>' +
                '<input id="myinput" name="myinput">' +
            '</form>'
        );
    });
    
    it('should build html tag with multiples body tags passed as explicit arguments with arrays inside', function(){
    
        assert.equal(
            
            ht.form({ id: 'myform', class: 'myclass' },
                [
                    ht.label({ for: 'myinput' }, 'My input'),
                    ht.input({ id:'myinput', name: 'myinput' })
                ],
                ht.button('Submit')
            ).toString(),
            
            '<form class="myclass" id="myform">' +
                '<label for="myinput">My input</label>' +
                '<input id="myinput" name="myinput">' +
                '<button>Submit</button>' +
            '</form>'
        );
    });
});

describe('mixins', function() {
    
    it('should apply attribute mixin', function(){
    
        assert.equal(
            
            ht.input({ id:'myinput' })
                .attr({ name: 'myinput', class: 'myclass' })
                .toString(),
            
            '<input class="myclass" id="myinput" name="myinput">'
        );
    });
    
    it('should apply global mixin to matching tag name', function(){
        
        function myattr(val) {
            assert(this instanceof nant.Tag)
            return this.attr({ myattr: val });
        }
        
        nant.mixin( 'input', myattr )
        
        assert.equal(
            
            ht.input({ name: 'myinput' }).myattr('val').toString(),
            
            '<input name="myinput" myattr="val">'
        );
    });
    
    it('should apply global mixin to matching tag names array', function(){
        
        function myattr() {
            assert(this instanceof nant.Tag)
            return this.attr({ myattr: this.name + '-attr'});
        }
        
        nant.mixin( ['div', 'input'], myattr )
        
        assert.equal(
            
            ht.div( ht.input().myattr() ).myattr(),
            
            '<div myattr="div-attr"><input myattr="input-attr"></div>'
        );
    });
    
    it('should apply global mixin to matching tag function', function(){
        
        function myattr() {
            assert(this instanceof nant.Tag)
            return this.attr({ myattr: this.name + '-attr'});
        }
        
        nant.mixin(function(tag) {
            return tag.name === 'input';
        }, myattr, 'newAttr' )
        
        assert.equal(
            
            ht.input({ name: 'myinput' }).newAttr().toString(),
            
            '<input name="myinput" myattr="input-attr">'
        );
    });
});