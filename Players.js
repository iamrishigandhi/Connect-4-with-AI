class Player_Random {
    
    constructor() {}

    getAction(state) {
        let actions = state.getLegalActions();
        return actions[Math.floor(Math.random()*actions.length)];
    }
}

class Player_Greedy {
    
    constructor() {}

    eval(state, player) {
       
        let winner = state.winner();

        if (winner == player) { return 10000; }
        else if (winner == PLAYER_NONE) { return 0; }
        else if (winner == PLAYER_DRAW) { return 0; }
        else { return -10000; }
    }

    getAction(state) {
        let actions = state.getLegalActions();
        let player = state.player;
        let max = -10000000;
        let maxAction = -1;
        for (let a = 0; a<actions.length; a++) {
            let child = state.copy();
            child.doAction(actions[a]);
            let value = this.eval(child, player);
            if (value > max) {
                max = value;
                maxAction = actions[a];
            }
        }
        return maxAction;
    }
}