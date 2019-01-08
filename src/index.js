import React from 'react';
import ReactDOM from 'react-dom';

class Square extends React.Component {
	render() {
		return (
			<button className="square">
			</button>
		);
	}
}

//Board manages the squares
class Board extends React.Component {
	render() {
		const squareList = this.props.squares;
		return <Square />;
	}
}

//Game manages the game logic
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: this.createBoard()
		}
	}

	createBoard() {
		const board = [];
		for (var r = 0; r < parseInt(this.props.rows); r++) {
			board.push([]);
			for (var c = 0; c < parseInt(this.props.cols); c++) {
				board[r].push(false);	
			}
		}
		return board;
	}

	render() {
		console.log(this.state.squares);
		return <Board />;
	}
}

ReactDOM.render(
	<Game rows="20" cols="20"/>,
	document.getElementById('root')
);

