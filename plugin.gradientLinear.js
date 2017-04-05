function hex2RGBA(hex,op){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+op+')';
    }
    throw new Error('Bad Hex');
}

Caman.Filter.register("gradient", function (main,gmap) {
	/* gmap struct
		[
			{color: '#000',opacity: 0.30,location:0},..
		]

		gmap.color not null
		gmap.opacity can null
		gmap.location can null
		

		or gmap presets @string

			'red2green','violet2orange','blue2red2yellow'

		main
			{
				type: 'linear|radial'
				blend: '<Caman.Blenders>',
				opacity: <0-100>,
				rotate: 'left|top|right|bottom'|<0-360>

				if type -> radial
					rotate : {
						innerX: <0-100>,
						innerY: <0-100>,
						outerX: <0-100>,
						outerY: <0-100>
					}
			}
	*/
    var canvas, ctxi, gradient;
    var width = this.canvas.width;
    var height = this.canvas.height;

    if (typeof exports !== "undefined" && exports !== null) {
        canvas = new Canvas(width, height);
    } else {
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
    }

    if(gmap == null){
    	gmap = ['#000','#fff'];
    }

    if(main == null){
    	main = {blend: 'lighten', opacity: 100, rotate: 'left', type:'linear'};
    }

    ctx = canvas.getContext('2d');

    var x1,x2,y1,y2;
    var scaleX,scaleY;
    
    if(main['type'] == 'linear'){
    	if(main['rotate'] == "right"){
	    	gradient = ctx.createLinearGradient(width, 0, 0, 0);	
	    }else if(main['rotate'] == "top"){
	    	gradient = ctx.createLinearGradient(0, 0, 0, width);	
	    }else if(main['rotate'] == "bottom"){
	    	gradient = ctx.createLinearGradient(0, width, 0, 0);	
	    }else if(main['rotate'] == "left"){
	    	gradient = ctx.createLinearGradient(0, 0, width, 0);
	    }else{
	    	//rotate is integer, degree calculate
	    	if(0 <= main['rotate'] && main['rotate'] < 45){
	    		x1 = 0;
	    		y1 = height / 2 * (45 - main['rotate']) / 45;
	    		x2 = width;
	    		y2 = height - y1;
	    	}else if((45 <= main['rotate'] && main['rotate'] < 135)){
				x1 = width * (main['rotate'] - 45) / (135 - 45);
				y1 = 0;
				x2 = width - x1;
				y2 = height;
			}else if((135 <= main['rotate'] && main['rotate'] < 225)){
				x1 = width;
				y1 = height * (main['rotate'] - 135) / (225 - 135);
				x2 = 0;
				y2 = height - y1;
			}else if((225 <= main['rotate'] && main['rotate'] < 315)){
				x1 = width * (1 - (main['rotate'] - 225) / (315 - 225));
				y1 = height;
				x2 = width - x1;
				y2 = 0;
			}else if(315 <= main['rotate']){
				x1 = 0;
				y1 = height - height / 2 * (main['rotate'] - 315) / (360 - 315);
				x2 = width;
				y2 = height - y1;
			}

			gradient = ctx.createLinearGradient(x1, y1, x2, y2);
	    }
    }else if(main['type'] == 'radial'){
    	/*
			main.rotate : {
				innerX: <0-100>,
				innerY: <0-100>,
				outerX: <0-100>,
				outerY: <0-100>
			}
    	*/

    	if (width > height) {
			scaleY = height / width;
		}
		if (height > width) {
			scaleX = width / height;
		}

		ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

		if(typeof(main['rotate'] === 'object')){
			gradient = ctx.createRadialGradient(
				x1 = (width * main['rotate']['innerX'] / 100) / scaleX, 
				y1 = (height * main['rotate']['innerY'] / 100) / scaleY, 
				r1 = 0, 
				x2 = (width * main['rotate']['outerX'] / 100) / scaleX, 
				y2 = (height * main['rotate']['outerY'] / 100) / scaleY, 
				r2 = (width / 2) / scaleX
			);
		}else{
			gradient = ctx.createRadialGradient(
				x1 = width * (Math.floor(Math.Random() * 100) + 1) / 100 / scaleX,
				y1 = height * (Math.floor(Math.Random() * 100) + 1) / 100 / scaleY,
				r1 = 0,
				x2 = (width * (Math.floor(Math.Random() * 100) + 1) / 100) / scaleX, 
				y2 = (height * (Math.floor(Math.Random() * 100) + 1) / 100) / scaleY, 
				r2 = (width / 2) / scaleX
			);
		}
		
    }

    if(!!gmap && gmap.constructor === Array){
    	//gradient map color list auto add to gradient map
    	var part = 1.0/gmap.length;
		var start_part = 0;
		for(var i = 0; i < gmap.length; i++){
			if(typeof(gmap[i]) === 'object'){
				if(gmap[i]['opacity'] < 0){
					gmap[i]['opacity'] = 0;
				}
				if(gmap[i]['opacity'] > 1){
					gmap[i]['opacity'] = 1;
				}

				if(gmap[i]['location'] == null){
					gradient.addColorStop(start_part, hex2RGBA(gmap[i]['color'],gmap[i]['opacity']));
				}else{
					gradient.addColorStop(gmap[i]['location'], hex2RGBA(gmap[i]['color'],gmap[i]['opacity']));
				}
			}else{
				if(gmap[i]['location'] == null){
					gradient.addColorStop(start_part, gmap[i]);
				}else{
					gradient.addColorStop(gmap[i]['location'], gmap[i]);
				}
			}
			if(gmap[i]['location'] == null){
				start_part += part;	
			}
		}
    }else{
    	//Gradient map sample presets 
    	if(gmap == 'red2green'){
    		gradient.addColorStop(0.000, 'rgba(225, 0, 25, 1.000)');
     		gradient.addColorStop(1.000, 'rgba(0, 96, 27, 1.000)');
    	}else if(gmap == 'violet2orange'){
    		gradient.addColorStop(0.000, 'rgba(41, 10, 89, 1.000)');
      		gradient.addColorStop(1.000, 'rgba(255, 124, 0, 1.000)');
    	}else if(gmap == 'blue2red2yellow'){
			gradient.addColorStop(0.000, 'rgba(10, 0, 178, 1.000)');
			gradient.addColorStop(0.500, 'rgba(255, 0, 0, 1.000)');
			gradient.addColorStop(1.000, 'rgba(255, 252, 0, 1.000)');
    	}else if(gmap == 'blue2yellow2blue'){
			gradient.addColorStop(0.100, 'rgba(11, 1, 184, 1.000)');
			gradient.addColorStop(0.500, 'rgba(253, 250, 3, 1.000)');
			gradient.addColorStop(0.900, 'rgba(11, 2, 170, 1.000)');
    	}else if(gmap == 'orange2yellow2orange'){
			gradient.addColorStop(0.000, 'rgba(255, 110, 2, 1.000)');
			gradient.addColorStop(0.500, 'rgba(255, 255, 0, 1.000)');
			gradient.addColorStop(1.000, 'rgba(255, 109, 0, 1.000)');
    	}else if(gmap == 'violet2green2orange'){
			gradient.addColorStop(0.000, 'rgba(111, 21, 108, 1.000)');
			gradient.addColorStop(0.500, 'rgba(0, 96, 27, 1.000)');
			gradient.addColorStop(1.000, 'rgba(253, 124, 0, 1.000)');
    	}else if(gmap == 'chrome'){
			gradient.addColorStop(0.000, 'rgba(41, 137, 204, 1.000)');
			gradient.addColorStop(0.500, 'rgba(255, 255, 255, 1.000)');
			gradient.addColorStop(0.520, 'rgba(144, 106, 0, 1.000)');
			gradient.addColorStop(0.640, 'rgba(217, 159, 0, 1.000)');
			gradient.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
    	}else if(gmap == 'spepctrum'){
			gradient.addColorStop(0.000, 'rgba(255, 0, 0, 1.000)');
			gradient.addColorStop(0.150, 'rgba(255, 0, 255, 1.000)');
			gradient.addColorStop(0.330, 'rgba(0, 0, 255, 1.000)');
			gradient.addColorStop(0.490, 'rgba(0, 255, 255, 1.000)');
			gradient.addColorStop(0.670, 'rgba(0, 255, 0, 1.000)');
			gradient.addColorStop(0.840, 'rgba(255, 255, 0, 1.000)');
			gradient.addColorStop(1.000, 'rgba(255, 0, 0, 1.000)');
    	}else if(gmap == 'copper'){
			gradient.addColorStop(0.000, 'rgba(151, 70, 26, 1.000)');
			gradient.addColorStop(0.300, 'rgba(251, 216, 197, 1.000)');
			gradient.addColorStop(0.830, 'rgba(108, 46, 22, 1.000)');
			gradient.addColorStop(1.000, 'rgba(239, 219, 205, 1.000)');
    	}else if(gmap == 'rainbow'){
			gradient.addColorStop(0.150, 'rgba(255, 0, 0, 0.000)');
			gradient.addColorStop(0.200, 'rgba(255, 0, 0, 1.000)');
			gradient.addColorStop(0.320, 'rgba(255, 252, 0, 1.000)');
			gradient.addColorStop(0.440, 'rgba(1, 180, 57, 1.000)');
			gradient.addColorStop(0.560, 'rgba(0, 234, 255, 1.000)');
			gradient.addColorStop(0.680, 'rgba(0, 3, 144, 1.000)');
			gradient.addColorStop(0.800, 'rgba(255, 0, 198, 1.000)');
			gradient.addColorStop(0.850, 'rgba(255, 0, 198, 0.000)');
    	}else if(gmap == 'fire'){
			gradient.addColorStop(0.000, '#000000');
			gradient.addColorStop(0.210, '#800000');
			gradient.addColorStop(0.500, '#ff8000');
			gradient.addColorStop(0.750, '#ffff00');
			gradient.addColorStop(1.000, '#ffffc0');
    	}else if(gmap == 'poppy'){
			gradient.addColorStop(0.000, '#fcaa0b');
			gradient.addColorStop(0.500, '#cd3e6e');
			gradient.addColorStop(1.000, '#81022d');
    	}else if(gmap == 'autumn'){
			gradient.addColorStop(0.000, '#272926');
			gradient.addColorStop(0.500, '#5c0100');
			gradient.addColorStop(1.000, '#b87e00');
    	}else if(gmap == 'autumn2'){
			gradient.addColorStop(0.000, '#354504');
			gradient.addColorStop(0.200, '#6f7908');
			gradient.addColorStop(0.550, '#cabc8b');
			gradient.addColorStop(0.750, '#e0d7b0');
			gradient.addColorStop(1.000, '#cabc8b');
    	}else if(gmap == 'poppy2'){
			gradient.addColorStop(0.050, '#fe1a33');
			gradient.addColorStop(0.350, '#d2533c');
			gradient.addColorStop(0.600, '#c2754d');
			gradient.addColorStop(0.850, '#582107');
    	}else if(gmap == 'brightfloral'){
			gradient.addColorStop(0.000, '#fd1901');
			gradient.addColorStop(0.650, '#ffb508');
			gradient.addColorStop(0.990, '#f3f602');
    	}else if(gmap == 'brightfloral2'){
			gradient.addColorStop(0.000, '#fd1901');
			gradient.addColorStop(0.440, '#ffb508');
			gradient.addColorStop(0.750, '#f3f602');
			gradient.addColorStop(1.000, '#fb0202');
    	}
    	/*
			Add your gradient styles..
    	*/
    }
    
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

	// Opacity & Blending Mode
    this.newLayer(function(){
		this.copyParent();
		this.setBlendingMode(main.blend);
		if(main.opacity == 0){
			main.opacity = 100;
		}
		if(main.opacity == 100){
			main.opacity = 0;
		}
		main.opacity = 100 - main.opacity;
		this.opacity(main.opacity);
    });
    this.replaceCanvas(canvas);
    return this;
});
