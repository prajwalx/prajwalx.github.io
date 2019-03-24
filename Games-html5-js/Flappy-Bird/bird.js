(function() {
   // your page initialization code here
   // the DOM will be available here

	 const canvas = document.querySelector('canvas');
 	 const ctx = canvas.getContext('2d');

 	//load images
 	const bg_day=new Image();
 	bg_day.src='sprites/background-day.png';
 	const bg_night=new Image();
 	bg_night.src='sprites/background-night.png';
 	const baseImg= new Image();
 	baseImg.src='sprites/base.png';
 	const BirdImg=[];
 	BirdImg[0]=new Image();
 	BirdImg[0].src='sprites/redbird-upflap.png';
 	BirdImg[1]=new Image();
 	BirdImg[1].src='sprites/redbird-midflap.png';
 	BirdImg[2]=new Image();
 	BirdImg[2].src='sprites/redbird-downflap.png';
 	const pipe=new Image();
 	pipe.src='sprites/pipe-green.png';
 	const numbers=[];
 	for(let i=0;i<10;i++){
 		numbers[i]=new Image();
 		numbers[i].src=`sprites/${i}.png`;
 	}

	//New Images
	const heli=new Image();
	heli.src='sprites/Helicopter.gif';
	const Sky=new Image();
	Sky.src='2D Forest Tileset PNG/Background/Day/Daylight sky.png';
	const mount_far=new Image();
	mount_far.src='2D Forest Tileset PNG/Background/Day/Mountains Far.png';
	const tree_close=new Image();
	tree_close.src='2D Forest Tileset PNG/Background/Day/Trees Close.png';
	const tree_far=new Image();
	tree_far.src='2D Forest Tileset PNG/Background/Day/Trees Far.png';
	const cloud=new Image();
	cloud.src=`2D Forest Tileset PNG/Background/Day/Clouds Day_${Math.floor(Math.random()*(5)+1)}.png`
	const groundImg=new Image();
	groundImg.src='2D Forest Tileset PNG/Background/Day/Ground Far.png';
	const centerGrass=new Image();
	centerGrass.src='2D Forest Tileset PNG/Blocks/Blocks Day/center_grass.png';
	const rockImage=new Image();
	rockImage.src='2D Forest Tileset PNG/Blocks/Blocks Day/center.png';
	const logImg=new Image();
	logImg.src='sprites/log.png'
	const restart_btn=new Image();
	restart_btn.src='sprites/button_restart.png';

	const heli_audio=new Audio();
	heli_audio.src='audio/Military Helicopter-SoundBible.com-1009489035-[AudioTrimmer.com].wav';
	const menu_audio=new Audio();
	menu_audio.src='audio/Fantasy_Game_Background_Looping.mp3';
	const game_audio=new Audio();
	game_audio.src='audio/Our-Mountain_v003_Looping.mp3';
 	//load audio
 	const point_audio=new Audio();
 	point_audio.src='audio/point.wav';
 	const hit_audio=new Audio();
 	hit_audio.src='audio/die.wav';
 	const wing_audio=new Audio();
 	wing_audio.src='audio/wing.wav';

 	function resize() {
 		// Our canvas must cover full height of screen
 		// regardless of the resolution
 		let height = window.innerHeight;

 		// So we need to calculate the proper scaled width
 		// that should work well with every resolution
 		let ratio = canvas.width/canvas.height;
 		let width = height * ratio;

		//For mobiles by Prajwal Bhati mod to avoid hori-scrolling
		if(window.innerWidth<width)
		width=window.innerWidth;

 		canvas.style.width = width+'px';
 		canvas.style.height = height+'px';
 		// game=setInterval(draw,100);
 		init(0);
 	}

 	window.addEventListener('load', resize, false);
	//Uncomment for Browser Resize
 	// window.addEventListener('resize', resize, false);

 	// http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/index.html
 	function drawRotatedImage(image, x, y, angle) {
		let TO_RADIANS = Math.PI/180;

 		// save the current co-ordinate system
 		// before we screw with it
 		ctx.save();

 		// move to the middle of where we want to draw our image
 		ctx.translate(x, y);

 		// rotate around that point, converting our
 		// angle from degrees to radians
 		ctx.rotate(angle * TO_RADIANS);

 		// draw it up and to the left by half the width
 		// and height of the image
 		ctx.drawImage(image, -(image.width/2), -(image.height/2));

 		// and restore the co-ords to how they were when we began
 		ctx.restore();
 	}

 	let bird_y;//bird_x fixed @ 70
 	let bno;//0,1,2 ,for flap motion
 	let bno_counter;//for flap motion
 	let bird_angle;
 	let base_x;
	let mountain=[];
	let base=[];
	let tree=[];
	let rand;

 	let gravity;
 	let gravitySpeed;
 	let horiSpeed;
 	let horiGravity;
 	let score;

 	let bg=bg_day;
 	let frameId;
	let mainMenuId;
 	let pipe_ar=[];

	function musicloop() {
	this.currentTime = 0;
	this.play();
	}
 	function init(flag=0){

		// heli_audio.addEventListener('ended', musicloop, false);
		// heli_audio.play();
		game_audio.pause();
		menu_audio.play();
 		canvas.removeEventListener('click',restart);
 		bird_y=150;//bird_x fixed @ 70
 		bno=0//0,1,2 ,for flap motion
 		bno_counter=0;//for flap motion
 		bird_angle=-1;
 		base_x=90;
		rand=1;
		mountain[0]={
 			x:0,
 			y:120
 		};
		mountain[1]={
 			x:canvas.height*mount_far.width/mount_far.height,
 			y:120
 		}
		for(let i=0;i<=7;i++){
			base[i]={x:i*(40*centerGrass.width/centerGrass.height)};
		}
		tree[0]={
			x:0
		}
		tree[1]={
			x:canvas.width/1.5
		}
		tree[2]={
			x:2*canvas.width/1.5
		}
 		gravity=0.10;
 		gravitySpeed=0;
 		horiSpeed=1.5;
 		horiGravity=0.05;
 		score=0;

 		pipe_ar=[];
 		// pipe_ar[0]={
 		// 	x:canvas.width+150,
 		// 	y:Math.random()*(81+140)-140,
 		// 	point:false
 		// }
 		// pipe_ar[1]={
 		// 	x:pipe_ar[0].x+Math.random()*(200-140)+140,
 		// 	y:Math.random()*(81+140)-140,
 		// 	point:false
 		// }
		pipe_ar[0]={
 			x:canvas.width+150,
 			y:Math.random()*(340-125)+125,
 			point:false
 		}
 		pipe_ar[1]={
 			x:pipe_ar[0].x+Math.random()*(250-165)+165,
 			y:Math.random()*(340-125)+125,
 			point:false
 		}
 		if(flag===1){
			menu_audio.pause();
			game_audio.play();
 			draw();
 			document.addEventListener("mousedown",jump);
 		}
 		else{
 			mainMenu();
			canvas.addEventListener('click',startGameFromMenu,false);
 		}

 	}
	function drawRockyGround(){
		for(let item of base){
			 ctx.drawImage(centerGrass,item.x,360,40*centerGrass.width/centerGrass.height,40);
			 item.x--;
		}
	}
	function drawTrees(){
		for(let item of tree){
			 ctx.drawImage(tree_close,item.x,320,canvas.width/1.5,canvas.width/1.5/(tree_close.width/tree_close.height));
			 ctx.drawImage(tree_far,item.x,340,canvas.width/1.5,canvas.width/1.5/(tree_far.width/tree_far.height));
			 item.x--;
		}

		// ctx.drawImage(tree_close,canvas.width/1.5,320,canvas.width/1.5,canvas.width/1.5/(tree_close.width/tree_close.height));
	}
 	function mainMenu(){
 		//Mod 3 counter to alternate cycle b/w bird-flaps[0,1,2]
 		// if(bno_counter%5===0)
 		// 	bno=(bno+1)%3;
 		// bno_counter++;

 		// base_x=base_x-2;
 		// if(base_x>=canvas.width)
 		// base_x=90;


		if(mountain[0].x+canvas.height*mount_far.width/mount_far.height<=0){
			// alert('New');
			let newHill={
 				x:mountain[mountain.length-1].x+canvas.height*mount_far.width/mount_far.height,
 				y:120
 			};
 			mountain.push(newHill);
			rand=Math.random()*100;
 			mountain.splice(0,1);
		}

		if(base[0].x+40<=0){
			let newbase={
 				x:(base.length-1)*(40*centerGrass.width/centerGrass.height)-15
 			};
			base.push(newbase);
			base.splice(0,1);
		}

		if(tree[0].x+(canvas.width/1.5)<=0){
			let newtree={
 				x:(tree.length-1)*(canvas.width/1.5),
 			};
			tree.push(newtree);
			tree.splice(0,1);
		}
 		// drawRotatedImage(bg,90,150,0
		// ctx.drawImage(Sky,0,0);
		// ctx.drawImage(Sky,0,0,canvas.width,canvas.height-100);
		drawRotatedImage(Sky,0,0);
		for(let hill of mountain){
			ctx.drawImage(mount_far,hill.x,hill.y,canvas.height*mount_far.width/mount_far.height,canvas.height);
			for(let i=0;i<2;i++)
			ctx.drawImage(cloud,hill.x+rand-i*30,i*10,50*cloud.width/cloud.height,50);
			hill.x--;
		}
		ctx.drawImage(groundImg,0,345,canvas.width,canvas.width/(groundImg.width/groundImg.height))
		// ctx.drawImage(tree_far,10,280,canvas.width,canvas.width/(tree_far.width/tree_far.height));
		drawTrees();

 		// drawRotatedImage(BirdImg[bno],95,bird_y,bird_angle);
		//ratio = 291/94


		// ctx.drawImage(logImg,item.x,item.y+440,52,52/(logImg.width/logImg.height));
		// ctx.drawImage(logImg,item.x,item.y,52,52/(logImg.width/logImg.height));

		ctx.drawImage(heli,40,bird_y,84,84/(heli.width/heli.height));
		// ctx.drawImage(logImg,170,-120,52,52/(logImg.width/logImg.height));//125--340
		// ctx.drawImage(logImg,170,372-120+85,52,52/(logImg.width/logImg.height));//125--340
		drawRockyGround();

		// ctx.drawImage(centerGrass,0,330,40*centerGrass.width/centerGrass.height,40);
		// ctx.drawImage(centerGrass,0,330,40*centerGrass.width/centerGrass.height,40);
		// for(let bas of base){
		// 		ctx.drawImage(centerGrass,bas.x,bas.y,canvas.width,80);
		// 		bas.x-=1;
		// }
 		// drawRotatedImage(baseImg,base_x,400,0);
		ctx.fillStyle = 'white';
		ctx.font= 'bolder 19px Andale Mono, monospace';
		ctx.fillText('TAP to Start',40,191);
 		mainMenuId=requestAnimationFrame(mainMenu);

 	}
	function startGameFromMenu(){
		cancelAnimationFrame(mainMenuId);
		canvas.removeEventListener('click',startGameFromMenu);
		init(1);
		console.log('fff');
	}
 	function jump(){
 		//when going up gravity and speed are -ve
 		gravitySpeed=gravitySpeed>0?0:gravitySpeed;
 		gravity-=0.175;
 		bird_angle=-15;
 		wing_audio.play();
 		//Drop 4ms after jump()
 		setTimeout(()=>{
 			gravity=0.09;
 			bird_angle=0;
 		},400);

 	}

 	function collision(item){
 		//0-48 is pipe width
 		//70 is bird_x and expected bird width is 34 //heli width:84
		//40 is heli_x
 		for(let i=0;i<48;i++){//loop across pipe width
 			if(item.x+i>=40&&item.x+i<=120&&bird_y<372-item.y){//top
				// alert('Top : '+item.x+','+item.y);
				return true;
			}

 			if(item.x+i>=40&&item.x+i<=120&&bird_y>=372-item.y+115){//bottom
				// alert('Bottom : '+item.x+','+item.y);
				return true;
			}

 		}
		// TopPipe:
		// X:  item.x,
		// Y: -item.y
		// BottomPipe:
		// X:  item.x,
		// Y:  372-item.y+115
		// Helicopter:
		// X:70,
		// Y:bird_y
		//
		// PipeWidth:52
		// HeliWidth:84
 		return false;
 	}
 	function drawNumbers(val,width,height,x,y){
 		let str=val.toString();
 		let wd=x;
 		for(let num of str){
 			if(num<numbers.length){
 				ctx.drawImage(numbers[num],wd,y,width,height);
 				wd=wd+width;
 			}
 		}
 	}
 	function restart(event){
 		// console.log(event);
 		// let x=event.pageX-canvas.offsetLeft;
 		// let y=event.pageY-canvas.offsetTop;
		// console.log(x+','+y);//109,300
 		// if(bird_y>325&&x>=145&&y>=396&&x<=290&&y<=446)
 				init(1);
 	}
 	function draw(){
		/*
		New Code Begins
		*/
		if(mountain[0].x+canvas.height*mount_far.width/mount_far.height<=0){
			// alert('New');
			let newHill={
 				x:mountain[mountain.length-1].x+canvas.height*mount_far.width/mount_far.height,
 				y:120
 			};
 			mountain.push(newHill);
			rand=Math.random()*100;
 			mountain.splice(0,1);
		}

		if(base[0].x+40<=0){
			let newbase={
 				x:(base.length-1)*(40*centerGrass.width/centerGrass.height)-15
 			};
			base.push(newbase);
			base.splice(0,1);
		}

		if(tree[0].x+(canvas.width/1.5)<=0){
			let newtree={
 				x:(tree.length-1)*(canvas.width/1.5),
 			};
			tree.push(newtree);
			tree.splice(0,1);
		}
 		// drawRotatedImage(bg,90,150,0
		// ctx.drawImage(Sky,0,0);
		// ctx.drawImage(Sky,0,0,canvas.width,canvas.height-100);
		drawRotatedImage(Sky,0,0,0);
		for(let hill of mountain){
			ctx.drawImage(mount_far,hill.x,hill.y,canvas.height*mount_far.width/mount_far.height,canvas.height);
			for(let i=0;i<2;i++)
			ctx.drawImage(cloud,hill.x+rand-i*30,i*10,50*cloud.width/cloud.height,50);
			hill.x--;
		}
		ctx.drawImage(groundImg,0,345,canvas.width,canvas.width/(groundImg.width/groundImg.height))

		drawTrees();
		ctx.drawImage(heli,40,bird_y,84,84/(heli.width/heli.height));
		// ctx.drawImage(logImg,170,200,52,52/(logImg.width/logImg.height));

		for(let item of pipe_ar){
 			// drawRotatedImage(pipe,item.x,item.y+440,0);//pipe bottom
 			// drawRotatedImage(pipe,item.x,item.y,180);//pipe top
			ctx.drawImage(logImg,item.x,-item.y,52,52/(logImg.width/logImg.height));
			ctx.drawImage(logImg,item.x,372-item.y+115,52,52/(logImg.width/logImg.height));
 			// item.x-=1.5;
 			item.x-=horiSpeed;
 		}
		drawRockyGround();
		/*
		New Code Ends
		*/

 		//Draw Entire Canvas

 		//Mod 3 counter to alternate cycle b/w bird-flaps[0,1,2]
 		// if(bno_counter%5===0)
 		// 	bno=(bno+1)%3;
 		// bno_counter++;

 		//Move baseImg
 		// base_x=base_x-2;
 		// if(base_x<70)
 		// base_x=90;

 		//When first pipe is out of canvas Remove this pipe and append new pipe at end
 		if(pipe_ar[0].x<=-45){
 			let newPipe={
 				x:pipe_ar[pipe_ar.length-1].x+Math.random()*(270-165)+165,
 				y:Math.random()*(340-125)+125,
 				point:false
 			};
 			pipe_ar.push(newPipe);
 			pipe_ar.splice(0,1);
 		}
 		/*
 		if First Pipe has passed bird ,mark its point as true
 		Add 1 to score , play point_audio, shuffle background after every +30 points And increase horiSpeed
 		Update Score
 		*/
 		if(pipe_ar[0].x<70&&!pipe_ar[0].point){
 				if(score&&score%15===0){
 					horiSpeed+=horiGravity;
 					bg=bg===bg_night?bg_day:bg_night;
 				}
 				score+=1;
 				point_audio.play();
 				pipe_ar[0].point=true;
 		}

 		/*
 		Draw Images on canvas
 		*/
 		// drawRotatedImage(bg,90,150,0);
 		// drawRotatedImage(BirdImg[bno],70,bird_y,bird_angle);
		// ctx.drawImage(heli,70,bird_y,80,80/(291/94));
 		// for(let item of pipe_ar){
 		// 	// drawRotatedImage(pipe,item.x,item.y+440,0);//pipe bottom
 		// 	// drawRotatedImage(pipe,item.x,item.y,180);//pipe top
		// 	ctx.drawImage(logImg,item.x,-item.y,52,52/(logImg.width/logImg.height));
		// 	ctx.drawImage(logImg,item.x,372-item.y+115,52,52/(logImg.width/logImg.height));
 		// 	// item.x-=1.5;
 		// 	item.x-=horiSpeed;
 		// }
 		// drawRotatedImage(baseImg,base_x,390,0);
 		// console.log(numbers);
 		// drawRotatedImage(numbers[0],canvas.width/2,50,0);
		if(bird_y<310)
 		drawNumbers(score,numbers[0].width,numbers[0].height,canvas.width/2,50);


 		//Increase vertical Speed , makes bird fall fast if not jump()
 		gravitySpeed+=gravity;
 		bird_y+=gravitySpeed;

 		//frameId helps to stop game
 		frameId=requestAnimationFrame(draw);

 		//GameOver 65 bird height?
 		/*
 		Game Over if bird_y crosses 325  = bottom
 		Game Over if bird_y crosses -250 = top
 		Game Over if bird_y collides with pipes
 		*/
 		if(bird_y>=325||bird_y<-250||collision(pipe_ar[0])){
 			hit_audio.play();//Hit audio on gameover
			heli_audio.pause();
 			console.log('GameOver');
 			gravity+=0.25;//bird falls to ground faster
 			bird_angle=90;//facing down
 			document.removeEventListener("click",jump);//disable jump listener
			heli_audio.removeEventListener('ended',musicloop);

 			if(bird_y>325){//bird hits ground
 				let high=localStorage.getItem('HighScore');
 				localStorage.setItem('HighScore',Math.max(score,high|0));

 				ctx.fillStyle='steelblue';
 				ctx.fillRect(75,80,80,120);
 				ctx.fillStyle = 'white';
 			  ctx.font= 'bolder 15px Andale Mono, monospace';
 			  ctx.fillText('SCORE',90,100);
 				drawNumbers(score,numbers[0].width/2,numbers[0].height/2,100,110);
 				// ctx.drawImage(numbers[score],100,125,12,18);
 				ctx.fillText('BEST',95,145);

 				// ctx.fillStyle='dodgerblue';
 				// ctx.fillRect(75,210,80,30);
 				// ctx.fillStyle = 'white';
 			  // ctx.font= 'bolder 15px Andale Mono, monospace';
 			  // ctx.fillText('RESTART',80,231);
				ctx.drawImage(restart_btn,65,210,105,105/(restart_btn.width/restart_btn.height));

 				// ctx.fillText(localStorage.getItem('HighScore'),100,165);
 				drawNumbers(localStorage.getItem('HighScore'),numbers[0].width/2,numbers[0].height/2,100,155);
 				cancelAnimationFrame(frameId);//stop the game;

 				canvas.addEventListener('click',restart,false);
 				// setTimeout(,500);
 			}
 		}
 	}


})();
