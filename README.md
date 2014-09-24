Features
========

- No need to learn another language, it's plain javascript
- Uses all language constructs to define your reusable building blocks
- Mixins allows you to separate UI concernes (styles, layout..)

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

if you need to embody multiples tags, simply list them in order

```javascript
ht.form({ id: 'myform', class: 'myclass' }, 
    ht.label({ for: 'myinput' }, 'My input'),
    ht.input({ id:'myinput', name: 'myinput' })
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

Application example: Bootstrap forms
=====================================

the following exemple builds a twitter bootstrap form

```javascript
ht.form({ class: 'form-horizontal', role: 'form' }, 
    ht.div({ class: 'form-group' },
        // css classes can be passed as array
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

1- either the some tag (generally when transformations are limited to attributes manipulation)
2- or even another new constructed tag (for example wrap an `input` tag with a `div`)

There is no limit of what you can do with function mixins just beware to always return a meaningful value (generally this will be a `Tag` object)