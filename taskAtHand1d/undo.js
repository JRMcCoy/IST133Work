function pageState(prevState, newState) {
    this.previousState = prevState;
    this.state = newState;
    this.nextState = null;
}

function stateStack(maxStateCount) {
    this.maxCount = maxStateCount;
    this.currentCount = 0;
    this.stackTop = null;
    this.stackBottom = null;
		
    this.pushState = function(newPageState) { // new page state is an array of tasks
        if (this.currentCount === 0) {
			$("#undo").removeClass("disabled");
            var firstAction = new pageState(null, newPageState);
            this.stackTop = firstAction;
            this.stackBottom = firstAction;
        }
        if (this.currentCount === this.maxCount) {
            this.stackBottom = this.stackBottom.nextState;
            this.stackBottom.previousState = null;
            this.stackTop.nextState = new pageState(this.stackTop, newPageState);
            this.stackTop = this.stackTop.nextState;
            return;
        }
        else {
            this.stackTop.nextState = new pageState(this.stackTop, newPageState);
            this.stackTop = this.stackTop.nextState;
        }
        this.currentCount += 1;
    }

    this.popState = function() {
        if (this.currentCount === 0) return null;

        var state = this.stackTop.state;
        if (this.currentCount === 1) {
            this.stackBottom = null;
            this.stackTop = null;
			$("#undo").addClass("disabled");
        }
        else {
            this.stackTop = this.stackTop.previousState;
            this.stackTop.nextState = null;
        }
        this.currentCount -= 1;
        return state;
    }
}
