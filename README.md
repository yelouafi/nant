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
You can also group body tags in arrays


More examples
==============

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

see the benefits from using javascript as the templating language

- No need to learn another language
- Uses functions and other constructs to define your building block


Mixins
=============

Lets review the last example, w've now reusable bootstrap tags to build form elements. But you may have noted that the grid's columns layout is hard coded inside the templates.

What if we want to move layout defintion (ie `col-sm-*` classes) outside so we can apply the layout we want to our templates?

Response is `Mixins`. a mixin allows us to apply transformations to a Tag we already built.

So we can rewrite the bootstrap form example as follow

```javascript
var layout = {
    cols: [2, 10],
    media: 'sm',
    label: { class: 'col-'+ layout.media + '-' + layout.cols[0] },
    input: { class: 'col-'+ layout.media + '-' + layout.cols[1] },
    offset: { class: 'col-'+ layout.media + '-offset-' + layout.cols[0] }
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

See how we've discarded all those `col-sm-*` references from form templates. If we want to change the form layout we have to apply changes in one place; This is good example of how javascript allows for good concern separation.

We can even do better by abstracting more bootstrap grid concepts

```javascript
function BtFormLayout(cols, media) {
    this.cols = cols;
    this.media = media;
	
	this.label = { class: 'col-'+ this.media + '-' + this.cols[0] };
    this.input = { class: 'col-'+ this.media + '-' + this.cols[1] };
    this.offset = { class: 'col-'+ this.media + '-offset-' + this.cols[0] };
}

var layout = new BtFormLayout([2,10], 'sm');

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
```

There is no limit on how you could acheive better reusability; Because you simply use your habitual programming language, templates defintion fit naturally with the rest of your app.
