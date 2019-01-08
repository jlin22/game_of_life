import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

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
		const squares = this.props.squares;
		var squareList = [];
		for (var r = 0; r < squares.length; r++) {
			var squareRow = [];
			for (var c = 0; c < squares[r].length; c++) {
				squareRow.push(<Square key={squares.length * r + c}/>);	
			}
			squareList.push(<div key={r} className="board-row">{squareRow}</div>);
		}
		return <div>{squareList}</div>;
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
		return ( 
			<div className="game">
				<Board squares={this.state.squares}/>
			</div>
		);
	}
}

ReactDOM.render(
	<Game rows="20" cols="20"/>,
	document.getElementById('root')
);

