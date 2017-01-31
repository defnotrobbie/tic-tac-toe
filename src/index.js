import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.winner ? "square won" : "square"} onClick={() => props.onClick()}>
        {props.value}
      </button>
  );
}

function Sort(props) {
  var arrows = '↑↓';
  // var arrows = '⇕';
  if(props.sort){
    arrows = (props.sort === 'asc' ? '↓': '↑');
  }
  return (
    <button className='sort' onClick={()=>props.onClick()}>
      {arrows}
    </button>
  );
}

function Board(props) {
  function renderSquare(i) {
    return <Square key={i} winner={props.lines.includes(i)} value={props.squares[i]} onClick={() => props.onClick(i)} />;
  }
  var rows = [];
  for (var x = 0; x < 9; x += 3 ) {
    var row = [];
    for (var y = x; y < x + 3; y++) {
      row.push(renderSquare(y));
    }
    rows.push(row);
  }
  return (
    <div>
      {rows.map(        (row, index)=> {
        return <div key={index} className="board-row">{row}</div>;
      }
               )}
    </div>
  );
}
class Game extends Component {
  constructor() {
    super();
    this.state = {
      sort: null,
      stepNumber: 0,
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      xIsNext: true,
    }
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: !(step % 2),
    })
  }
  handleSort(){
    if(this.state.sort === 'asc') {
      this.setState({sort: 'desc'});
    } else {
      this.setState({sort: 'asc'});
    }
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    var calc = calculateWinner(current.squares);
    var winner = calc.winner;
    var lines = calc.lines;
    var status;
    const sort = this.state.sort;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, move) => {
      const moveLoc = {
        x: Math.floor(history[move].location/3)+1,
        y: Math.floor(history[move].location%3)+1
      };
      const desc = move ?
        (!(move % 2) ? 'O' : 'X') + ' @ ' + moveLoc.x + ':' + moveLoc.y :
        'Game start';
      return (
        <li key={move}>
      <a href="#" onClick={() => this.jumpTo(move)}>
        {move===this.state.stepNumber ? <b>{desc}</b> : desc }
            </a>
    </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            lines={lines}
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <Sort onClick={()=>this.handleSort()} sort={sort}/>
          <ol reversed={this.state.sort === 'desc'}>
            {this.state.sort === 'desc' ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: lines[i]
      }
    }
  }
  return {
    winner: false,
    lines: []
  };
}

window.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });
