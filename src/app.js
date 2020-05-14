import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.scss';

const default_data = [
  [6, 0, 5, 7, 0, 0, 1, 3, 2],
  [7, 0, 0, 6, 0, 0, 5, 0, 8],
  [0, 1, 9, 3, 0, 0, 0, 0, 4],
  [0, 2, 0, 0, 0, 3, 0, 0, 0],
  [0, 7, 3, 9, 0, 0, 2, 5, 0],
  [0, 5, 1, 2, 0, 0, 0, 0, 9],
  [5, 0, 8, 0, 0, 0, 0, 2, 0],
  [0, 4, 0, 0, 7, 6, 9, 1, 5],
  [0, 9, 0, 0, 4, 0, 6, 8, 0],
];

const default_status = [
  [false, true, false, false, true, true, false, false, false],
  [false, true, true, false, true, true, false, true, false],
  [true, false, false, false, true, true, true, true, false],
  [true, false, true, true, true, false, true, true, true],
  [true, false, false, false, true, true, false, false, true],
  [true, false, false, false, true, true, true, true, false],
  [false, true, false, true, true, true, true, false, true],
  [true, false, true, true, false, false, false, false, false],
  [true, false, true, true, false, true, false, false, true],
];

class Sudoku extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      status: props.status,
      xcoord: 0,
      ycoord: 0,
      speed: 1000,
      opIncrement: true,
      interval: null,
    };
    this.solve = this.solve.bind(this);
    this.stopCounter = this.stopCounter.bind(this);
    this.startCounter = this.startCounter.bind(this);
    this.incrementCoordinate = this.incrementCoordinate.bind(this);
    this.decrementCoordinate = this.decrementCoordinate.bind(this);
    this.onSpeedChangeHandler = this.onSpeedChangeHandler.bind(this);
  }

  startCounter() {
    if (this.state.xcoord === 9) return;
    const interval = setInterval(this.solve, this.state.speed);
    this.setState({
      interval,
    });
  }

  stopCounter() {
    clearInterval(this.state.interval);
    this.setState({
      interval: null,
    });
  }

  incrementCoordinate() {
    let { xcoord, ycoord } = this.state;
    let opIncrement = true;
    ycoord += 1;
    if (ycoord === 9) {
      ycoord = 0;
      xcoord += 1;
    }

    if (xcoord === 9) {
      this.stopCounter();
    }

    this.setState({
      xcoord,
      ycoord,
      opIncrement,
    });
  }

  decrementCoordinate() {
    let { xcoord, ycoord } = this.state;
    let opIncrement = false;
    ycoord -= 1;
    if (ycoord === -1) {
      ycoord = 8;
      xcoord -= 1;
    }

    this.setState({
      xcoord,
      ycoord,
      opIncrement,
    });
  }

  onSpeedChangeHandler(e) {
    let speed = e.target.value;
    if (this.state.interval !== null) {
      clearInterval(this.state.interval);
      let interval = setInterval(this.solve, speed);
      this.setState({
        interval,
        speed,
      });
    } else {
      this.setState({
        speed,
      });
    }
  }

  resetCounter() {
    let data = this.state.data.map((row) => row.slice());
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (this.state.status[x][y]) {
          data[x][y] = 0;
        }
      }
    }

    clearInterval(this.state.interval);

    this.setState({
      data,
      xcoord: 0,
      ycoord: 0,
      speed: 1000,
      opIncrement: true,
      interval: null,
    });
  }

  updateData(x, y, value) {
    let data = this.state.data.map((row) => row.slice());
    data[x][y] = value;
    this.setState({
      data,
    });
  }

  solve() {
    const { xcoord: xc, ycoord: yc, data } = this.state;
    if (xc === 9) return;
    if (this.state.status[xc][yc]) {
      let start = data[xc][yc];
      for (let value = start + 1; value <= 9; value++) {
        if (this.valid(value, xc, yc, data)) {
          this.updateData(xc, yc, value);
          this.incrementCoordinate();
          return;
        }
      }
      this.updateData(xc, yc, 0);
      this.decrementCoordinate();
    } else {
      if (this.state.opIncrement) {
        this.incrementCoordinate();
      } else {
        this.decrementCoordinate();
      }
    }
  }

  valid(value, xc, yc, data) {
    for (let rc = 0; rc < 9; rc++) if (data[rc][yc] === value) return false;
    for (let cc = 0; cc < 9; cc++) if (data[xc][cc] === value) return false;
    for (let x = parseInt(xc / 3) * 3; x < (parseInt(xc / 3) + 1) * 3; x++)
      for (let y = parseInt(yc / 3) * 3; y < (parseInt(yc / 3) + 1) * 3; y++)
        if (data[x][y] === value) return false;

    return true;
  }

  render() {
    let { xcoord: xc, ycoord: yc } = this.state;
    let sudoku = this.state.data.map((row, rid) => (
      <p key={rid}>
        {row.map((data, cid) => {
          if (xc === rid && yc === cid)
            return (
              <button key={rid * 9 + cid} className="btn-focused">
                {data}
              </button>
            );
          else return <button key={rid * 9 + cid}>{data}</button>;
        })}
      </p>
    ));

    return (
      <div>
        {sudoku}
        <h1>
          {this.state.xcoord === 9
            ? `Done`
            : `${this.state.xcoord} : ${this.state.ycoord}`}
        </h1>
        <button onClick={() => this.startCounter()}>Start Interval</button>
        <button onClick={() => this.stopCounter()}>Stop Interval</button>
        <button onClick={() => this.resetCounter()}>Reset Sudoku</button>
        <label> Speed </label>
        <input
          type="range"
          name="speed"
          min="0"
          max="2000"
          value={this.state.speed}
          onChange={(e) => this.onSpeedChangeHandler(e)}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Sudoku data={default_data} status={default_status} />,
  document.getElementById('app')
);
