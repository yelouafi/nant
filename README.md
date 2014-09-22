Get started
===========

###On the server

Install it

```
npm install nant
```

Then use it

```javascript
var nant = require('nant');
var html = nant.p('this is as easy as writing javascript code');
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
			el.innerHTML = nant.p('this is as easy as writing javascript code'); 
		</script>
	</body>
</html>
```

So what's this ?
================

Obviuosly, this is not a new templating language for javascript; **javascript is the templating language**.

As seen above, html tags are exposed as functions. you simply use the appropriate tag name to build your template. 

attributes are passed to those functions as objects.

```javascript
nant.input({ type: 'text', required: 'true', name: 'myinput'});
```

this will become

```html
<input type="text" required="required" name="myinput">
```

tag function can take an optional body 

```javascript
nant.div({ id: 'myid', class: 'myclass' }, 'String body');
```

besides plain strings, you can pass other tags as body

```javascript
nant.form({ id: 'myform', class: 'myclass' }, 
    nant.input({ name: 'myinput' })
);
```

if there is more than a tag, simply uses `+` to join them

```javascript
nant.form({ id: 'myform', class: 'myclass' }, 
    nant.label({ for: 'myinput' }, 'My input') + 
    nant.input({ id:'myinput', name: 'myinput' })
);
```

the following exemple builds a twitter bootstrap form

```javascript
var t = nant;
t.form({ class: 'form-horizontal', role: 'form' }, 
    t.div({ class: 'form-group' },
        t.label({ for:'email', class: 'col-sm-2', controlLabel: true}, 'Email') +
        t.div({ class: 'col-sm-10' },
            t.input({ type: 'email', class: 'form-control', id: 'email', placeholder: 'Email' })
        )
    ) +
    t.div({ class: 'form-group' },
        t.div({ class: 'col-sm-offset-2 col-sm-10' },
            t.button({ type: 'submit', class: 'btn btn-default'}, 'Sign in')
        )
    )
);
```

Motivation
==========

As a web developer, what i really need is a powerful language that offer features like

- Reusability
- Refactoring
- Testability

So as a javascript'er what i really need is a real programming language to construct my screens

observe the last bootstrap example, as we are in the javascript land, we can benefits from all the powerful language features and tooling to build our template

```javascript
bt = {};

bt.horzForm = function horzForm(body) {
    return nant.form({ class: 'form-horizontal', role: 'form' }, body );
}

bt.formGroup = function formGroup(label, input) {
    nant.div({ class: 'form-group' },
        label +
        (input ? nant.div({ class: 'col-sm-10' }, input ) : '')
    )
}

var myHtml = bt.horzForm(
    bt.formGroup(
        nant.label({ for:'email', class: 'col-sm-2', controlLabel: true}, 'Email'),
        nant.input({ type: 'email', class: 'form-control', id: 'email', placeholder: 'Email' })
    ) +
    bt.formGroup(
        nant.div({ class: 'col-sm-offset-2 col-sm-10' },
            nant.button({ type: 'submit', class: 'btn btn-default'}, 'Sign in')
        )
    )
)
```

so you see the benefits from using javascript as our templating language

- No need to learn another language, this is just another library
- Uses function to defines your reusable blocks with argumens, conditionals, loops etc


You can go even further building more reusable blocks using Mixins (see below)
