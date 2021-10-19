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

    // sets the state to have a winner if there is one
    checkForWin = (x, y, player) => {

        let winningMoves = [{x, y}];

        // check horizontal
        for (let column = x + 1; column < x + 4; column += 1) {
            const checkPiece = this.getPiece(column, y);

            if (checkPiece && checkPiece.player === player) {
                winningMoves.push({ x: column, y: y })
            } else {
                break;
            }
        }
        for (let column = x - 1; column > x - 4; column -= 1) {
            const checkPiece = this.getPiece(column, y);

            if (checkPiece && checkPiece.player === player) {
                winningMoves.push({ x: column, y: y })
            } else {
                break;
            }
        }
        if (winningMoves.length > 3) {
            this.setState({winner: player, winningMoves})
            return true;
        }

        // check vertical
        winningMoves = [{x, y}];
        for (let row = y + 1; row < y + 4; row += 1) {
            const checkPiece = this.getPiece(x, row);

            if (checkPiece && checkPiece.player === player) {
                winningMoves.push({x: x, y: row })
            } else {
                break;
            }
        }
        for (let row = y - 1; row > y - 4; row -= 1) {
            const checkPiece = this.getPiece(x, row);

            if (checkPiece && checkPiece.player === player) {
                winningMoves.push({x: x, y: row })
            } else {
                break;
            }
        }
        if (winningMoves.length > 3) {
            this.setState({winner: player, winningMoves})
            return true;
        }
    }

    // adding a new move into the state and changing the player turn to the next player
    addMove = (x, y) => {
        const { playerTurn } = this.state;
        const nextPlayerTurn = playerTurn === "red" ? "yellow" : "red";

        // check for a win based on this next move
        // start from center and check how many pieces are on left, right; four in a row means a win
        this.setState({moves: this.state.moves.concat({x, y, player: playerTurn}), playerTurn: nextPlayerTurn, count:++this.state.count}, () => this.checkForWin(x, y, playerTurn))
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

