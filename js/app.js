$(document).ready(function() {

	var URL = "https://accesscontrolalloworiginall.herokuapp.com/https://www.opentdb.com/api.php?amount=10&type=multiple";

	var expTable = [11, 25, 57, 84, 129, 192, 283, 406, 537, 688, 861, 1050];
	var hpTable = [5, 9, 15, 23, 30, 38, 47, 55, 64, 76, 83, 90];

	var setQuestions = function(qCategory, qDifficulty, qType) {
		if(qCategory!==undefined) {
			this.category=qCategory;
		}
		if(qDifficulty!==undefined) {
			this.difficulty=qDifficulty;
		}
		if(qType!==undefined) {
			this.type=qType;
		}
	};

	var Player = function(playerName, playerGender) {
		this.name = playerName;
		this.gender = playerGender;
		this.level = 1;
		this.exp = 0;
		this.expForLvUp = 11;
		this.hp = 5;
		this.maxHp = 5
		this.coins = 50;
		this.hints = 5;
		this.potion = 3;
		this.capsule = 0;
		this.capsuleUsed = 0;
		this.elixir = 1;
	};

	var playerInfo = [];
	var newPlayer;
	var quizType = [];
	var options = [];


	var App = {
		init: function() {
			App.bindEvents();
		},

		bindEvents: function() {
			App.chooseGame();
			App.inputName();
			App.chooseGender();
			App.showPlayerInfo();
			App.itemsMenu();
			App.storeMenu();
			App.setQuizCategory();
			App.setQuizDiff();
			App.answerQuestions();
		},

		currentQuestions: [],

		chooseGame: function() {
			if (localStorage.getItem('name') === null || localStorage.getItem('hp')<1) {
				$('#loadGame').css('visibility', 'hidden');
				$('#newGame').css({'float': 'none', 
								   'width': '150px', 
								   'margin':'auto',
								   'margin-top': '70px'});
			}

			setTimeout(function() {
				$('#start').fadeIn(2500);
			}, 1000);
			setTimeout(function() {
				$('#title').css({'text-shadow':'6px 6px 3px #666666',
								 'transform':'translateX(-3px)'})
			}, 2500);
			setTimeout(function() {
				$('footer').fadeIn(2000);
			}, 3500);

			$('#newGame').click(function() {
				$('#start').fadeOut(2000);
				setTimeout(function() {
					App.welcomMsg();
				}, 2000);
			});
			$('#loadGame').click(function() {
				window.location.replace("game.html");
			});
		},

		welcomMsg: function() {
			var path = window.location.pathname;
			if (path === "/trivia_master/") {
				setTimeout(function() {
					App.showMessage($("#message1"));
				}, 1500); 
				setTimeout(function() {
					App.eraseText($("#message1"));
				}, 4000);
				setTimeout(function() {
					App.showMessage($("#message2"));
				}, 6500); 
				setTimeout(function() {
					App.eraseText($("#message2"));
				}, 9500);
				setTimeout(function() {
					App.showMessage($("#message3"));
				}, 11500); 
				setTimeout(function() {
					App.eraseText($("#message3"));
				}, 14500);
				setTimeout(function() {
					App.showNameBox();
				}, 17000);
			}
		},

		showMessage: function(text) {
			text.css("color", "#424242");
			var wordlist = text.html().split("");
			text.html("");
			var tagGoing = "";
			$.each(wordlist, function(idx, elem) {
				if(elem === "<" || elem === ">") {
					tagGoing += elem;
					var foundTag = $(tagGoing).appendTo(text);
					foundTag.css("opacity", 0);
					foundTag.delay(idx * 50);
					foundTag.animate({opacity: 1}, 1200);
					tagGoing = "";
				} else {
					if (tagGoing !== "") {
						tagGoing += elem;
					} else {
						var newEl = $("<span/>").text(elem).css("opacity", 0);
						newEl.appendTo(text);
						newEl.delay(idx * 70);
						newEl.animate({opacity: 1}, 1200);
					}
				}
			});
		},

		eraseText: function(elem, timing) {
			setTimeout(function() {
				elem.fadeOut(1500);
			}, timing);
		},

		showNameBox: function() {
			$('#askName').fadeIn(1500);
		},

		inputName: function() {
			$('#nameOk').on('click', function() {
				$('#askName .warning').remove();
				if($('#askName input').val().trim() === "") {
					$('#askName').append("<p class='warning'>Please enter your name</p>");
				} else {
					playerInfo[0] = $('#askName input').val();
					$('#askName').fadeOut(1000);
					setTimeout(function() {
						App.showGenderBox();
					}, 2500);
				}
			});
		},

		showGenderBox: function() {
			$('#askGender').fadeIn(2000);
		},

		chooseGender: function() {
			$('#askGender img').on('click', function() {
				playerInfo[1] = $(this).attr('id');
				$('#askGender').fadeOut(2000);
				App.createPlayer();
				var playerName = localStorage.getItem('name');
				var message = "OK , " + playerName + ". Let's start the game."
				setTimeout(function() {
					$('#message4').css('display', 'block');
				}, 2500);
				$('#message4').html(message);
				setTimeout(function() {
					App.showMessage($("#message4"));
				}, 3500); 
				setTimeout(function() {
					App.eraseText($("#message4"));
				}, 7000);
				setTimeout(function() {
					window.location.replace("game.html");
				}, 9000);

			});
		},

		createPlayer: function() {
			newPlayer = new Player(playerInfo[0], playerInfo[1]);
			localStorage.setItem('name', newPlayer.name);
			localStorage.setItem('gender', newPlayer.gender);
			localStorage.setItem('level', newPlayer.level);
			localStorage.setItem('exp', newPlayer.exp);
			localStorage.setItem('expNeeded', newPlayer.expForLvUp);
			localStorage.setItem('hp', newPlayer.hp);
			localStorage.setItem('maxHp', newPlayer.maxHp);
			localStorage.setItem('coins', newPlayer.coins);
			localStorage.setItem('hints', newPlayer.hints);
			localStorage.setItem('potion', newPlayer.potion);
			localStorage.setItem('capsule', newPlayer.capsule);
			localStorage.setItem('capsuleUsed', newPlayer.capsuleUsed)
			localStorage.setItem('elixir', newPlayer.elixir);
		},

		showPlayerInfo: function() {
			var path = window.location.pathname;
			var page = path.split("/").pop();
			if (page === "game.html") {
				$(document).ready(function() {
					$('#name').text(localStorage.getItem("name"));
					$('#level').text(localStorage.getItem("level"));
					$('#exp').text(localStorage.getItem("exp"));
					$('#expNeeded').text(localStorage.getItem("expNeeded"));
					$('#hp').text(localStorage.getItem("hp"));
					$('#maxHp').text(localStorage.getItem("maxHp"));
					$('#coins').text(localStorage.getItem("coins"));
					$('#hints').text(localStorage.getItem("hints"));
					$('#potion').text(localStorage.getItem("potion"));
					$('#capsule').text(localStorage.getItem("capsule"));
					$('#elixir').text(localStorage.getItem("elixir"));
					var gender = localStorage.getItem('gender');
					if (gender === 'male') {
						$('#playerInfo img').attr('src', 'images/boy.png');
					} else {
						$('#playerInfo img').attr('src', 'images/girl.png');
					}
					if ($(window).width() <= 1024) {
						$('#playerInfo').css('display', 'none');
					} 
				})
				
				$('#menu').click(function() {
					$('#playerInfo').slideToggle();
				})
			}
		},

		itemsMenu: function() {
			$('#items').click(function() {
					$('#itemList').slideToggle();
			});
			$('#itemList li:first-child').click(function() {
				var hints = parseInt(localStorage.getItem('hints'));
				if(hints > 0) {
					$('#itemList').hide();
					$('#useHint').show();
					$('#quiz ul').hide();
				}
			});
			$('#itemList li:nth-child(2)').click(function() {
				var potion = parseInt(localStorage.getItem('potion'));
				if (potion > 0) {
					$('#itemList').hide();
					$('#usePotion').show();
					$('#quiz ul').hide();
				}
			});
			$('#itemList li:nth-child(3)').click(function() {
				var capsule = parseInt(localStorage.getItem('capsule'));
				if (capsule > 0) {
					$('#itemList').hide();
					$('#useCapsule').show();
					$('#quiz ul').hide();
				}
			});
			$('.confirmUseItem .no').click(function() {
				$('.confirmUseItem').hide();
				$('#itemList').show();
				$('#quiz ul').show();
			});
			$('#useHint .yes').click(function() {
				App.useHint();
				$('.confirmUseItem').hide();
				$('#itemList').show();
				$('#quiz ul').show();
			});
			$('#usePotion .yes').click(function() {
				App.usePotion();
				$('.confirmUseItem').hide();
				$('#itemList').show();
				$('#quiz ul').show();
			});
			$('#useCapsule .yes').click(function() {
				App.useCapsule();
				$('.confirmUseItem').hide();
				$('#itemList').show();
				$('#quiz ul').show();
			});			
		},

		storeMenu: function() {
			$('#store').click(function() {
					$('#productList').slideToggle();
			});
			$('#productList li').click(function () {
				var item = $(this).attr('value');
				var itemPrice = parseInt($(this).children('span').text());
				App.purchaseItem(item, itemPrice);
			})
		},

		setQuizCategory: function() {
			var path = window.location.pathname;
			var page = path.split("/").pop();
			if (page === "game.html") {
				setTimeout(function() {
					App.showText('#setCategory p', 'Please choose a question category', 0, 30);
				}, 1500);
				$('#gamePage').fadeIn(2000);
				setTimeout(function() {
					$('#setCategory ul').fadeIn(1500);
				}, 3000);
			}
				
			$('#setCategory li').click(function() {
				
				quizType[0] = $(this).attr('value');
				$('#setCategory').fadeOut(1000);
				setTimeout(function() {
					$('#setDiff').fadeIn(1500)
				}, 1000);
				setTimeout(function() {
					App.showText('#setDiff p', 'Please select question difficulty', 0, 30);
				}, 2000);
				setTimeout(function() {
					$('#setDiff ul').fadeIn(1500)
				}, 3500);
			})
		},

		setQuizDiff: function() {
			$('#setDiff li').click(function() {
				quizType[1] = $(this).attr('value');
				$('#setDiff').fadeOut(1500);
				App.sendUrl();
				setTimeout(function() {
					$('#quiz').fadeIn(1000)
				}, 3000);
			})
		},

		showText: function (target, message, index, interval) {   
		  if (index < message.length) {
		    $(target).append(message[index++]);
		    setTimeout(function () { App.showText(target, message, index, interval); }, interval);
		  }
		},

		sendUrl: function() {
			var newQuersions = new setQuestions(quizType[0], quizType[1], quizType[2]);
			App.showQuestions(newQuersions);
		},

		showQuestions: function(data) {
			var request = App.requestQuiz(data);
			request.done(function(response) {
				if (response.results.length === 0) {
					setTimeout(function() {
						$('#quiz').css('height', '0');
					}, 2500);
					setTimeout(function() {
						$('#noQuestion').fadeIn(2000);
					}, 3000);
					setTimeout(function() {
						$('#noQuestion').fadeOut(2000);
					}, 7000);
					setTimeout(function() {
						location.reload();
					}, 9000);
				} else {
					App.formatResponse(response);
					App.renderQuestions(App.currentQuestions[0]);
					$('#itemMenu').fadeIn(3000);
					$('#storeMenu').fadeIn(3000);
				}
			});
		},

		answerQuestions: function() {
			var i = 0;
			$('#quiz').on('click', 'li', function() {
				App.judge($(this).attr('value'), App.currentQuestions[i].correct_answer, App.currentQuestions[i].difficulty);
				if(localStorage.getItem('hp')<1) {
					if (parseInt(localStorage.getItem('elixir')) < 1) {
						App.gameOver();
						return;
					} else {
						App.useElixir();
					}
				}

				$('#quiz').fadeOut(1500);
				i++;
				setTimeout(function() {
					App.renderQuestions(App.currentQuestions[i]);
				}, 1600);

				if (i===10) {
					setTimeout(function() {
						$('#quiz').html("<p>Please choose another category.</p>");
					}, 1500)
					setTimeout(function() {
						$('#quiz').fadeIn(1500);
					},2000);
					setTimeout(function() {
						$('#quiz').fadeOut(1500);
					},4000);
					setTimeout(function() {
						location.reload();
					},5500);
				} else {
					$('#quiz').fadeIn(1500);
				}
			});
		},

		formatResponse: function(questions) {
			App.currentQuestions = questions.results;
			console.log(App.currentQuestions);
			var correctAnswerIndex = _.random(0,3);
			for(var i=0; i<App.currentQuestions.length; i++) {
				options[i] = JSON.parse(JSON.stringify(App.currentQuestions[i].incorrect_answers));
				options[i].splice(correctAnswerIndex, 0, App.currentQuestions[i].correct_answer);
				App.currentQuestions[i].index = i+1;
			}

			console.log(options);
			
			for (var j=0; j<App.currentQuestions.length; j++) {
				App.currentQuestions[j].first = options[j][0];
				App.currentQuestions[j].second = options[j][1];
				App.currentQuestions[j].third = options[j][2];
				App.currentQuestions[j].fourth = options[j][3];
			}
		},

		questionTemplate: _.template(
			'<h3><span id="qNum"><%= index %></span>/10. <%= question %>&nbsp; &nbsp; &nbsp; &nbsp; <div id="diff">(Difficulty: <%= difficulty %>)</div></h3>' +
			'<ul>' +
				'<li value="<%- first %>">A. <%= first %></li>' +
				'<li value="<%- second %>">B. <%= second %></li>' +
				'<li value="<%- third %>">C. <%= third %></li>' +
				'<li value="<%- fourth %>">D. <%= fourth %></li>' +
			'</ul>' +
			'<img id="result" src="" hidden>'
		),

		singleQuestionMarkup: function(question) {
			return App.questionTemplate(question);
		},

		renderQuestions: function(question) {
			var questionMarkup = App.singleQuestionMarkup(question);
			$('#quiz').html(questionMarkup);
		},

		requestQuiz: function(data) {
			return $.ajax(URL, {
				dataType: "json",
				data: data
			})
		},

		judge: function(answer, correctAnswer, difficulty) {
			if (answer === correctAnswer) {
				var exp = parseInt(localStorage.getItem('exp'));
				var coins = parseInt(localStorage.getItem('coins'));
				if (difficulty === 'easy') {
					exp+=3;
					coins+=2;
				} else if (difficulty ==='medium') {
					exp+=4;
					coins+=3;
				} else {
					exp+=5;
					coins+=4;
				}

				$('#exp').css('color', '#00F210');
				setTimeout(function() {
					$('#exp').css('color', 'yellow');
				}, 1500);
				$('#coins').css('color', '#00F210');
				setTimeout(function() {
					$('#coins').css('color', 'yellow');
				}, 1500);

				$('#result').attr('src', 'images/correct.png');
				$('#result').fadeIn(200);
				setTimeout(function() {
					$('#result').fadeOut(5000);
				}, 2000);

				$('#exp').text(exp);
				$('#coins').text(coins);
				localStorage.setItem('exp', exp);
				localStorage.setItem('coins', coins);
				App.checkLevel();

			} else {
				var hp = parseInt($('#hp').text());
				if (difficulty === 'easy') {
					hp-=1;
				} else if (difficulty ==='medium') {
					hp-=2;
				} else {
					hp-=3;
				}

				$('#hp').css('color', '#FF3D40');
				setTimeout(function() {
					$('#hp').css('color', 'yellow');
				}, 1500);

				$('#result').attr('src', 'images/wrong.png');
				$('#result').fadeIn(200);
				setTimeout(function() {
					$('#result').fadeOut(500);
				}, 2000);

				if (hp < 0) {
					$('#hp').text(0);
					localStorage.setItem('hp', 0);
				} else {
					$('#hp').text(hp);
					localStorage.setItem('hp', hp);
				}
			}
		},

		checkLevel: function() {
			var level = parseInt(localStorage.getItem("level"));
			var exp = parseInt(localStorage.getItem("exp"));
			var hp = parseInt(localStorage.getItem("hp"));
			var capsuleUsed = parseInt(localStorage.getItem("capsuleUsed"));

			if(exp>=expTable[level-1]) {
				exp-=expTable[level-1];
				level++;

				$('#level').css('color', '#00F210');
				setTimeout(function() {
					$('#level').css('color', 'yellow');
				}, 1500);

				$('#exp').text(exp);
				localStorage.setItem('exp', exp);
				$('#level').text(level);
				localStorage.setItem('level', level);
				$('#hp').text(hpTable[level-1]+capsuleUsed*10);
				localStorage.setItem('hp', hpTable[level-1]+capsuleUsed*10);
				$('#expNeeded').text(expTable[level-1]);
				localStorage.setItem('expNeeded', expTable[level-1]);
				$('#maxHp').text(hpTable[level-1]+capsuleUsed*10);
				localStorage.setItem('maxHp', hpTable[level-1]+capsuleUsed*10);
			}
		},

		useHint: function() {
			var hintNumber = parseInt(localStorage.getItem('hints'));
			if (hintNumber === 0) {
				return;
			} else {
				var questionNumber = parseInt($('#qNum').text())-1;
			
				var eliminatedOptionIndex = _.random(0, App.currentQuestions[questionNumber].incorrect_answers.length-1);
				var eliminatedOption = App.currentQuestions[questionNumber].incorrect_answers[eliminatedOptionIndex];

				$('#quiz li').each(function() {
					if($(this).attr("value") === eliminatedOption) {
						$(this).fadeOut(1500);
					}
				})
				App.currentQuestions[questionNumber].incorrect_answers.splice(eliminatedOptionIndex, 1);
				
				hintNumber--;
				$('#hints').text(hintNumber);
				localStorage.setItem('hints', hintNumber);
			}
		},

		usePotion: function() {
			var hp = parseInt(localStorage.getItem("hp"));
			var maxHp = parseInt(localStorage.getItem("maxHp"));
			var potionNumber = parseInt(localStorage.getItem("potion"));
			if(hp === maxHp || potionNumber === 0) {return;}
			hp+5>maxHp?hp=maxHp:hp+=5;
			potionNumber--;
			localStorage.setItem('hp', hp);
			$('#hp').text(hp);
			localStorage.setItem('potion', potionNumber);
			$('#potion').text(potionNumber);

			$('#hp').css('color', '#00F210');
			setTimeout(function() {
				$('#hp').css('color', 'yellow');
			}, 1500);
		},

		useCapsule: function() {
			var maxHp = parseInt(localStorage.getItem("maxHp"));
			var capsuleNumber = parseInt(localStorage.getItem("capsule"));
			var capsuleUsed = parseInt(localStorage.getItem("capsuleUsed"));
			if (capsuleNumber ===0) {
				return;
			} else {
				maxHp += 10;
				capsuleNumber--;
				capsuleUsed++;
				$('#maxHp').text(maxHp);
				localStorage.setItem('maxHp', maxHp);
				$('#capsule').text(capsuleNumber);
				localStorage.setItem('capsule', capsuleNumber);
				localStorage.setItem('capsuleUsed', capsuleUsed);

				$('#maxHp').css('color', '#00F210');
				setTimeout(function() {
					$('#maxHp').css('color', 'yellow');
				}, 1500);
			}
		},

		useElixir: function() {
			var elixirNumber = parseInt(localStorage.getItem("elixir"));
			var hp = parseInt(localStorage.getItem("hp"));
			var maxHp = parseInt(localStorage.getItem("maxHp"));

			hp = Math.round(maxHp/2);
			elixirNumber--;
			$('#hp').text(hp);
			localStorage.setItem('hp', hp);
			$('#elixir').text(elixirNumber);
			localStorage.setItem('elixir', elixirNumber);

			$('#elixir').css('color', '#00F210');
				setTimeout(function() {
					$('#elixir').css('color', 'gray');
				}, 1500);
		},

		purchaseItem: function(item, price) {
			var coins = parseInt(localStorage.getItem('coins'));
			var itemNumber = parseInt(localStorage.getItem(item));
			var numberChange = $("#itemList li span[id="+item+"]");  

			if(coins < price) {
				return;
			} else {
				coins -= price;
				itemNumber++;
				numberChange.text(itemNumber);
				$('#coins').text(coins);
				localStorage.setItem(item, itemNumber);
				localStorage.setItem('coins', coins);
			}
		},

		gameOver: function() {
			$('#quiz').fadeOut(2000);
			setTimeout(function() {
				$('#gameOver').fadeIn(2000);
			}, 3000);
			$('#startAgain').click(function() {
				$('#gameOver').fadeOut(2000);
				setTimeout(function() {
					location.reload();
				}, 3000);
			})
			var name = localStorage.getItem('name');
			var gender = localStorage.getItem('gender');
			App.createPlayer();
			localStorage.setItem('name', name);
			localStorage.setItem('gender', gender);
		}
	};

	App.init();
});