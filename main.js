
var score = 0;
var gameStatus = true;//to know that game is over
var timer = '';
$('.gamePlay').toggle();
$(".helpPage").toggle();//hide these two screens just show home
var home = false;//to know user is playing or in homepage/restart
var snowball = document.createElement('audio'); //adding audio elemnt to HTML document
snowball.src = "./audio/Snowball Impact Sound Effect.mp3";
snowball.volume = 0.1
var jewel = document.createElement('audio'); //adding audio elemnt to HTML document
jewel.src = "./audio/Gem (Spyro) - Sound Effect [HD].mp3";
jewel.volume = 0.1;
var music = document.createElement('audio'); //adding audio elemnt to HTML document
music.src = "./audio/Up To Something - Background Music (HD).mp3";
music.volume = 0.1;
var ending = document.createElement('audio');
ending.src = "./audio/TADA SOUND EFFECT.mp3";
ending.volume = 0.1;

$(document).ready(function () {

    $("#startBtn").on('click', () => {
        $(".startPage").toggle();
        $('.gamePlay').toggle();
        gameStatus = true;
        startGame();
    });

    $("#helpBtn").on('click', () => {
        $(".startPage").toggle();
        $('.helpPage').toggle();
    });

    $("#backBtn").on('click', () => {
        $(".helpPage").toggle();
        $('.startPage').toggle();
    });

    $('#homeBtn').on('click', () => {
        $('.gamePlay').toggle();
        $(".startPage").toggle();
        music.pause();
        music.currentTime = 0;
        gameStatus = false;
        home = true;
        snowball.pause()
        jewel.pause();
        clearInterval(timer);

    })

    $('#restart').on('click', () => {
        clearInterval(timer);
        home = true
        music.pause();
        music.currentTime = 0;
        startGame();
    });


});

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function checkCollision(penguin, item) {
    var x1 = penguin.offset().left;
    var y1 = penguin.offset().top;
    var h1 = penguin.outerHeight(true);
    var w1 = penguin.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = item.offset().left;
    var y2 = item.offset().top;
    var h2 = item.outerHeight(true);
    var w2 = item.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false; //no touch between the two 
    return true;
}




function startGame() {

    $('#stars').empty();
    $('#lives').empty();
    $('#hide').css('visibility', 'hidden');
    $('.item').empty()
    $('.item').remove()
    score = 0;
    var time = 60;
    home = false;
    gameStatus = true

    var interval_id = window.setInterval("", 9999); // Get a reference to the last
    // interval +1
    for (var i = 1; i < interval_id; i++)
        window.clearInterval(i);

    $('.score').text('00')
    music.play();

    $('#lives').append(`<img class="lives" src="./images/heart.png" alt="">
    <img class="lives" src="./images/heart.png" alt="">
    <img class="lives" src="./images/heart.png" alt="">`)

    $penguin = $("#moveCharacter");
    $(document).keydown(function (e) {
        var pengPosition = $penguin.position();
        if (gameStatus)
            switch (e.which) {
                case 37://left
                    if (pengPosition.left > 16)
                        $penguin.css('left', pengPosition.left - 20 + 'px')
                    break;
                case 39://right
                    if (pengPosition.left < 610)
                        $penguin.css('left', pengPosition.left + 20 + 'px')
                    break;

            }
    });


    var falling = setInterval(function () {
        if (home || !gameStatus) clearInterval(falling)//if the user wanted to go back home stop this interval immediately
        for (var i = 0; i < 2; i++) {

            if (home) break;
            if (gameStatus) fallingItem();

        }

    }, 4000);// falling 2 items every 4 sec


    timer = setInterval(() => {
        if (time < 10) {

            $(".timer").text('0' + time--);
        }
        else {
            $(".timer").text(time--);
        }

        if (time < 0 || !gameStatus || home) {
            clearInterval(timer);
            gameStatus = false;
            ending.play();
            $('#hide').css('visibility', 'visible');
        }
    }, 1000);



    function fallingItem() {

        if (home) return; //stop thrwoing items 

        var length = random(50, ($(".canvas").width() - 50));
        var velocity = 9000;
        var size = random(30, 35);
        var item = $("<div/>", {
            class: "item",
            style: "width:" + size + "px; height:" + size + "px; left:" + length + "px; transition: transform " + velocity + "ms linear;"
        });



        //set a value 0 or 1 to the data value 
        item.data('value', Math.round(Math.random()));

        //based on value choose item type 
        if (item.data('value')) {
            var jewels = ['./images/blue.png', './images/red.png', './images/purple.png', './images/pink.png']
            var index = random(0, jewels.length - 1)//get random color for the jewel 
            var jewelColor = 'url(' + jewels[index] + ')'

            item.css({ 'background': jewelColor, 'background-size': 'contain', 'background-repeat': 'no-repeat' });
        } else {
            item.css({ 'background': 'url(./images/snowball.png)', 'background-size': 'contain', 'background-repeat': 'no-repeat' });
        }

        var check = setInterval(() => {
            if (home) clearInterval(check)//if the user wanted to go back home stop this interval immediately
            if (checkCollision($penguin, item)) {
                if (item.data('value')) {//value =1 that means it's a jewel
                    item.remove()//remove jewels when penguin touch it and increase score 
                    jewel.play()
                    score += 10;
                    $('.score').text(score)
                    if (score == 40) {
                        $('#stars').append(`<img class="star" src="./images/star.png" alt="">`)
                    }
                    if (score == 90) {
                        $('#stars').append(`<img class="star" src="./images/star.png" alt="">`)
                    }
                    if (score == 120) {
                        $('#stars').append(`<img class="star" src="./images/star.png" alt="">`)
                    }
                }
                else {
                    item.remove();//remove snowball when penguin touch it and lose one heart
                    snowball.play()
                    $('.lives').last().remove();
                    if (!$('.lives').length) {
                        gameStatus = false;
                        ending.play();
                        $('#hide').css('visibility', 'visible');
                    }
                }

            }
        }, 20); //it check for collision every 20ms



        //draw the item

        $(".canvas").append(item);
        var exit = setInterval(() => {
            if (home) {
                item.remove()
                $('.item').empty()
                clearInterval(exit)//if the user wanted to go back home stop this interval immediately
            }

            if (!gameStatus) {

                music.pause();
                item.remove();
                clearInterval(exit)

            }
        }, 10);

        //random start for animation
        var move = setTimeout(function () {
            if (home) {
                item.remove()
                $('.item').empty()
                clearInterval(move)//if the user wanted to go back home stop this interval immediately
            }
            item.addClass("move");
        }, random(0, 4000));

        //remove this item when animation is over
        item.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function (event) {

                $(this).remove();

            });
    }


}
