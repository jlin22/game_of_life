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

	componentDidMount() {
		this.interval = setInterval(() =>
			{if (this.props.started) {this.updateBoard()}}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	updateBoard() {
		var squares = this.state.squares.slice();
		for (var r = 0; r < squares.length; r++) {
			for (var c = 0; c < squares[r].length; c++) {
				var neighbors = 0;
				if (r + 1 < squares.length && squares[r + 1][c]) {
					neighbors++
				}
				else if (r - 1 >= 0 && squares[r - 1][c]) {
					neighbors++
				}
				else if (c - 1 >= 0 && squares[r][c - 1]) {
					neighbors++
				}
				else if (c + 1 <= squares[r].length && squares[r][c + 1]) {
					neighbors++
				}

				if (squares[r][c]) {
					if (neighbors === 2 || neighbors === 3)
						squares[r][c] = false;
					else
						squares[r][c] = true;
				}
				else {
					if (neighbors === 3)
						squares[r][c] = true;
					else
						squares[r][c] = false;
				}
			}
		}
		console.log(squares)
		this.setState({
			squares: squares
		});
	}

	handleClick(r, c) {
		var squares = this.state.squares.slice();
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

class GameInput extends React.Component {
	render() {
		return (
			<div className="gameInput">
				<button 
					onClick={() => this.props.handleStart()}>
					Start
				</button>
			</div>
		);
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			started: false
		}
		this.handleStart = this.handleStart.bind(this);
	}

	handleStart() {
		this.setState({
			started: !this.state.started
		});
	}

	render() {
		return (
			<div className="app">	
				<Game 
					rows="20"
					cols="20"
					started={this.state.started}/>
				<GameInput 
					handleStart={this.handleStart}/>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
