// CONST
const BOARDSIZE = 7;
const LETTERBOARD = [`A`, `B`, `C`, `D`, `E`, `F`, `G`];

/*----- app's state (variables) -----*/
let winner = null;
let turn = 1;
let compGuesses = [];

class Ships {
    constructor(){
        this.shipLocation = [];
        this.succesfulHits = [];
        this.shipLength = 5;
        this.sunk = false;
    }

    initShip() {
        this.generateShip();
        console.log(`Thie First ship is located at: ${this.shipLocation}`);
    }

    generateShip() {
        let side = Math.floor(Math.random() * 2 + 1);
        let yAxis = null;
        let xAxis = null;
        let tempShipLocal = [];

        if(side === 1)
        {
            xAxis = Math.floor(Math.random() * BOARDSIZE);
            yAxis = Math.floor(Math.random() * (BOARDSIZE - this.shipLength));
        }
        else
        {
            xAxis = Math.floor(Math.random() * (BOARDSIZE - this.shipLength));
            yAxis = Math.floor(Math.random() * BOARDSIZE);
        }

        for(let i = 0; i < this.shipLength; i++)
        {
            if(side === 1)
            {
                tempShipLocal.push(LETTERBOARD[xAxis] + (yAxis + i));
            }
            else
            {
                tempShipLocal.push(LETTERBOARD[xAxis + i] + yAxis);
            }
        }
        this.shipLocation = tempShipLocal;
    }

    handleFiring(guess) {
        let index = this.shipLocation.indexOf(guess);
        if(this.succesfulHits[index] === `success`)
        {
            console.log(this.succesfulHits[index]);
            turn === 1 ? renderMessage(`Player 1: You've already selected this spot`) : renderMessage(`Comp: You've already selected this spot`);
            return true;
        }
        else if (index >= 0) 
        {
            this.succesfulHits[index] = `success`;
            if(this.shipSunk()) 
            {
                turn === 1 ? renderMessage(`Player 1 you've successfully sunk a ship`) : renderMessage(`Computer has successfully sunk a ship`);
                return true;
            }
            turn === 1 ? renderMessage(`Nice Player 1! You've hit a ship at ${guess}`) : renderMessage(`Computer has hit a ship at ${guess}`);
            return true;
        } 
        else
        {   
            turn === 1 ? renderMessage(`Player 1 your shot at ${guess} was a miss`) : renderMessage(`Computer has missed a shot at ${guess}`)
        }
        return false;
    }

    shipSunk() {
        for(let i = 0; i < this.shipLength; i++)
        {
            if(this.succesfulHits[i] !== `success`)
            {
                return false;
            }
        }
        this.sunk = true;
        return true;
    }   
}

class Cruiseship extends Ships {
    constructor() {
        super();
        this.shipLength = 4;
    }

    initShip(locationFirstShip) {
    this.isShipRepeating(locationFirstShip)
        console.log(`The 2nd ship is located at: ${this.shipLocation}`)
    }

    isShipRepeating(locationFirstShip) {
        let exitValue;
        this.generateShip();

        for(let i = 0; i < this.shipLocation.length; i++)
        {
            if(locationFirstShip.includes(this.shipLocation[i]))
            {
                console.log(`oopsie`);
                exitValue = true;
            }
        }
        if(exitValue)
        {
            this.isShipRepeating(locationFirstShip);
        }
        return exitValue;
    }
}

class Smallship extends Ships {
    constructor() {
        super();
        this.shipLength = 3;
    }

    initShip(locationFirstShip, locationSecondShip) {
        this.isShipRepeating(locationFirstShip, locationSecondShip)
        console.log(`The 3rd ship is located at: ${this.shipLocation}`)
    }

    isShipRepeating(locationFirstShip, locationSecondShip) {
        this.generateShip();
        let exitValue = false;
        for(let i = 0; i < this.shipLocation.length; i++)
        {
            if(locationFirstShip.includes(this.shipLocation[i]) ||
            locationSecondShip.includes(this.shipLocation[i]))
            {
                console.log(`oopsie`);
                exitValue = true;
            }
        }
        if(exitValue)
        {
            this.isShipRepeating(locationFirstShip, locationSecondShip)
        }
        return exitValue;
    }
}


/*----- cached element references -----*/
const fireBtn = document.getElementById(`fireBtn`);
const message = document.getElementById(`messageBoard`);
const compBoard = document.getElementById(`compBoard`);
const userBoard = document.getElementById(`userBoard`);
const guessInput = document.getElementById(`guessInput`);

/*----- event listeners -----*/
fireBtn.addEventListener(`click`, handleFireBtn);
userBoard.addEventListener(`click`, handleCellClick);




/*----- functions -----*/
function init() {
    console.log("started initializing ships")
    firstShip = new Ships;
    secondShip = new Cruiseship;
    thirdShip = new Smallship;

    computerFirstShip = new Ships;
    computerSecondShip = new Cruiseship;
    computerThirdShip = new Smallship

    firstShip.initShip();
    secondShip.initShip(firstShip.shipLocation);
    thirdShip.initShip(firstShip.shipLocation, secondShip.shipLocation);

    computerFirstShip.initShip();
    computerSecondShip.initShip(computerFirstShip.shipLocation);
    computerThirdShip.initShip(computerFirstShip.shipLocation, computerSecondShip.shipLocation);

    console.log("finished initializing ships")
}

function handleGuess(guess, firstShip, secondShip, thirdShip) {
    let isHit = firstShip.handleFiring(guess) || secondShip.handleFiring(guess)||
        thirdShip.handleFiring(guess);
        if(isHit && firstShip.sunk && secondShip.sunk && thirdShip.sunk)
        {
            fireBtn.disabled = true;
            fireBtn.removeEventListener(`click`, handleFireBtn);
            guessInput.disabled = true; 
            winner = `winner`;
            turn === 1 ? renderMessage(`Player 1 has won!`) : renderMessage(`Computer has won!`);
        }
        else if(isHit)
        {
            turn === -1 ? compGuesses.push(guess) : ``;
            turn === 1 ? renderUserBoard(guess, `success`) : renderCompBoard(guess, `success`);
        }
        else
        {
            turn === -1 ? compGuesses.push(guess) : ``;
            turn === 1 ? renderUserBoard(guess, `miss`) : renderCompBoard(guess, `miss`);
        }
}

function improvedRandomGuess(ship, location) {
    let counter = 0;
    let compSuccessfulHits = [];
    let xAxis = null;
    let yAxis = null;
    let improvGuess = null;
    for(let i = 0; i < ship.succesfulHits.length; i++)
    {
        if(ship.succesfulHits[i] === `success`)
        {
            compSuccessfulHits.push(ship.shipLocation[i]);
            counter++;
        }
    }
    console.log(`this is the counter: ${counter}`);
    console.log(compSuccessfulHits);

    if(counter > 1)
    {
        if(compSuccessfulHits[0][0] === compSuccessfulHits[1][0])
        {
            do{
                const randomIndex = Math.floor(Math.random() * counter);
                const randomNum = Math.floor(Math.random() * (BOARDSIZE - ship.shipLength));
                let firstChar = compSuccessfulHits[randomIndex][0];
                let secondChar = compSuccessfulHits[randomIndex][1];
                console.log(`location 0: ${compSuccessfulHits[randomIndex][0]}`)
                console.log(`location 1: ${secondChar}`)
                const addingOrSubstracting = Math.random() * 2;
                if(secondChar === 6)
                {
                    console.log(`this is the improvGuess 1.3500`)
                    if(compGuesses.includes(firstChar + (secondChar - 1)))
                    {
                        console.log(`this is the improvGuess 1.355`)
                        console.log(`HERE: ${compGuesses.includes(firstChar + (secondChar - 1))}`)
                        console.log(randomNum);
                        xAxis = secondChar - randomNum;
                        
                    }
                    else
                    {
                        console.log(`this is the improvGuess 1.3400`)
                        xAxis = secondChar - 1;
                    }
                    
                }
                else if (secondChar === 0)
                {
                    if(compGuesses.includes(firstChar + (secondChar + 1)))
                    {
                        console.log(`this is the improvGuess 1.3600`)
                        xAxis = secondChar + randomNum;
                    }
                    else
                    {
                        console.log(`this is the improvGuess 1.3700`)
                        xAxis = secondChar + 1;
                    }
                }
                else if(addingOrSubstracting == 1)
                {
                    console.log(`this is the improvGuess 1.3900`)
                    xAxis = secondChar + 1
                }
                else
                {
                    console.log(`this is the improvGuess 1.3950`)
                    xAxis = secondChar - 1;
                }
                yAxis = firstChar;
                improvGuess = yAxis + xAxis;
                console.log(`Location Guess from counter > 1 if: ${improvGuess}`);
            }while(compGuesses.includes(improvGuess))
            console.log(`this is the improvGuess 1.3: ${improvGuess}`)
        }
        else
        {
            do{
                const randomNum = Math.floor(Math.random() * (LETTERBOARD - ship.shipLength));
                const randomIndex = Math.floor(Math.random() * counter);
                const addingOrSubstracting = Math.floor(Math.random() * 2);
                let firstChar = compSuccessfulHits[randomIndex][0];
                firstChar = LETTERBOARD.indexOf(firstChar);
                if(firstChar === 6)
                {
                    if(compGuesses.includes((firstChar - 1) + secondChar))
                    {
                        yAxis = firstChar - randomNum;
                        yAxis = LETTERBOARD[yAxis];
                    }
                    else
                    {
                        yAxis = firstChar - 1;
                        yAxis = LETTERBOARD[yAxis];
                    }
                }
                else if (firstChar === 0)
                {
                    if(compGuesses.includes((firstChar + 1) + secondChar))
                    {
                        yAxis = firstChar + randomNum;
                        yAxis = LETTERBOARD[yAxis];
                    }
                    else
                    {
                        yAxis = firstChar + 1;
                        yAxis = LETTERBOARD[yAxis];
                    }
                }
                else
                {
                    yAxis = addingOrSubstracting === 1 ? firstChar + 1 : firstChar - 1;
                    yAxis = LETTERBOARD[yAxis];
                }
                xAxis = compSuccessfulHits[randomIndex][1];
                improvGuess = yAxis + xAxis;
                console.log(`Location Guess from counter > 1 else ${improvGuess}`);
            }while(compGuesses.includes(improvGuess))
            console.log(`this is the improvGuess 1.450: ${improvGuess}`)
        }
        console.log(`this is the improvGuess 1.4: ${improvGuess}`)
        return improvGuess;
    }
    else if(counter === 1)
    {
        const side = Math.floor(Math.random() * 2);
        let firstChar = location[0];
        console.log(`location 0: ${firstChar}`)
        let secondChar = parseInt(location[1]);
        console.log(`location 1: ${secondChar}`)
        if(side === 1)
        {
            do{
                const randomNum = Math.floor(Math.random() * (LETTERBOARD - ship.shipLength));
                firstChar = LETTERBOARD.indexOf(firstChar);
                const addingOrSubstracting = Math.floor(Math.random() * 2);

                if(firstChar === 6)
                {
                    if(compGuesses.includes((firstChar - 1) + secondChar))
                    {
                        console.log(compGuesses.includes((firstChar - 1) + secondChar))
                        yAxis = firstChar + randomNum;
                        yAxis = LETTERBOARD[yAxis];
                    }
                    else
                    {
                        yAxis = firstChar - 1;
                        yAxis = LETTERBOARD[yAxis];
                    }
                }
                else if (firstChar === 0)
                {
                    if(compGuesses.includes((firstChar - 1) + secondChar))
                    {
                        console.log(compGuesses.includes((firstChar + 1) + secondChar))
                        yAxis = firstChar + randomNum;
                        yAxis = LETTERBOARD[yAxis];
                    }
                    else
                    {
                        yAxis = firstChar + 1;
                        yAxis = LETTERBOARD[yAxis];
                    }
                }
                else
                {
                    yAxis = addingOrSubstracting === 1 ? firstChar + 1 : firstChar - 1;
                    yAxis = LETTERBOARD[yAxis];
                }
                xAxis = location[1];
                improvGuess = yAxis + xAxis;
                console.log(`Location Guess from counter === 1 if ${improvGuess}`);
            }while(compGuesses.includes(improvGuess))
            console.log(`this is the improvGuess 1.5: ${improvGuess}`)
        }
        else
        {
            do{
                const randomNum = Math.floor(Math.random() * (LETTERBOARD - ship.shipLength));
                const addingOrSubstracting = Math.floor(Math.random() * 2);
                if(secondChar === 6)
                {
                    if(compGuesses.includes(firstChar + (secondChar - 1)))
                    {
                        console.log(`=== else 1 .2`)
                        console.log(compGuesses.includes(firstChar + (secondChar + 1)))
                        xAxis = secondChar - randomNum;
                        console.log(xAxis);
                    }
                    else
                    {
                        console.log(`=== else 1 .3`)
                        xAxis = secondChar - 1;
                    }
                }
                else if (secondChar === 0)
                {
                    if(compGuesses.includes(firstChar + (secondChar + 1)))
                    {
                        console.log(`=== else 1 .4`)
                        console.log(compGuesses.includes(firstChar + (secondChar + 1)))
                        xAxis = secondChar + randomNum;
                        console.log(xAxis);
                    }
                    else
                    {
                        console.log(`=== else 1 .5`)
                        xAxis = secondChar + 1;
                    }
                }
                else
                {
                    xAxis = addingOrSubstracting === 1 ? (secondChar + 1) : (secondChar - 1);
                }
                yAxis = location[0];
                improvGuess = yAxis + xAxis;
                console.log(`Location Guess from counter === 1 else ${improvGuess}`);
            }while(compGuesses.includes(improvGuess))
        }
        return improvGuess;
    }
    return;
}

function computerGuessingImproved() {
    let shipHitLocation;
    const firstShipIndex = computerFirstShip.succesfulHits.indexOf(`success`);
    const secondShipIndex = computerSecondShip.succesfulHits.indexOf(`success`);
    const thirdShipIndex = computerThirdShip.succesfulHits.indexOf(`success`);

    if(firstShipIndex >= 0 && computerFirstShip.sunk !== true)
    {
        shipHitLocation = computerFirstShip.shipLocation[firstShipIndex];
        return improvedRandomGuess(computerFirstShip, shipHitLocation);
    }
    else if(secondShipIndex >= 0 && computerSecondShip.sunk !== true)
    {
        shipHitLocation = computerSecondShip.shipLocation[secondShipIndex];
        return improvedRandomGuess(computerSecondShip, shipHitLocation);
    }
    else if(thirdShipIndex >= 0 && computerThirdShip.sunk !== true)
    {
        shipHitLocation = computerThirdShip.shipLocation[thirdShipIndex];
        return improvedRandomGuess(computerThirdShip, shipHitLocation);
    }
    return false;
}

function shipHasBeenHit() {
    const firstShipIndex = computerFirstShip.succesfulHits.indexOf(`success`);
    const secondShipIndex = computerSecondShip.succesfulHits.indexOf(`success`);
    const thirdShipIndex = computerThirdShip.succesfulHits.indexOf(`success`);

    if(firstShipIndex >= 0 || secondShipIndex >= 0 || thirdShipIndex >= 0)
    {
        return true;
    }

    return false;
}

function computerGuess() {
    let guessValue = null;
    if(shipHasBeenHit())
    {
        guessValue =  computerGuessingImproved();
    }
    else
    {
        do{
            let yAxis = LETTERBOARD[Math.floor(Math.random() * 7)];
            let xAxis = Math.floor(Math.random() * 7);
            let guessValue = yAxis + xAxis;
            console.log(`computer guess: ${guessValue}`);
        }while(compGuesses.indexOf(guessValue) >= 0)
        return guessValue;
    }
    return guessValue;
}

function handleFireBtn() {
    fireBtn.disabled = true;
    fireBtn.removeEventListener(`click`, handleFireBtn);
    let compGuess = computerGuess();
    const guessValue = guessInput.value;

    handleGuess(guessValue, firstShip, secondShip, thirdShip);
    turn *= -1;
    if(firstShip.sunk && secondShip.sunk && thirdShip.sunk)
    {
        return;
    }

    setTimeout( () => {
        handleGuess(compGuess, computerFirstShip, computerSecondShip, computerThirdShip);
        turn *= -1;
        fireBtn.disabled = false;
        fireBtn.addEventListener(`click`, handleFireBtn);
    }, 2500);
}

function handleCellClick(event) {
    const target = event.target;
    const guessValue = target.id;
    userBoard.disabled = true;
    userBoard.removeEventListener(`click`, handleCellClick);
    let compGuess = computerGuess();

    handleGuess(guessValue, firstShip, secondShip, thirdShip);
    turn *= -1;
    if(firstShip.sunk && secondShip.sunk && thirdShip.sunk)
    {
        return;
    }

    setTimeout( () => {
        handleGuess(compGuess, computerFirstShip, computerSecondShip, computerThirdShip);
        turn *= -1;
        userBoard.disabled = false;
        userBoard.addEventListener(`click`, handleCellClick);
    }, 2500);
}

function renderMessage(text){
    if( text === ``)
    {
        message.innerText = ``;
    }
    else
    {
        message.innerText = text;
    }
}

function renderCompBoard(guess, missOrHit) {
    const cellChange = compBoard.querySelector(`#${guess}`);

    if(missOrHit === `success`)
    {
        console.log(missOrHit, guess)
        cellChange.classList.add(`hit`);
    }
    else
    {
        console.log(missOrHit, guess)
        cellChange.classList.add(`miss`);
    }
}

function renderUserBoard(guess, missOrHit) {
    const cellChange = userBoard.querySelector(`#${guess}`);
    if(missOrHit === `success`)
    {
        console.log(missOrHit, guess)
        cellChange.classList.add(`hit`);
    }
    else
    {
        console.log(missOrHit, guess)
        cellChange.classList.add(`miss`);
    }
}

// function resetBoards(){

// }

init();
renderMessage(``);