/*----- constant variables-----*/
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
        console.log(`The 1st ship is located at: ${this.shipLocation}`)
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
    let overseaGuess;
    let isHit = firstShip.handleFiring(guess) || secondShip.handleFiring(guess)||
        thirdShip.handleFiring(guess);
        if(isHit && firstShip.sunk && secondShip.sunk && thirdShip.sunk)
        {
            turn === 1 ? renderUserBoard(guess, `success`) : renderCompBoard(guess, `success`);
            fireBtn.disabled = true;
            fireBtn.removeEventListener(`click`, handleFireBtn);
            guessInput.disabled = true; 
            winner = `winner`;
            turn === 1 ? renderMessage(`Player 1 has won!`) : renderMessage(`Computer has won!`);
        }
        else if(isHit && computerFirstShip.sunk && computerSecondShip.sunk && computerThirdShip.sunk)
        {
            turn === 1 ? renderUserBoard(guess, `success`) : renderCompBoard(guess, `success`);
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

function improvedRandomGuess(ship, location, counter) 
{
    let compSuccessfulHits = [];
    let xAxis = null;
    let yAxis = null;
    let improvGuess = null;

    let firstChar = location[0];
    firstChar = LETTERBOARD.indexOf(firstChar);
    let secondChar = parseInt(location[1]);

    for(let i = 0; i < ship.succesfulHits.length; i++)
    {
        if(ship.succesfulHits[i] === `success`)
        {
            compSuccessfulHits.push(ship.shipLocation[i]);
        }
    }

    do
    {
        let randomGuess = Math.floor(Math.random() * 7);
        const side = Math.floor(Math.random() * 2);
        const addingOrSubstracting = Math.floor(Math.random() * 2);

        if(counter === 1)
        {
            if(side === 1) 
            {
                yAxis = addingOrSubstracting === 1 ? firstChar - 1 : firstChar + 1;
                xAxis = secondChar;

                if(compGuesses.includes(compSuccessfulHits[0]) && compGuesses.includes((compSuccessfulHits[1])) && compGuesses.includes((compSuccessfulHits[2])))
                {
                    yAxis = randomGuess;
                }
            }
            else 
            {
                yAxis = firstChar;
                xAxis = addingOrSubstracting === 1 ? secondChar - 1 : secondChar + 1;
            }
        }
        else if(counter > 1) 
        {
            if(compSuccessfulHits[0][0] === compSuccessfulHits[1][0])
            {
                let randomNum = Math.floor(Math.random() * 2);
                if(randomNum === 0)
                {
                    xAxis = addingOrSubstracting === 1 ? secondChar - 1 : secondChar + 1;
                    yAxis = firstChar;
                    if(compGuesses.includes(compSuccessfulHits[0]) && compGuesses.includes((compSuccessfulHits[1])) && compGuesses.includes((compSuccessfulHits[2])))
                    {
                        xAxis = randomGuess;
                    }
                }
                else if (randomNum === 1)
                {
                    xAxis = addingOrSubstracting === 1 ? secondChar - counter: secondChar + counter;
                    yAxis = firstChar;
                    if(compGuesses.includes(compSuccessfulHits[0]) && compGuesses.includes((compSuccessfulHits[1])) && compGuesses.includes((compSuccessfulHits[2])))
                    {
                        xAxis = randomGuess;
                    }
                }
            }
            else
            {
                let randomNum = Math.floor(Math.random() * 2);
                if(randomNum === 0)
                {
                    yAxis = addingOrSubstracting === 1 ? firstChar - 1 : firstChar + 1;
                    xAxis = secondChar;
                    if(compGuesses.includes(compSuccessfulHits[0]) && compGuesses.includes((compSuccessfulHits[1])) && compGuesses.includes((compSuccessfulHits[2])))
                    {
                        yAxis = randomGuess;
                    }
                }
                else if (randomNum === 1)
                {
                    yAxis = addingOrSubstracting === 1 ? firstChar - counter: firstChar + counter;
                    xAxis = secondChar;
                    if(compGuesses.includes(compSuccessfulHits[0]) && compGuesses.includes((compSuccessfulHits[1])) && compGuesses.includes((compSuccessfulHits[2])))
                    {
                        yAxis = randomGuess;
                    }
                }
            }
        }
    }while(xAxis > 6 || xAxis < 0 || yAxis < 0 || yAxis > 6 || compGuesses.includes(LETTERBOARD[yAxis] + xAxis))
    yAxis = LETTERBOARD[yAxis];
    improvGuess = yAxis + `` +  xAxis;
    return improvGuess;
}

function computerGuessingImproved() {
    let shipHitLocation;
    const firstShipIndex = computerFirstShip.succesfulHits.filter(hit => hit === `success`).length;
    const secondShipIndex = computerSecondShip.succesfulHits.filter(hit => hit === `success`).length;
    const thirdShipIndex = computerThirdShip.succesfulHits.filter(hit => hit === `success`).length;
    const firstShipCounter = computerFirstShip.succesfulHits.filter(hit => hit === `success`).length;
    const secondShipCounter = computerSecondShip.succesfulHits.filter(hit => hit === `success`).length;
    const thirdShipCounter = computerThirdShip.succesfulHits.filter(hit => hit === `success`).length;
    
    if(firstShipIndex > 0 && computerFirstShip.sunk !== true)
    {
        shipHitLocation = computerFirstShip.shipLocation[firstShipIndex];
        return improvedRandomGuess(computerFirstShip, shipHitLocation, firstShipCounter);
    }
    else if(secondShipIndex > 0 && computerSecondShip.sunk !== true)
    {
        shipHitLocation = computerSecondShip.shipLocation[secondShipIndex];
        return improvedRandomGuess(computerSecondShip, shipHitLocation, secondShipCounter);
    }
    else if(thirdShipIndex > 0 && computerThirdShip.sunk !== true)
    {
        shipHitLocation = computerThirdShip.shipLocation[thirdShipIndex];
        return improvedRandomGuess(computerThirdShip, shipHitLocation, thirdShipCounter);
    }
    return;
}

function shipHasBeenHit() {
    const firstShipIndex = computerFirstShip.succesfulHits.indexOf(`success`);
    const secondShipIndex = computerSecondShip.succesfulHits.indexOf(`success`);
    const thirdShipIndex = computerThirdShip.succesfulHits.indexOf(`success`);

    if((firstShipIndex >= 0 && computerFirstShip.sunk === false) || (secondShipIndex >= 0 && computerSecondShip.sunk === false) || (thirdShipIndex >= 0 && computerThirdShip.sunk === false))
    {
        return true;
    }

    return false;
}

function computerGuess() {
    let guessValue = null
    if(shipHasBeenHit())
    {
        guessValue =  computerGuessingImproved();
        return guessValue
    }
    else
    {
        do{
            let yAxis = LETTERBOARD[Math.floor(Math.random() * 7)];
            let xAxis = Math.floor(Math.random() * 7);
            guessValue = yAxis + xAxis;
        }while(compGuesses.includes(guessValue) === true)
        return guessValue;
    }
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

    if(computerFirstShip.sunk && computerSecondShip.sunk && computerThirdShip.sunk)
    {
        return;
    }

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
        cellChange.classList.add(`hit`);
    }
    else
    {
        cellChange.classList.add(`miss`);
    }
}

function renderUserBoard(guess, missOrHit) {
    const cellChange = userBoard.querySelector(`#${guess}`);
    if(missOrHit === `success`)
    {
        cellChange.classList.add(`hit`);
    }
    else
    {
        cellChange.classList.add(`miss`);
    }
}

// function resetBoards(){

// }

init();
renderMessage(``);