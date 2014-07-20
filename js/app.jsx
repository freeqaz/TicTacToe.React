/** @jsx React.DOM */

var TicTacToe = React.createClass({
    componentDidMount: function() {
    },

    getInitialState: function() {
        var ticTacToeBoxes = {};

        // Build the board's data
        for (var y = 0; y < this.props.size; y++) {
            for (var x = 0; x < this.props.size; x++) {
                ticTacToeBoxes["cell" + y + x] = {
                    x: x,
                    y: y,
                    ownedBy: ""
                };
            }
        }

        // This is the state of the board
        return {
            turn: "X",
            board: ticTacToeBoxes
        };
    },

    handleClick: function(x, y) {

        var b = this.state.board;

        b["cell" + x + y].ownedBy = this.state.turn;

        var winner;

        // Check for any winners
        if (this.checkForWinner(x, y, this.state.turn)) {
            winner = this.state.turn + " wins!";
        }

        // Check if there's a tie
        if (winner === undefined && this.checkForTie()) {
            winner = "Tie!";
        }

        // Forces the view to update
        this.setState({
            winner: winner,
            turn: this.state.turn == "X" ? "Y" : "X",
            board: b
        });
    },

    checkForWinner: function(x, y, player) {

        var b = this.state.board;

        // Check row
        for (var nRow = 0; nRow < this.props.size; nRow++) {
            if (b["cell" + nRow + y].ownedBy != this.state.turn) {
                break;
            }
            if (nRow == this.props.size - 1) {
                return true;
            }
        }

        // Check column
        for (var nColumn = 0; nColumn < this.props.size; nColumn++) {
            if (b["cell" + x + nColumn].ownedBy != this.state.turn) {
                break;
            }
            if (nColumn == this.props.size - 1) {
                return true;
            }
        }

        // Check diagonal
        for (var nDiag = 0; nDiag < this.props.size; nDiag++) {
            if (b["cell" + nDiag + nDiag].ownedBy != this.state.turn) {
                break;
            }
            if (nDiag == this.props.size - 1) {
                return true;
            }
        }
        
        // Check anti-diagonal
        for (var nDiag = 0; nDiag < this.props.size; nDiag++) {
            if (b["cell" + nDiag + ((this.props.size - 1) - nDiag)].ownedBy != this.state.turn) {
                break;
            }
            if (nDiag == this.props.size - 1) {
                return true;
            }
        }

        return false;
    },

    checkForTie: function() {

        var b = this.state.board;

        var count = 0;
        
        // Count number of filled blocks
        for (var y = 0; y < this.props.size; y++) {
            for (var x = 0; x < this.props.size; x++) {
                if (b["cell" + y + x].ownedBy != "")
                    count++;
            }
        }

        // If number of filled blocks equals total, return true
        return (count == (this.props.size * this.props.size));
    },

    render: function() {
        var self = this;
        
        var borderStyle = {
            'border-style': 'solid',
            'border-width': '3px',
            'border-color': 'black'
        };
        var fontColor = {
            'background-color': this.state.selectedColor,
            'width': '193px',
            'height': '40px',
            'margin-top': '8px'
        };
        var margin = {
            'margin': '8px'
        };

        // The way the table is rendered...
        // There's probably a cleaner way to do this.
        var rows = [];
        for (var x = 0; x < this.props.size; x++) {
            var columns = [];
            for (var y = 0; y < this.props.size; y++) {
                columns.push(y)
            }
            rows.push(columns);
        }


        var classes = "";

        if (this.state.winner !== undefined) {
            return (<h1>{this.state.winner}</h1>);
        }

        // This renders the state of the board to the DOM.
        return (
            <div className="ticTacToeContainer centered">
                <h1 className="centered">{self.state.turn}'s turn</h1>
                <div style={borderStyle}>
                    <table className="centered">
                    {rows.map(function(row, x) {
                        return (
                            <tr className={"tr-board-" + x}>
                                {columns.map(function(column, y) {

                                    // Find our item and get the state
                                    var positionClasses = "ticTacToe-cell ";
                                
                                    // Set our classes for styling purposes
                                    if (x > 0 && x < self.props.size - 1) {
                                        positionClasses += "h ";
                                    }

                                    if (y > 0 && y < self.props.size - 1) {
                                        positionClasses += "v ";
                                    }

                                    // Empty cell has a button
                                    if (self.state.board["cell" + x + y].ownedBy === "") {
                                        return (<td className={positionClasses}>
                                                    <button onClick={self.handleClick.bind(this, x, y)}
                                                            className="freeCell centered btn" />
                                                </td>);
                                    }
                                    // Filled cell just sets the background and renders text
                                    else {
                                        positionClasses += "ownedBy" + self.state.board["cell" + x + y].ownedBy;
                                        return (<td className={positionClasses}>
                                                    <h2 className="centered ">
                                                        {self.state.board["cell" + x + y].ownedBy}
                                                    </h2>
                                                </td>);
                                    }
                                
                                })}
                            </tr>
                            );
                    })}
                    </table>
                </div>
            </div>
        );
    }
});

var ThreeByThree = React.createClass({
    render: function() {
        return (<TicTacToe size="3" />);
    }
});

React.renderComponent(<ThreeByThree />, document.getElementById('reactcontainer'));

