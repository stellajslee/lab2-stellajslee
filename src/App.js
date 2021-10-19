import './App.css';
import React, { Component } from "react";

class App extends Component {
    // states of rows and columns; starting with red
    state = {
        rows: 6,
        columns: 7,
        moves: [],
        playerTurn: "red",
        count: 0
    };

    // resetting board to empty
    resetBoard = () => {
        this.setState({ moves: [], winner: null, count: 0});
    }

    // get moves with particular row and column
    getPiece = (x, y) => {
        const list = this.state.moves.filter((item) => {
            return (item.x === x && item.y === y);
        });

        return list [0];
    }

    // getting winning moves using velocity
    getWinningMoves = (xPosition, yPosition, xVelocity, yVelocity) => {
        // to store winning moves
        const winningMoves = [{x: xPosition, y: yPosition}];
        // to get the player with the winning moves
        const player = this.getPiece(xPosition, yPosition).player;

        // checking delta in forward direction
        for (let delta = 1; delta <= 3; delta += 1) {
            const checkX = xPosition + xVelocity * delta;
            const checkY = yPosition + yVelocity * delta;

            const checkPiece = this.getPiece(checkX, checkY);
            if (checkPiece && checkPiece.player === player) {
                winningMoves.push({ x: checkX, y: checkY })
            } else {
                break;
            }
        }

        // checking delta in reverse direction
        for (let delta = -1; delta >= -3; delta -= 1) {
            const checkX = xPosition + xVelocity * delta;
            const checkY = yPosition + yVelocity * delta;

            const checkPiece = this.getPiece(checkX, checkY);
            if (checkPiece && checkPiece.player === player) {
                winningMoves.push({ x: checkX, y: checkY })
            } else {
                break;
            }
        }

        return winningMoves;
    }

    // sets the state to have a winner if there is one
    checkForWin = (x, y) => {
        // to check horizontal moves, we set xPosition and yPosition to current position & xVelocity to 1 and yVelocity to 0
        // to check vertical moves, we set xPosition and yPosition to current position & xVelocity to 0 and yVelocity to 1
        // to check forward diagonal moves, we set xPosition and yPosition to current position & xVelocity to 1 and yVelocity to 1
        // to check reverse diagonal moves, we set xPosition and yPosition to current position & xVelocity to -1 and yVelocity to 1
        const velocities = [{x: 1, y: 0}, {x:0, y: 1}, {x:-1, y:1}, {x:1 , y:1}];

        // iterating all the directions we have to check
        for (let index = 0; index < velocities.length; index++) {
            const element = velocities[index];
            const winningMoves = this.getWinningMoves(x, y, element.x, element.y);
            if (winningMoves.length > 3) {
                this.setState({ winner: this.getPiece(x,y).player, winningMoves })
            }
        }
    }

    // adding a new move into the state and changing the player turn to the next player
    addMove = (x, y) => {
        const { playerTurn } = this.state;
        const nextPlayerTurn = playerTurn === "red" ? "yellow" : "red";

        // making the piece go the lowest row
        let availableYPosition = null;
        for (let position = this.state.rows - 1; position >= 0; position--) {
            if (!this.getPiece(x, position)) {
                availableYPosition = position;
                break;
            }
        }
        if (availableYPosition !== null) {
            this.setState({moves: this.state.moves.concat({x, y: availableYPosition, player: playerTurn}), playerTurn: nextPlayerTurn, count:++this.state.count}, () => this.checkForWin(x, availableYPosition, playerTurn))
        }
    }

    // render a square board
    renderBoard() {
        // get number of rows and columns from state
        const { winner } = this.state;
        const rowViews = [];

        // create rows and columns for the board
        for (let row = 0; row < this.state.rows; row += 1) {
            const columnViews = [];
            for (let column = 0; column < this.state.columns; column += 1) {
                const piece = this.getPiece(column, row);

                columnViews.push(<div className="column">
                    {/* circular buttons that players will be pressing */}
                    <div onClick={() => {this.addMove(column, row,)}} className="bu">
                        {/* if there is piece associated with that coordinate, change colour red/yellow if not undefined */}
                        {piece ? <button className="bu-selected" style={{backgroundColor: piece.player}} disabled={true}/>: undefined}
                    </div>
                </div>);
            }
            rowViews.push(
                <div className="row">{columnViews}</div>
            );
        }

        return (
            <div className="board">
                {/* restart game if winner announcement is clicked */}
                {winner && <div onClick={this.resetBoard} className="winner">{winner} wins! click here to restart</div>}
                {/* if all 42 buttons are changed into a colour then the game is over */}
                {this.state.count === 42 && <div onClick={this.resetBoard} className="winner">board is full! click here to restart</div>}

                {rowViews}
            </div>
        )
    }

    // rendering the board
    render() {
        return (
            <>
                <div className="container">
                    <header className="header">CONNECT 4 GAME!</header>
                    <div>
                        {this.renderBoard()}
                    </div>
                </div>
            </>
        )
    }
}

export default App;

