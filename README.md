Features
========

- No need to learn another language, it's plain javascript
- Uses all language constructs to define your reusable building blocks
- Mixins to separate UI concernes (styles, layout..)

Get started
===========

###On the server

Install it

```
npm install nant
```

Then use it

```javascript
var nant = require('nant').ht;
var html = ht.p('this is as easy as writing javascript code');
```

###On the Browser :

Just add `nant.js` to your includes.


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
			el.innerHTML = ht.p('this is as easy as writing javascript code'); 
		</script>
	</body>
</html>
```
-------------------------------------------------------------------------------------------
So what's this ?
================

Obviuosly, this is not a new templating language for javascript; **javascript is the templating language**.

Html tags are exposed as functions. you simply use the appropriate tag name to build your template. 

Tag attributes are passed as arguments.

```javascript
ht.input({ type: 'text', name: 'myinput', required: 'true'});
```

this will become

```html
<input type="text" name="myinput" required>
```

Tag body is passed as an optional argument

```javascript
ht.div({ id: 'myid', class: 'myclass' }, 'String body');
```

You can pass nested tags as body

```javascript
ht.form({ id: 'myform', class: 'myclass' }, 
    ht.input({ name: 'myinput' })
);
```

If you pass a function as body, it will be called upon rendering with embodding tag attributes
```javascript
function myBody(tag) {
    return ht.p('Hello to ' + tag.name);
}

ht.form({ id: 'myform', class: 'myclass' }, 
    myBody
);
```

if you need to embody multiples tags, simply list them in order

```javascript
ht.form({ id: 'myform', class: 'myclass' }, 
    ht.label({ for: 'myinput' }, 'My input'),
    ht.input({ id:'myinput', name: 'myinput' }),
    'Help text',
    someFunction
);
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
);
```


css class attribute can be defined as an array

```javascript
ht.input({ class: ['class1', 'class2'] })
```
```html
<input class="class1 class2">
```


class can also be a conditional object, only members with a truthy value will be picked

```javascript
ht.input({ class: { class1: true, class2: 1 > 2 })
```
```html
<input class="class1">
```
------------------------------------------------------------------------------------------
###Object attributes (aka angular/knockout/... users)

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

we can't write this object straight into our code because theit will be evaluateed directly

```javascript
// Error, strike and bold members will get evaluated right now, probably raises an error if deleted or some aren't in the scope
ht.p({ ngClass: {strike: !deleted, bold: some.isBold() } })
```

instead use `nant.uq(expr)` to build an unquoted expression

```javascript
// Correct , strike and bold members will get evaluated right now
ht.p({ ngClass: {strike: nant.uq('!deleted'), bold: nant.uq('some.isBold()') } })
```

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
        // css classes can also be passed as conditional object { class1: condition, class2: condition, ...}
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

--------------------------------------------------------------------------------------

Mixins
======

Lets review the last example, w've reusable bootstrap tags to build form elements. 

You may have noted that the grid's columns layout (all those `col-sm-*` classes) is hard coded inside the templates.

What if we want to move layout defintion (`col-sm-*` classes) outside ? we can make changes on form layout once and then apply it to all our form template.

Response is `Mixins`. a mixin allows us to apply transformations to a prebuilt Tag.

So we can rewrite the bootstrap form example as follow

```javascript
// Form layout definition
var layout = {
    label: { class: 'col-sm-2' },
    input: { class: 'col-sm-10' },
    offset: { class: 'col-sm-offset-2' }
}

// Form group apply layout def to its input and label
bt.formGroup = function formGroup(input, label) {
    input = ht.div(input).mixin(layout.input);
    if(label) {
        label = label.mixin(layout.label);
    } else {
        input = input.mixin(layout.offset);
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
        label = label.mixin(layout.label);
    } else {
        input = input.mixin(layout.offset);
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

Above w've seen **attribute mixins**. They are quite simple to use, you pass in an attribute definition; the `mixin` function extendsthe tag's attributes with the new ones.

Well there is also **function mixins**: you can provide the `mixin` method with your own function; it will be called then with tag object as parameter.


```javascript
function myMixin(tag) {
    // do something cool ...
    // don't forget to return
    return tag;
}

ht.div(/* ... */).mixin( myMixin );
```

so basically, the mixin function take a tag parameter, applies whatever transformations to it and then return :

- either the same tag (generally when transformations are limited to attributes manipulation)
- or even another new constructed tag (for example wrap an `input` tag with a `div`)

There is no limit of what you can do with function mixins just beware to always return a meaningful value (generally this will be a `Tag` object)

---------------------------------------------------------------------------------

Custom Tags
===========

All exemples above simply define custom functions that return well known html tags; but you can also define your own custom tags that follows the html syntax rules. This maybe even necessary if you're working with some third party lib that requires custom tags (like `angularjs`).

Use `nant.makeTag` to make a tag builder function

```javascript
// define your namespace
var ns = nant.ns = {};
// define your custom element inside the namespace
ns.myElement = nant.makeTag('MyElement', isVoid)

//Later you can use your tag function
var myHtml = ht.div(
    ns.myElement({ ...}, body )
)
```
If `isVoid` parameter is true, then any body provided to the tag function will be ignored and closing tag (`</myelement>`) will not be generated upon tag stringification






