# CamanJS - LinearGradient-Plugin

Easy using;

```javascript
Caman.gradientLinear(pos,main,gmap);
```

| pos           | main          | gmap  |
| ------------- |:-------------:| -----:|
| left          | blend         | color |
| right         | opacity       |opacity|
| bottom        |               |       |
| top           |               |       |

Basic stucture;

```
//main
main = {
	blend: '<Caman.Blends>',
	opacity: <0-100>
}

//gmap
gmap = [
	{
		color: '<hexWithHashtag>',
		opacity: <0.0-1.0>
	},...N
]
```

## Example

```javascript
Caman("#tst", function () {
	gmap = [
		{
			color: '#ff0000',
			opacity: 1
		},
		{
			color: '#123abc',
			opacity: 1
		},
		{
			color: '#000',
			opacity: 1
		}
	];
	pos  = "left";
	main = {blend:'lighten',opacity: 100}

	this.gradientLinear(pos,main,gmap);

	this.render();
});
```
