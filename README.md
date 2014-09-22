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

Obviuosly, this is not a new templating language for javascript; it simply uses javascript as the templating language.

As seen above, html tags are exposed as functions and you simply call those functions to build tour template. 

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
