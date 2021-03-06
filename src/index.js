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
		this.updateBoard = this.updateBoard.bind(this);
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
		this.interval = setInterval(() => {
			if (this.props.started) {
				this.updateBoard();
			}
		}, this.props.step);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.step !== prevProps.step) {
			clearInterval(this.interval);
			this.interval = setInterval(() => {
				if (this.props.started) {
					this.updateBoard();
				}
			}, this.props.step);
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	updateBoard() {
		const squares = this.state.squares.slice();
		var newSquares = this.createBoard(); 

		var numRows = this.state.squares.length;
		//Assumption: numCols are the same for all rows
		var numCols = this.state.squares[0].length;
		for (var r = 0; r < numRows; r++) {
			for (var c = 0; c < numCols; c++) {
				const numberOfNeighbors = getNumberOfNeighbors(squares, r, c);
				newSquares[r][c] = transition(squares[r][c], numberOfNeighbors);
			}
		}
		this.setState({
			squares: newSquares
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

function inBounds(r, c, numRows, numCols) {
	return (r < numRows && r >= 0 &&
					c < numCols && c >= 0); 
}

function getNumberOfNeighbors(squares, r, c) {
	const numRows = squares.length;
	const numCols = squares[0].length;

	const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, 1],
		[1, 1], [1, 0], [1, -1], [0, -1]];

	var neighbors = 0;
	for (var i = 0; i < offsets.length; i++) {
		const rowOffset = offsets[i][0];
		const colOffset = offsets[i][1];
		if (inBounds(r + rowOffset, c + colOffset, numRows, numCols)
				&& squares[r + rowOffset][c + colOffset]) {
			neighbors++;
		}
	} 
	return neighbors;
}

function transition(isAlive, numberOfNeighbors) {
	return (isAlive && (numberOfNeighbors === 2 || numberOfNeighbors === 3))
				 || (!isAlive && (numberOfNeighbors === 3));
}

class GameInput extends React.Component {
	render() {
		const handleChange = (e) => this.props.handleChange(e);
		const startValue = this.props.started ? 'Stop' : 'Start';
		return (
			<div className="gameInput">
				<div>
					<button 
						name="start"
						onClick={handleChange}
					>
					{startValue}
					</button>
				</div>
				<div>
					<label>Step in milliseconds:
						<input
							name="step"
							type="number"
							value={this.props.step}
							onChange={handleChange}
						/>
				</label>
				</div>
				<div className="dimensions">
					<input
						name="rows"
						type="number"
						value={this.props.rows}
						onChange={handleChange}
					/>
					<input
						name="cols"
						type="number"
						value={this.props.cols}
						onChange={handleChange}
					/>
				</div>
			</div>
		);
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			started: false,
			step: 1000,
			rows: 7,
			cols: 7,
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (target.type === 'number') {
			this.setState({
				[name]: value
			});
		}
		else if (target.type === 'submit') {
			this.setState({
				started: !this.state.started
			});
		}
	}

	render() {
		return (
			<div className="app">	
				<Game 
					rows={this.state.rows}
					cols={this.state.cols}
					started={this.state.started}
					step={this.state.step}
				/>
				<GameInput 
					handleChange={this.handleChange}
					started={this.state.started}
					step={this.state.step}
					rows={this.state.rows}
					cols={this.state.cols}
				/>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
