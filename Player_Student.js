class Player_Student {

    constructor(config) {
        this.config = config;
        this.searchStartTime = 0;
        this.bestAction         = null;
        this.currentBestAction  = null;
        this.currentMaxDepth    = null;
        this.maxPlayer          = null;

        console.log(" Student AB Player ");
        console.log(" Time Limit: ", this.config.timeLimit);
        console.log(" Max Depth: ", this.config.maxDepth);
    }

    getAction(state) {
        return this.IDAlphaBeta(state);
    }

    IDAlphaBeta(state) {
        this.searchStartTime = performance.now();
        this.bestAction = null;
        this.maxPlayer = state.player;

        if (this.config.timeLimit <=0 || this.config.maxDepth <= 0) {
            return this.bestAction;
        }

        for (let depth = 1; depth <= this.config.maxDepth; depth++) {
            this.currentMaxDepth = depth;
            try {
                this.AlphaBeta(state, -Infinity, +Infinity, 0, true);
                this.bestAction = this.currentBestAction;
            } catch (e) {
                if (e.constructor === TimeOutException) {
                    break;
                } else {
                    throw e;
                }
            }
        }
        return this.bestAction;
    }

    AlphaBeta(state, alpha, beta, depth, max) {

        let timeElapsed = performance.now() - this.searchStartTime;
        let actions = state.getLegalActions();

        if (timeElapsed > this.config.timeLimit) {
            throw new TimeOutException;
        }

        if (depth >= this.currentMaxDepth) {
            return this.eval(state, this.maxPlayer);
        }

        if (max) {
            let v = -Infinity;
            for (let a = 0; a<actions.length; a++) {
                let child = state.copy();
                child.doAction(actions[a]);
                let vDash = this.AlphaBeta(child, alpha, beta, depth + 1, !max);
                if (vDash > v) {
                    v = vDash;
                }
                if (vDash >= beta) {
                    return v;
                }
                if (vDash > alpha) {
                    alpha = vDash;
                    if (depth === 0) {
                        this.currentBestAction = actions[a];
                    }
                }
            }
            return v;
        } else {
            let v = +Infinity;
            for (let a = 0; a<actions.length; a++) {
                let child = state.copy();
                child.doAction(actions[a]);
                let vDash = this.AlphaBeta(child, alpha, beta, depth + 1, !max);
                if (vDash < v) {
                    v = vDash;
                }
                if (vDash <= alpha) {
                    return v;
                }
                if (vDash < beta) {
                    beta = vDash;
                }
            }
            return v;
        }
    }

    eval(state, player) {
        let winner = state.winner();
        if      (winner == player)              { return Infinity; }   // win, return large#
        else if (winner == (player + 1) % 2)    { return -Infinity; }  // loss, return -large#
        else if (winner == PLAYER_DRAW)         { return 0; }       // draw, return 0
        else if (winner == PLAYER_NONE) {   
            
            let playerCount = countMoves(state, player);
            let opponentCount = countMoves(state, (player + 1) % 2);
            
            //difference in the number of winning moves
            return playerCount - opponentCount;
        }
    }
}

//heuristic function that I put in eval. it initializes count variable to 0
//then goes through every slot of the board, it checks for the player's piece and
//calculates moves for a win in 4 directions, horizontal, vertical, up and right, up and left.
//after it is done with every slot, it holds the value in count and returns it as result of the function

function countMoves(state, player) {
    let count = 0;

    for (let row = 0; row < state.rows; row++) {
        for (let column = 0; column < state.columns; column++) {
            if (state.board[row][column] == player) {
                //checks horizontal moves for three columns to the right
                if (column <= state.columns - 4) {
                    if (state.board[row][column + 1] == player &&  
                        state.board[row][column + 2] == player && 
                        state.board[row][column + 3] == player) {
                        count++;
                    }
                }
                //checks vertical moves for three rows
                if (row <= state.rows - 4) {
                    if (state.board[row + 1][column] == player && 
                        state.board[row + 2][column] == player && 
                        state.board[row + 3][column] == player) {
                        count++;
                    }
                }

                //checks up right moves for three rows diagonally up and right direction
                if (row <= state.rows - 4 && column >= 3) {
                    if (state.board[row + 1][column - 1] == player && 
                        state.board[row + 2][column - 2] == player && 
                        state.board[row + 3][column - 3] == player) {
                        count++;
                    }
                }

                //checks up left moves for three rows diagonally up and left direction
                if (row <= state.rows - 4 && column <= state.columns - 4) {
                    if (state.board[row + 1][column + 1] == player && 
                        state.board[row + 2][column + 2] == player && 
                        state.board[row + 3][column + 3] == player) {
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

//made an exception class to handle timeouts, it wouldn't work otherwise just gave me errors
class TimeOutException {
    constructor(message) {
        this.message = message;
        this.name = 'TimeOutException';
    }
}