# CamanJS - Gradient-Plugin

Easy using;

```javascript
Caman.gradient(main,gmap);
```

Basic stucture;

```
//main
main = {
	type: 'linear|radial'
	blend: '<Caman.Blends>',
	opacity: <0-100>,
	rotate: 'left|top|right|bottom'|<0-360>
}

if(main.type = 'radial'){
	rotate : {
		innerX: <0-100>,
		innerY: <0-100>,
		outerX: <0-100>,
		outerY: <0-100>
	}
}

//gmap
gmap = [
	{
		color: '<hexWithHashtag>',
		opacity: <0.0-1.0>|null,
		location:<0.0-1.0>|null
	},...N
]
```

## Example

![CamanJS Gradient Plugin Orginal Image](http://fatihmertdogancan.com/github/camanjs-lineargradient/ben.jpg "CamanJS Gradient Plugin Orginal Image")

```javascript
Caman("#tst", function () {
	gmap = [
		{
			color: '#ff0000',
			opacity: 1,
			location: null
		},
		{
			color: '#123abc',
			opacity: 1,
			location: null
		},
		{
			color: '#000',
			opacity: 1,
			location: null
		}
	];
	main = {
		type: 'linear',
		blend:'lighten',
		opacity: 100, 
		rotate: 'left'
	}

	this.gradient(main,gmap);

	this.render();
});
```

Result


![CamanJS Gradient Plugin Gradient Affected Image](http://fatihmertdogancan.com/github/camanjs-lineargradient/canvas.png "CamanJS Gradient Plugin Gradient Affected Image")
