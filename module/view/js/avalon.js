$(function () {
	$('#roomPage').hide();
	$('#gamePage').hide();	
	$('#gameStart').hide();
	$('.firebase-traning').hide();
	$('#boardDiv').hide();
	$('#chooseCharactor').hide();
	$('#voteStart').hide();
	$('#chooseYesOrNoDiv').hide();
	$('#chooseSuccessOrFailDiv').hide();
	
		
	$('#returnLoginPage').on('click',function(){
		$('#loginPage').show();
		$('#roomPage').hide();
	});
	
	////////// Initialize Firebase //////////////
  const config = {
    apiKey: "AIzaSyCbPZSRK7JjUoJExAzxrBPCdtJsj9HqTvI",
    authDomain: "simpletask-36ba6.firebaseapp.com",
    databaseURL: "https://simpletask-36ba6.firebaseio.com",
    projectId: "simpletask-36ba6",
    storageBucket: "simpletask-36ba6.appspot.com",
    messagingSenderId: "721030123795"
  };
  firebase.initializeApp(config);  
  

	////////////login page JS start///////////////////////////////////
	var iconSelect;
  
	selectedText = document.getElementById('selected-text');
	
	document.getElementById('my-icon-select').addEventListener('changed', function(e){
	   $("#selected-text").text(iconSelect.getSelectedValue());
	});

	iconSelect = new IconSelect("my-icon-select", 
		{'selectedIconWidth':635,
		'selectedIconHeight':635,
		'selectedBoxPadding':300,
		'iconsWidth':48,
		'iconsHeight':48,
		'boxIconSpace':1,
		'vectoralIconNumber':4,
		'horizontalIconNumber':8});

	var icons = [];
	icons.push({'iconFilePath':'images/icons/chooseIcon.png', 'iconValue':''});
	icons.push({'iconFilePath':'images/icons/bird.gif', 'iconValue':'bird'});
	icons.push({'iconFilePath':'images/icons/cat.gif', 'iconValue':'cat'});
	icons.push({'iconFilePath':'images/icons/dog.gif', 'iconValue':'dog'});
	icons.push({'iconFilePath':'images/icons/rabbit.gif', 'iconValue':'rabbit'});
	icons.push({'iconFilePath':'images/icons/capo.gif', 'iconValue':'capo'});
	icons.push({'iconFilePath':'images/icons/whitebear.gif', 'iconValue':'whitebear'});
	icons.push({'iconFilePath':'images/icons/yolk.gif', 'iconValue':'yolk'});
	icons.push({'iconFilePath':'images/icons/penguin.gif', 'iconValue':'penguin'});
	
	iconSelect.refresh(icons);
	
	var playerName;
	var playerIcon;
	var playerInfoMap = new Object();
	$("#loginButton").on("click",function(){
		playerName = $("#playerName").val();
		playerIcon = $("#selected-text").text();
		if( playerName==''){
			alert("請輸入暱稱");
			return;
		}
		if( playerIcon==''){
			alert("請選擇圖片");
			return;
		}		
		playerInfoMap["playerName"] = playerName;
		playerInfoMap["playerIcon"] = playerIcon;
		$('#gamePage').hide();
		$('#loginPage').hide();
		$('#roomPage').show();
		
	});
		
//////////////選擇遊玩人數與腳色////////////////////	
  	var amountList = [
		0,1,2,3,4,
		[2,3,2,3,3],
		[2,3,4,3,4],
		[2,3,3,4,4],
		[3,4,4,5,5],
		[3,4,4,5,5],
		[3,4,4,5,5]
	]
	var bgamount1 = [0,1,2,3,4,
		["梅林","派西","平民","刺客","魔甘娜"],
		["梅林","派西","平民","平民","刺客","魔甘娜"],
		["梅林","派西","平民","平民","刺客","魔甘娜","壞人"],
		["梅林","派西","平民","平民","平民","刺客","魔甘娜","壞人"],
		["梅林","派西","平民","平民","平民","平民","刺客","魔甘娜","壞人"],
		["梅林","派西","平民","平民","平民","平民","刺客","魔甘娜","壞人","壞人"]
	]
	var bgamount2 = [0,1,2,3,4,
		["梅林","平民","平民","刺客","壞人"],
		["梅林","平民","平民","平民","刺客","壞人"],
		["梅林","平民","平民","平民","刺客","壞人","壞人"],
		["梅林","平民","平民","平民","平民","刺客","壞人","壞人"],
		["梅林","平民","平民","平民","平民","平民","刺客","壞人","壞人"],
		["梅林","平民","平民","平民","平民","平民","刺客","壞人","壞人","壞人"]
	]
	var gameRule = [0,1,2,3,4,
		["2","3","2","3","3"],
		["2","3","4","3","4"],
		["2","3","3","4(2)","4"],
		["3","4","4","5(2)","5"],
		["3","4","4","5(2)","5"],
		["3","4","4","5(2)","5"]
	]
	//預設為五人有派西
	var gameCharacterValue = bgamount1[0];
	var gameRuleValue;
	var gameAmountValue;
	
	function setCharacter(){
		gameRuleValue = gameRule[$('#gameMember').val()];
		gameAmountValue = amountList[$('#gameMember').val()];
		if ( $('#isPercival').val()==1 ){
			gameCharacterValue = bgamount1[$('#gameMember').val()];
		}else{
			gameCharacterValue = bgamount2[$('#gameMember').val()];
		}		
//		$('#gameCharacter').empty().append($("<option></option>").attr("value", gameCharacterValue).text(gameCharacterValue));
		$('#gameCharacter').text(gameCharacterValue);
	};
	
	$('#gameMember, #isPercival').on('change', function(){
		setCharacter();
	});
	
	setCharacter();
	////////////room page JS end///////////////////////////////////
    var roomNumber;
	var data= new Object();
	var playerList=[];
	var playerIndex = 0;
	var gameStart=false;

    $('#createRoom').on('click',function(){
		var randomNumber = Math.floor((Math.random() * 10) + 1);
		$('#roomNumber').text(randomNumber);
		
		playerList.push(playerInfoMap);
		data["playerList"] = playerList;
		data["assignStage"] = true;
		
		roomNumber = firebase.database().ref().child(randomNumber);	
		roomNumber.set({
			data : data
		});

		$('#chooseCharactor').show();
		$('#gameStart').show();
		$('#roomPage').hide();
		$('#gamePage').show();
		roomNumber.on('child_changed',snap=>{
			data = snap.val();
		});
		gameRuleInit(true);
	});
	 
	$('#joinGame').on('click',function(){
		roomNumber = firebase.database().ref().child($('#joinRoomNumber').val());
		$('#roomNumber').text($('#joinRoomNumber').val());
	
		$('#roomPage').hide();
		$('#gamePage').show();
		
		var count = 0;
		while(count++ < 2){			
			roomNumber.on('value',function(snapshot){
				data=snapshot.child('data').val();
			});
		};			
			
		setTimeout(function() { 
			data["playerList"].push(playerInfoMap);
			playerIndex = data["playerList"].length - 1;
			roomNumber.set({
				data : data
			});
			gameRuleInit(false);
		}, 1000);
	});	
	
	$('#gameStart').on('click',function(){
		data["gameStart"] = "true";
		data["gameRule"] = gameRuleValue;
		data["gameAmount"] = gameAmountValue;
		
		var j=0;
		
		data["playerList"].forEach(function(element){
			var randomCharacter = Math.floor((Math.random() * gameCharacterValue.length)  );
			element["character"] = gameCharacterValue[randomCharacter];
			gameCharacterValue.splice(randomCharacter, 1);
			element["playerIndex"] = j++;
		});

		data["startIndex"] = Math.floor( Math.random() * data["playerList"].length );  
		roomNumber.set({
			data : data
		});
	});
	
	function gameRuleInit(isRoomMaster){
		// 同步任何操作造成資料庫的異動
		roomNumber.on('child_changed',snap=>{
			data = snap.val();
			
			if ("true"==data["gameStart"]){
				$('#boardDiv').show();
				$('#t1-1').text(data["gameRule"][0]);
				$('#t2-1').text(data["gameRule"][1]);
				$('#t3-1').text(data["gameRule"][2]);
				$('#t4-1').text(data["gameRule"][3]);
				$('#t5-1').text(data["gameRule"][4]);
				console.log("gameRuleInit");
				console.log(playerIndex);

				
				var i = 1;
				data["playerList"].forEach(function(element){
					$("#P" + i++).html( '<input class="selectPlayer" type="checkbox" data-index="'+ (i - 1) +'" data-character="'+ element["character"] +'" id="cb'+ (i - 1) +'"/><label for="cb'+ (i - 1) +'"><img src="images/icons/'+ element["playerIcon"] +'.gif" alt="" border=3 height=200 width=200></img><br><p class="p-center '+ element["character"] +' ">'+ element["playerName"] +'</p></label>' );
				});

				data["voteStage"]?$('#chooseYesOrNoDiv').show():$('#chooseYesOrNoDiv').hide();
				( playerIndex == data["startIndex"] && data["assignStage"] )?$('#voteStart').show():$('#voteStart').hide();


				if( data["voteStage"] ) {
					(data["voteList"][data["voteList"].length -1 ]).forEach(function(element){
						$("#P" + element["index"]).css("border","10px").css("border-style","solid").css("border-color","#FFD382");
					});
				};
				// 當所有人都投票了 計算投票結果並顯示 (如果投票回合還沒開始會找不到物件會出錯)
				if( data["voteStage"] && data["voteResultList"] ) {
					if ( data["voteResultList"][data["voteList"].length - 1].length == data["playerList"].length ) {
						(data["voteResultList"][data["voteList"].length - 1 ]).forEach(function(element){
							$("#P" + (element["index"]+1)).css("border","10px").css("border-style","solid").css("border-color",element["yesOrNo"]=="yes"?"#9ACD32":"#B22222");
							console.log(element["index"]);
							console.log();
						});
					
						//(data["voteList"][data["voteList"].length -1 ]).forEach(function(element){
						//	if ( playerIndex == element["index"] ){
						//		$('#chooseSuccessOrFailDiv').show();
						//	};
						//});
					};
				};
				if( data["missionStage"] ) {
					(data["roundList"][data["roundList"].length -1 ]).forEach(function(element){
						$("#P" + element["index"]).css("border","10px").css("border-style","solid").css("border-color","#FFD382");
						
						if ( playerIndex == element["index"] ){
							
							
							//$('#chooseSuccessOrFailDiv').show();
						};
					});
				};
				
				if( data["announcement"] ){
					$('#annouce').text(data["announcement"]);
				}

				if(data["roundShowResult"]){
					if ( ( (data["roundResult"][data["roundResult"].length - 1 ]).length -1 ) == data["gameAmount"][data["roundResult"].length - 1 ] ){
						var count1 = 0;
						(data["roundResult"][data["roundResult"].length - 1 ]).forEach(function(element){
							if ( element == "no" ) {
								count1++;
							};
						});
						if (data["roundResult"].length == 4 && data["playerList"].length > 6 ){
							if (count1 > 1 ){
								data["roundShowResult"][data["roundShowResult"].length -1 ] = "red"							
							}else{
								data["roundShowResult"][data["roundShowResult"].length -1 ] = "blue"
							}
						}else{
							if (count1 > 0 ){
								data["roundShowResult"][data["roundShowResult"].length -1 ] = "red"							
							}else{
								data["roundShowResult"][data["roundShowResult"].length -1 ] = "blue"
							}
						}
						data["assignStage"] = true;
						data["chooseStage"] = false;
						data["announcement"] = "上一局反對人數: " + count1;
						roomNumber.set({
							data : data
						});
					};
				};
				
				if(data["roundShowResult"]){
					var m = 1;
					data["roundShowResult"].forEach(function(element){
						$("#t" + (m++) + "-2").css('background-color', element);
					});
				};
				
			};			
		});
	};
	


	
	
///////////////////////////Canvas/////////////////////////////
//function initCanvas(){
//	var cvs = $("#cvs")[0];
//	var ctx = cvs.getContext("2D");
//	var img = new Image();
//	img.src="images/avalon/board_5.jpg"
//	img.onload=function(){
//		ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
//	};
//};

	var imageList = ["board_5.jpg","board_6.jpg","board_7.jpg","board_8.jpg","board_9.jpg","board_10.jpg","mission_token.png","vote_token.png","fail_token.png","success_token.png","梅林.jpg","好人.jpg","壞人.jpg","刺客.jpg","派西維爾.jpg","莫甘娜.jpg","莫德雷德.jpg","奧伯倫.jpg","yes.jpg","no.jpg","caption.jpg","mission.jpg","god.png","vote_token2.jpg","unknown.jpg","yes.jpg","no.jpg","camp.jpg"];
	var canvasMap = {};
	var imgMap = {};
	var loadImageProgress = 0;
	var resizer = SlEEPBAG.canvasAutoResizer;
	var cvs = document.getElementById('cvs');
	var boardCtx = cvs.getContext('2d');
	var makeCache  = function(index,img){
		img.onload = function(){
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = img.width ;
			canvas.height = img.height ;
			ctx.drawImage(img,0,0,img.width,img.height) ;
			canvasMap[imageList[index]] = canvas ;
			loadImageProgress ++ ;
			if ( loadImageProgress === imageList.length ){
				drawBoard();
			}
		}
	}

	for ( var i = 0 ; i < imageList.length ; i ++ ){
		var img = new Image();
		img.src = "images/avalon/" + imageList[i] ;
		imgMap[imageList[i]] = img ;
		makeCache(i,img) ;
	}

	window.addEventListener("resize",function(){
		drawBoard();
	})

	var nowRound = 5;
	var nowVote = 5;
	
	var drawBoard = function(){
		var b = $('#gameMember').val();
		boardCtx.drawImage(canvasMap["board_"+b+".jpg"],0,0);
		boardCtx.drawImage(canvasMap["vote_token.png"],(77*(nowVote-1))+8,238);
		for ( var i = 0 ; i < 5 ; i ++ ){
			boardCtx.drawImage(canvasMap["success_token.png"],(93*(i))+8,98);
			
		}
		boardCtx.drawImage(canvasMap["mission_token.png"],(92*(nowRound-1))+63,155);
	}
	
///////////////game page JS start////////////////////////////  


var isVotePass = false;

  	$('#returnRoomPage').on('click',function(){	
		data["playerList"].splice(data["playerList"].indexOf(playerInfoMap),1);
		roomNumber.set({
				data : null
		});	
		$('#gameStart').hide();
		$('#roomPage').show();
		$('#gamePage').hide();	
	});	

	
	$('#voteStart').on('click',function(){
		if ( data["roundList"] ) {
			if(data["gameAmount"][data["roundList"].length ] != $( "input.selectPlayer:checked" ).length){
				alert("選擇人數不對");
				return;
			}
		//"如果都沒開始任何賽局 直接抓第一個"
		}else {
		
			if(data["gameAmount"][0] != $( "input.selectPlayer:checked" ).length){
				alert("選擇人數不對");
				return;
			}
		};
		
		//如果第一局都還沒開始voteList會不存在
		var voteList= [];
		if ( data["voteList"] ){
			voteList = data["voteList"];
		};
		
		oneRoundVoteList = [];
		
		$.each($( "input.selectPlayer:checked" ),function(){
			var roundMap = new Object();
			roundMap["character"]=$(this).data("character");
			roundMap["index"]=$(this).data("index");
			oneRoundVoteList.push(roundMap);
		});

		voteList.push(oneRoundVoteList);
		

		data["voteList"] = voteList;
		data["assignStage"] = false;
		data["voteStage"] = true;
		data["missionStage"] = false;

		roomNumber.set({
			data : data
		});
	});


	$('#chooseYesOrNoBtn').on('click',function(){
		if ( 1 != $( "input.chooseYesOrNoClass:checked" ).length ) {
			alert("贊成/反對你只能擇一選擇");
			return;
		}
		//建立投票結果List
		var voteResultMap = new Object();
		voteResultMap["index"]=playerIndex;
		voteResultMap["yesOrNo"]=$( "input.chooseYesOrNoClass:checked" ).data("value");
		
		//存在
		if ( data["voteResultList"] ){			
			data["voteResultList"][data["voteList"].length - 1].push(voteResultMap);
		//不存在
		}else{
			var oneRoundVoteResultList = [];
			oneRoundVoteResultList.push(voteResultMap);
			var voteResultList = [];		
			voteResultList.push( oneRoundVoteResultList );
			data["voteResultList"] = voteResultList;
		};
		
		roomNumber.set({
			data : data
		});	
		
		$('#chooseYesOrNoDiv').hide();
		
	});
	//function votePass(){
	//	//讓指派任務按鈕可以傳下去
	//	if ( data["startIndex"] == ( data["playerList"].length ) ){
	//		data["startIndex"] = 1;
	//	}else{
	//		data["startIndex"] = data["startIndex"] + 1;
	//	};
	//
	//	//如果第一局都還沒開始gameOfRoundList會不存在
	//	var roundList;
	//	if ( data["roundList"] ){
	//		roundList = data["roundList"];
	//	}else{
	//		roundList = [];
	//	};
	//
	//	var oneRoundList = [];
	//	
	//	$.each($( "input.selectPlayer:checked" ),function(){
	//		var roundMap = new Object();
	//		roundMap["character"]=$(this).data("character");
	//		roundMap["index"]=$(this).data("index");
	//		oneRoundList.push(roundMap);
	//	});
	//	
	//	roundList.push(oneRoundList);
	//	
	//	///////////////////////////////////////
	//	var roundResult;
	//	if ( data["roundResult"] ){
	//		roundResult = data["roundResult"];
	//	}else{
	//		roundResult = [];
	//	};
	//	var oneResultList = [];
	//	oneResultList.push("YES");
	//	roundResult.push(oneResultList);
	//	////////////////////////////////////
	//	var roundShowResult;
	//	if ( data["roundShowResult"] ){
	//		roundShowResult = data["roundShowResult"];
	//	}else{
	//		roundShowResult = [];
	//	};		
	//
	//	roundShowResult.push("yellow");
	//
	//	////////////////////////////////////
	//	data["roundShowResult"] = roundShowResult;
	//	data["roundResult"] = roundResult;
	//	data["roundList"] = roundList;
	//	data["assignStage"] = false;
	//	data["chooseStage"] = false;
	//
	//	roomNumber.set({
	//		data : data
	//	});	
	//};

	
	$('#chooseSuccessOrFailBtn').on('click',function(){
		if ( 1 != $( "input.chooseSuccessOrFailClass:checked" ).length ) {
			alert("你/妳僅能選一張卡");
			return;
		}

		data["roundResult"][data["roundResult"].length - 1].push( $( "input.chooseSuccessOrFailClass:checked" ).data("value") );
		data["chooseStage"] = true;
		
		roomNumber.set({
			data : data
		});	
		
		$('#chooseSuccessOrFailDiv').hide();
		
	});
	
	$('#showYourCharacter').on('mousedown touchstart',function(){
		$("#showYourCharacter").html(data["playerList"][playerIndex]["character"]);
		if (data["playerList"][playerIndex]["character"] == "梅林"){
			$("p.刺客").css('background-color', 'red');
			$("p.魔甘娜").css('background-color', 'red');
			$("p.壞人").css('background-color', 'red');			
		}else if (data["playerList"][playerIndex]["character"] == "派西"){
			$("p.梅林").css('background-color', 'orange');
			$("p.魔甘娜").css('background-color', 'orange');
		}else if (data["playerList"][playerIndex]["character"] == "刺客"){
			$("p.刺客").css('background-color', 'red');
			$("p.魔甘娜").css('background-color', 'red');
			$("p.壞人").css('background-color', 'red');	
		}else if (data["playerList"][playerIndex]["character"] == "魔甘娜"){
			$("p.刺客").css('background-color', 'red');
			$("p.魔甘娜").css('background-color', 'red');
			$("p.壞人").css('background-color', 'red');			
		}else if (data["playerList"][playerIndex]["character"] == "壞人"){
			$("p.刺客").css('background-color', 'red');
			$("p.魔甘娜").css('background-color', 'red');
			$("p.壞人").css('background-color', 'red');			
		}
	}).on('mouseup mouseleave touchend', function() {
		$("#showYourCharacter").html("我是誰");
		if (data["playerList"][playerIndex]["character"] == "梅林"){
			$("p.刺客").css('background-color', "white");
			$("p.魔甘娜").css('background-color', "white");
			$("p.壞人").css('background-color', "white");			
		}else if (data["playerList"][playerIndex]["character"] == "派西"){
			$("p.梅林").css('background-color', "white");
			$("p.魔甘娜").css('background-color', "white");
		}else if (data["playerList"][playerIndex]["character"] == "刺客"){
			$("p.刺客").css('background-color', "white");
			$("p.魔甘娜").css('background-color', "white");
			$("p.壞人").css('background-color', "white");	
		}else if (data["playerList"][playerIndex]["character"] == "魔甘娜"){
			$("p.刺客").css('background-color', "white");
			$("p.魔甘娜").css('background-color', "white");
			$("p.壞人").css('background-color', "white");			
		}else if (data["playerList"][playerIndex]["character"] == "壞人"){
			$("p.刺客").css('background-color', "white");
			$("p.魔甘娜").css('background-color', "white");
			$("p.壞人").css('background-color', "white");			
		}
	});
	
  ///////////////game page JS end////////////////////////////
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /////////////////////////////////////////////////////////////////
  var rootRef = firebase.database().ref().child('info');
  $('#save_button').on('click',function(){
	 rootRef.set({
		info1:$('#info1').val(),
		info2:$('#info2').val()
	 });
  
  });
  
  $('#clear_button').on('click',function(){	
  		$('#info1').val('');
		$('#info2').val('');  
  });
  
  $('#load_button').on('click',function(){
  	rootRef.on('value',function(snapshot){
		$('#info1').val(snapshot.child('info1').val());
		$('#info2').val(snapshot.child('info2').val());			
	});  
  });
  
  ///////////////////////// value changed remove added
  
  var preObject = $('#object');
  
  const dbRefObject = firebase.database().ref().child('object');
  const dbRefObject2 = firebase.database().ref().child('object2');
  const dbRefList = dbRefObject.child('hobbies');
  
  var objectData;
  dbRefObject.on('value', snap => console.log(snap.val()));
  dbRefObject2.on('value', snap => {
	preObject.innerText = JSON.stringify(snap.val(), null, 3);  
  });
  
  var lidata="";
 
  dbRefList.on('child_added', snap=>{	
	lidata = snap.val();
	//console.log(lidata);
	var li = document.createElement('li');
	li.innerText = lidata;
	$('#list').append(li);
  });
  
   dbRefList.on('child_added', snap=>{	
	lidata = snap.val();
	//console.log(lidata);
	var li = document.createElement('li');
	li.innerText = lidata;
	li.id = snap.key;
	$('#list').append(li);
  });
  
    dbRefList.on('child_changed', snap=>{	
	  const liChanged = document.getElementById(snap.key);
	  liChanged.innerText=snap.val();	  
	});
	
    dbRefList.on('child_removed', snap=>{	
	  const liRemove = document.getElementById(snap.key);
	  liRemove.remove();	  
	});

	/////////////////////////// log in //// sign up //// log out
  var txtEmail = $('#txtEmail');
  var txtPassword = $('#txtPassword');
  const btnLogin = $('#btnLogin');
  const btnSignUp = $('#btnSignUp');
  const btnLogout = $('#btnLogout');
  const auth = firebase.auth();
  
  btnLogout.hide();
	var email = "";
	var pass = "";
  txtEmail.on("change",function(){
	email = $('#txtEmail').val();
	//console.log(email);
  });
  txtPassword.on("change",function(){
	pass = $('#txtPassword').val();
	//console.log(pass);
  });
	 btnLogin.on("click",function(){
		const auth = firebase.auth();
		const promise = auth.signInWithEmailAndPassword(email, pass); 
		promise.catch(e => console.log(e.message));

	});
	btnSignUp.on("click",function(){
		const auth = firebase.auth();
		const promise = auth.createUserWithEmailAndPassword(email, pass); 
		promise.catch(e => console.log(e.message));
	});
	btnLogout.on("click",function(){
		firebase.auth().signOut();

	});	

	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			//console.log(firebaseUser);
			btnLogout.show();
		} else {
			//console.log('not logged in');
			btnLogout.hide();
		}
	
	});
	
});