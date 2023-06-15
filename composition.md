/*
On Load, game starts by randomizing the location of ships for both computer and player 1.

There are two boards on screen. One displays player 1's ships. 
The other board displays an empty grid as the computer's ships will be hidden.

Once the player inputs a guess and clicks on the fire button, a function will check if comouter's shipLocation
matches the guess, if true, it will change the class of the square on the grid and add the location to 
ships hit. If ships sinks, the function subtracts 1 from its totalShipsAlive.

The game showcases the current status of the game at the top of the screen.

Once all ships have sunk, a function in the player class will check if totalShipsAlive === 0, and if so, we have a winner.

//Classes
A player class is constructed to initialize properties for player 1. Properties like their ship locations,
if their ships have been hit, if their ships have sank. 

A computer class will be extended from the player class, since the computer will need a function that randomizes its guesses.

A game class will have the init function as well as the render functions to display the changes of the game on screen.
*/