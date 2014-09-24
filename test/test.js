var assert = require("assert")
var nant = require("../nant"), ht = nant.ht;

describe('nant', function(){
    describe('attributes', function(){
        it('should build attributes from primitives (number, string, null, undefined, true, false)', function(){
           
            assert.equal(
                ht.div({ strAttr: 'strAttr', numAttr: 1, trueAttr: true, falseAttr: false, nullAttr: null, undefAttr: undefined }).toString(),
                '<div str-attr="strAttr" num-attr="1" true-attr></div>'
            );
        });
    });
    
    describe('attributes', function(){
        it('should build attributes from objects', function(){
           
            assert.equal(
                ht.div({ objAttr: { strAttr: 'strAttr', numAttr: 1, nested: { nestedStr: 'nest\'edStr', nestedNum: 1 } } }).toString(),
                '<div obj-attr="{strAttr: \'strAttr\', numAttr: 1, nested: {nestedStr: \'nest\\\'edStr\', nestedNum: 1}}"></div>'
            );
        });
    });
    
    describe('attributes', function(){
        it('should let nested props of object attributes unquoted', function(){
           
            assert.equal(
                ht.div({ objAttr: { strAttr: 'strAttr', uqAttr: nant.uq('exp1===true'), nested: { nestedStr: 'nest\'edStr', nestedUq: nant.uq('exp2 > 0') } } }).toString(),
                '<div obj-attr="{strAttr: \'strAttr\', uqAttr: exp1===true, nested: {nestedStr: \'nest\\\'edStr\', nestedUq: exp2 > 0}}"></div>'
            );
        });
    });
});
    
describe('html', function(){
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
            
            '<form id="myform" class="myclass">' +
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
            
            '<form id="myform" class="myclass">' +
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
            
            '<form id="myform" class="myclass">' +
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
            
            '<form id="myform" class="myclass">' +
                '<label for="myinput">My input</label>' +
                '<input id="myinput" name="myinput">' +
                '<button>Submit</button>' +
            '</form>'
        );
    });
    
    it('should apply attributes mixin when passed an attributes param', function(){
    
        assert.equal(
            
            ht.input({ id:'myinput', name: 'myinput' })
                .mixin({ class: 'my-input-class'})
                .toString(),
            
            '<input id="myinput" name="myinput" class="my-input-class">'
        );
    });
    
    it('should apply function mixin when passed a function param', function(){
        
        function applyClass(tag) {
            nant.extend(tag.attrs, { class: 'my-input-class'});
            return tag;
        }
    
        assert.equal(
            
            ht.input({ id:'myinput', name: 'myinput' })
                .mixin( applyClass )
                .toString(),
            
            '<input id="myinput" name="myinput" class="my-input-class">'
        );
    });
  });