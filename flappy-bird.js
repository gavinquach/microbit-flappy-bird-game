/*
** draw a pair of poles from x axis position and pole height parameters
*/
function drawPoles(pole_x: number, pole_height: number) {
    // draw top pole by looping
    // 
    for (let i = 0; i <= pole_height + 1; i++) {
        led.plot(pole_x, pole_height - i);
        led.plotBrightness(pole_x, pole_height - i, 125);
    }
    // draw bottom pole by looping
    // 
    for (let i = 4; i >= pole_height + 3; i--) {
        led.plot(pole_x, i);
        led.plotBrightness(pole_x, i, 125);
    }
}

/*
** turn off all LEDs for column at row x
*/
function clearColumn(x: number) {
    // go through all 4 of the row's LEDs
    for (let y = 0; y <= 4; y++) {
        // if row to clear is bird's x position
        if (x == bird_x) {
            // clear columns around the bird only
            for (let y2 = 0; y2 <= 4; y2++) {
                if (y2 != bird_y) {
                    led.unplot(x, y2);
                }
            }
        }
        else {
            led.unplot(x, y);
        }
    }
}

/*
** draw bird by turning on LED at bird x and y axis
*/
function drawBird() {
    led.plot(bird_x, bird_y);
    led.plotBrightness(bird_x, bird_y, 255);
}

/*
** move bird up by 1 LED in y axis
*/
function jump() {
    led.unplot(bird_x, bird_y);
    bird_y--;
    led.plot(bird_x, bird_y);
    led.plotBrightness(bird_x, bird_y, 255);
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
    led.unplot(bird_x, bird_y);
    bird_y += 0.5;
    led.plot(bird_x, bird_y);
    led.plotBrightness(bird_x, bird_y, 255);
}

/*
** draw 1st pair of poles
*/
function drawPoles1() {
    if (poles1 == -2) {
        if (-1 - poles1_x == -5) {
            clearColumn(0);
        }
    }
    if (poles1 > -2) {
        clearColumn(Math.abs(-1 - poles1_x));
        clearColumn(poles1_x); // clear column LEDs before drawing new poles
        drawPoles(poles1_x, poles1); // show poles at column
        poles1_x--;
    }
}

/*
** draw 2nd pair of poles
*/
function drawPoles2() {
    if (poles2 == -2) {
        if (-1 - poles2_x == -5) {
            clearColumn(0);
        }
    }
    if (poles2 > -2) {
        clearColumn(Math.abs(-1 - poles2_x));
        clearColumn(poles2_x); // clear column LEDs before drawing new poles
        drawPoles(poles2_x, poles2); // show poles at column
        poles2_x--;
    }
}

/*
** random poles' heights and reset x axis position
*/
function resetPolesPos() {
    if (poles1 == -3) {
        poles1 = randint(-1, 2);
    }
    if (poles1 == -2) {
        poles1--;
    }
    if (poles1_x < 0) {
        poles1_x = 4;
        poles1 = -2;
    }
    if (poles2 == -3) {
        poles2 = randint(-1, 2);
    }
    if (poles2 == -2) {
        poles2--;
    }
    if (poles2_x < 0) {
        poles2_x = 4;
        poles2 = -2;
    }
}

let first_time = true;  // first loop check boolean
let poles1 = randint(-1, 2);    // 1st pair of poles' height
let poles1_x = 4;   // 1st pair of poles' x axis
let poles2 = -3;    // 2nd pair of poles' height (-3 and -2 are disabled)
let poles2_x = 4;   // 2nd pair of poles' x axis
let bird_x = 1; // bird x axis
let bird_y = 2; // bird y axis
let i = 7;  // give some time for player before showing poles
let in_game = true; // boolean to check if game is on-going
let point = 0;

/*
** make the bird go up when B is pressed
*/
input.onButtonPressed(Button.A, function () {
    // prevent going out of bounds
    if (bird_y > 0) {
        jump();
    }
})

/*
** make the bird go up when B is pressed
*/
input.onButtonPressed(Button.B, function () {
    // prevent going out of bounds
    if (bird_y > 0) {
        jump();
    }
})

basic.forever(function () {
    // ------------------- //
    // starting animations //
    // ------------------- //
    // for (let j = 3; j > 0; j--) {
    //     basic.showNumber(j);
    //     basic.pause(500);
    // }
    // music.startMelody(music.builtInMelody(Melodies.Entertainer))
    // basic.clearScreen();
    // basic.showString("GO!")

    // basic.clearScreen();
    // -------------------------- //
    // end of starting animations //
    // -------------------------- //

    while (in_game) {
        // ------------------------ //
        // pole imact check section //
        // ------------------------ //
        if (in_game) {
            // if the bird descends passed the bottom of the screen
            if (bird_y > 4) {
                // end the game
                in_game = false;
                music.playTone(Note.G, 200);
                music.playTone(Note.G3, 500);
                music.startMelody(music.builtInMelody(Melodies.Funeral))

                // micro:bit v2 sound
                // soundExpression.sad.play();
            }

            // if 1st pair of poles are on screen
            if (poles1 > -2) {
                // if the pole is at the bird's position
                if (poles1_x == bird_x) {
                    // if bird's y axis is within the poles' heights
                    if (bird_y <= poles1 || bird_y >= poles1 + 3) {
                        // end the game
                        in_game = false;
                        music.playTone(Note.G, 200);
                        music.playTone(Note.G3, 500);
                        music.startMelody(music.builtInMelody(Melodies.Funeral))

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
            }

            // if 2nd pair of poles are on screen
            if (poles2_x > -2) {
                // if the pole is at the bird's position
                if (poles2_x == bird_x) {
                    // if bird's y axis is within the poles' heights
                    if (bird_y <= poles2 || bird_y >= poles2 + 3) {
                        // end the game
                        in_game = false;
                        music.playTone(Note.G, 200);
                        music.playTone(Note.G3, 500);
                        music.startMelody(music.builtInMelody(Melodies.Funeral))

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
            }
        }
        if (!in_game) {
            game.setScore(point);
            game.gameOver();
        }
        // ------------------------------- //
        // end of pole imact check section //
        // ------------------------------- //

        // draw bird on screen
        drawBird();

        if (i == 4) {
            drawPoles1(); // draw first pair of poles

            // check if is not first loop
            if (!first_time) {
                drawPoles2(); // draw second pair of poles
                resetPolesPos(); // reset and randomize poles
            }
        }
        else if (i == 3) {
            drawPoles1(); // draw first pair of poles

            // check if is not first loop
            if (!first_time) {
                drawPoles2(); // draw second pair of poles
                resetPolesPos(); // reset and randomize poles
            }
        }
        else if (i == 2) {
            drawPoles1(); // draw first pair of poles

            // check if is not first loop
            if (!first_time) {
                drawPoles2(); // draw second pair of poles
                resetPolesPos(); // reset and randomize poles
            }
        }
        else if (i == 1) {
            drawPoles1(); // draw first pair of poles

            // check if is still first loop
            if (first_time) {
                // random second pair of poles' heights
                poles2 = randint(-1, 2);
            }
            drawPoles2(); // draw second pair of poles

            // check if is not first loop
            if (!first_time) {
                // reset and randomize poles
                resetPolesPos();
            }
        }
        else if (i == 0) {
            drawPoles1(); // draw first pair of poles
            drawPoles2(); // draw second pair of poles
            
            // first loop over
            first_time = false;

            // check if is not first loop
            if (!first_time) {
                // reset and randomize poles
                resetPolesPos();
            }
        }

        // keep iterating
        i--;
        if (i < 0) {
            i = 4;
        }
        // add to score after every sucessful pole dodge


        // pull bird down every frame
        descendBird();

        // delay for 500ms until next frame
        basic.pause(500);
    }
})
