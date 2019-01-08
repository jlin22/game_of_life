import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

class Square extends React.Component {
	render() {
		const color = this.props.value ? 'black' : 'white';
		const style = {backgroundColor: color}
		return (
			<button 
				className="square"
				onClick={this.props.onClick}
				style={style}
				>
			</button>
		);
	}
}

//Board manages the squares
class Board extends React.Component {
	renderSquare(r, c) {
		return (
			<Square
				key={this.props.squares.length * r + c}
				value={this.props.squares[r][c]}
				onClick={() => this.props.handleClick(r, c)}
			/>
		);
	}

	render() {
		const squares = this.props.squares;
		var squareList = [];
		for (var r = 0; r < squares.length; r++) {
			var squareRow = [];
			for (var c = 0; c < squares[r].length; c++) {
				squareRow.push(this.renderSquare(r, c));
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
		this.handleClick = this.handleClick.bind(this);
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

	handleClick(r, c) {
		const squares = this.state.squares.slice();
		squares[r][c] = !squares[r][c];
		this.setState({
			squares: squares
		});
	}

	render() {
		return ( 
			<div className="game">
				<Board 
					squares={this.state.squares}
					handleClick={this.handleClick}/>
			</div>
		);
	}
}

ReactDOM.render(
	<Game rows="20" cols="20"/>,
	document.getElementById('root')
);

