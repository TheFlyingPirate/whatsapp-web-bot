 (() => {
	//
	// GLOBAL VARS AND CONFIGS
	//
	var antiAutoReply;
	var prevSend;
	var lastMessageOnChat = false;
	var ignoreLastMsg = {};
	var elementConfig = {
		"chats": [0, 0, 5, 2, 0, 3, 0, 0, 0],
		"pane-side": [0, 0, 5, 2, 0, 3, 0, 0, 0],
		"chat_icons": [0, 0, 1, 1, 1, 0],
		".xD91K": [0, 0, 1, 1, 1, 0],
		"chat_title": [0, 0, 1, 0, 0, 0, 0],
		"chat_lastmsg": [0, 0, 1, 1, 0, 0],
		"chat_active": [0, 0],
		"selected_title": [0, 0, 5, 3, 0, 1, 1, 0, 0, 0, 0]
	};
	
	
	
	const commandList = ["Command 1","Command 2"];//insert your own commands here
	const replyList = ["Reply 1","Reply 2"]; //insert your replies here
	const defaultReply = "Default Reply";//insert the default Reply here


	//
	// FUNCTIONS
	//
	function getElement(id, parent){
		if (!elementConfig[id]){
			//alert("Testa");
			return false;
		}
		var elem = !parent ? document.body : parent;
		var elementArr = elementConfig[id];
		elementArr.forEach(function(pos) {
			if (!elem.childNodes[pos]){
				return false;
			}
			elem = elem.childNodes[pos];
		});
		return elem;
	}
	
	function getLastMsg(){
		var messages = document.querySelectorAll('.FTBzM');
		//console.log(document.querySelectorAll('.FTBzM'));
		var pos = messages.length-1;
		while (messages[pos] && (messages[pos].classList.contains('msg-system') || messages[pos].querySelector('.message-in'))){
			pos--;
			if (pos <= -1){ 
				return false;
			}
		}
		if (messages[pos] && messages[pos].querySelector('.selectable-text')){	
			return messages[pos].querySelector('.selectable-text').innerText.trim();
		} else {
			return false;
		}
	}
	
	function getUnreadChats(){
		var unreadchats = [];
		var chats = getElement("pane-side");
		//alert(chats);
		if (chats){
			chats = chats.childNodes;
			
			for (var i in chats){
				
				if (!(chats[i] instanceof Element)){
					continue;
				}
				
			
				var classValue = "P6z4j";
				var messageCount = chats[i].getElementsByClassName(classValue);
				if (messageCount.length==1){
					  unreadchats.push(chats[i]);
					//  alert(chats[i].className);
				}
			
			}
		}
		return unreadchats;
	}
	
	function didYouSendLastMsg(){

		var messages = document.querySelectorAll('.FTBzM, .msg');

		if (messages.length <= 0){
			return false;
		}
		var pos = messages.length-1;
		
		while (messages[pos] && messages[pos].classList.contains('msg-system')){
			pos--;
			if (pos <= -1){
				return -1;
			}
		}
		if (messages[pos].querySelector('.message-out')){
			return true;
		}
		if (messages[pos].classList.contains('message-out')){
			return true;
			
		}
		
		
		return false;
	}

	// Call the main function again
	const goAgain = (fn, sec) => {
		//const chat = document.querySelector('div.chat:not(.unread)')
		//selectChat(chat)
		setTimeout(fn, sec * 1000)
	}

	// Dispath an event (of click, por instance)
	const eventFire = (el, etype) => {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
		el.dispatchEvent(evt);
	}

	// Select a chat to show the main box
	const selectChat = (chat, cb) => {
		const title = getElement("chat_title",chat).title;
		
		eventFire(chat.firstChild.firstChild.firstChild, 'mousedown');
		if (!cb) return;
		const loopFewTimes = () => {
			setTimeout(() => {
				const titleMain = getElement("selected_title").title;
				if (titleMain !== undefined && titleMain != title){
					console.log('not yet');
					return loopFewTimes();
				}
				return cb();
			}, 300);
		}

		loopFewTimes();
	}

	// Send a message
	const sendMessage = (chat, message, cb) => {
		//avoid duplicate sending
		var title;

		if (chat){
			title = getElement("chat_title").title;
		} else {
			title = document.getElementsByClassName("_19RFN")[0].innerHTML.replace(/[\u2000-\u206F]/g, "");
		}
		
		ignoreLastMsg[title] = message;
		
		messageBox = document.querySelectorAll("[contenteditable='true']")[0];

		//add text into input field
		messageBox.innerHTML = message.replace(/  /gm,'');

		//Force refresh
		event = document.createEvent("UIEvents");
		event.initUIEvent("input", true, true, window, 1);
		messageBox.dispatchEvent(event);

		//Click at Send Button
		eventFire(document.querySelector('span[data-icon="send"]'), 'click');

		cb();
	}

	//
	// MAIN LOGIC
	//
	const start = (_chats, cnt = 0) => {
		// get next unread chat
		const chats = _chats || getUnreadChats();
		const chat = chats[cnt];
		
		var processLastMsgOnChat = false;
		var lastMsg;
		
		if (!lastMessageOnChat){
			if (false == (lastMessageOnChat = getLastMsg())){
				lastMessageOnChat = true; //to prevent the first "if" to go true everytime
			} else {
				lastMsg = lastMessageOnChat;
			}
		} else if (lastMessageOnChat != getLastMsg() && getLastMsg() != false && !didYouSendLastMsg()){
			lastMessageOnChat = lastMsg = getLastMsg();
			processLastMsgOnChat = true;
		}
		
		if (!processLastMsgOnChat && (chats.length == 0 || !chat)) {
			console.log(new Date(), 'nothing to do now... (1)', chats.length, chat);
			return goAgain(start, 3);
		}

		// get infos
try{ 	
	selectChat(chat);
}catch(err){}
		var title;
		if (!processLastMsgOnChat){
			title = getElement("chat_title",chat).title + '';
			lastMsg = (getElement("chat_lastmsg", chat) || { innerText: '' }).title.replace(/[\u2000-\u206F]/g, ""); //.last-msg returns null when some user is typing a message to me
			
		} else {
			title = document.getElementsByClassName("_19RFN")[0].innerHTML.replace(/[\u2000-\u206F]/g, "");
		}
		
		console.log('Cazooooooooo', title,lastMsg );
		
		// avoid sending duplicate messaegs
		if (ignoreLastMsg[title] && (ignoreLastMsg[title]) == lastMsg) {
			console.log(new Date(), 'nothing to do now... (2)', title, lastMsg);
			return goAgain(() => { start(chats, cnt + 1) }, 0.5);
		}
		if(lastMsg==replyList[0]){
		lastMsg="";
		}
		// what to answer back?
		let sendText
		
		for(var i=0;i<commandList.length;i++){
			if(lastMsg.toUpperCase() == commandList[i]){
				sendText = replyList[i];
			}
			if(lastMsg==replyList[i]){
				sendText = "";
			}
		
		}
		
		if(!sendText&&lastMsg!=""){
		sendText = defaultReply;
		}
		for(var i=0;i<commandList.length;i++){
			if(lastMsg==replyList[i]){
				sendText = "";
			}
		
		}
		if(lastMsg==defaultReply){
			sendText = "";
		}
		
		// that's sad, there's not to send back...
	
		if(prevSend==lastMsg){
			sendText="";
		}
		
		if(antiAutoReply==title +" "+lastMsg){
				
				sendText="";
			
		}
	
		antiAutoReply=title+ " " + lastMsg;
		prevSend=sendText;
		if (!sendText) {
			ignoreLastMsg[title] = lastMsg;
			console.log(new Date(), 'new message ignored -> ', title, lastMsg);
			return goAgain(() => { start(chats, cnt + 1) }, 0.1);
		}

		console.log(new Date(), 'new message to process, uhull -> ', title, lastMsg);

		// select chat and send message
		
		if (!processLastMsgOnChat){
			
			selectChat(chat, () => {if(sendText!=false){
				sendMessage(chat, sendText.trim(), () => {
					goAgain(() => { start(chats, cnt + 1) }, 1);
				});
			}})
		} else {
			
			sendMessage(null, sendText.trim(), () => {
				goAgain(() => { start(chats, cnt + 1) }, 1);
			});
		}
	}
	start();
})()
