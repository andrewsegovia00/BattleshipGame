// CONST
const BOARDSIZE = 7;
const LETTERBOARD = [`A`, `B`, `C`, `D`, `E`, `F`, `G`];

/*----- app's state (variables) -----*/
let winner = null;
let turn = 1;

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
        console.log(`Here's the index ${index}`);
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
            winner = winner;
            turn === 1 ? renderMessage(`Player 1 has won!`) : renderMessage(`Computer has won!`);
        }
        else if(isHit)
        {
            turn === 1 ? renderUserBoard(guess, `success`) : renderCompBoard(guess, `success`);
        }
        else
        {
            turn === 1 ? renderUserBoard(guess, `miss`) : renderCompBoard(guess, `miss`);
        }
}

function computerGuess() {
    let xAxis = LETTERBOARD[Math.floor(Math.random() * 7)]
    let yAxis = Math.floor(Math.random() * 7)
    let guessValue = xAxis + `` + yAxis;
    console.log(`computer guess: ${guessValue}`)
    return guessValue;
}

function handleFireBtn() {
    if(computerFirstShip.sunk && computerSecondShip.sunk && computerThirdShip.sunk)
    {
        return;
    }
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

    if(computerFirstShip.sunk && computerSecondShip.sunk && computerThirdShip.sunk)
    {
        return;
    }
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