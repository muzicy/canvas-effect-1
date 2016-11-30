var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var canvas = document.getElementsByClassName("canvas")[0];
var blurDiv = document.getElementById('blur-div');
var blurImage = document.getElementById('blur-image');
var ctx = canvas.getContext('2d');
var resetBtn = document.getElementById('reset');
var showBtn = document.getElementById('show');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

//定义剪辑区域随机出现的位置；
var radius = 50;
var clipX = 400;
var clipY = 300;
var clippingRegion = {x:clipX, y:clipY, r:radius};
var image = new Image();
var timer = null;
image.src = 'timg.jpg';
var leftMargin=0;
var topMargin=0;
var theLeft = 0;
var theTop = 0;

image.onload = function(){
	
  blurDiv.style.width=canvas.width+'px';
  blurDiv.style.height=canvas.height+'px';
  blurImage.style.width=image.width+'px';
  blurImage.style.height=image.height+'px';
  leftMargin = (image.width-canvas.width)/2;
  topMargin = (image.height-canvas.height)/2;
  blurImage.style.left=-leftMargin +'px';
  blurImage.style.top=-topMargin+'px'
  
 /* leftMargin = (image.width-canvas.width)/2;
  topMargin = (image.height-canvas.height)/2;
  $('#blur-div').css({'width':canvas.width+'px','height':canvas.height+'px'});
  //这里为什么要加通过String()来对取反有疑问。
  $('#blur-image').css({'width':image.width+'px','hieght':image.height+'px','left':String(-leftMargin)+'px','top':String(-topMargin)+'px'});
  */
  initImage();	
}

function initImage(){
  clearInterval(timer);
  theLeft = leftMargin < 0?-leftMargin:0;
  theTop = topMargin > 0?-topMargin:0;
  clippingRegion = {x:Math.random(0,1)*(canvas.width-2*radius-2*theLeft)+radius+theLeft, y:Math.random(0,1)*(canvas.height-2*radius-2*theTop)+radius+theTop, r:radius};
  draw(image,clippingRegion);
}

function setClippingRegion(clippingRegion){
  ctx.beginPath();
  ctx.arc(clippingRegion.x,clippingRegion.y,clippingRegion.r,0,2*Math.PI,false);
  ctx.clip();
}

function draw(image,clippingRegion){
//起先代码中忘记添加ctx.save()和ctx.restore() 运行出问题
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();//保存初始状态	
  setClippingRegion(clippingRegion);
  ctx.drawImage(image,Math.max(leftMargin,0),Math.max(topMargin,0),Math.min(canvas.width,image.width),Math.min(canvas.height,image.height),leftMargin<0?-leftMargin:0,
  topMargin<0?-topMargin:0, Math.min(canvas.width,image.width),Math.min(canvas.height,image.height));//在画布上定位图像
  ctx.restore();//恢复起始状态，必须得撤销之前的剪辑状态重新开始画
}

function show(){     
    timer = setInterval(function(){	
	console.log('1');
	clippingRegion.r+=20;
	if(clippingRegion.r > parseInt(canvas.height+canvas.width)){
	  clearInterval(timer);
	}
	draw(image,clippingRegion); 
	
  },30);

}

function resetClip(){
  initImage();
}

//阻止滑动事件
canvas.addEventListener('touchstart',function(e){
  e.stopPropagation();	
})
