"use strict";

const CHRHEIGHT  = 9;
const CHRWIDTH   = 8;
const FONT       = "48px monospace";  //使用フォント
const HEIGHT     = 120;  //仮想画面サイズ　高さ
const WIDTH      = 128;  //仮想画面サイズ　幅
const MAP_WIDTH  = 32;  //マップ幅
const MAP_HEIGHT = 32;  //マップ高さ
const SMOOTH     = 0;  //補完処理
const TILECOLUMN = 4;  //タイル桁数
const TILEROW    = 4;  //タイル行数
const TILESIZE   = 8;  //タイルサイズ（ドット

let   gScreen;    //仮想画面
let   gFrame = 0; //内部カウンタ
let   gWidth;     //実画面の幅
let   gHeight;    //実画面の高さ
let   gImgMap;    //画像マップ
let   gImgPlayer;    //画像　プレイヤー
let   gPlayerX = 0;  //プレイヤー座標X
let   gPlayerY = 0;  //プレイヤー座標Y 

const  gFileMap = "img/map.png"
const  gFilePlayer = "img/player.png"

//マップ
const  gMap = [
 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
 0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
 0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
 0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3,12, 3, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
 7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
];

function DrawMain()
{
  const   g =gScreen.getContext("2d");  //仮想画面の2D描画コンテキストを取得
  for(let y = 0; y < 20; y++){
    for(let x = 0; x < 20; x++){
      let  px = gPlayerX + x;
      let  py = gPlayerY + y;
      DrawTile(g, x * TILESIZE, y * TILESIZE, gMap[py * MAP_WIDTH + px]);
    }
  }
  g.fillStyle = "#0000ff"
  g.fillRect(0, HEIGHT / 2 - 1, WIDTH, 2);
  g.fillRect(WIDTH / 2 - 1, 0, 2, HEIGHT);

  g.drawImage(gImgPlayer, 
              CHRWIDTH, 0, CHRWIDTH, CHRHEIGHT,
              WIDTH / 2 - CHRWIDTH / 2, HEIGHT / 2 -  CHRHEIGHT / 2, CHRWIDTH, CHRHEIGHT);

//  g.font = FONT;  //文字フォント
//  g.fillText("Hello World" + gFrame, gFrame / 10, 64);
}


function DrawTile(g, x, y, idx)
{
  const  ix = (idx % TILECOLUMN) * TILESIZE;
  const  iy = Math.floor (idx / TILECOLUMN) * TILESIZE;
  g.drawImage(gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

function LoadImage()
{
  gImgMap = new Image(); gImgMap.src = gFileMap;  //マップ画像読み込み
  gImgPlayer = new Image(); gImgPlayer.src = gFilePlayer;  //プレイヤー画像読み込み
}

function WmPaint()
{
  DrawMain();
  const   ca = document.getElementById("main"); //mainキャンバスの要素を取得
  const   g = ca.getContext("2d");  //2D描画コンテキストを取得
  g.drawImage( gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight );  //仮想画面のイメージを実画面へ転送
}
//  ブラウザサイズ変更イベント
function WmSize()
{
  const   ca = document.getElementById("main"); //mainキャンバスの要素を取得
  ca.width = window. innerWidth;  //キャンバスの幅をブラウザの幅へ変更
  ca.height = window. innerHeight;  //キャンバスの高さをブラウザの高さに変更
  const   g = ca.getContext("2d");  //2D描画コンテキストを取得
  g.imageSmoothingEnabled = g.msImageSmoothingEnabled = SMOOTH; //補完処理
  
  //  実画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計測する。
  gWidth = ca.width;
  gHeight = ca.height;
  if( gWidth / WIDTH < gHeight / WIDTH ){
      gHeight = gWidth * HEIGHT / WIDTH;
  }else{
      gWidth = gHeight * WIDTH / HEIGHT;
  }

}
//タイマーイベント発生時の処理
function WmTimer()
{
  gFrame++; //内部カウンタを加算
  WmPaint();
}

//  キー入力(DONW)イベント
window.onkeydown = function(ev)
{
  let  c = ev.keyCode;  //キーコード取得

  if(c == 37)  gPlayerX--;  //左
  if(c == 38)  gPlayerY--;  //上
  if(c == 39)  gPlayerX++;  //右
  if(c == 40)  gPlayerY++;  //下
}

//ブラウザ起動イベント
window.onload = function()
{
  LoadImage();
  
  gScreen = document.createElement("canvas");  //仮想画面作成
  gScreen.width = WIDTH;  //仮想画面の幅を設定
  gScreen.height = HEIGHT;  //仮想画面の高さを設定
  WmSize();  //画面サイズ初期化
  window.addEventListener("resize", function() {WmSize()});  //ブラウザサイズ変更時WmSize()が呼ばれるよう指示
  setInterval( function(){ WmTimer() }, 33 );  //33ms間隔で WmTimerを呼び出すよう指示
}
