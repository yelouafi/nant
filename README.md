**nant** lets you generate your html templates with plain javascript (browser and server).

Features
========

- No need to learn another language, just old good javascript
- Tags are simple POJOs (Plain Old *Javascript* Object) and can be manipulated with ease before stringification
- Uses all language constructs and programming techniques to define your reusable building blocks
- Attach your own methods to specific Tags using Mixins

Get started
===========

###On the Browser :

It's just one file - `nant.js` - to import in your page.


```html
<html>
	<head>
	    <script src="nant.js"></script>
	</head>
	<body>
		<div id="placeholder">...</div>
		<script>
			var el = document.getElementById('placeholder');
			var ht = nant.ht;
			el.innerHTML = ht.p('this is as easy as writing javascript code').toString(); 
		</script>
	</body>
</html>
```

###On the server

```
npm install nant
```

Then

```javascript
// get the Html Templates namespace
var ht = require('nant').ht;
var html = ht.p('this is as easy as writing javascript code').toString();
```



-------------------------------------------------------------------------------------------

So what's this ? A new Templating Language ?
=============================================

Obviously no; Instead **javascript is the templating language**.

Html tags are exposed as functions in the `ht` namespace and tag attributes are passed as arguments.

```javascript
var html = ht.input({ type: 'text', name: 'myinput', required: 'true'}).toString();
console.log( html );
```
```html
<input type="text" name="myinput" required>
```

Tag body is passed as an optional argument

```javascript
var html = ht.div({ id: 'myid', class: 'myclass' }, 'String body').toString();
console.log( html );
```
```html
<div class="myclass" id="myid" required>
    String body
</div>
```

You can pass nested tags as body (note you don'need to call `toString()` on nested tags)

```javascript
ht.form({ id: 'myform', class: 'myclass' },
    ht.div(
        ht.label('My Input'),
        ht.input({ name: 'myinput', placeholder: 'My Input' })
    )
).toString();
```

If you pass a function as body, it will be called upon rendering (with the parent tag as parameter)

```javascript
function myBody(tag) {
    return ht.p('Hello to ' + tag.name);
}

ht.form({ id: 'myform', class: 'myclass' }, 
    myBody
).toString();
```

if you need to embody multiples tags, simply list them in order

```javascript
ht.form({ id: 'myform', class: 'myclass' }, 
    ht.label({ for: 'myinput' }, 'My input'),
    ht.input({ id:'myinput', name: 'myinput' }),
    'Help text',
    someFunction
).toString();
```

You can also group body tags in arrays

```javascript
ht.form({ id: 'myform', class: 'myclass' },
    ht.h1('Form header'),
    [
        ht.label({ for: 'myinput' }, 'My input'),
        ht.input({ id:'myinput', name: 'myinput' })
    ],
    ht.button('Submit')
).toString();
```


css class attribute can be defined as an array

```javascript
ht.input({ class: ['class1', 'class2'] })
```
```html
<input class="class1 class2">
```

or a conditional object, only members with a truthy value will be picked

```javascript
ht.input({ class: { class1: 1 < 2, class2: 1 > 2 })
```
```html
<input class="class1">
```

you may also use array of both string/conditional object

```javascript
ht.input({ class: [ 'myclass',  { class1: 1 < 2, class2: 1 > 2 } ])
```
```html
<input class="myclass class1">
```

------------------------------------------------------------------------------------------

##Tag manipulation

all methods of the `ht` namespace returns an objet of type `Tag`; 

the `Tag`'s prototype exposes a few methods; this is useful if you want to manipulate the tag object before calling `.toString()`

###.attr( attrName [, attrValue ] )

get/set current attribute value

```javascript
var div = ht.input({ name: 'myinput', class: 'myclass' });

div.attr('name');               // 'myinput'
div.attr('class');              // ['myclass']
div.attr('name', 'newName');    // div.attr('name') === 'newName'
```

note how class attribute was converted to an Array; internally all tags maintains an `Array` instance for `class` attribute


###.attr( [ attrName1, attrName2, ...] )

When passed an array, returns an object with given attributes

```javascript
var div = ht.input({ id:'myid', name: 'myname', placeholder: 'My Input' });
div.attr(['id', 'name']); // { id:'myid', name: 'myname' }
```

###.attr( object )

if you pass it an object, tag's attributes will be extended with object's members

```javascript
var div = ht.input({ name: 'myinput', class: 'myclass' });

div.attr({ id: 'myid', class: 'class1' });
div.attr('id'); // 'myid'
div.attr('class'); // ['myclass', 'class1']
```

###.hasClass()

used to check if tag instance references a css class

```javascript
var div = ht.input({ name: 'myinput', class: ['myclass',  { class1: 1 === 1, class2: 1 !== 1} ] });

div.hasClass('myclass');            // true
div.hasClass('class1');             // true
div.hasClass('class2');             // false
div.hasClass('myclass class1');     // true
div.hasClass(['myclass', 'class2']);     // false
```

###.toggleClass()

is another familiar method to to toggle on/off css class references

```javascript
var div = ht.input({ name: 'myinput', class: ['myclass',  { class1: 1 === 1, class2: 1 !== 1} ] });

div.toggleClass('myclass');                 
// div.hasClass('myclass') == false

div.toggleClass('class2', true);            
// div.hasClass('class2') == true

div.toggleClass('class1', true);           
// nothing changes as class1 is already enabled

div.toggleClass(['myclass', 'class2']);    
// div.hasClass('myclass') == true && div.hasClass('class2') == false
```

###.match( selector )

Another useful method to check weather a tag matches the given selector; note only a small subset of css selectors is supported at the moment
You can also supply a function (see example below) to perform tag matching

exemple
```javascript
var divTag = ht.div({ id: 'mydiv', class: ['form', 'group', 'col'] });
var inputTag = ht.input({ id: 'myinput', class: ['control', 'col'] });

// tag name selectors
divTag.match('div');                  // true
inputTag.match('input');              // true
divTag.match('div, input');           // true
inputTag.match(['div', 'input']);     // true

// class names, ids
divTag.match('div.form');               // true
divTag.match('div.form.group');         // true
divTag.match('#mydiv');                 // true
divTag.match('div#mydiv.form.col');     // true
divTag.match('*.col');                  // true
inputTag.match('*.col');                // true

// uses custom matching method
divTag.match( function(t) {  return t.name === 'div' } );
```

###.children( [ selector ] )

returns all direct children of the current tag; if provided, selector will be used to filter out the result

###.find( selector )

returns all descendents (including non-direct children) matching the given selector


------------------------------------------------------------------------------------------------------------------------

###Mixins

Mixins allows attaching custom methods to selected tags

for example, suppose you have a `data-model` attribute you want to apply to all input tags

```javascript
//First you define you mixin function
function dataModel(model) {
    return this.attr({ dataModel: model });
}

// Then you attach it to all <input/> tags
nant.mixin( 'input', dataModel );
```

therefore you can call `input` tags with the `dataModel` method
```javascript
ht.input({ name: 'myinput' }).dataModel('mymodel');
```
```html
<input name="myinput" data-model="mymodel">
```

the exact signature of the `nant.mixin()` method is

`nant.mixin( selector, mixinFn, [mixinName] )`

examples 

```javascript
function dataModel() { ... }

// define 'dataModel' methods on all <input/> and <select/> tags
nant.mixin( ['input', 'select'], dataModel );
```

```javascript
function tagName(name) { 
    this.attr('name', name);
}

// define 'name' method on all tags
nant.mixin( '*', tagName, 'name' );
```

```javascript
function cols(cols) { 
    this.attr({ class: 'col-sm-'+cols);
}

// define 'cols' method on all div tags with class 'form-group'
nant.mixin( function(tag) {
    return tag.name === 'div' && tag.hasClass('form-group');
}, cols );
```


------------------------------------------------------------------------------------------
###Object attributes (for angular/knockout/... users)

**nant** supports passing nested objects as attribute values, this is useful in some cases (if you're working with data-binding libs like **angular** or **knockout**)

```javascript
ht.div({ 
    objAttr: { 
        strAttr: 'strAttr', 
        numAttr: 1, 
        nested: { 
            nestedStr: 'nest\'edStr', 
            nestedNum: 1 
        }
    }
})
```
```html
<div obj-attr="{strAttr: 'strAttr', numAttr: 1, nested: {nestedStr: 'nest\'edStr', nestedNum: 1}}"></div>
```

Note also that `camelCased` tag attribute names are transformed to their `dash-delimited` countreparts (ie `objAttr` become `obj-attr`)

Sometimes, when working with data-binding libs, we have to pass expressions in the object attribute that will be evaluated later by the lib. observe this angular example

```html
<p ng-class="{strike: !deleted, bold: some.isBold() }">...</p>
```

we can't write this object straight into our code because the expressions will be evaluateed directly

```javascript
// Error, strike and bold members will get evaluated right now, probably raises an error if deleted or some aren't in the scope
ht.p({ ngClass: {strike: !deleted, bold: some.isBold() } })
```

instead use `nant.uq(expr)` to build an unquoted expression

```javascript
// Correct , strike and bold members will get evaluated later
ht.p({ ngClass: {strike: nant.uq('!deleted'), bold: nant.uq('some.isBold()') } })
```

-----------------------------------------------------------------------------------------------

###Defining Custom Tags
=======================

Simply, use `nant.makeTag` to make a tag builder function

```javascript
// It's better to define custom tags in their own namespace
var ns = nant.ns = {};
// define your custom element inside the namespace
ns.myElement = nant.makeTag('MyElement', isVoid)

//Later you can use your tag function
var myHtml = ht.div(
    ns.myElement({ ...}, body )
)
```

If `isVoid` parameter is true, then any body provided to the tag function will be ignored and closing tag (`</myelement>`) will not be generated upon tag stringification


---------------------------------------------------------------------------------------------

Tutorial: Bootstrap forms
=====================================

the following exemple builds a twitter bootstrap form

```javascript
ht.form({ class: 'form-horizontal', role: 'form' }, 
    ht.div({ class: 'form-group' },
        ht.label({ for:'email', class: ['col-sm-2', 'control-label']}, 'Email'),
        ht.div({ class: 'col-sm-10' },
            ht.input({ type: 'email', class: 'form-control', id: 'email', placeholder: 'Email' })
        )
    ),
    ht.div({ class: 'form-group' },
        ht.div({ class: 'col-sm-offset-2 col-sm-10' },
            ht.button({ type: 'submit', class: 'btn btn-default'}, 'Sign in')
        )
    )
);
```

As we are simply using javascript, we are free to structure our templating the way we want. So we can also write

```javascript
var bt = nant.bt = {};

bt.horzForm = function horzForm() {
    var body = Array.prototype.slice.call(arguments);
    return ht.form({ class: 'form-horizontal', role: 'form' }, body );
}

bt.formGroup = function formGroup(input, label) {
    return ht.div({ class: 'form-group' },
        label,
        ht.div({ class: { 'col-sm-10': true, 'col-sm-offset-2': !label }}, input )
    )
}

var myHtml = bt.horzForm(
    bt.formGroup(
        ht.label({ for:'email', class: ['col-sm-2', 'control-label']}, 'Email'),
        ht.input({ type: 'email', class: 'form-control', id: 'email', placeholder: 'Email' })
    ),
    bt.formGroup(
        ht.button({ type: 'submit', class: 'btn btn-default'}, 'Sign in')
    )
)
```


Lets review the last example, w've reusable bootstrap tags to build form elements. 

You may have noted that the grid's columns layout (all those `col-sm-*` classes) is hard coded inside the templates.

What if we want to move layout defintion (`col-sm-*` classes) outside ? we can make changes on form layout once and then apply it to all our form template.


```javascript
// Form layout definition
var layout = {
    label: { class: 'col-sm-2' },
    input: { class: 'col-sm-10' },
    offset: { class: 'col-sm-offset-2' }
}

// Form group apply layout def to its input and label
bt.formGroup = function formGroup(input, label) {
    input = ht.div(input).attr(layout.input);
    if(label) {
        label = label.attr(layout.label);
    } else {
        input = input.attr(layout.offset);
    }
    return ht.div({ class: 'form-group' },
        label, input
    )
}

var myHtml = bt.horzForm(
    bt.formGroup(
        ht.input({ type: 'email', class: 'form-control', id: 'email', placeholder: 'Email' }),
        ht.label({ for:'email', class: 'control-label'}, 'Email')
        
    ),
    bt.formGroup(
        ht.button({ type: 'submit', class: 'btn btn-default'}, 'Sign in')
    )
)
```

See how we've decoupled form layout and form field définition. 

We can do better by abstracting away more bootstrap grid concepts

```javascript
function BtFormLayout(cols, media) {
    this.cols = cols;
    this.media = media;
	
	this.label = { class: 'col-'+ this.media + '-' + this.cols[0] };
    this.input = { class: 'col-'+ this.media + '-' + this.cols[1] };
    this.offset = { class: 'col-'+ this.media + '-offset-' + this.cols[0] };
}

var layout = new BtFormLayout([2,10], 'sm');

bt.formGroup = function formGroup(input, label, layout) {
    input = ht.div(input).mixin(layout.input);
    if(label) {
        label = label.attr(layout.label);
    } else {
        input = input.attr(layout.offset);
    }
    return ht.div({ class: 'form-group' },
        label, input
    )
}

var myHtml = bt.horzForm(
    bt.formGroup(
        ht.input({ type: 'email', class: 'form-control', id: 'email', placeholder: 'Email' }),
        ht.label({ for:'email', class: 'control-label'}, 'Email')
    ),
    bt.formGroup(
        ht.button({ type: 'submit', class: 'btn btn-default'}, 'Sign in')
    )
)
```

You can go ever further to acheive better reusability; Because you're in the javascript land, you can apply your favourite desgin patterns.
