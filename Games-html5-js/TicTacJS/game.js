/*Initialize matrice*/
var mat=new Array(3);

var table = document.getElementsByClassName('tablee')[0];
var tdArray=table.getElementsByTagName('td');
var btngrp=document.getElementsByClassName('showLeft');
var ScoreTable = (document.getElementsByClassName('scoreTable')[0]).getElementsByTagName('td');
var click = new Audio('audio/Button_Push-Mike_Koenig-1659525069.mp3');

var score={
  easy:{
    win:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).easy.win||0,
    lose:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).easy.lose||0,
    draw:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).easy.draw||0,
  },
  intermediate:{
    win:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).intermediate.win||0,
    lose:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).intermediate.lose||0,
    draw:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).intermediate.draw||0,
  },
  advanced:{
    win:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).advanced.win||0,
    lose:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).advanced.lose||0,
    draw:localStorage.getItem("score")&&JSON.parse(localStorage.getItem("score")).advanced.draw||0,
  }
}
var difficulty;

function SaveScore(winner){
  switch (difficulty) {
    case 0:
    if(winner=='O')
      score.easy.win+=1;
    else if(winner=='X')
      score.easy.lose+=1;  
    else
      score.easy.draw+=1;  
      break;
      
    case 1:
    if(winner=='O')
      score.intermediate.win+=1;
    else if(winner=='X')
      score.intermediate.lose+=1;  
    else
      score.intermediate.draw+=1;  
      break;
      
    case 2:
    if(winner=='O')
      score.advanced.win+=1;
    else if(winner=='X')
      score.advanced.lose+=1;  
    else
      score.advanced.draw+=1;  
      break;      
  }
  console.log(score);
  localStorage.setItem("score",JSON.stringify(score));
}

function ShowScore(){
  var scoreArray=Object.values(score);
  var k=0;
  for(var i=0;i<3;i++){
    var rowAr=Object.values(scoreArray[i]);
    for(var j=0;j<3;j++){
      ScoreTable[k++].innerHTML=rowAr[j];
    }
  }
}

/*Initialize rows of matrix*/
function init(){  
  for(var i=0;i<3;i++)
    mat[i]=new Array(3);
}

/*Start Game*/
function start(diff){
  init();
  (Array.from(btngrp)).forEach((item) => {
    item.classList.remove('showLeft');
    item.classList.add('hideLeft')
  })
  // btngrp.classList.remove('showLeft');
  // btngrp.classList.add('hideLeft');
  
  table.classList.remove('hideLeft');
  table.classList.add('showLeft');  
  difficulty=diff;
}

/*For Easy Moves we just pick one Randomly*/
function getRandomValidMove(){
  var ar=new Array();
  for(var i=0;i<3;i++){
    for(var j=0;j<3;j++)
    if(mat[i][j]==null)
    ar.push({value:0,i:i,j:j});
  }
  /*return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive*/
  return ar.length>0?ar[Math.floor(Math.random()*(ar.length))]:{value:0,i:null,j:null};
  
}

/*For Medium we take random of (optimal,easy) */
function getMediumMove(){
  var easy = getRandomValidMove();
  var hard = minimax(1);
  return Math.random()<0.25?easy:hard;
}
/*For Hard we take random of (optimal,easy) , with greaterbiased towards optimal*/
function getHardMove(){
  var easy = getRandomValidMove();
  var hard = minimax(1);
  return Math.random()<0.008?easy:hard;//very less probability but can occur
}
/*trigger onclick by player*/
function playerMove(i,j){
  click.play();
  /*If cell is empty*/
  if(mat[i][j]==null){
    /*Make the move*/
    mat[i][j]='O';
    UpdateTable();
    
    if(win('O')){
      SaveScore('O');
      alert('You Win');
      location.reload();  
      return;
    }
    
    /*Calculate AI's move*/
    var move;
    switch (difficulty) {
      case 0:
        move = getRandomValidMove();
        break;
      case 1:
        move = getMediumMove();
        break;
      case 2:
        move = getHardMove();//Unbeatable :P    
        break;
      default:
        
    }
    /*If Match is Tie*/
    if(move.i==null){
      SaveScore('Tie')
      alert('Tie');
      location.reload();  
      return;
    }    
    
    /*Make the move on the calculated position*/
    mat[move.i][move.j]='X';    
    UpdateTable();
    
    if(win('X')){
      SaveScore('X');
      alert('You Lose');
      location.reload();  
      return;
    }
  }  
}

/*Checks if any 3 chars are in winning position*/
function win(char){
  /*Horizontal Strike*/
  if(mat[0][0]===char&&mat[0][0]===mat[0][1]&&mat[0][0]==mat[0][2])
  return true;
  if(mat[1][0]===char&&mat[1][0]===mat[1][1]&&mat[1][0]==mat[1][2])
  return true;
  if(mat[2][0]===char&&mat[2][0]===mat[2][1]&&mat[2][0]==mat[2][2])
  return true;
  
  /*Vertical Strike*/
  if(mat[0][0]===char&&mat[0][0]===mat[1][0]&&mat[0][0]==mat[2][0])
  return true;
  if(mat[0][1]===char&&mat[0][1]===mat[1][1]&&mat[0][1]==mat[2][1])
  return true;
  if(mat[0][2]===char&&mat[0][2]===mat[1][2]&&mat[0][2]==mat[2][2])
  return true;
  
  /*Diagonal Strike*/
  if(mat[0][0]===char&&mat[0][0]===mat[1][1]&&mat[0][0]==mat[2][2])
  return true;
  if(mat[0][2]===char&&mat[0][2]===mat[1][1]&&mat[0][2]==mat[2][0])
  return true;
  
  return false;
}

/*
Minimax algorithm Recursive For Tic Tac Toe
1=Maximizer that is AI
0=Minimizer that is player(human)
*/
function minimax(turn){  
  /*Base Cases*/
  if(win('X'))
  return ({value:1,i:null,j:null});
  if(win('O'))
  return ({value:-1,i:null,j:null});
  
  /*Object to return optimal answer*/
  var ans={
    value:null,
    i:null,
    j:null
  };
  /*Loop over 2d matrix*/
  for(var i=0;i<3;i++){
    for(var j=0;j<3;j++){
      /*If cell is empty => Feasible move */
      if(mat[i][j]==null){
        /*If it's Maximizer , our AI's turn*/
        if(turn==1){
          /*Make the move*/
          mat[i][j]='X';
          /*Pass on Control to Minimizer*/
          var item=minimax(0);
          /*If item is greater than our current max ans OR current max ans is empty, Update current max answer*/
          if(ans.value==null||item.value>ans.value){
            ans.value=item.value;
            ans.i=i;
            ans.j=j;
          }
          /*Reset 2d mat cell to initial value */
          mat[i][j]=null;
        }
        /*If it's Minimizer , our Human Player's turn*/
        else{
          /*Make the move*/
          mat[i][j]='O';
          /*Pass on Control to Maximizer*/          
          var item=minimax(1);
          /*If item is lesser than our current min ans OR current min ans is empty, Update current min answer*/
          if(ans.value==null||item.value<ans.value){
            ans.value=item.value;
            ans.i=i;
            ans.j=j;
          }
          /*Reset 2d mat cell to inital value */
          mat[i][j]=null;
        }
      }
    }
  }
  
  /*If no moves available, matrix is full => Game Tie*/
  if(ans.value==null){
    ans.value=0;    
  }
  
  return ans;
}

/*Update html table with values from matrix*/
function UpdateTable(){
  var k=0;
  for(var i=0;i<3;i++){
    for(var j=0;j<3;j++){
      tdArray[k++].innerHTML=mat[i][j]||'';
    }
  }
}