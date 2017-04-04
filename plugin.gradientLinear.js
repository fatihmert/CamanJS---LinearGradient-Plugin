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

Caman.Filter.register("gradientLinear", function (pos,main,gmap) {
	/* gmap struct
		[
			{color: '#000',opacity: 0.30},
			{color: '#000',opacity: 0.30},
			{color: '#000',opacity: 0.30}...
		]

		pos
			left,right,top,bottom

		main
			{
				blend: 'overlay',
				opacity: 100
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

    if(pos == null){
    	pos = "left";
    }

    if(gmap == null){
    	gmap = ['#000','#fff'];
    }

    if(main == null){
    	main = {blend: 'lighten', opacity: 100};
    }

    ctx = canvas.getContext('2d');
    								//   right,bottom,left,top			
    if(pos == "right"){
    	gradient = ctx.createLinearGradient(width, 0, 0, 0);	
    }else if(pos == "top"){
    	gradient = ctx.createLinearGradient(0, 0, 0, width);	
    }else if(pos == "bottom"){
    	gradient = ctx.createLinearGradient(0, width, 0, 0);	
    }else{
    	gradient = ctx.createLinearGradient(0, 0, width, 0);
    }
    
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

			gradient.addColorStop(start_part, hex2RGBA(gmap[i]['color'],gmap[i]['opacity']));
		}else{
			gradient.addColorStop(start_part, gmap[i]);
		}
		start_part += part;
	}
    
    ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

    //this.replaceCanvas(canvas);
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
