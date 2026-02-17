var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");


//--------------------------- .common/fixes.js --------------------------

try{
	document.execCommand("BackgroundImageCache", false, true);
}catch(err){}

//--------------------------- .common/Extensions.class.js --------------------------

var Extensions={
	isIE: navigator.appVersion.match(/MSIE/i),
	
	supportPNG24: !navigator.appVersion.match(/MSIE [65]/),
	
	setOpacity:function(opacity){
		if(opacity<0){
			opacity=0;
		}
		if(opacity>100){
			opacity=100
		}
			
		this.style.opacity = opacity/100;
		try{
			this.style.filter = 'alpha(opacity=' + opacity + ')';
		}catch(err){}
		
		this._opacity=opacity;
	},
	
	getOpacity:function(){
		if(typeof(this._opacity)=='undefined'){
			return 100;
		}
		return this._opacity;
	},
	
	getPos:function(obj){
		var x=obj.offsetLeft;
		var y=obj.offsetTop;
		for(i=obj; i=i.offsetParent; x+=parseInt(i.offsetLeft),y+=parseInt(i.offsetTop));
		return {x:x, y:y}
	},
	
	getEventPos:function(e){
		if (!e)
			var e = window.event;
		if (e.pageX){
			posx = e.pageX;
			posy = e.pageY;
		}else if (e.clientY){
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return {x:posx, y:posy}
	},
	
	createElement:function(elementName,addStyle,cssClassName){
		var elm=document.createElement(elementName);
		if(typeof(addStyle)!='undefined'){
			for(var property in addStyle){
				elm.style[property]=addStyle[property];
			}
		}
		if(typeof(cssClassName)!='undefined')
			elm.className=cssClassName;
		return elm;
	},
	
	//---------------------css---------------------
	
	addCssClass:function(element,className){
		var patt=new RegExp(className,'i');
		if(!patt.test(String(element.className)))
			element.className=element.className+' '+className;
		
	},
	
	removeCssClass:function(element,className){
		var patt=new RegExp('\s*'+className,'i');
		if(patt.test(String(element.className)))
			element.className=String(element.className).replace(patt,'');
	},
	
	//----------------scroll window---------------
	
	scrollToTop:function(winObj){
		var win=(typeof(winObj)=='undefined')?top:winObj;
		//Util.printObj(win);
		try{
			win.scroll(0,0);
		}catch(err){}
	}
}

//--------------------------- .common/Util.js --------------------------

var Util={
	posX:10,
	posY:10,
	
	showBlind:function(status){
		if(!this.blind){
			this.blind=((document.getElementsByTagName('body'))[0]).appendChild(document.createElement('div'));
			with(this.blind.style){
				backgroundColor='transparent';
				width='50px';
				height='80px';
				position='absolute';
				top=0;
				left=0;
				zIndex='1000'
			}
		}
	},
	
	//create debug layer (this.trace)
	debugLayer:null,
	
	trace:function(str){
		if(!traceIsOn)
			return false;
		if(!this.debugLayer){
			this.debugLayer=((document.getElementsByTagName('body'))[0]).appendChild(document.createElement('div'));
			this.debugLayer.innerHTML='<a href="javascript:Util.clearDebug()">clear</a><br>';
			with(this.debugLayer.style){
				position='absolute';
				padding='10px';
				color='#090';
				backgroundColor='#fff';
				top=this.posY+'px';
				left=this.posX+'px';
				zIndex='1000'
			}
		}
		this.debugLayer.innerHTML=this.debugLayer.innerHTML+'<br>'+str;
	},
	
	ctrace:function(str){
		this.clearDebug();
		this.trace(str);
	},
	
	printObj:function(obj){
		this.trace('---------object----------');
		for(var i in obj){
			if(typeof(obj[i])=='function'){
				this.trace(i+'=function(){...}')
			}else{
				this.trace(i+'='+obj[i])
			}
		}
		this.trace('--------end object-------');
	},
	
	clearDebug:function(){
		this.debugLayer.innerHTML='<a href="javascript:Util.clearDebug()">clear</a><br>';
	},
	
	setPos:function(posX,posY){
		this.posX=posX;
		this.posY=posY;
		if(this.debugLayer){
			this.debugLayer.style.left=posX+'px';
			this.debugLayer.style.top=posY+'px';
		}
	}
}

//--------------------------- JSColorPicker.class.js --------------------------

function JSColorPicker(initParams){ //{url skinPath, int x, int y}
	if(initParams==undefined)
	return;
	if(!document.createElement) //check DOM
	return;
	try{
		document.captureEvents(Event.MOUSEMOVE);
	}catch(err){}

	this.isIE=Extensions.isIE;
	this.fixPNG=!Extensions.supportPNG24;

	//----------- initialize params

	this.skinPath=initParams.skinPath;
	this.holder=(initParams.holder && typeof(document.getElementById(initParams.holder))!='undefined')?document.getElementById(initParams.holder):false;
	if(initParams.holder && !this.holder){
		// Holder missing; avoid attaching a floating picker to body.
		return;
	}
	this.color=(initParams.color)?initParams.color.replace(/#/,''):'ff0000';

	//-------- create cpwin

	if(this.holder){
		this.cpwin=Extensions.createElement('div',{
			position:'relative',
			width:'310px',
			height:'277px'}
			);
			this.holder.appendChild(this.cpwin);
	}else{
		this.cpwin=Extensions.createElement('div',{
			position:'absolute',
			left:this.x+'px',
			top:this.y+'px',
			width:'310px',
			height:'277px',
			border:'1px solid #aaa',
			backgroundColor:'#eee'}
			);
			document.getElementsByTagName('body')[0].appendChild(this.cpwin);
	}

	//------------- create cp
	this.cp=this.cpwin.appendChild(Extensions.createElement('div',{
		position:'absolute',
		width:'256px',
		height:'256px',
		backgroundColor:'#ffffff',
		left:0,
		top:0
	}));
	this.cp.trackMouseMove=false;
	this.cp.parent=this;
	this.cp.width=256;
	this.cp.height=256;

	if(this.fixPNG){
		this.cp.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src='"+this.skinPath+"colorpicker/sat.png')";
	}else{
		// Render with CSS gradients to avoid dependency on archived 1x1 PNG assets.
		this.cp.style.backgroundImage='linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0))';
	}

	this.cp.style.cursor='crosshair';

	
	this.cp._setColor=function(rgb){
		this.style.backgroundColor='#'+rgb.r.toHex()+rgb.g.toHex()+rgb.b.toHex();
	}

	this.cp._setSV=function(s,v){
		var s=parseInt(this.width*s);
		if(s>=256-this.parent.marker.height)
			s=256-this.parent.marker.height;
		
		this.picker.style.left=s+'px';
		this.picker.style.top=parseInt(this.height-this.height*v)+'px';
	}

	this.cp._showPicker=function(){
		this.picker.style.display='block';
	}
	this.cp._hidePicker=function(){
		this.picker.style.display='none';
	}
	this.cp._trackMouse=function(e){
		var cpPos=Extensions.getPos(this);
		var mousePos=Extensions.getEventPos(e);

		this.parent.hsvColor.s=Math.round((mousePos.x-cpPos.x)/255*100)/100;
		this.parent.hsvColor.v=1-Math.round((mousePos.y-cpPos.y)/255*100)/100;

		this.picker.style.left=parseInt(mousePos.x-cpPos.x-this.picker.width/2)+'px';
		this.picker.style.top=parseInt(mousePos.y-cpPos.y-this.picker.height/2)+'px';

		this.parent._recalcColor();
	}


	//-------------- create picker

	this.cp.picker=this.cp.appendChild(Extensions.createElement('div',{
		position:'absolute',
		width:'12px',
		height:'12px',
		left:'10px',
		top:'10px',
		background:'transparent',
		border:'2px solid #fff',
		borderRadius:'50%',
		boxShadow:'0 0 0 1px #000',
		boxSizing:'border-box',
		pointerEvents:'none'
	}));
	this.cp.picker.width=12;
	this.cp.picker.height=12;


	//-------------- create bar

	this.bar=this.cpwin.appendChild(Extensions.createElement('div',{
		position:'absolute',
		width:'19px',
		height:'256px',
		backgroundImage:'linear-gradient(to bottom, #ff0000 0%, #ff00ff 17%, #0000ff 33%, #00ffff 50%, #00ff00 67%, #ffff00 83%, #ff0000 100%)',
		left:'270px',
		top:0
	}));
	this.bar.height=256;
	this.bar.parent=this;
	this.bar._setH=function(h){
		var h=parseInt((this.parent.bar.height-this.parent.marker.height/2)*(360-h)/360);
		this.parent.marker.style.top=h+'px';
	}

	//----------- create marker

	this.marker=this.cpwin.appendChild(Extensions.createElement('div',{
		position:'absolute',
		width:'38px',
		height:'9px',
		left:'260px',
		top:'6px',
		overflow:'hidden'
	}));
	this.marker.width=38;
	this.marker.height=9;
	if(this.fixPNG){
		this.marker.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src='"+this.skinPath+"colorpicker/slidemarker.gif')";
	}else{
		this.marker.style.background='rgba(255,255,255,0.95)';
		this.marker.style.border='1px solid #2f2f2f';
		this.marker.style.boxSizing='border-box';
	}
	try{
		this.marker.style.cursor='url('+this.skinPath+'cursors/cursor_hand.cur), default';
	}catch(err){}
	this.marker.parent=this;

	/*-------- RGB - HSV convertion ------*/
	Number.prototype.toHex=function(){
		var val=this.toString(16);
		return (val.length==1)?'0'+val:val;
	}
	String.prototype.toDec=function(){
		var digits='0123456789ABCDEF';
		var val=0;
		var pos='';

		for(var i=0; i<this.length; i++){
			pos=digits.indexOf(this.substr(i,1).toUpperCase());
			if(pos==-1)
			return NaN;
			val+=pos*Math.pow(16,this.length-i-1);
		}
		return val;
	}

	this._rgb2hsv=function(r,g,b){
		r/=255;
		g/=255;
		b/=255;

		var minVal = Math.min(r, g, b);
		var maxVal = Math.max(r, g, b);
		var delta = maxVal - minVal;

		var h,s,v;

		v = maxVal;

		if (delta == 0) {
			h = 0;
			s = 0;
		} else {
			s = delta / maxVal;
			var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
			var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
			var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;

			if (r == maxVal) {h = del_B - del_G;}
			else if (g == maxVal) {h = (1 / 3) + del_R - del_B;}
			else if (b == maxVal) {h = (2 / 3) + del_G - del_R;}

			if (h < 0) {h += 1;}
			if (h > 1) {h -= 1;}
		}
		h = Math.round(h*360);
		s = Math.round(s*100)/100;
		v = Math.round(v*100)/100;

		return {h:h,s:s,v:v};
	}

	this._hsv2rgb=function(h,s,v){
		h/=360;
		if (s == 0){                       //HSV values = 0 � 1
			var r=v*255
			var g=v*255
			var b=v*255
		}else{
			var_h=h*6
			if (var_h ==6)
			var_h=0	//h must be<1
			var_i=parseInt(var_h)	//Or...var_i=floor(var_h)
			var_1=v*(1-s)
			var_2=v*(1-s*(var_h-var_i))
			var_3=v*(1-s*(1-(var_h-var_i)))

			if ( var_i==0){var_r=v;var_g=var_3;var_b=var_1}
			else if(var_i==1){var_r=var_2;var_g=v;var_b=var_1}
			else if(var_i==2){var_r=var_1;var_g=v;var_b=var_3}
			else if(var_i==3){var_r=var_1;var_g=var_2;var_b=v}
			else if(var_i==4){var_r=var_3;var_g=var_1;var_b=v}
			else {var_r=v;var_g=var_1;var_b=var_2}

			var r=var_r*255 //RGB results = 0 � 255
			var g=var_g*255
			var b=var_b*255
		}
		return {r:Math.round(r),g:Math.round(g),b:Math.round(b)};
	}

	/*--------behavior for cp ------*/
	this.cp.onmousedown=function(e){
		this._trackMouse(e);
		this._hidePicker();
		this.trackMouseMove=true;
		this.parent._recalcColor();
	}

	this.cp.onmouseup=function(){
		this._showPicker()
		this.trackMouseMove=false;
		//this.parent._recalcColor();
	}

	this.cp.onmousemove=function(e){
		if(this.trackMouseMove)
		this._trackMouse(e);
	}

	this.cp.onmouseover=function(){
		if(this.trackMouseMove)
		this._hidePicker();
	}

	this.cp.onmouseout=function(){
		this.trackMouseMove=false;
		this._showPicker()
	}

	/*--------- behavior for bar ----------*/
	this.bar.onclick=function(e){
		var barPos=Extensions.getPos(this);
		var mousePos=Extensions.getEventPos(e);

		posy=mousePos.y-barPos.y;

		this.parent.marker.style.top=posy-Math.round(this.parent.marker.height/2)+'px'

		this.parent.hsvColor.h=Math.round((this.height-posy)/this.height*360);
		this.parent._recalcColor();
	}
	try{
		this.bar.style.cursor='pointer'
	}catch(err){}

	/*--------behavior for marker------*/
	this.markerActive=false;
	this.defaultMousemoveHandler=null;

	this.marker.y=0;
	this.marker.height=9;

	this.marker.onmousedown=function(e){
		try{
			this.parent.marker.style.cursor='url('+this.parent.skinPath+'cursors/cursor_handhold.cur), move'
		}catch(err){}
		this.parent.markerActive=true;

		window.jscp_activeColorPicker=this.parent;
		this.parent.defaultMousemoveHandler=document.onmousemove;
		this.parent.defaultMouseupHandler=document.onmouseup;

		document.onmouseup=function(){
			document.onmouseup=jscp_activeColorPicker.defaultMouseupHandler;
			document.onmousemove=jscp_activeColorPicker.defaultMousemoveHandler;
			jscp_activeColorPicker.markerActive=false;
			try{
				jscp_activeColorPicker.marker.style.cursor='url('+jscp_activeColorPicker.skinPath+'cursors/cursor_hand.cur), default'
			}catch(err){}
		}

		document.onmousemove=function(e){
			var marker=jscp_activeColorPicker.marker;
			var bar=jscp_activeColorPicker.bar;

			var barPos=Extensions.getPos(bar);
			var mousePos=Extensions.getEventPos(e);

			posy=mousePos.y-barPos.y;

			if(posy>=0 && posy<=bar.height)
				jscp_activeColorPicker._recalcColor();

			if(posy<0)
				posy=0
			if(posy>=bar.height)
				posy=bar.height;

			marker.style.top=posy-Math.round(marker.height/2)+'px';
			jscp_activeColorPicker.hsvColor.h=Math.round(360-posy/bar.height*360);
		}
	}

	this.marker.onmouseup=function(){
		try{
			this.style.cursor='url('+this.parent.skinPath+'cursors/cursor_hand.cur), default'
		}catch(err){}
		document.onmousemove=jscp_activeColorPicker.defaultMousemoveHandler;
		jscp_activeColorPicker.markerActive=false;
		this.parent.markerActive=false;
	}

	//----------------- init

	this._recalcColor=function(){
		this.rgbColor=this._hsv2rgb(
			this.hsvColor.h,
			this.hsvColor.s,
			this.hsvColor.v
		);
		this.cp._setColor(this._hsv2rgb(this.hsvColor.h,1,1))
		this.color=this.rgbColor.r.toHex()+this.rgbColor.g.toHex()+this.rgbColor.b.toHex();

		this.onChange(this.color);
	}

	//--------------- public methods
	
	this.onChange=function(){};
	
	this.setColor=function(color){
		String(color).replace('#','');
		
		this.rgbColor={
			r:color.substr(0,2).toDec(),
			g:color.substr(2,2).toDec(),
			b:color.substr(4,2).toDec()
		};
		
		this.hsvColor=this._rgb2hsv(
			this.rgbColor.r,
			this.rgbColor.g,
			this.rgbColor.b
		);
		
		this.bar._setH(this.hsvColor.h);
		this.cp._setSV(this.hsvColor.s, this.hsvColor.v);
		this._recalcColor();
	}
	
	
	this.setColor(this.color);
	return this;
}

//--------------------------- JSHSlider.class.js --------------------------

function JSHSlider(initParams){
	/*
	holderId
	holder
	x
	y
	boxWidth
	boxHeight
	cornerWidth
	markerWidth
	markerHeight
	skinPath
	*/
	
	if(!document.createElement) //check DOM
		return;
	
	try{
		document.captureEvents(Event.MOUSEMOVE);
	}catch(err){}
	
	//------------ initialization
	
	this.params=initParams;
	this.value=0;
	
	this.onChange=function(perc){}
	this.onStart=function(){}
	this.onStop=function(){}
	
	//------------ create objects
	
	if(typeof(this.params.holder)!='undefined'){
		this.holder=this.params.holder;
	}
	if(document.getElementById(this.params.holderId)){
		this.holder=document.getElementById(this.params.holderId);
	}
	if(!this.holder){
		this.box=document.getElementsByTagName('body')[0].appendChild(Extensions.createElement('div',{
			position:	'absolute',
			width:		this.params.boxWidth+'px',
			height:		this.params.boxHeight+'px',
			left:		this.params.x+'px',
			top:		this.params.y+'px'
		}));
	}else{
		if(typeof(this.params.x)!='undefined' && typeof(this.params.y)!='undefined'){
			this.box=this.holder.appendChild(Extensions.createElement('div',{
				position:	'relative',
				left:		this.params.x+'px',
				top:		this.params.y+'px'
			}));
		}else{
			this.box=this.holder.appendChild(Extensions.createElement('div',{
				position:	'relative'
			}));
		}
	}
	
	var pos=Extensions.getPos(this.box);
	this.params.x=pos.x;
	this.params.x=pos.y;
	
	this.box.appendChild(Extensions.createElement('div',{
		position:	'absolute',
		width:		this.params.cornerWidth+'px',
		height:		this.params.boxHeight+'px',
		left:		'0px',
		top:		'0px',
		background:	'url('+this.params.skinPath+'bg_lcorner.gif) left center no-repeat'
	}));
	this.box.appendChild(Extensions.createElement('div',{
		position:	'absolute',
		width:		this.params.boxWidth-2*this.params.cornerWidth+'px',
		height:		this.params.boxHeight+'px',
		left:		this.params.cornerWidth+'px',
		top:		'0px',
		background:	'url('+this.params.skinPath+'bg_line.gif) left center repeat-x'
	}));
	this.box.appendChild(Extensions.createElement('div',{
		position:	'absolute',
		width:		this.params.cornerWidth+'px',
		height:		this.params.boxHeight+'px',
		left		:this.params.boxWidth-this.params.cornerWidth+'px',
		top:		'0px',
		background:	'url('+this.params.skinPath+'bg_rcorner.gif) left center no-repeat'
	}));
	
	this.marker=this.box.appendChild(Extensions.createElement('div',{
		position:	'absolute',
		width:		this.params.markerWidth+'px',
		height:		this.params.markerHeight+'px',
		left:		this.params.cornerWidth+'px',
		top:		0-parseInt((this.params.markerHeight-this.params.boxHeight)/2)+'px',
		background:	'url('+this.params.skinPath+'bg_marker.gif) left top no-repeat'
	}));
	this.marker.parent=this;
	this.marker.mousex=0;
	try{
		this.marker.style.cursor='url('+this.params.cursorsPath+'cursor_hand.cur), e-resize'
	}catch(err){}
	
	//-------------------------- methods ---------------------------
	
	this._trackMouse=function(e){
		var boxPos=Extensions.getPos(this.box);
		var mousePos=Extensions.getEventPos(e);
		
		var minX=this.params.cornerWidth;
		var maxX=this.params.boxWidth-this.params.cornerWidth-this.params.markerWidth;
		var x=mousePos.x-boxPos.x-this.marker.mousex;
		
		if((x<minX && this.value==0) || (x>maxX && this.value==1))
			return;
		
		if(x<minX)
			x=minX;
		if(x>maxX)
			x=maxX;
			
		this.value=Math.round((x-minX)/(maxX-minX)*100)/100;
		this.onChange(this.value);
			
		this.marker.style.left=x+'px';
	}
	
	this.setValue=function(val){
		var val=parseFloat(val);
		if(val>1)
			val=1;
		if (val<0)
			val=0;
		
		this.value=val;
			
		var boxPos=Extensions.getPos(this.box);
		
		var minX=this.params.cornerWidth;
		var maxX=this.params.boxWidth-this.params.cornerWidth-this.params.markerWidth;
		var x=minX=parseInt((maxX-minX)*val);
		this.marker.style.left=x+'px';
	}
	//-------------------------- behavior -------------------------
	
	this.marker.onmousedown=function(e){
		var markerPos=Extensions.getPos(this);
		var mousePos=Extensions.getEventPos(e);
		
		this.parent.onStart();
		
		this.mousex=mousePos.x-markerPos.x
		
		try{
			this.parent.marker.style.cursor='url('+this.parent.params.cursorsPath+'cursor_handhold.cur), e-resize'
		}catch(err){}
		
		window.jssl_activeSlider=this.parent;
		this.parent.defaultMousemoveHandler=document.onmousemove;
		this.parent.defaultMouseupHandler=document.onmouseup;
		
		document.onmouseup=function(){
			jssl_activeSlider.onStop();
			document.onmouseup=jssl_activeSlider.defaultMouseupHandler;
			document.onmousemove=jssl_activeSlider.defaultMousemoveHandler;
			try{
				jssl_activeSlider.marker.style.cursor='url('+jssl_activeSlider.params.cursorsPath+'cursor_hand.cur), e-resize'
			}catch(err){}
		}
		
		document.onmousemove=function(e){
			jssl_activeSlider._trackMouse(e);
			return false;
		}
		
		return false;
	}
	
	this.marker.onmouseup=function(){
		try{
			this.style.cursor='url('+this.parent.params.cursorsPath+'cursor_hand.cur), e-resize'
		}catch(err){}
		document.onmousemove=this.parent.defaultMousemoveHandler;
	}
}


//--------------------------- JSCSlider.class.js --------------------------

function JSCSlider(initParams){
	/*
	holderId
	holder
	x
	y
	radius
	markerWidth
	markerHeight
	skinPath
	*/

	if(!document.createElement) //check DOM
	return;

	try{
		document.captureEvents(Event.MOUSEMOVE);
	}catch(err){}


	//------------ initialization

	this.params=initParams;
	this.value=0;

	this.onChange=function(degrees){}
	this.onStart=function(){}
	this.onStop=function(){}

	//------------ create objects

	if(typeof(this.params.holder)!='undefined'){
		this.holder=this.params.holder;
	}
	if(document.getElementById(this.params.holderId)){
		this.holder=document.getElementById(this.params.holderId);
	}

	if(!this.holder){
		this.box=document.getElementsByTagName('body')[0].appendChild(Extensions.createElement('div',{
			position:	'absolute',
			width:		this.params.radius*2+'px',
			height:		this.params.radius*2+'px',
			left:		this.params.x+'px',
			top:		this.params.y+'px',
			overflow:	'visible'
		}));
	}else{
		if(typeof(this.params.x)!='undefined' && typeof(this.params.y)!='undefined'){
			this.box=this.holder.appendChild(Extensions.createElement('div',{
				position:	'relative',
				width:		this.params.radius*2+'px',
				height:		this.params.radius*2+'px',
				left:		this.params.x+'px',
				top:		this.params.y+'px',
				overflow:	'visible'
			}));
		}else{
			this.box=this.holder.appendChild(Extensions.createElement('div',{
				position:	'relative',
				width:		this.params.radius*2+'px',
				height:		this.params.radius*2+'px',
				overflow:	'visible'
			}));
		}
	}

	this.bg=this.box.appendChild(Extensions.createElement('div',{
		position:	'absolute',
		width:		this.params.radius*2+'px',
		height:		this.params.radius*2+'px',
		background:	'url('+this.params.skinPath+'bg_canvas.png) left top no-repeat'
	}));
	if(!Extensions.supportPNG24){
		this.bg.style.background='none';
		this.bg.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='crop',src='"+this.params.skinPath+"bg_canvas.png')";
	}

	var pos=Extensions.getPos(this.box);
	this.params.x=pos.x;
	this.params.x=pos.y;

	this.marker=this.box.appendChild(Extensions.createElement('div',{
		position:	'absolute',
		width:		this.params.markerWidth+'px',
		height:		this.params.markerHeight+'px',
		left:		0+'px',
		top:		0+'px',
		background:	'url('+this.params.skinPath+'bg_marker.png) left top no-repeat'
	}));
	if(!Extensions.supportPNG24){
		this.marker.style.background='none';
		this.marker.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src='"+this.params.skinPath+"bg_marker.png')";
	}
	this.marker._width=this.params.markerWidth;
	this.marker._height=this.params.markerHeight;
	this.marker.parent=this;
	this.marker.mousex=0;
	try{
		this.marker.style.cursor='url('+this.params.cursorsPath+'cursor_hand.cur), move'
	}catch(err){}
	

	//-------------------------- methods ---------------------------

	this._trackMouse=function(e){
		var boxPos=Extensions.getPos(this.box);
		var mousePos=Extensions.getEventPos(e);

		var x=mousePos.x-boxPos.x-this.params.radius;
		var y=mousePos.y-boxPos.y-this.params.radius;

		var radians=Math.atan(y/x);

		var degrees=radians/Math.PI*180;
		if(degrees<0)
			degrees+=180;
		if(y<0)
			degrees+=180;
		degrees=Math.round(degrees);

		var markerX=Math.round(Math.cos(radians)*(this.params.radius-3));
		var markerY=Math.round(Math.sin(radians)*(this.params.radius-3));

		if(x<0){
			markerX=this.params.radius-markerX;
			markerY=this.params.radius-markerY;
		}else{
			markerX=this.params.radius+markerX;
			markerY=this.params.radius+markerY;
		}
		this.marker.style.left=markerX-Math.round(this.marker._width/2)+'px';
		this.marker.style.top=markerY-Math.round(this.marker._height/2)+'px';

		this.marker._x=markerX;
		this.marker._y=markerY;

		this.value=degrees;
		this.onChange(degrees);
	}


	this.setValue=function(degrees){
		var radians=Math.PI*(360-degrees)/180;

		var markerX=this.params.radius+Math.round(Math.cos(radians)*(this.params.radius-3));
		var markerY=this.params.radius-Math.round(Math.sin(radians)*(this.params.radius-3));

		this.marker.style.left=markerX-Math.round(this.marker._width/2)+'px';
		this.marker.style.top=markerY-Math.round(this.marker._height/2)+'px';

		this.marker._x=markerX;
		this.marker._y=markerY;

		this.value=degrees;
	},

	this.getValue=function(){
		return this.value;
	}
	//-------------------------- behavior -------------------------

	this.marker.onmousedown=function(e){
		this.parent.onStart();
		try{
			this.parent.marker.style.cursor='url('+this.parent.params.cursorsPath+'cursor_handhold.cur), e-resize'
		}catch(err){}

		window.jssl_activeSlider=this.parent;
		this.parent.defaultMousemoveHandler=document.onmousemove;
		this.parent.defaultMouseupHandler=document.onmouseup;

		document.onmouseup=function(){
			jssl_activeSlider.onStop();
			document.onmouseup=jssl_activeSlider.defaultMouseupHandler;
			document.onmousemove=jssl_activeSlider.defaultMousemoveHandler;
			try{
				jssl_activeSlider.marker.style.cursor='url('+jssl_activeSlider.params.cursorsPath+'cursor_hand.cur), e-resize'
			}catch(err){}
		}

		document.onmousemove=function(e){
			jssl_activeSlider._trackMouse(e);
			return false;
		}

		return false;
	}

	this.marker.onmouseup=function(){
		try{
			this.style.cursor='url('+this.parent.params.cursorsPath+'cursor_hand.cur), e-resize'
		}catch(err){}
		document.onmousemove=this.parent.defaultMousemoveHandler;
	}

	//------------------------ initialization ----------------------

	if(typeof(this.params.value)!='undefined'){
		this.setValue(parseInt(this.params.value));
	}
}


//--------------------------- ControlTabs.js --------------------------

var ControlTabs={
	/*
	sample configuration
	{
	colors:'Colors',
	canvas:'Canvas',
	image:'Image',
	rotate:'Rotate'
	}
	*/
	tabs: 	{},

	init:	function(tabs, activeTab){
		this.tabs=tabs;
		this.select(activeTab);
	},

	active: 'colors',

	select: function(tabName){

		var activeTab=document.getElementById('tab_'+this.active);
		var selectedTab=document.getElementById('tab_'+tabName);

		activeTab.innerHTML='<a href="#" onclick="ControlTabs.select(\''+this.active+'\'); return false;"><ins>'+this.tabs[this.active]+'</ins></a>';
		activeTab.className=String(activeTab.className).replace(/\s*active/i,'');

		selectedTab.innerHTML='<span><ins>'+this.tabs[tabName]+'</ins></span>';
		selectedTab.className=String(selectedTab.className).replace(/\s*active/ig,'')+' active';

		document.getElementById('tabcontent_'+this.active).style.display='none';
		document.getElementById('tabcontent_'+tabName).style.display='block';

		this.active=tabName;
		try{
			ControlSliders.hideSliders();
		}catch(err){}
		if(tabName=='saved' && typeof(ControlShare)!='undefined' && ControlShare.renderSavedList){
			ControlShare.renderSavedList();
		}
	}
}

//--------------------------- ControlColors.js --------------------------

var ControlColors={
	/*
	sample configuration
	{
		skinPath:'assets/images/',
		holder:'cpHolder',
		color:'#2c672e'
	}
	*/
	
	picker:null,
	
	activeSampleId:'',
	activeField:null,
	activeSample:null,
	
	init: function(params, activeSampleId){
		if(params && params.holder){
			var holder=document.getElementById(params.holder);
			if(holder){
				holder.innerHTML='';
			}
		}
		this.picker=new JSColorPicker(params);
		if(!this.picker || !this.picker.cpwin){
			return;
		}
		
		this.selectSample(activeSampleId);
		
		this.picker.onChange=function(color){
			ControlColors.activeField.value=color;
			ControlColors.activeSample.style.backgroundColor='#'+color;
			ControlParams.updateParam(ControlColors.activeSampleId, color);
			ControlParams.renderParam(ControlColors.activeSampleId, color);
		}
	},
	
	initSample:function(sampleId,color){
		var color=String(color).replace('#','');
		var fieldElement=document.getElementById(sampleId+'Val');
		
		document.getElementById(sampleId+'Sample').style.backgroundColor='#'+color;
		fieldElement.value=color;
		
		fieldElement.onfocus=function(){
			ControlColors.activeField=this;
			//ControlColors.selectSample(String(this.id).replace('Val',''));
		};	
		fieldElement.onblur=function(){
			ControlColors.readValue(this);
		};
		fieldElement.onkeydown=function(e){
			var keycode=0;
			if (window.event) 
				keycode = window.event.keyCode;
			else if (e) 
				keycode = e.which;
			if(keycode==13 || keycode==9){
				ControlColors.readValue(this);
				return false;
			}
		}
	},
	
	selectSample: function (sampleId){
		var sample=document.getElementById(sampleId+'Sample');
		if(this.activeSample && this.activeSample!==sample)
			Extensions.removeCssClass(this.activeSample,'active');
		Extensions.addCssClass(sample,'active');
		
		this.activeSampleId=sampleId;
		this.activeSample=sample;
		this.activeField=document.getElementById(sampleId+'Val');
		
		if(typeof(ControlParams.fields)!='undefined')
			this.picker.setColor(ControlParams.fields[this.activeSampleId].value);
	},
	
	readValue:function(fieldElement){
		var val=String(fieldElement.value);
		if(!val.match(/[\da-f]{6}/i)){
			Extensions.addCssClass(fieldElement, 'invalidValue');
			return false;
		}

		Extensions.removeCssClass(fieldElement, 'invalidValue');
		
		this.activeSample.style.backgroundColor='#'+val;
		this.picker.setColor(val)
	},
	
	set:function(colors){
		for(var sampleId in colors){
			var color=String(colors[sampleId]).replace('#','');
			document.getElementById(sampleId+'Sample').style.backgroundColor='#'+color;
			document.getElementById(sampleId+'Val').value=color;
			ControlParams.updateParam(sampleId, color);
		}
		if(typeof(colors[this.activeSampleId])!='undefined')
			this.picker.setColor(colors[this.activeSampleId]);
	}
}

//--------------------------- ControlSliders.js --------------------------

var ControlSliders={
	
	/*
	Sample configuration
	{
		skinPath:'assets/images/live-fields/',
		cursorsPath:'assets/images/cursors/',
		holderWidth:200,
		holderHeight:30,
		boxWidth:179,
		boxHeight:10,
		cornerWidth:1,
		markerWidth:30,
		markerHeight:12,
		x:10,
		y:13
	}
	*/
	
	init:function(params, filters){
		LiveFields.init(params, filters);
		
		LiveFields.onInvalidValue=function(fieldElement){
			Extensions.addCssClass(fieldElement, 'invalidValue');
		}
		
		LiveFields.onValidValue=function(fieldElement){
			Extensions.removeCssClass(fieldElement, 'invalidValue');
		}
		
		LiveFields.onChange=function(paramName, value){
			ControlParams.updateParam(paramName, value);
		}
	},
	
	set:function(paramName,paramValue){
		LiveFields.set(paramName,paramValue);
		var range=document.getElementById(paramName+'Range');
		if(range) range.value=paramValue;
	},
	
	hideSliders:function(){
		LiveFields.hideSlider();
	},
	
	setRel:function(primaryFieldId, dependedFieldId){
		LiveFields.setRel(primaryFieldId, dependedFieldId);
	},
	
	unsetRel:function(primaryFieldId){
		LiveFields.unsetRel(primaryFieldId);
	}
}


//--------------------------- ControlRels.js --------------------------

var ControlRels={
	switchers:{},
	
	initSwitcher:function(switcherId, primaryFieldId, dependedFieldId, isOn){
		this.switchers[switcherId]={
			primaryFieldId:		primaryFieldId,
			dependedFieldId:	dependedFieldId,
			status: 			!isOn
		}
		
		this.switchStatus(switcherId)
	},
	
	switchStatus:function(switcherId){
		if(typeof(this.switchers[switcherId])!='undefined'){
			var switcher=this.switchers[switcherId];
			var switcherElement=document.getElementById(switcherId);
			
			if(switcher.status){
				ControlSliders.unsetRel(switcher.primaryFieldId);
				ControlSliders.unsetRel(switcher.dependedFieldId);
				
				if(String(switcherElement.className).match(/\s?propFlagActive/i)){
					switcherElement.className=String(switcherElement.className).replace(/\s?propFlagActive/i,'');
				}
			}else{
				ControlSliders.setRel(switcher.primaryFieldId, switcher.dependedFieldId);
				ControlSliders.setRel(switcher.dependedFieldId, switcher.primaryFieldId);
				
				if(!String(switcherElement.className).match(/\s?propFlagActive/i))
					switcherElement.className=switcherElement.className+' propFlagActive';
			}
			
			this.switchers[switcherId].status=!this.switchers[switcherId].status;
		}
	}
}

//--------------------------- LiveFields.class.js --------------------------

var LiveFields={
	
	params:{},
	holder:false,
	filters:{},
	activeField:'',
	
	hideDelay:2000,
	fadeDelay:50,
	fadeStep:10,
	fadeTimer:null,
	fadeAllowed:true,
	
	_activateFadeTimer:function(){
		this.fadeAllowed=true;
		clearTimeout(this.fadeTimer);
		this.holder.setOpacity(100);
		this.fadeTimer=setTimeout(function(){
			LiveFields.fadeOutSlider();
		},this.hideDelay);
	},
	
	_fixValue:function(){
		var filter=this.filters[this.activeField.id];
		var value=parseFloat(this.activeField.value);
		if(isNaN(value)){
			this.onInvalidValue(this.activeField);
			return false;
		}

		if(value>filter.max)
			value=filter.max;
		if(value<filter.min)
			value=filter.min;
		this.activeField.value=value;
		
		this.onValidValue(this.activeField);
		return value;
	},
	
	init:function(params, filters){
		if(this.holder)
			return;
		if(typeof(document.getElementsByTagName)=='undefined'){
			alert("Browser doesn't support LiveFields feature")
			return false;
		}
		
		this.params=params;
		
		if(typeof(filters)!='undefined')
			this.filters=filters;
		
		for(var fieldId in this.filters){
			if(field=document.getElementById(fieldId)){
				field.onclick=function(){
					LiveFields.showSlider(this)
				};
				field.onblur=function(){
					LiveFields.readValue(this);
				};
				field.onkeydown=function(e){
					var keycode=0;
					if (window.event) 
						keycode = window.event.keyCode;
					else if (e) 
						keycode = e.which;
					if(keycode==13 || keycode==9)
						LiveFields.readValue(this);
				}
				this.filters[fieldId].depended=false;
			}
		}
		
		this.holder=document.getElementsByTagName('body')[0].appendChild(
			Extensions.createElement('div',{
				position:	'absolute',
				top:		100+'px',
				left:		100+'px',
				background:	'url('+this.params.skinPath+'bg_holder.gif'+') 0 0 no-repeat',
				width:		this.params.holderWidth+'px',
				height:		this.params.holderHeight+'px',
				display:	'none'
			})
		);
		this.holder.setOpacity=Extensions.setOpacity;
		this.holder.getOpacity=Extensions.getOpacity;
		
		this.params.holder=this.holder;
		this.slider = new JSHSlider(params);
		this.slider.onChange=function(perc){
			LiveFields._activateFadeTimer();			
			LiveFields.setValue(perc);
		}
	},
	
	showSlider:function(fieldElement){
		var pos=Extensions.getPos(fieldElement);
		this.holder.style.left=parseInt(pos.x-(this.params.holderWidth-fieldElement.offsetWidth)/2)+'px';
		this.holder.style.top=parseInt(pos.y+fieldElement.offsetHeight)+'px';
		
		this.fadeAllowed=false;
		clearTimeout(this.fadeTimer);
		this.holder.setOpacity(100);
		this.holder.style.display='block';
		
		this.activeField=fieldElement;
		this.readValue(fieldElement);
		
		this.onChange(this.activeField.id, this.activeField.value);
	},
	
	hideSlider:function(fieldElement){
		this.holder.style.display='none';
		this.holder.setOpacity(100);
	},
	
	fadeOutSlider:function(){
		if(!this.fadeAllowed)
			return;
		
		var opacity=this.holder.getOpacity()
		if(opacity>0){
			this.holder.setOpacity(opacity-this.fadeStep);
			this.fadeTimer=setTimeout(function(){
				LiveFields.fadeOutSlider();
			},this.fadeDelay);
		}else{
			clearTimeout(this.fadeTimer);
			this.hideSlider();
		}
						
	},
	
	setValue:function(perc){
		var range=this.filters[this.activeField.id]
		if(range){
			if(typeof(range.precision)!='number' && range.precision!=0){
				var value=parseInt(range.min+(range.max-range.min)*perc);
			}else{
				var value=parseInt(range.min+(range.max-range.min)*perc*Math.pow(10,range.precision))/Math.pow(10,range.precision);
			}
		}
		
		this.activeField.value=value;
		this.onValidValue(this.activeField);
		this.calculateDepended();
		this.onChange(this.activeField.id,value);
	},
	
	set:function(paramName,paramValue){
		if(typeof(document.getElementById(paramName))=='undefined')
			return false;
		var field=document.getElementById(paramName)

		if(typeof(this.filters[paramName])=='undefined')
			return false;
			
		var range=this.filters[paramName]
		if(paramValue>range.max)
			paramValue=range.max;
		if(paramValue<range.min)
			paramValue=range.min;
			
		field.value=paramValue;
		this.onChange(paramName, paramValue);
	},
	
	calculateDepended:function(){
		if(this.filters[this.activeField.id].depended){
			var dependedFieldId=this.filters[this.activeField.id].depended;
			var dependedField=document.getElementById(dependedFieldId);
			var range=this.filters[dependedFieldId];
			var relFactor=this.filters[dependedFieldId].relFactor;
			var value=this.activeField.value;
			
			var dependedVal=parseFloat(dependedField.value);
			dependedVal=value*relFactor;
			
			var wasCorrected=false;
			if(dependedVal<range.min){
				dependedVal=range.min;
				wasCorrected=true;
			}
			if(dependedVal>range.max){
				dependedVal=range.max;
				wasCorrected=true;
			}			
			
			if(typeof(range.precision)!='number' && range.precision!=0){
				dependedField.value=parseInt(dependedVal);
			}else{
				dependedField.value=parseInt(dependedVal*Math.pow(10,range.precision))/Math.pow(10,range.precision);
			}
			
			if(wasCorrected)
				return;
			
			this.onValidValue(dependedField);
			this.onChange(dependedFieldId,dependedVal);
		}
	},
	
	readValue:function(fieldElement){
		var value=this._fixValue();
		
		if(value){
			var range=this.filters[this.activeField.id];
			this.slider.setValue((value-range.min)/(range.max-range.min));
			
			LiveFields._activateFadeTimer();
			
			LiveFields.calculateDepended();
			LiveFields.onChange(this.activeField.id, value);
		}
	},
	
	//----------------- relations handling ----------------------
	
	setRel:function(primaryFieldId, dependedFieldId){
		if(typeof(this.filters[primaryFieldId])!='undefined' && typeof(this.filters[dependedFieldId])!='undefined'){
			this.filters[primaryFieldId].depended=dependedFieldId;
			this.filters[dependedFieldId].relFactor=parseFloat(document.getElementById(dependedFieldId).value)/parseFloat(document.getElementById(primaryFieldId).value)
		}
	},
	
	unsetRel:function(primaryFieldId){
		if(typeof(this.filters[primaryFieldId])!='undefined')
			this.filters[primaryFieldId].depended=false;
	},
	
	//--------------------- events ------------------------------
	
	onChange:function(paramName, value){},
	
	onInvalidValue:function(fieldElement){},
	
	onValidValue:function(fieldElement){}
}

//--------------------------- ControlAngle.js --------------------------

var ControlAngle={
	params:{},
	holder:null,
	face:null,
	knob:null,
	field:null,
	radius:0,
	centerX:0,
	centerY:0,
	currentValue:0,
	snapAngles:[0,45,90,135,180,225,270,315],
	snapThreshold:7,
	isDragging:false,
	dragMoveHandler:null,
	dragUpHandler:null,

	/*
	sample params
	{
	x:200,
	y:200,
	radius:104,
	markerWidth:30,
	markerHeight:30,
	skinPath:'assets/images/cslider/',
	cursorsPath:'/images/cursors/'
	}
	*/

	init:function(params){
		this.params=params;
		this.holder=document.getElementById(params.holderId);
		if(!this.holder){
			return;
		}
		this.face=document.getElementById('rotateDialFace');
		this.knob=document.getElementById('rotateDialKnob');
		this.field=document.getElementById('rotateAngleField');
		if(!this.face || !this.knob || !this.field){
			return;
		}

		this._computeGeometry();
		this._renderSnapDots();
		this._bindEvents();
		this.setValue(parseInt(params.value,10)||0);
	},

	showValue: function(degrees){
		if(!this.field || !this.knob){
			return;
		}
		this.currentValue=degrees;
		this.field.value=degrees;
		var r=degrees*Math.PI/180;
		var x=this.centerX+this.radius*Math.cos(r);
		var y=this.centerY+this.radius*Math.sin(r);
		this.knob.style.left=Math.round(x)+'px';
		this.knob.style.top=Math.round(y)+'px';
	},

	setValue:function(val){
		if(isNaN(val)){
			return;
		}
		val=((parseInt(val,10)%360)+360)%360;
		this.showValue(val);
		ControlParams.updateParam('angle',val);
	},

	getValue:function(){
		return this.currentValue;
	},

	readValue:function(){
		if(!this.field){
			return false;
		}
		var val=parseInt(this.field.value);
		if(isNaN(val)){
			Extensions.addCssClass(this.field, 'invalidValue');
			return false;
		}

		Extensions.removeCssClass(this.field, 'invalidValue');

		this.setValue(val);
	},

	_computeGeometry:function(){
		var w=this.face.offsetWidth||248;
		var h=this.face.offsetHeight||248;
		this.centerX=Math.round(w/2);
		this.centerY=Math.round(h/2);
		this.radius=Math.round(Math.min(w,h)/2)-12;
	},

	_renderSnapDots:function(){
		if(!this.face){
			return;
		}
		var i;
		for(i=0;i<this.snapAngles.length;i++){
			var a=this.snapAngles[i]*Math.PI/180;
			var d=document.createElement('span');
			d.className='rotateSnapDot';
			d.style.left=Math.round(this.centerX+this.radius*Math.cos(a))+'px';
			d.style.top=Math.round(this.centerY+this.radius*Math.sin(a))+'px';
			this.face.appendChild(d);
		}
	},

	_bindEvents:function(){
		var self=this;
		var startDrag=function(evt){
			self.isDragging=true;
			Extensions.removeCssClass(self.field,'invalidValue');
			Extensions.addCssClass(self.knob,'dragging');
			self._updateFromPointer(evt,true);
			self.dragMoveHandler=function(e){ self._updateFromPointer(e,true); };
			self.dragUpHandler=function(){
				self.isDragging=false;
				Extensions.removeCssClass(self.knob,'dragging');
				document.removeEventListener('mousemove',self.dragMoveHandler,false);
				document.removeEventListener('mouseup',self.dragUpHandler,false);
				document.removeEventListener('touchmove',self.dragMoveHandler,false);
				document.removeEventListener('touchend',self.dragUpHandler,false);
			};
			document.addEventListener('mousemove',self.dragMoveHandler,false);
			document.addEventListener('mouseup',self.dragUpHandler,false);
			document.addEventListener('touchmove',self.dragMoveHandler,false);
			document.addEventListener('touchend',self.dragUpHandler,false);
			if(evt && evt.preventDefault) evt.preventDefault();
			return false;
		};

		this.knob.onmousedown=startDrag;
		this.knob.ontouchstart=startDrag;

		this.field.onblur=function(){ self.readValue(); };
		this.field.onkeydown=function(e){
			var code=0;
			if(window.event) code=window.event.keyCode;
			else if(e) code=e.which;
			if(code==13 || code==9){
				self.readValue();
			}
		};
		if(this.field.addEventListener){
			this.field.addEventListener('input',function(){
				var v=parseInt(self.field.value,10);
				if(isNaN(v)){
					Extensions.addCssClass(self.field,'invalidValue');
					return;
				}
				Extensions.removeCssClass(self.field,'invalidValue');
				self.setValue(v);
			},false);
		}
	},

	_updateFromPointer:function(evt,applySnap){
		if(!this.face){
			return;
		}
		var p=this._pointerPos(evt);
		var facePos=Extensions.getPos(this.face);
		var x=p.x-facePos.x;
		var y=p.y-facePos.y;
		var angle=Math.atan2(y-this.centerY,x-this.centerX)*180/Math.PI;
		if(angle<0) angle+=360;
		angle=Math.round(angle);
		if(applySnap){
			angle=this._snap(angle);
		}
		this.setValue(angle);
	},

	_snap:function(angle){
		var i;
		var best=angle;
		var bestDist=999;
		for(i=0;i<this.snapAngles.length;i++){
			var s=this.snapAngles[i];
			var d=Math.abs(angle-s);
			if(d>180) d=360-d;
			if(d<bestDist){
				bestDist=d;
				best=s;
			}
		}
		if(bestDist<=this.snapThreshold){
			return best;
		}
		return angle;
	},

	_pointerPos:function(evt){
		var e=evt||window.event;
		if(e.touches && e.touches.length){
			e=e.touches[0];
		}
		return {
			x:e.pageX || (e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft),
			y:e.pageY || (e.clientY + document.body.scrollTop + document.documentElement.scrollTop)
		};
	}
}

//--------------------------- ControlUpload.js --------------------------

var ControlUpload={
	
	handlers:{},
	progressbar:null,
	compiledImageURL:'',
	handlerURL:'',
	lastRequestedURL:'',
	autoApplyTimer:null,
	
	init:function(handlers,progressbarId){
		this.handlers=handlers;
		this.progressbar=document.getElementById(progressbarId);
		
		try{
			this.ajaxHandler=new XMLHttpRequest();
		}catch (e){
			try{
				this.ajaxHandler=new ActiveXObject("Msxml2.XMLHTTP");
			}catch (e){
				try{
					this.ajaxHandler=new ActiveXObject("Microsoft.XMLHTTP");
				}catch (e){
					this._reportError('Sorry, but seems like your browser can not perform AJAX requests')
				}
			}
		}
	},
	
	request:function(action){
		var queryString='';
		
		var params=ControlParams.getAllParams();
		for(var property in params){
			queryString+='&p['+property+']='+encodeURI(params[property]);
		}
		
		queryString='?action='+action+queryString;
		
		var handler=this.handlers[action];
		if(!handler){
			return;
		}
		if(action=='apply' && handler && handler.ajax && (!handler.URL || handler.URL=='')){
			// Local/offline mode: no backend endpoint, apply preview tile directly.
			if(this._applyBgFromCanvas()){
				return;
			}
		}
		if(action=='download' && handler && handler.ajax && (!handler.URL || handler.URL=='')){
			// Local/offline mode: export current preview tile directly.
			if(this._downloadFromCanvas()){
				return;
			}
		}
		if(handler.ajax){
			this._showBar();
			this.lastRequestedURL=this.handlerURL+queryString;
			this.ajaxHandler.open("GET",handler.URL+queryString,true);
			this.ajaxHandler.onreadystatechange=function(){
				ControlUpload._receiveResponse();
			}
			this.ajaxHandler.send(null);
		}else{
			var frame=document.getElementById("communityFrame");
			if(typeof(frame)=='undefined' || !frame){
				top.document.location=handler.URL+queryString;
			}else{
				frame.src=handler.URL+queryString;
			}
		}
	},
	
	handleResponse:function(response){
		switch(response['action']){
			case 'apply':
				this.compiledImage=response.file;
				var buf = new Image();
				this.compiledImageURL=response.path+response.file+'.jpg';
				buf.src=this.compiledImageURL;
				buf.onload=function(){
					ControlUpload._applyBgImage();
				}
				break;
			case 'download':
				this.compiledImage=response.file;
				document.location='/download.php?file='+response.file;
				this._hideBar();
				break;
		}
	},
	
	_receiveResponse:function(){
		//Util.trace('>'+this.ajaxHandler.readyState)
		if(this.ajaxHandler.readyState==4){
			if(this.ajaxHandler.status==200){
				var mask=/success/im;
				if(this.ajaxHandler.responseText.match(mask)){
					var responseIsValid=true;
					try{
						eval('var response='+this.ajaxHandler.responseText);
					}catch(err){
						this._reportError('Inavalid response (0)');
						this._hideBar();
						responseIsValid=false
					}
					if(responseIsValid){
						if(response.success){
							//Util.printObj(response);
							ControlUpload.handleResponse(response);
						}else{
							this._reportError('Failed to perform action');
							this._hideBar();
						}
					}
				}else{
					this._reportError('Inavalid response (1)');
					if(this.lastRequestedURL && this.lastRequestedURL.indexOf('action=apply')!=-1){
						this._applyBgFromCanvas();
					}
					if(this.lastRequestedURL && this.lastRequestedURL.indexOf('action=download')!=-1){
						this._downloadFromCanvas();
					}
					this._hideBar();
				}
			}else{
				this._reportError('server error: '+this.ajaxHandler.status)
				if(this.lastRequestedURL && this.lastRequestedURL.indexOf('action=apply')!=-1){
					this._applyBgFromCanvas();
				}
				if(this.lastRequestedURL && this.lastRequestedURL.indexOf('action=download')!=-1){
					this._downloadFromCanvas();
				}
				this._hideBar();
			}
		}
	},
	
	_reportError:function(message){
		Util.trace(this.lastRequestedURL);
		Util.trace(message);
	},

	scheduleAutoApply:function(delayMs){
		var delay=(typeof delayMs=='number')?delayMs:120;
		if(this.autoApplyTimer){
			clearTimeout(this.autoApplyTimer);
		}
		this.autoApplyTimer=setTimeout(function(){
			ControlUpload.autoApplyTimer=null;
			ControlUpload._applyBgFromCanvas();
		},delay);
	},
	
	_applyBgImage:function(){
		document.getElementsByTagName('body')[0].style.background='url('+this.compiledImageURL+')';
		this._hideBar();
	},

	_applyBgFromCanvas:function(){
		try{
			var dataUrl=this._buildPatternDataUrl();
			if(!dataUrl) return false;
			var body=document.getElementsByTagName('body')[0];
			body.style.backgroundImage='url('+dataUrl+')';
			body.style.backgroundRepeat='repeat';
			body.style.backgroundPosition='0 0';
			this._hideBar();
			return true;
		}catch(err){
			return false;
		}
	},

	_downloadFromCanvas:function(){
		try{
			var dataUrl=this._buildPatternDataUrl();
			if(!dataUrl) return false;
			var a=document.createElement('a');
			var stamp=(new Date().getTime());
			a.href=dataUrl;
			a.download='bgpattern-'+stamp+'.png';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			this._hideBar();
			return true;
		}catch(err){
			return false;
		}
	},

	_buildPatternDataUrl:function(){
		var canvas=document.getElementById('screenObj');
		if(!canvas || !canvas.getContext){
			return '';
		}
		var sw=canvas.width||190;
		var sh=canvas.height||190;
		var tw=parseInt(ControlParams.getParam('canvasWidth'),10);
		var th=parseInt(ControlParams.getParam('canvasHeight'),10);
		if(isNaN(tw)) tw=sw;
		if(isNaN(th)) th=sh;
		if(tw<1) tw=1;
		if(th<1) th=1;
		if(tw>sw) tw=sw;
		if(th>sh) th=sh;

		var sx=Math.round((sw-tw)/2);
		var sy=Math.round((sh-th)/2);
		if(sx<0) sx=0;
		if(sy<0) sy=0;

		var tmp=document.createElement('canvas');
		tmp.width=tw;
		tmp.height=th;
		var tctx=tmp.getContext('2d');
		tctx.clearRect(0,0,tw,th);
		tctx.drawImage(canvas,sx,sy,tw,th,0,0,tw,th);
		return tmp.toDataURL('image/png');
	},
	
	_showBar:function(){
		this.progressbar.className='upload';
	},
	
	_hideBar:function(){
		this.progressbar.className='';
	}
}

//--------------------------- ControlLoad.js --------------------------

var ControlLoad={
	
	progressbar:null,
	ajaxHandler:null,
	lastRequestedConfId:'',
	handlerURL:'',
	
	init:function(handlerURL, progressbarId){
		this.progressbar=document.getElementById(progressbarId);
		this.handlerURL=handlerURL;
		
		try{
			this.ajaxHandler=new XMLHttpRequest();
		}catch (e){
			try{
				this.ajaxHandler=new ActiveXObject("Msxml2.XMLHTTP");
			}catch (e){
				try{
					this.ajaxHandler=new ActiveXObject("Microsoft.XMLHTTP");
				}catch (e){
					this._reportError('Sorry, but seems like your browser can not perform AJAX requests')
				}
			}
		}
	},
	
	loadConf:function(confId){
		var queryString='';
		
		/*if(confId==this.lastRequestedConfId)
			return;*/
			
		queryString='?action=load&confId='+confId;
		
		this._showBar();
		this.lastRequestedURL=this.handlerURL+queryString;
		this.ajaxHandler.open("GET",this.handlerURL+queryString,true);
		this.ajaxHandler.onreadystatechange=function(){
			ControlLoad._receiveResponse();
		}
		this.ajaxHandler.send(null);
		
	},
	
	handleResponse:function(response){
		document.getElementsByTagName('body')[0].style.background='url('+response.params.file+')';
		
		/*Util.clearDebug();
		Util.printObj(response.params);*/
		
		//colors
		ControlColors.set({
			fgColor:	response.params.fgColor,
			bgColor:	response.params.bgColor
		});
		
		//canvas width and height
		ControlSliders.setRel('canvasWidth', 'controlHeight');
		ControlSliders.setRel('controlHeight', 'canvasWidth');
		ControlSliders.set('canvasWidth',response.params.canvasWidth)
		ControlSliders.set('canvasHeight',response.params.canvasHeight)
				
		//texture
		ControlParams.updateParam('texture',response.params.texture);
		ControlParams.updateParam('textureOpacity',response.params.textureOpacity);
		
		//image
		ControlParams.updateParam('image',response.params.image);
		ControlSliders.set('imageOpacity',response.params.imageOpacity);
		ControlSliders.set('imageScale',response.params.imageScale);
		ControlParams.updateParam('angle',response.params.angle);
		ControlAngle.setValue(response.params.angle);
		ControlLoc.switchTo(response.params.imagesLocation);
		
		this.lastRequestedConfId=response.params.patternId;
		this._hideBar();
	},
	
	_receiveResponse:function(){
		//Util.trace('>'+this.ajaxHandler.readyState)
		if(this.ajaxHandler.readyState==4){
			if(this.ajaxHandler.status==200){
				var mask=/success/im;
				if(this.ajaxHandler.responseText.match(mask)){
					var responseIsValid=true;
					try{
						eval('var response='+this.ajaxHandler.responseText);
					}catch(err){
						this._reportError('Inavalid response (0)');
						this._hideBar();
						responseIsValid=false
					}
					if(responseIsValid){
						if(response.success){
							ControlLoad.handleResponse(response);
						}else{
							this._reportError('Failed to perform action');
							this._hideBar();
						}
					}
				}else{
					this._reportError('Inavalid response (1)');
					this._hideBar();
				}
			}else{
				this._reportError('server error: '+this.ajaxHandler.status)
				this._hideBar();
			}
		}
	},
	
	_reportError:function(message){
		Util.trace(this.lastRequestedURL);
		Util.trace(message);
	},
	
	_showBar:function(){
		this.progressbar.className='download';
	},
	
	_hideBar:function(){
		this.progressbar.className='';
	}
}


//--------------------------- CanvasScreen.js --------------------------

var CanvasScreen={
	canvas:null,
	ctx:null,
	state:null,
	imageMap:null,
	imageCache:null,
	textureCache:null,
	tintedCache:null,
	_tileCanvas:null,
	_scheduleId:null,

	attach:function(canvas){
		this.canvas=canvas;
		this.ctx=canvas.getContext('2d');
		this._setNoSmooth(this.ctx);
		this.imageMap=this._buildImageMap();
		this._applySVGThumbnails();
		this.imageCache={};
		this.textureCache={};
		this.tintedCache={};
		this.iconBoundsCache={};
		this.state={
			canvasWidth:127,
			canvasHeight:127,
			texture:3,
			textureOpacity:35,
			image:'scrolls-20',
			angle:0,
			imageScale:59,
			imageOpacity:52,
			imagesLocation:'diagonal',
			fgColor:'e9f2ea',
			bgColor:'577d5d'
		};
		return this._createApi();
	},

	_createApi:function(){
		var self=this;
		return {
			set_canvasWidth:function(v){self.state.canvasWidth=self._clampInt(v,1,512);self._schedule();},
			set_canvasHeight:function(v){self.state.canvasHeight=self._clampInt(v,1,512);self._schedule();},
			set_texture:function(v){self.state.texture=self._clampInt(v,0,5);self._schedule();},
			set_textureOpacity:function(v){self.state.textureOpacity=self._clampInt(v,0,100);self._schedule();},
			set_image:function(v){self.state.image=String(v);self._schedule();},
			set_angle:function(v){self.state.angle=self._clampInt(v,0,360);self._schedule();},
			set_imageScale:function(v){self.state.imageScale=self._clampInt(v,0,200);self._schedule();},
			set_imageOpacity:function(v){self.state.imageOpacity=self._clampInt(v,0,100);self._schedule();},
			set_imagesLocation:function(v){self.state.imagesLocation=String(v);self._schedule();},
			set_fgColor:function(v){self.state.fgColor=self._normalizeHex(String(v));self._schedule();},
			set_bgColor:function(v){self.state.bgColor=self._normalizeHex(String(v));self._schedule();}
		};
	},

	_schedule:function(){
		var self=this;
		if(this._scheduleId) return;
		this._scheduleId=setTimeout(function(){
			self._scheduleId=null;
			self.render();
		},0);
	},

		render:function(){
			if(!this.ctx || !this.canvas) return;
			var w=this.canvas.width;
			var h=this.canvas.height;
			if(!w || !h) return;
			var tile=this._renderTile();
			this.ctx.clearRect(0,0,w,h);
			// Match legacy SWF preview: show a centered tile inside the preview area.
			this.ctx.fillStyle='#f6f6f6';
			this.ctx.fillRect(0,0,w,h);
			if(!tile) return;
			var dx=Math.round((w-tile.width)/2);
			var dy=Math.round((h-tile.height)/2);
			this.ctx.drawImage(tile,dx,dy);
		},

	_renderTile:function(){
		var tw=this._clampInt(this.state.canvasWidth,1,512);
		var th=this._clampInt(this.state.canvasHeight,1,512);
		if(!this._tileCanvas){
			this._tileCanvas=document.createElement('canvas');
		}
		if(this._tileCanvas.width!=tw) this._tileCanvas.width=tw;
		if(this._tileCanvas.height!=th) this._tileCanvas.height=th;
		var tctx=this._tileCanvas.getContext('2d');
		this._setNoSmooth(tctx);
		tctx.clearRect(0,0,tw,th);

		// background
		tctx.fillStyle='#'+this._normalizeHex(this.state.bgColor);
		tctx.fillRect(0,0,tw,th);

		// texture overlay
		if(this.state.texture>0){
			var texSrc='assets/bgs/'+this.state.texture+'.png';
			var tex=this._getImage(texSrc);
			if(tex && tex.complete){
				tctx.save();
				tctx.globalAlpha=this.state.textureOpacity/100;
				var tpat=tctx.createPattern(tex,'repeat');
				tctx.fillStyle=tpat;
				tctx.fillRect(0,0,tw,th);
				tctx.restore();
			}
		}

		// icon pattern
		var imageId=this.state.image;
			var iconEntry=this.imageMap?this.imageMap[imageId]:null;
			if(iconEntry){
				var iconImg=this._getImage(iconEntry.svg||iconEntry.png||iconEntry.gif, iconEntry.png||iconEntry.gif);
			if(iconImg && iconImg.complete){
				var scale=this.state.imageScale/100;
					var bounds=this._getIconBounds(iconImg, imageId);
					var target=Math.max(1,Math.round(Math.min(tw,th)*scale));
					var maxSide=Math.max(1,Math.max(bounds.sw,bounds.sh));
					var iw=Math.max(1,Math.round(bounds.sw*target/maxSide));
					var ih=Math.max(1,Math.round(bounds.sh*target/maxSide));
					// Compensate trim asymmetry so icon remains visually centered when scaling.
					var sourceCx=bounds.sx+bounds.sw/2;
					var sourceCy=bounds.sy+bounds.sh/2;
					var fullCx=iconImg.width/2;
					var fullCy=iconImg.height/2;
					var offsetX=Math.round((sourceCx-fullCx)*target/maxSide);
					var offsetY=Math.round((sourceCy-fullCy)*target/maxSide);
					var useAlphaOnly=(iconImg.src&&iconImg.src.toLowerCase().indexOf('.svg')!=-1);
					var tint=this._getTinted(iconImg, bounds, iw, ih, this.state.fgColor, imageId, scale, useAlphaOnly);
					if(tint){
					tctx.save();
					tctx.globalAlpha=this.state.imageOpacity/100;
					var angle=(this.state.angle||0)*Math.PI/180;
					var mode=this._getLocationMode();
					var positions=[
						{x:0,y:0},
						{x:tw,y:0},
						{x:0,y:th},
						{x:tw,y:th}
					];
					if(mode=='diagonal'){
						positions.push({x:Math.round(tw/2),y:Math.round(th/2)});
					}

					for(var p=0; p<positions.length; p++){
						var cx=positions[p].x;
						var cy=positions[p].y;
						if(angle){
							tctx.save();
							tctx.translate(cx, cy);
							tctx.rotate(angle);
							tctx.drawImage(tint, -iw/2-offsetX, -ih/2-offsetY, iw, ih);
							tctx.restore();
						}else{
							tctx.drawImage(tint, cx-iw/2-offsetX, cy-ih/2-offsetY, iw, ih);
						}
					}
					tctx.restore();
				}
			}
		}

		return this._tileCanvas;
	},

	_applySVGThumbnails:function(){
		var items=document.getElementsByTagName('a');
		for(var i=0;i<items.length;i++){
			var a=items[i];
			if(!a.className || a.className.indexOf('imageItem')==-1) continue;
			var on=a.getAttribute('onclick')||'';
			var m=on.match(/updateParam\('image','([^']+)'\)/);
			if(!m) continue;
			var id=m[1];
			var entry=this.imageMap?this.imageMap[id]:null;
			if(!entry || !entry.svg) continue;
			var img=a.getElementsByTagName('img')[0];
			if(!img) continue;
			if(img._svgApplied) continue;
			img._svgApplied=true;
			img.style.width='100%';
			img.style.height='100%';
			img.style.objectFit='contain';
			img.style.display='block';
			img.style.padding='4px';
			img.style.boxSizing='border-box';
			img.onerror=function(){
				if(this._gifFallback){
					this.src=this._gifFallback;
					this._gifFallback='';
				}
			};
			img._gifFallback=entry.gif||'';
			img.src=entry.svg;
		}
	},

		_buildImageMap:function(){
			var map={};
			var items=document.getElementsByTagName('a');
			for(var i=0;i<items.length;i++){
				var a=items[i];
				if(!a.className || a.className.indexOf('imageItem')==-1) continue;
				var on=a.getAttribute('onclick')||'';
				var m=on.match(/updateParam\('image','([^']+)'\)/);
				if(!m) continue;
				var id=m[1];
				var img=a.getElementsByTagName('img')[0];
				if(img && img.getAttribute('src')){
					var gifSrc=img.getAttribute('src');
					map[id]={gif:gifSrc,png:this._toHQIconPath(id),svg:this._toSVGIconPath(id)};
				}
			}
			return map;
		},
		_toHQIconPath:function(imageId){
			var parts=String(imageId||'').split('-');
			if(parts.length<2) return '';
			return 'illustration/png_x4/icos/'+parts[0]+'/'+parts[1]+'.png';
		},
		_toSVGIconPath:function(imageId){
			var parts=String(imageId||'').split('-');
			if(parts.length<2) return '';
			return 'illustration/svg_icons/'+parts[0]+'/'+parts[1]+'.svg';
		},

		_getImage:function(src,fallbackSrc){
			if(!src) return null;
			var key=src+'|'+(fallbackSrc||'');
			if(this.imageCache[key]) return this.imageCache[key];
			var img=new Image();
			var self=this;
			img._fallback=fallbackSrc||'';
			img.onload=function(){self._schedule();};
			img.onerror=function(){
				if(this._fallback && this.src.indexOf(this._fallback)==-1){
					this.src=this._fallback;
					this._fallback='';
				}
			};
			img.src=src;
			this.imageCache[key]=img;
			return img;
		},

		_getIconBounds:function(img, imageId){
			if(this.iconBoundsCache[imageId]) return this.iconBoundsCache[imageId];
			var isSvg=(img && img.src && img.src.toLowerCase().indexOf('.svg')!=-1);
			var tmp=document.createElement('canvas');
			tmp.width=img.width;
			tmp.height=img.height;
			var tctx=tmp.getContext('2d');
			this._setNoSmooth(tctx);
			tctx.clearRect(0,0,tmp.width,tmp.height);
			tctx.drawImage(img,0,0);
			var sx=0, sy=0, ex=tmp.width-1, ey=tmp.height-1;
			try{
				var id=tctx.getImageData(0,0,tmp.width,tmp.height).data;
				var found=false;
					var lumCut=isSvg?238:245;
					var alphaCut=isSvg?24:1;
				var minX=tmp.width, minY=tmp.height, maxX=0, maxY=0;
				for(var y=0;y<tmp.height;y++){
					for(var x=0;x<tmp.width;x++){
						var i=(y*tmp.width+x)*4;
						var a=id[i+3];
						if(a<alphaCut) continue;
						var lum=(id[i]+id[i+1]+id[i+2])/3;
						if(lum>lumCut) continue;
						found=true;
						if(x<minX) minX=x;
						if(y<minY) minY=y;
						if(x>maxX) maxX=x;
						if(y>maxY) maxY=y;
					}
				}
				if(found){
					sx=minX; sy=minY; ex=maxX; ey=maxY;
					if(isSvg){
						if(ex-sx>2){sx=sx+1;ex=ex-1;}
						if(ey-sy>2){sy=sy+1;ey=ey-1;}
					}
				}
			}catch(err){
				// keep full image bounds
			}
			var bounds={sx:sx,sy:sy,sw:Math.max(1,ex-sx+1),sh:Math.max(1,ey-sy+1)};
			this.iconBoundsCache[imageId]=bounds;
			return bounds;
		},

		_getTinted:function(img, bounds, w, h, color, imageId, scale, useAlphaOnly){
			var hex=this._normalizeHex(color);
			var b=bounds||{sx:0,sy:0,sw:img.width,sh:img.height};
						var key=imageId+'|'+b.sx+','+b.sy+','+b.sw+','+b.sh+'|'+w+'x'+h+'|'+hex+'|'+(useAlphaOnly?'alpha':'lum');
			if(this.tintedCache[key]) return this.tintedCache[key];
			var c=document.createElement('canvas');
			c.width=w;
			c.height=h;
			var cctx=c.getContext('2d');
			this._setNoSmooth(cctx);
			cctx.clearRect(0,0,w,h);
			cctx.drawImage(img,b.sx,b.sy,b.sw,b.sh,0,0,w,h);

			if(useAlphaOnly){
				try{
					var rgbSvg=this._hexToRgb(hex);
					var idataSvg=cctx.getImageData(0,0,w,h);
					var ds=idataSvg.data;
					var cut=242;
					var edgeLow=80;
					for(var si=0;si<ds.length;si+=4){
						var sa=ds[si+3];
						if(!sa) continue;
						var sl=(ds[si]+ds[si+1]+ds[si+2])/3;
						if(sl>cut){
							ds[si+3]=0;
							continue;
						}
						ds[si]=rgbSvg.r;
						ds[si+1]=rgbSvg.g;
						ds[si+2]=rgbSvg.b;
						var lf=(cut-sl)/(cut-edgeLow);
						if(lf<0) lf=0;
						if(lf>1) lf=1;
						lf=Math.pow(lf,1.45);
						var sa2=Math.round(sa*lf);
						if(sa2<14) sa2=0;
						ds[si+3]=sa2;
					}
					cctx.putImageData(idataSvg,0,0);
				}catch(err){
					cctx.globalCompositeOperation='source-in';
					cctx.fillStyle='#'+hex;
					cctx.fillRect(0,0,w,h);
					cctx.globalCompositeOperation='source-over';
				}
				this.tintedCache[key]=c;
				return c;
			}

			try{
				var rgb=this._hexToRgb(hex);
				var idata=cctx.getImageData(0,0,w,h);
				var d=idata.data;
				var low=165;
				var high=246;
				var gamma=1.25;
				for(var i=0;i<d.length;i+=4){
					var a=d[i+3];
					if(!a) continue;
					var lum=(d[i]+d[i+1]+d[i+2])/3;
					var t=(high-lum)/(high-low);
					if(t<0) t=0;
					if(t>1) t=1;
					t=Math.pow(t,gamma);
					d[i]=rgb.r;
					d[i+1]=rgb.g;
					d[i+2]=rgb.b;
					d[i+3]=Math.round(a*t);
				}
				cctx.putImageData(idata,0,0);
			}catch(err){
				cctx.clearRect(0,0,w,h);
				cctx.drawImage(img,b.sx,b.sy,b.sw,b.sh,0,0,w,h);
				cctx.globalCompositeOperation='source-in';
				cctx.fillStyle='#'+hex;
				cctx.fillRect(0,0,w,h);
				cctx.globalCompositeOperation='source-over';
			}

			this.tintedCache[key]=c;
			return c;
		},

		_getLocationMode:function(){
			var mode=String(this.state.imagesLocation||'').toLowerCase();
			if(mode=='diagonal' || mode=='straight') return mode;
			var loc=document.getElementById('locModes');
			if(loc && loc.className){
				if(loc.className.indexOf('locmode_diagonal')!=-1) return 'diagonal';
				if(loc.className.indexOf('locmode_straight')!=-1) return 'straight';
			}
			return 'diagonal';
		},

		_hexToRgb:function(hex){
			return {
				r:parseInt(hex.substr(0,2),16)||0,
				g:parseInt(hex.substr(2,2),16)||0,
				b:parseInt(hex.substr(4,2),16)||0
			};
		},

		_setNoSmooth:function(ctx){
			if(!ctx) return;
			ctx.imageSmoothingEnabled=false;
			ctx.mozImageSmoothingEnabled=false;
			ctx.webkitImageSmoothingEnabled=false;
			ctx.msImageSmoothingEnabled=false;
		},

	_clampInt:function(v,min,max){
		var n=parseInt(v,10);
		if(isNaN(n)) n=min;
		if(n<min) n=min;
		if(n>max) n=max;
		return n;
	},

	_normalizeHex:function(val){
		var s=String(val).replace(/[^0-9a-fA-F]/g,'');
		if(s.length==3){
			s=s[0]+s[0]+s[1]+s[1]+s[2]+s[2];
		}
		while(s.length<6){
			s=s+'0';
		}
		return s.substr(0,6).toLowerCase();
	}
};

//--------------------------- ControlShare.js --------------------------

var ControlShare={
	savedUrlsKey:'patternator.savedUrls',
	thumbTextureCache:{},
	thumbIconCache:{},
	thumbTintCache:{},

	_getCurrentUrl:function(){
		UrlState.syncNow(ControlParams.getAllParams());
		return window.location.href;
	},

	_getSavedUrls:function(){
		try{
			var raw=localStorage.getItem(this.savedUrlsKey);
			var list=raw?JSON.parse(raw):[];
			if(!list || typeof(list.length)==='undefined'){
				return [];
			}
			return list;
		}catch(err){
			return [];
		}
	},

	_setSavedUrls:function(list){
		localStorage.setItem(this.savedUrlsKey,JSON.stringify(list));
	},

	_parseSavedParams:function(url){
		var out={
			canvasWidth:127,
			canvasHeight:127,
			texture:0,
			textureOpacity:35,
			image:'scrolls-1',
			angle:0,
			imageScale:59,
			imageOpacity:52,
			imagesLocation:'straight',
			fgColor:'e9f2ea',
			bgColor:'577d5d'
		};
		try{
			var u=new URL(url,window.location.href);
			var params=new URLSearchParams(u.search);
			for(var i=0;i<UrlState.keys.length;i++){
				var k=UrlState.keys[i];
				var v=UrlState._getQueryValue(params,k);
				if(v===null) continue;
				var clean=UrlState._sanitize(k,v,ControlParams.fields||initialValues);
				if(clean===null) continue;
				out[k]=clean;
			}
		}catch(err){}
		return out;
	},

	_getTextureThumbImage:function(textureId){
		var id=parseInt(textureId,10);
		if(isNaN(id) || id<1 || id>5){
			return null;
		}
		var src='assets/bgs/'+id+'.png';
		if(this.thumbTextureCache[src]){
			return this.thumbTextureCache[src];
		}
		var img=new Image();
		var self=this;
		img.onload=function(){
			self.renderSavedList();
		};
		img.onerror=function(){};
		img.src=src;
		this.thumbTextureCache[src]=img;
		return img;
	},

	_getIconThumbImage:function(imageId){
		var parts=String(imageId||'').split('-');
		if(parts.length<2){
			return null;
		}
		var svgSrc='illustration/svg_icons/'+parts[0]+'/'+parts[1]+'.svg';
		var pngSrc='illustration/png_x4/icos/'+parts[0]+'/'+parts[1]+'.png';
		var key=svgSrc+'|'+pngSrc;
		if(this.thumbIconCache[key]){
			return this.thumbIconCache[key];
		}
		var img=new Image();
		var self=this;
		img._fallback=pngSrc;
		img.onload=function(){
			self.renderSavedList();
		};
		img.onerror=function(){
			if(this._fallback && this.src.indexOf(this._fallback)===-1){
				this.src=this._fallback;
			}
		};
		img.src=svgSrc;
		this.thumbIconCache[key]=img;
		return img;
	},

	_getTintedThumbIcon:function(imageId, iconImg, w, h, hex){
		if(!iconImg || !iconImg.complete || !iconImg.width || !iconImg.height){
			return null;
		}
		var key=String(imageId||'')+'|'+w+'x'+h+'|'+hex;
		if(this.thumbTintCache[key]){
			return this.thumbTintCache[key];
		}
		var c=document.createElement('canvas');
		c.width=w;
		c.height=h;
		var cctx=c.getContext('2d');
		cctx.clearRect(0,0,w,h);
		cctx.drawImage(iconImg,0,0,w,h);
		cctx.globalCompositeOperation='source-in';
		cctx.fillStyle='#'+hex;
		cctx.fillRect(0,0,w,h);
		cctx.globalCompositeOperation='source-over';
		this.thumbTintCache[key]=c;
		return c;
	},

	_drawThumb:function(canvas, params){
		if(!canvas || !canvas.getContext) return;
		var ctx=canvas.getContext('2d');
		var size=canvas.width;
		var bg=String(params.bgColor||'577d5d').replace(/[^0-9a-fA-F]/g,'').toLowerCase();
		var fg=String(params.fgColor||'e9f2ea').replace(/[^0-9a-fA-F]/g,'').toLowerCase();
		if(bg.length===3) bg=bg[0]+bg[0]+bg[1]+bg[1]+bg[2]+bg[2];
		if(fg.length===3) fg=fg[0]+fg[0]+fg[1]+fg[1]+fg[2]+fg[2];
		while(bg.length<6) bg+='0';
		while(fg.length<6) fg+='0';
		bg=bg.substr(0,6);
		fg=fg.substr(0,6);

		ctx.clearRect(0,0,size,size);
		ctx.fillStyle='#'+bg;
		ctx.fillRect(0,0,size,size);

		var texImg=this._getTextureThumbImage(params.texture);
		if(texImg && texImg.complete){
			ctx.save();
			var to=parseInt(params.textureOpacity,10);
			if(isNaN(to)) to=35;
			ctx.globalAlpha=Math.max(0,Math.min(1,to/100));
			ctx.fillStyle=ctx.createPattern(texImg,'repeat');
			ctx.fillRect(0,0,size,size);
			ctx.restore();
		}

		var iconImg=this._getIconThumbImage(params.image);
		if(iconImg && iconImg.complete && iconImg.width && iconImg.height){
			var io=parseInt(params.imageOpacity,10);
			if(isNaN(io)) io=52;
			var angle=(parseInt(params.angle,10)||0)*Math.PI/180;
			var scale=parseInt(params.imageScale,10);
			if(isNaN(scale)) scale=59;
			var target=Math.max(1,Math.round(size*Math.max(0.05,Math.min(2,scale/100))));
			var bounds={sx:0,sy:0,sw:iconImg.width,sh:iconImg.height};
			if(CanvasScreen && CanvasScreen._getIconBounds){
				try{
					bounds=CanvasScreen._getIconBounds(iconImg, params.image||'thumb');
				}catch(err){}
			}
			var maxSide=Math.max(1,Math.max(bounds.sw,bounds.sh));
			var iw=Math.max(1,Math.round(bounds.sw*target/maxSide));
			var ih=Math.max(1,Math.round(bounds.sh*target/maxSide));
			var sourceCx=bounds.sx+bounds.sw/2;
			var sourceCy=bounds.sy+bounds.sh/2;
			var fullCx=iconImg.width/2;
			var fullCy=iconImg.height/2;
			var offsetX=Math.round((sourceCx-fullCx)*target/maxSide);
			var offsetY=Math.round((sourceCy-fullCy)*target/maxSide);

			var tinted=null;
			if(CanvasScreen && CanvasScreen._getTinted){
				try{
					tinted=CanvasScreen._getTinted(iconImg,bounds,iw,ih,fg,params.image||'thumb',scale/100,false);
				}catch(err){}
			}
			if(!tinted){
				tinted=this._getTintedThumbIcon(params.image,iconImg,iw,ih,fg);
			}
			if(!tinted){
				return;
			}

			var drawIconAt=function(x,y){
				ctx.save();
				ctx.translate(x,y);
				ctx.rotate(angle);
				ctx.globalAlpha=Math.max(0,Math.min(1,io/100));
				ctx.drawImage(tinted,-iw/2-offsetX,-ih/2-offsetY,iw,ih);
				ctx.restore();
			};

			drawIconAt(0,0);
			drawIconAt(size,0);
			drawIconAt(0,size);
			drawIconAt(size,size);
			if(String(params.imagesLocation||'').toLowerCase()==='diagonal'){
				drawIconAt(Math.round(size/2),Math.round(size/2));
			}
		}
	},

	_promptCopy:function(url){
		window.prompt('Copy this URL:',url);
	},

	_copyCurrentUrl:function(url){
		var self=this;
		if(navigator.clipboard && navigator.clipboard.writeText){
			navigator.clipboard.writeText(url).then(function(){
				alert('Link copied to clipboard.');
			},function(){
				self._promptCopy(url);
			});
			return true;
		}
		try{
			var ta=document.createElement('textarea');
			ta.value=url;
			ta.setAttribute('readonly','readonly');
			ta.style.position='fixed';
			ta.style.left='-9999px';
			document.body.appendChild(ta);
			ta.select();
			ta.setSelectionRange(0,ta.value.length);
			var ok=document.execCommand('copy');
			document.body.removeChild(ta);
			if(ok){
				alert('Link copied to clipboard.');
			}else{
				self._promptCopy(url);
			}
			return true;
		}catch(err){
			self._promptCopy(url);
			return false;
		}
	},

	shareCurrent:function(){
		var url=this._getCurrentUrl();
		if(navigator.share){
			navigator.share({title:'Patternator',url:url}).catch(function(){});
			return false;
		}
		this._copyCurrentUrl(url);
		return false;
	},

	saveCurrent:function(){
		var url=this._getCurrentUrl();
		try{
			var list=this._getSavedUrls();
			for(var i=0;i<list.length;i++){
				if(list[i]===url){
					alert('This URL is already saved locally.');
					this.renderSavedList();
					return false;
				}
			}
			list.unshift(url);
			if(list.length>100){
				list=list.slice(0,100);
			}
			this._setSavedUrls(list);
			this.renderSavedList();
			alert('Current URL saved locally.');
		}catch(err){
			alert('Unable to save locally in this browser.');
		}
		return false;
	},

	removeSaved:function(index){
		var list=this._getSavedUrls();
		if(index<0 || index>=list.length){
			return false;
		}
		list.splice(index,1);
		this._setSavedUrls(list);
		this.renderSavedList();
		return false;
	},

	clearSaved:function(){
		try{
			localStorage.removeItem(this.savedUrlsKey);
		}catch(err){}
		this.renderSavedList();
		return false;
	},

	applySavedUrl:function(url){
		var params=this._parseSavedParams(url);

		try{
			ControlColors.set({
				fgColor:params.fgColor,
				bgColor:params.bgColor
			});
		}catch(err){}

		var sliderParams=['canvasWidth','canvasHeight','textureOpacity','imageOpacity','imageScale'];
		for(var i=0;i<sliderParams.length;i++){
			var key=sliderParams[i];
			try{
				ControlSliders.set(key,params[key]);
			}catch(err){
				try{
					var field=document.getElementById(key);
					if(field) field.value=params[key];
					ControlParams.updateParam(key,params[key]);
				}catch(err2){}
			}
		}

		ControlParams.updateParam('texture',params.texture);
		ControlParams.updateParam('image',params.image);
		ControlParams.updateParam('angle',params.angle);
		if(typeof(ControlAngle)!='undefined' && ControlAngle.setValue){
			ControlAngle.setValue(params.angle);
		}

		var mode=String(params.imagesLocation||'straight').toLowerCase();
		mode=(mode==='diagonal')?'diagonal':'straight';
		if(typeof(ControlLoc)!='undefined' && ControlLoc.switchTo){
			ControlLoc.switchTo(mode);
		}else{
			ControlParams.updateParam('imagesLocation',mode);
		}

		UrlState.syncNow(ControlParams.getAllParams());
		return false;
	},

	renderSavedList:function(){
		var listNode=document.getElementById('savedPatternsList');
		var emptyNode=document.getElementById('savedPatternsEmpty');
		if(!listNode || !emptyNode){
			return;
		}

		var list=this._getSavedUrls();
		listNode.innerHTML='';

		if(!list.length){
			emptyNode.style.display='block';
			return;
		}
		emptyNode.style.display='none';

		for(var i=0;i<list.length;i++){
			var url=list[i];
			var params=this._parseSavedParams(url);
			var li=document.createElement('li');
			li.className='savedItem';

			var thumb=document.createElement('canvas');
			thumb.className='savedThumb';
			thumb.width=80;
			thumb.height=80;
			this._drawThumb(thumb,params);
			var thumbLink=document.createElement('a');
			thumbLink.href=url;
			thumbLink.title=url;
			thumbLink.className='savedThumbLink';
			thumbLink.onclick=(function(targetUrl){
				return function(e){
					if(e && (e.ctrlKey || e.metaKey || e.shiftKey || e.button===1)){
						return true;
					}
					return ControlShare.applySavedUrl(targetUrl);
				};
			})(url);
			thumbLink.appendChild(thumb);
			li.appendChild(thumbLink);

			var actions=document.createElement('span');
			actions.className='savedItemActions';

			var copyLink=document.createElement('a');
			copyLink.href='#';
			copyLink.className='savedActionCopy';
			copyLink.title='Copy URL';
			copyLink.appendChild(document.createTextNode('copy'));
			copyLink.onclick=(function(targetUrl){
				return function(){
					ControlShare._copyCurrentUrl(targetUrl);
					return false;
				};
			})(url);

			var removeLink=document.createElement('a');
			removeLink.href='#';
			removeLink.className='savedActionRemove';
			removeLink.title='Remove saved URL';
			removeLink.appendChild(document.createTextNode('remove'));
			removeLink.onclick=(function(idx){
				return function(){
					return ControlShare.removeSaved(idx);
				};
			})(i);

			actions.appendChild(copyLink);
			actions.appendChild(removeLink);
			li.appendChild(actions);

			listNode.appendChild(li);
		}
	}
};

//--------------------------- UrlState.js --------------------------

var UrlState={
	keys:[
		'canvasWidth','canvasHeight','texture','textureOpacity',
		'image','angle','imageScale','imageOpacity','imagesLocation',
		'fgColor','bgColor'
	],
	shortKeys:{
		canvasWidth:'cw',
		canvasHeight:'ch',
		texture:'tx',
		textureOpacity:'to',
		image:'im',
		angle:'ag',
		imageScale:'is',
		imageOpacity:'io',
		imagesLocation:'il',
		fgColor:'fg',
		bgColor:'bg'
	},
	_timer:null,

	_has:function(k){
		for(var i=0;i<this.keys.length;i++){
			if(this.keys[i]===k) return true;
		}
		return false;
	},

	_isColorKey:function(k){
		return k==='fgColor' || k==='bgColor';
	},

	_getQueryValue:function(params,longKey){
		if(params.has(longKey)) return params.get(longKey);
		var shortKey=this.shortKeys[longKey];
		if(shortKey && params.has(shortKey)) return params.get(shortKey);
		return null;
	},

	hasUrlParams:function(){
		try{
			if(!window.location || !window.location.search) return false;
			var params=new URLSearchParams(window.location.search);
			for(var i=0;i<this.keys.length;i++){
				var k=this.keys[i];
				if(params.has(k)) return true;
				var sk=this.shortKeys[k];
				if(sk && params.has(sk)) return true;
			}
		}catch(err){}
		return false;
	},

	_sanitize:function(k,v,fields){
		if(v===null || typeof(v)==='undefined') return null;
		v=String(v);
		if(this._isColorKey(k)){
			v=v.replace(/[^0-9a-fA-F]/g,'').toLowerCase();
			if(v.length===3){
				v=v[0]+v[0]+v[1]+v[1]+v[2]+v[2];
			}
			if(v.length!==6) return null;
			return v;
		}
		var def=fields&&fields[k]?fields[k]:null;
		if(def && typeof(def.min)!=='undefined' && typeof(def.max)!=='undefined'){
			var n=parseInt(v,10);
			if(isNaN(n)) return null;
			if(n<def.min) n=def.min;
			if(n>def.max) n=def.max;
			return String(n);
		}
		return v;
	},

	applyToInitialValues:function(fields){
		try{
			if(!window.location || !window.location.search) return;
			var params=new URLSearchParams(window.location.search);
			for(var i=0;i<this.keys.length;i++){
				var k=this.keys[i];
				if(!fields[k]) continue;
				var raw=this._getQueryValue(params,k);
				if(raw===null) continue;
				var clean=this._sanitize(k,raw,fields);
				if(clean!==null){
					fields[k].value=clean;
				}
			}
		}catch(err){}
	},

	syncNow:function(fields){
		try{
			if(!window.history || !window.history.replaceState || !fields) return;
			var q=new URLSearchParams();
			for(var i=0;i<this.keys.length;i++){
				var k=this.keys[i];
				if(typeof(fields[k])==='undefined') continue;
				var clean=this._sanitize(k,fields[k],ControlParams.fields||initialValues);
				if(clean!==null){
					var outKey=this.shortKeys[k]||k;
					q.set(outKey,clean);
				}
			}
			var base=window.location.pathname;
			var next=base+(q.toString()?('?'+q.toString()):'');
			window.history.replaceState(null,'',next);
		}catch(err){}
	},

	scheduleSync:function(fields){
		var self=this;
		if(this._timer) clearTimeout(this._timer);
		this._timer=setTimeout(function(){
			self._timer=null;
			self.syncNow(fields);
		},0);
	}
};

var DynamicFavicon={
	_version:0,

	_sanitizeHex:function(value){
		var hex=String(value||'').replace(/[^0-9a-fA-F]/g,'').toLowerCase();
		if(hex.length===3){
			hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		if(hex.length!==6){
			return 'e9f2ea';
		}
		return hex;
	},

	applyFromColor:function(value){
		var hex=this._sanitizeHex(value);
		this._version++;
		var href='./assets/images/favicon.php?c='+hex+'&v='+this._version;
		var head=document.getElementsByTagName('head')[0];

		var link=document.getElementById('dynamicFavicon');
		if(!link){
			link=document.createElement('link');
			link.id='dynamicFavicon';
			link.rel='icon';
			link.type='image/svg+xml';
			head.appendChild(link);
		}
		link.href=href;

		var shortcut=document.getElementById('dynamicFaviconShortcut');
		if(!shortcut){
			shortcut=document.createElement('link');
			shortcut.id='dynamicFaviconShortcut';
			shortcut.rel='shortcut icon';
			shortcut.type='image/svg+xml';
			head.appendChild(shortcut);
		}
		shortcut.href=href;
	}
};

//--------------------------- ControlParams.js --------------------------

var ControlParams={
	syncCavasSize:true,
	screen:null,
	
	/*
	Sample configuration
	{
		canvasWidth:	{min:50,	max:190,	value:150},
		canvasHeight:	{min:50,	max:190,	value:80},
		textureOpacity:	{min:0,		max:100,	value:20},
		
		imageScale:		{min:5,		max:100,	value:50},
		imageOpacity:	{min:0,		max:100,	value:50},
		
		fgColor:		{value: 	'ffffff'},
		bgColor:		{value: 	'990000'}
	}
	*/
	
	
	init:function(fields){
		this.screen=document.getElementById(navigator.appVersion.match(/MSIE/i)?'screenObjIE':'screenObj');
		if(this.screen && this.screen.tagName && this.screen.tagName.toLowerCase()=='canvas'){
			this.screen=CanvasScreen.attach(this.screen);
		}
		this.fields=fields;
		for(var paramName in this.fields){
			this.setParam(paramName, this.fields[paramName].value);
		}
	},

	renderParam:function(paramName,value){
		//Util.ctrace(paramName);
		setTimeout(function(){
			try{	
				ControlParams.screen['set_'+paramName](value);
			}catch(err){
				Util.trace('err: '+paramName+' = '+value+' ('+err+')')
			}
		},1);
	},
	
	updateParam:function(paramName,value){
		var previousValue=this.fields[paramName].value;
		this.fields[paramName].value=value;
		if(paramName=='bgColor'){
			DynamicFavicon.applyFromColor(value);
		}
		UrlState.scheduleSync(this.getAllParams());
		if(!designerIsClosed)
			this.renderParam(paramName, this.fields[paramName].value)
		if(previousValue!==value){
			ControlUpload.scheduleAutoApply(140);
		}
	},
	
	getAllParams:function(){
		var ret={};
		for(var property in this.fields){
			ret[property]=this.fields[property].value;
		}
		return ret;
	},
	
	getParam:function(paramName){
		var element=document.getElementById(paramName);
		if(element)
			return element.value;
		else
			return this.fields[paramName].value;
	},
	
	setParam:function(paramName, value){
		var element=document.getElementById(paramName);
		if(element)
			element.value=value;
	},
	
	renderAllParams:function(){
		this.screen=document.getElementById(navigator.appVersion.match(/MSIE/i)?'screenObjIE':'screenObj');
		if(this.screen && this.screen.tagName && this.screen.tagName.toLowerCase()=='canvas'){
			this.screen=CanvasScreen.attach(this.screen);
		}
		for(var paramName in this.fields){
			this.renderParam(paramName, this.fields[paramName].value)
		}
	}
}

//--------------------------- ControlWindow.js --------------------------

var ControlWindow={
	
	opened:			true,
	pane:			null,
	closedCssClass:	'closed',
	switcher:		null,
	titleOpen:		'open',	
	titleClose:		'close',	
	
	init:function(paneId,closedCssClass,switcherId,titleOpen,titleClose,opened){
		this.opened=opened;
		this.pane=document.getElementById(paneId);
		this.closedCssClass=closedCssClass;
		this.switcher=document.getElementById(switcherId);
		this.titleOpen=titleOpen;
		this.titleClose=titleClose;

		if(!this.pane || !this.switcher){
			// Required layout nodes missing (page trimmed). Skip window init.
			return;
		}

		if(this.opened)
			this.open();
		else
			this.close();
	},
	
	open:function(){
		if(!this.pane || !this.switcher){
			return;
		}
		this.opened=true;
		this.switcher.innerHTML=this.titleOpen;
		Extensions.removeCssClass(this.pane, this.closedCssClass);
		designerIsClosed=false;
		Extensions.scrollToTop();
	},
	
	close:function(){
		if(!this.pane || !this.switcher){
			return;
		}
		this.opened=false;
		this.switcher.innerHTML=this.titleClose;
		Extensions.addCssClass(this.pane, this.closedCssClass);
		designerIsClosed=true;
		Extensions.scrollToTop();
	},
	
	switchMode:function(){
		if(!this.opened)
			this.open();
		else
			this.close();
	}
}

//--------------------------- ControlLoc.js --------------------------

var ControlLoc={
	selectedMode:'locmode',
	cssClassPrefix:'',
	modes:{},
	switcher:null,
	
	init:function(switcherId,cssClassPrefix,modes,selectedMode){
		this.switcher=document.getElementById(switcherId);
		this.cssClassPrefix=cssClassPrefix;
		this.modes=modes;
		
		this.switchTo(selectedMode);
	},
	
	switchTo:function(mode){
			for(var key in this.modes){
				Extensions.removeCssClass(this.switcher, this.cssClassPrefix+key);
			}
			Extensions.addCssClass(this.switcher, this.cssClassPrefix+mode);
		ControlParams.updateParam('imagesLocation',this.modes[mode]);
		this.selectedMode=mode;		
	}
}

//--------------------------- CanvasTabControls.js --------------------------

var CanvasTabControls={
	_clamp:function(v,min,max){
		var n=parseInt(v,10);
		if(isNaN(n)) return null;
		if(n<min) n=min;
		if(n>max) n=max;
		return n;
	},

	_isLinked:function(){
		var flag=document.getElementById('canvasPropFlag');
		return !!(flag && String(flag.className).indexOf('propFlagActive')!=-1);
	},

	_applySize:function(sourceField){
		var w=document.getElementById('canvasWidth');
		var h=document.getElementById('canvasHeight');
		var range=document.getElementById('canvasSizeRange');
		if(!w || !h || !range) return;

		var wv=this._clamp(w.value,0,190);
		var hv=this._clamp(h.value,0,190);

		if(wv===null){ Extensions.addCssClass(w,'invalidValue'); }
		else{ Extensions.removeCssClass(w,'invalidValue'); }
		if(hv===null){ Extensions.addCssClass(h,'invalidValue'); }
		else{ Extensions.removeCssClass(h,'invalidValue'); }

		if(this._isLinked()){
			var base=null;
			if(sourceField===h && hv!==null) base=hv;
			else if(wv!==null) base=wv;
			else if(hv!==null) base=hv;
			if(base===null) return;
			wv=base;
			hv=base;
		}

		if(wv!==null){
			w.value=wv;
			ControlParams.updateParam('canvasWidth',wv);
		}
		if(hv!==null){
			h.value=hv;
			ControlParams.updateParam('canvasHeight',hv);
		}
		if(wv!==null) range.value=wv;
	},

	_bindSize:function(){
		var self=this;
		var w=document.getElementById('canvasWidth');
		var h=document.getElementById('canvasHeight');
		var range=document.getElementById('canvasSizeRange');
		if(!w || !h || !range) return;

		range.min=0;
		range.max=190;
		var initial=self._clamp(w.value,0,190);
		if(initial===null) initial=0;
		range.value=initial;

		range.oninput=function(){
			var v=self._clamp(this.value,0,190);
			if(v===null) return;
			w.value=v;
			h.value=v;
			Extensions.removeCssClass(w,'invalidValue');
			Extensions.removeCssClass(h,'invalidValue');
			ControlParams.updateParam('canvasWidth',v);
			ControlParams.updateParam('canvasHeight',v);
		};
		range.onchange=range.oninput;

		var bindField=function(field){
			var onApply=function(){ self._applySize(field); };
			if(field.addEventListener){
				field.addEventListener('input',onApply,false);
				field.addEventListener('change',onApply,false);
				field.addEventListener('keydown',function(e){
					var code=e&&e.which?e.which:(window.event?window.event.keyCode:0);
					if(code==13){
						onApply();
					}
				},false);
			}else{
				field.onkeyup=onApply;
				field.onchange=onApply;
			}
		};
		bindField(w);
		bindField(h);
	},

	_bindTextureOpacity:function(){
		var self=this;
		var field=document.getElementById('textureOpacity');
		var range=document.getElementById('textureOpacityRange');
		if(!field || !range) return;

		range.min=0;
		range.max=100;
		var initial=self._clamp(field.value,0,100);
		if(initial===null) initial=0;
		field.value=initial;
		range.value=initial;

		var sync=function(v){
			field.value=v;
			range.value=v;
			Extensions.removeCssClass(field,'invalidValue');
			ControlParams.updateParam('textureOpacity',v);
		};

		range.oninput=function(){
			var v=self._clamp(this.value,0,100);
			if(v===null) return;
			sync(v);
		};
		range.onchange=range.oninput;

		var onField=function(){
			var v=self._clamp(field.value,0,100);
			if(v===null){
				Extensions.addCssClass(field,'invalidValue');
				return;
			}
			sync(v);
		};
		if(field.addEventListener){
			field.addEventListener('input',onField,false);
			field.addEventListener('change',onField,false);
		}else{
			field.onkeyup=onField;
			field.onchange=onField;
		}
	},

	init:function(){
		this._bindSize();
		this._bindTextureOpacity();
	}
}
//--------------------------- ImageTabControls.js --------------------------

var ImageTabControls={
	pairs:{
		imageScale:{min:0,max:100},
		imageOpacity:{min:0,max:100}
	},

	_clamp:function(v,min,max){
		var n=parseInt(v,10);
		if(isNaN(n)) return null;
		if(n<min) n=min;
		if(n>max) n=max;
		return n;
	},

	_sync:function(paramName,value){
		var field=document.getElementById(paramName);
		var range=document.getElementById(paramName+'Range');
		if(!field || !range) return;
		field.value=value;
		range.value=value;
		Extensions.removeCssClass(field,'invalidValue');
		ControlParams.updateParam(paramName,value);
	},

	_bindPair:function(paramName,min,max){
		var self=this;
		var field=document.getElementById(paramName);
		var range=document.getElementById(paramName+'Range');
		if(!field || !range) return;

		var initial=self._clamp(field.value,min,max);
		if(initial===null) initial=min;
		range.min=min;
		range.max=max;
		range.value=initial;
		field.value=initial;

		range.oninput=function(){
			var v=self._clamp(this.value,min,max);
			if(v===null) return;
			self._sync(paramName,v);
		};
		range.onchange=range.oninput;

		var onFieldInput=function(){
			var v=self._clamp(field.value,min,max);
			if(v===null){
				Extensions.addCssClass(field,'invalidValue');
				return;
			}
			self._sync(paramName,v);
		};
		if(field.addEventListener){
			field.addEventListener('input',onFieldInput,false);
			field.addEventListener('change',onFieldInput,false);
		}else{
			field.onkeyup=onFieldInput;
			field.onchange=onFieldInput;
		}
	},

	init:function(){
		for(var paramName in this.pairs){
			var cfg=this.pairs[paramName];
			this._bindPair(paramName,cfg.min,cfg.max);
		}
	}
}
//--------------------------- init-index.js --------------------------


function renderAllParams(){
	ControlParams.renderAllParams();
}

function ftrace(str,clear){
	if(typeof(clear)!='undefined')
		Util.clearDebug();
	Util.trace('flash:'+str);
}

var designerIsClosed=false;

function init(){
	
	Extensions.removeCssClass(document.getElementById("wrapper"),'invisible');
	UrlState.applyToInitialValues(initialValues);
	DynamicFavicon.applyFromColor(initialValues.bgColor.value);
	document.getElementsByTagName('body')[0].style.background='url(assets/permanents/defaultPattern.jpg) #222';
	var logo=document.getElementById('logo');
	if(logo){
		logo.onclick=function(){
			var body=document.getElementsByTagName('body')[0];
			if(String(body.className||'').indexOf('blocksFaded')!=-1){
				Extensions.removeCssClass(body,'blocksFaded');
			}else{
				Extensions.addCssClass(body,'blocksFaded');
			}
			return false;
		};
	}
	
	//------------------------ init tabs -----------------------
	
	ControlTabs.init({
		colors:'Colors',
		canvas:'Texture',
		image:'Image',
		rotate:'Rotate',
		saved:'Saved',
		about:'About'
	},'image');
	
	//------------------- init color picker --------------------
	
	ControlColors.init({
		skinPath:'assets/images/',
		holder:'cpHolder',
		color:initialValues.fgColor.value
	},'fgColor');
	
	ControlColors.initSample('fgColor',initialValues.fgColor.value);
	ControlColors.initSample('bgColor',initialValues.bgColor.value);
	
	//------------------- init params syncer --------------------
	
	ControlParams.init(initialValues);
		//------------------- init params fields --------------------
	
	ControlSliders.init({
		skinPath:'assets/images/live-fields/',
		cursorsPath:'assets/images/cursors/',
		holderWidth:200,
		holderHeight:30,
		boxWidth:179,
		boxHeight:10,
		cornerWidth:1,
		markerWidth:30,
		markerHeight:12,
		x:10,
		y:13
	},initialValues);
	
	//------------------- init angle slider --------------------
	
	ControlAngle.init({
		holderId:'angleSlider',
		radius:104,
		markerWidth:30,
		markerHeight:30,
		skinPath:'assets/images/cslider/',
		cursorsPath:'assets/images/cursors/',
		fieldClassName:'paramsField',
		value:initialValues.angle.value
	});
	
	//------------------- init upload controller ---------------
	
	ControlUpload.init(
		{
			apply:{
				ajax:	true,
				URL:	''
			},
			download:{
				ajax:	true,
				URL:	''
			}
		},
		'progressbar'
	);
	
	//------------------- init upload controller ---------------
	
	ControlLoad.init('', 'progressbar');
	
	//-------------------- init layout -----------------------
	
	ControlWindow.init(
		'wrapper',
		'closed',
		'wmodeSwitcherTitle',
		'Hide designer',
		'Show designer',
		true
	);
	
	//-------------------- init location modes -----------------------
	
	ControlLoc.init(
		'locModes',	
		'locmode_',
		{
			diagonal: 	'diagonal',
			straight:	'straight'
		},
		'diagonal'
	);
	
	CanvasTabControls.init();
	ImageTabControls.init();
	UrlState.syncNow(ControlParams.getAllParams());
	
	//-----------------performing the magick :)-----------------
	
	setTimeout(function(){
		renderAllParams();
		// If URL carries a shared state, auto-apply it as page background.
		if(UrlState.hasUrlParams()){
			setTimeout(function(){
				ControlUpload._applyBgFromCanvas();
			},140);
		}
	},100)
}
}
















































