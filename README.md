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
ht.input({ type: 'text', required: 'true', name: 'myinput'});
```

this will become

```html
<input type="text" required="required" name="myinput">
```

Tag body is passed as an optional argument

```javascript
ht.div({ id: 'myid', class: 'myclass' }, 'String body');
```

besides plain strings, you can pass nested tags as body

```javascript
ht.form({ id: 'myform', class: 'myclass' }, 
    ht.input({ name: 'myinput' })
);
```

if you need to embody multiples tags, simply list them in order

```javascript
ht.form({ id: 'myform', class: 'myclass' }, 
    ht.label({ for: 'myinput' }, 'My input')
    ht.input({ id:'myinput', name: 'myinput' })
);
```

More examples
==============

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

As we are simply using javascript, we are free to structure our templating the way we want. For the last example we can rewrite it as follow

```javascript
var bt = nant.bt = {};

bt.horzForm = function horzForm() {
    var body = Array.prototype.slice.call(arguments);
    return ht.form({ class: 'form-horizontal', role: 'form' }, body );
}

bt.formGroup = function formGroup(input, label) {
    return ht.div({ class: 'form-group' },
        label,
        // classes can be passed as conditional object { class1: condition, class2: condition, ...}
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

so the main benefits from using javascript as the templating language

- No need to learn another language
- Uses function to defines your reusable blocks with argumens, conditionals, loops etc


There is More
=============

Lets review the last example, w've now reusable bootstrap tags to build form elements. But you may have noted that the grid's columns layout is hard coded inside the templates.

What if we want to move layout defintion (ie `col-sm-*` classes) outside so we can apply the layout we want to our templates?

Response is `Mixins`. a mixin allows us to apply transformations to a Tag we already built.

So we can rewrite the bootstrap form example as follow

```javascript
var layout = {
    label: { class: 'col-sm-2' },
    input: { class: 'col-sm-10' },
    offset: { class: 'col-sm-offset-2'}
}

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