//data-location: Row, Height from the Top Left Corner! Starts at 1
"use strict";
var ISRED = true;
//var PieceTypes = ['Pawn','Castle','Knight','Bishop','Queen','King','Bishop','Knight','Castle'];
var PieceTypes = ['♟','♖','♘','♗','♕','♔','♗','♘','♖'];
//K-King,R-Rook/Castle,N-Knight,B-Bishop
var g_Player = ['black','white'];
var Click = (function(){
	var counter=0; 
	return function(){return counter+=1;}})(); //Closure statements that counts the number of clicks
var PieceSelected;
var PieceSelectedId;
var chessState = [];

function startGame()
{	
	var chessBoard = "<table class='ChessBoard'><th></th>";
	var headers = "";
	var chessBoardRows = "";
	var chessBoardRow = "";
	var isRed = true;
	var color = 'red';
	var pieceName = '';
	for(var i=1;i<=8;i++){
		headers += "<th>"+i+"</th>";
		for(var j=1;j<=8;j++)
		{
		if(i == 2 || i== 7) //Second Row of Chess Pieces// Pawns
		{
	
			pieceName = g_Player[(i-1)%6]+PieceTypes[0];
		}else
		if(i==1 || i==8){ //First Row Find a way to swap the order between king and queen for i=8 i==8&&j==5?4;
			pieceName = g_Player[i%8]+PieceTypes[j];
		}else
		{
			pieceName = '';
		}
		chessState[i-1] = [];
		chessState[i-1][j-1] = pieceName;
		color = cellColor(isRed);		
		chessBoardRow += "<td>"+button(i,j,color,pieceName)+"</td>";
		}
		chessBoardRow = nextLine(i,chessBoardRow);
		chessBoardRows +="<tr>"+chessBoardRow+"</tr>";
		chessBoardRow = "";
	}
	
	chessBoard= chessBoard+headers+chessBoardRows+ "</table>";
	document.getElementById("test1").innerHTML = chessBoard;
} //Check using the splice method to swap them out
function button(row,height,color,pieceName)
{
 var location = "'"+row+"_"+height+"'";
 var javaMethodName = "btnPressed("+row+","+height+")";
 var string_Button = "<Button id="+location+" data-location="+location+" onclick='"+javaMethodName+"' class='"+color+"'><span style='font-size:250%;'>"+pieceName+"</span></Button>";
return string_Button; 
}
function cellColor(p1){
	var clr = 'black';
	if(ISRED)
		{
		clr = 'red';
			
		}
	ISRED = !ISRED;	
	return clr;
}
function nextLine(p1,row)
{
  ISRED = !ISRED;
  row = "<td BGCOLOR = grey>"+p1+"</td>" + row;
  return row;
}

var chessPieceSelected = {row:-1, column: -1,type:"",id:"",player:""}; 

function btnPressed(row,column)
{
	//1= first Click 2=SecondClick
	var turn = Click()%2;
	var id = row+"_"+column;
	var btn = document.getElementById(id);
	//First Click Save the Button Name and state
	if(turn == 1){
		chessPieceSelected.type = btn.innerHTML;
		chessPieceSelected.id = id;
		chessPieceSelected.row = row;
		chessPieceSelected.column = column;
 
		
	}else
	{
		if(validateMove(row,column))
		{
		document.getElementById(chessPieceSelected.id).innerHTML = ""; //move the piece
		btn.innerHTML = chessPieceSelected.type;
		}else
		{
			window.alert("Error: Invalid Move");
		}
	}
	
	
}
function validateMove(row,column){
	var pieceType = getPieceType(chessPieceSelected.type);
	var isValid = false;
	var isTopPlayer;
	switch(pieceType)
	{
		case PieceTypes[0]: //Pawn
			isTopPlayer = getPlayerColor(chessPieceSelected.type) === 'white';
			isValid = PawnValidMoves(chessPieceSelected.row,chessPieceSelected.column,row,column,isTopPlayer);
			break;
		case PieceTypes[2]: //Knight
			isValid = HorseValidMoves(chessPieceSelected.row,chessPieceSelected.column,row,column);
			break;	
		case PieceTypes[1]://Rook
			isValid = CastleValidMoves(chessPieceSelected.row,chessPieceSelected.column,row,column);
			break;
		case PieceTypes[3]: //Bishop
			isValid = BishopValidMoves(chessPieceSelected.row,chessPieceSelected.column,row,column);
			break;
		case PieceTypes[4]: //Queen
			isValid = QueenValidMoves(chessPieceSelected.row,chessPieceSelected.column,row,column);
			break;
		case PieceTypes[5]: //King
			isValid = KingValidMoves(chessPieceSelected.row,chessPieceSelected.column,row,column);
			break;
			
	}
	return isValid;
}


//ChessPieces Validations - SingleMove and DoubleMove Forward
function PawnValidMoves(rowBefore,columnBefore, rowAfter,columnAfter,isTopPlayer)
{
	var i = -1;
	var doubleSpace = NaN;
	if(isTopPlayer){
		i = 1;
	}
	if (rowBefore === 2 || rowBefore === 7 )
	{
	doubleSpace = i*2;
	}
	
	return ((rowBefore+i) === rowAfter || (rowBefore+doubleSpace === rowAfter)) && columnBefore === columnAfter;
}
function HorseValidMoves(rowBefore,columnBefore, rowAfter,columnAfter)
{
	var shortDistanceSquarted = Pythagores(rowBefore,columnBefore,rowAfter,columnAfter);
	return shortDistanceSquarted === 5;
}
function CastleValidMoves(rowBefore,columnBefore,rowAfter,columnAfter)
{
	return (rowBefore === rowAfter && columnBefore !== columnAfter) || (rowBefore !== rowAfter && columnBefore === columnAfter); 
}
function BishopValidMoves(rowBefore,columnBefore,rowAfter,columnAfter)
{	
	return Math.abs(rowAfter-rowBefore) === Math.abs(columnAfter-columnBefore);

}
function QueenValidMoves(rowBefore,columnBefore,rowAfter,columnAfter)
{
	
	return BishopValidMoves(rowBefore,columnBefore,rowAfter,columnAfter) || CastleValidMoves(rowBefore,columnBefore,rowAfter,columnAfter);
}
function KingValidMoves(rowBefore,columnBefore,rowAfter,columnAfter)
{
	var queenValidMove = QueenValidMoves(rowBefore,columnBefore,rowAfter,columnAfter);
	
	return queenValidMove && (Math.abs(rowAfter - rowBefore) <= 1 && Math.abs(columnAfter - columnBefore) <=1) 
}

//Helper Functions
function Pythagores(x1,y1,x2,y2)
{
	return Math.pow((x1-x2),2) + Math.pow((y1-y2),2);
}
function bothTypes(typeIndex, pieceType)
{

	return (g_Player[0]+PieceTypes[typeIndex]) === pieceType ||  (g_player[typeIndex]+PieceTypes[i]) === pieceType;
}
function getPieceType(pieceName)
{
	return pieceName.substring(pieceName.length-8,pieceName.length-7); 
}
function getPlayerColor(pieceName){

return pieceName.substring(pieceName.length-13,pieceName.length-8);
} 