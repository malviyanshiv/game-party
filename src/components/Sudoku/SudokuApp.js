import React from 'react';
import SudokuDemo from './SudokuDemo';
import SudokuEdit from './SudokuEdit';

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

class SudokuApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: default_data,
      status: default_status,
      isEditMode: false,
    };
  }

  render() {
    return this.state.isEditMode ? (
      <SudokuEdit />
    ) : (
      <SudokuDemo data={this.state.data} status={this.state.status} />
    );
  }
}

export default SudokuApp;
