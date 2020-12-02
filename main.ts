/*
** draw a pair of poles from x axis value and pole's height value
*/
function drawPoles(pole_x: number, pole_height: number) {
    // draw top pole by turning on the 
    // LED from 0 to pole_height + 1
    for (let i = 0; i <= pole_height + 1; i++) {
        led.plot(pole_x, pole_height - i);
        // set pole brightness to 125
        led.plotBrightness(pole_x, pole_height - i, 125);
    }

    if (easy_mode) {
        // draw top pole by turning on the 
        // LED from 4 to pole_height + 3 (+3 to create 
        // a 2-LED wide gap for bird clearance)
        for (let i = 4; i >= pole_height + 3; i--) {
            led.plot(pole_x, i);
            // set pole brightness to 125
            led.plotBrightness(pole_x, i, 125);
        }
    }
    else {
        // draw top pole by turning on the 
        // LED from 4 to pole_height + 3 (+2 to create 
        // a 1-LED wide gap for bird clearance)
        for (let i = 4; i >= pole_height + 2; i--) {
            led.plot(pole_x, i);
            // set pole brightness to 125
            led.plotBrightness(pole_x, i, 125);
        }
    }
}

/*
** turn off all LEDs for column at row x
*/
function clearColumnLEDs(x: number) {
    // go through all 4 of the row's LEDs
    for (let y = 0; y <= 4; y++) {
        // clear column LEDS
        led.unplot(x, y);
        // turn on LED at bird's position
        drawBird();
    }
}

/*
** draw bird by turning on LED at bird x and y axis
*/
function drawBird() {
    // turn on the LED of the bird
    led.plot(bird_x, bird_y);
    // set bird's LED brightness to maximum
    led.plotBrightness(bird_x, bird_y, 255);
}

/*
** move bird up by 1 LED in y axis
*/
function jump() {
    // turn off the LED of the current bird
    led.unplot(bird_x, bird_y);
    // add to y axis to move the bird up
    bird_y--;
    bird_y = Math.floor(bird_y);
    drawBird();
}

/*
** move bird down by 1 LED in y axis
** function for debug
*/
// function descend() {
//     led.unplot(bird_x, bird_y);
//     bird_y++;
//     led.plot(bird_x, bird_y);
//     led.plotBrightness(bird_x, bird_y, 255);
// }

/*
** move bird down by 1 LED in y axis
*/
function descendBird() {
    // turn off the LED of the current bird
    led.unplot(bird_x, bird_y);
    // add to y axis to move the bird down
    bird_y += 0.5;
    // turn on the LED of the bird with new y axis position
    drawBird();
}

/*
** draw 1st pair of poles
*/
function drawPoles1() {
    // if pair of poles finished their run through the screen
    if (poles1_x == 5) {
        // clear first column (far left) LEDs
        clearColumnLEDs(0);
    }

    // clear the column shown 1 LED to the right of the current x axis
    clearColumnLEDs(Math.abs(-1 - poles1_x));
    // clear column LEDs before drawing new poles
    clearColumnLEDs(poles1_x);
    // show poles at row x
    drawPoles(poles1_x, poles1_height);

    // move pole 1 LED to the left
    poles1_x--;

    // pair of poles finished their run through the screen
    // reset x axis value and randomize height
    if (poles1_x < 0) {
        poles1_x = 5;
        if (!easy_mode) {
            // make the pole gap at a height that's possible 
            // for the bird to fall down to
            if (poles2_height == -1) {
                poles1_height = randint(-1, 2);
            }
            else {
                poles1_height = randint(-1, 3);
            }
        }
        else {
                poles1_height = randint(-1, 2);
        }
    }
}

/*
** draw 2nd pair of poles
*/
function drawPoles2() {
    // if pair of poles finished their run through the screen
    if (poles2_x == 5) {
        // clear first column (far left) LEDs
        clearColumnLEDs(0);
    }

    // clear the column shown 1 LED to the right of the current x axis
    clearColumnLEDs(Math.abs(-1 - poles2_x));
    // clear column LEDs before drawing new poles
    clearColumnLEDs(poles2_x);
    // show poles at row x
    drawPoles(poles2_x, poles2_height);

    // move pole 1 LED to the left
    poles2_x--;

    // pair of poles finished their run through the screen
    // reset x axis value and randomize height
    if (poles2_x < 0) {
        poles2_x = 5;
        if (!easy_mode) {
            // make the pole gap at a height that's possible 
            // for the bird to fall down to
            if (poles1_height == -1) {
                poles2_height = randint(-1, 2);
            }
            else {
                poles2_height = randint(-1, 3);
            }
        }
        else {
                poles2_height = randint(-1, 2);
        }
    }
}

/*
** check if the bird makes impact with a pole
*/
function checkImpact() {
    // if the bird descends passed the bottom of the screen
    if (bird_y > 4 || bird_y < 0) {
        // end the game
        in_game = false;
        music.playTone(Note.G, 200);
        music.playTone(Note.G3, 500);
        music.startMelody(music.builtInMelody(Melodies.Funeral))

        // micro:bit v2 sound
        // soundExpression.sad.play();
    }

    let bottom_poles_height = 0;

    // if the pole is at the bird's position
    if (poles1_x == bird_x) {
        if (easy_mode) {
            bottom_poles_height = poles1_height + 3;
        }
        else {
            bottom_poles_height = poles1_height + 2;
        }
        
        // if bird's y axis is within the poles' heights
        if (bird_y <= poles1_height || bird_y >= bottom_poles_height) {
            // end the game
            in_game = false;

            // play sounds to indicate that the 
            // player has hit a pole and the game has ended
            music.playTone(Note.G, 200);
            music.playTone(Note.G3, 500);
            music.startMelody(music.builtInMelody(Melodies.Funeral));

            // micro:bit v2 sound
            // soundExpression.sad.play();
        }
        else {
            point++;

            // play sounds to indicate player has
            // successfully dodged the poles
            music.playTone(Note.GSharp4, 150);
            music.playTone(Note.GSharp5, 150);
        }
    }

    // if the pole is at the bird's position
    else if (poles2_x == bird_x) {
        if (easy_mode) {
            bottom_poles_height = poles2_height + 3;
        }
        else {
            bottom_poles_height = poles2_height + 2;
        }

        // if bird's y axis is within the poles' heights
        if (bird_y <= poles2_height || bird_y >= bottom_poles_height) {
            // end the game
            in_game = false;
            
            // play sounds to indicate that the 
            // player has hit a pole and the game has ended
            music.playTone(Note.G, 200);
            music.playTone(Note.G3, 500);
            music.startMelody(music.builtInMelody(Melodies.Funeral));

            // micro:bit v2 sound
            // soundExpression.sad.play();
        }
        else {
            point++;

            // play sounds to indicate player has
            // successfully dodged the poles
            music.playTone(Note.GSharp4, 150);
            music.playTone(Note.GSharp5, 150);
        }
    }
    // game ended
    if (!in_game) {
        // set player score
        game.setScore(point);
        // show game over screen
        game.gameOver();
    }
}

let poles1_height = randint(-1, 2); // 1st pair of poles' height
let poles1_x = 5; // 1st pair of poles' x axis
let poles2_height = randint(-1, 2); // 2nd pair of poles' height
let poles2_x = 5; // 2nd pair of poles' x axis
let bird_x = 1; // bird x axis
let bird_y = 2; // bird y axis
let show_poles2_countdown = 3;  // count to draw 2nd pair of poles 2 
                                // LEDs away from first pole
let point = 0; // store player points
let select_mode = true;    // select mode stage
let in_game = false; // boolean to check if game is on-going
let easy_mode = true; // true = easy mode: poles have a 2-LED wide gap
                      // false = hard mode: poles have a 1-LED wide gap
let first_time = true;  // boolean for first loop check 

/*
** when button A is pressed
*/
input.onButtonPressed(Button.A, function () {
    // in-game, make bird jump
    if (in_game) {
        // prevent going out of bounds
        if (bird_y > 0) {
            jump();
        }
    }
    // during select mode period
    else if (select_mode) {
        // clear screen LEDs
        basic.clearScreen();
        // stop showing mode selection string
        led.stopAnimation();
        // no longer at mode selection period
        select_mode = false;
        // set game to easy mode
        easy_mode = true;
    }
})

/*
** when button B is pressed
*/
input.onButtonPressed(Button.B, function () {
    // in-game, make bird jump
    if (in_game) {
        // prevent going out of bounds
        if (bird_y > 0) {
            jump();
        }
    }
    // during select mode period
    else if (select_mode) {
        // clear screen LEDs
        basic.clearScreen();
        // stop showing mode selection string
        led.stopAnimation();
        // no longer at mode selection period
        select_mode = false;
        // set game to hard mode
        easy_mode = false;
    }
})

input.onButtonPressed(Button.AB, function () {
    if(!in_game) {
        select_mode = true;
        point = 0; 
    }
})

basic.forever(function () {
    // mode selection stage
    if (select_mode) {
        basic.showString("MODE:A=EASY B=HARD  ", 125);
    }
    // game start
    else {
        // ------------------- //
        // starting animations //
        // ------------------- //
        // 3-2-1 countdown before the game starts
        for (let j = 3; j > 0; j--) {
            basic.showNumber(j);
            basic.pause(500);
        }

        // play music and display the word "GO!"
        music.startMelody(music.builtInMelody(Melodies.Entertainer))
        basic.clearScreen();
        basic.showString("GO!");
        basic.clearScreen();
        // -------------------------- //
        // end of starting animations //
        // -------------------------- //

        in_game = true;

        while (in_game) {
            // pull bird down every frame
            descendBird();
            // check bird impact
            checkImpact();

            // draw 1st pair of poles
            drawPoles1();

            if (easy_mode) {
                // set first run to false
                if (show_poles2_countdown == 0) {
                    first_time = false;
                }
                // draw 2nd pair of poles
                if (!first_time) {
                    drawPoles2();
                }

                // continue countdown if is first run
                if (first_time) {
                    show_poles2_countdown--;
                }

                // delay animations
                basic.pause(550);
            }
            else {
                // delay animations
                basic.pause(460);
            }
        }
    }
})
