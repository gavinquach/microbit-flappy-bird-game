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
    // draw top pole by turning on the 
    // LED from 4 to pole_height + 3 (+3 to create 
    // a 2-LED wide gap for bird clearance)
    // (might add a hard mode to make the gap 1 LED wide in the future)
    for (let i = 4; i >= pole_height + 3; i--) {
        led.plot(pole_x, i);
        // set pole brightness to 125
        led.plotBrightness(pole_x, i, 125);
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
    // turn on the LED of the bird with new y axis position
    led.plot(bird_x, bird_y);
    // set bird's LED brightness to maximum
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
    // turn off the LED of the current bird
    led.unplot(bird_x, bird_y);
    // add to y axis to move the bird down
    bird_y += 0.5;
    // turn on the LED of the bird with new y axis position
    led.plot(bird_x, bird_y);
    // set bird's LED brightness to maximum
    led.plotBrightness(bird_x, bird_y, 255);
}

/*
** draw 1st pair of poles
*/
function drawPoles1() {
    // if pole finished its loop
    if (poles1_height == -2 && poles1_x == 4) {
        // clear first column (far left) LEDs
        clearColumnLEDs(0);
    }
    if (poles1_height > -2) {
        // clear the column shown 1 LED to the right of the current x axis
        clearColumnLEDs(Math.abs(-1 - poles1_x));
        // clear column LEDs before drawing new poles
        clearColumnLEDs(poles1_x);
        // show poles at row x
        drawPoles(poles1_x, poles1_height);

        // check bird impact
        checkImpact();

        // move x axis 1 LED to the left
        poles1_x--;
    }
}

/*
** draw 2nd pair of poles
*/
function drawPoles2() {
    // if pole finished its loop
    if (poles2_height == -2 && poles2_x == 4) {
        // clear first column (far left) LEDs
        clearColumnLEDs(0);
    }
    if (poles2_height > -2) {
        // clear the column shown 1 LED to the right of the current x axis
        clearColumnLEDs(Math.abs(-1 - poles2_x));
        // clear column LEDs before drawing new poles
        clearColumnLEDs(poles2_x);
        // show poles at row x
        drawPoles(poles2_x, poles2_height);

        // check bird impact
        checkImpact();

        // move x axis 1 LED to the left
        poles2_x--;
    }
}

/*
** random poles' heights and reset x axis position
*/
function resetPolesPos() {
    // randomize first pair of poles' height value
    if (poles1_height == -3) {
        poles1_height = randint(-1, 2);
    }
    // first pair of poles' height value is -2, 
    // decrease by 1 as means for it to display
    // every three iterations of the while loop
    if (poles1_height == -2) {
        poles1_height--;
    }
    // first pair of poles' height value is less
    // than 0, reset x axis value and set height
    // to -2 to delay it from displaying
    if (poles1_x < 0) {
        poles1_x = 4;
        poles1_height = -2;
    }
    // randomize second pair of poles' height value
    if (poles2_height == -3) {
        poles2_height = randint(-1, 2);
    }
    // second pair of poles' height value is -2, 
    // decrease by 1 as means for it to display
    // every three iterations of the while loop
    if (poles2_height == -2) {
        poles2_height--;
    }
    // second pair of poles' height value is less
    // than 0, reset x axis value and set height
    // to -2 to delay it from displaying
    if (poles2_x < 0) {
        poles2_x = 4;
        poles2_height = -2;
    }
}

/*
** check if the bird makes impact with a pole
*/
function checkImpact() {
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
        if (poles1_height > -2) {
            // if the pole is at the bird's position
            if (poles1_x == bird_x) {
                // if bird's y axis is within the poles' heights
                if (bird_y <= poles1_height || bird_y >= poles1_height + 3) {
                    // end the game
                    in_game = false;

                    // play sounds to indicate that the 
                    // player has hit a pole and the game has ended
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
                if (bird_y <= poles2_height || bird_y >= poles2_height + 3) {
                    // end the game
                    in_game = false;
                    
                    // play sounds to indicate that the 
                    // player has hit a pole and the game has ended
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
    // game ended
    if (!in_game) {
        // set player score
        game.setScore(point);
        // show game over screen
        game.gameOver();
    }
}

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
                // randomize second pair of poles' heights
                poles2_height = randint(-1, 2);
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
