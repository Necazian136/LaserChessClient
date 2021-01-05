import {Component, Input, OnInit} from '@angular/core';
import {Piece} from './piece/piece';
import {Board} from './board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board: Board;
  availableMoves: boolean[][];
  availableRotation: boolean[][];
  laserPath: number[][];
  width: number;
  private _selectedPieceX: number = null;
  private _selectedPieceY: number = null;

  constructor() {
    this.board = null;
    this.width = 900;
    this.availableMoves = [];
  }

  ngOnInit(): void {
    this.changeBoard('Ace');
  }

  changeBoard(name: string): void {
    let map: string = null;
    switch (name.toLowerCase()) {
      case 'ace':
        map = 'assets/map/ace.map';
        break;
    }
    fetch(map)
      .then((response) => {
        return response.text();
      })
      .then((mapText) => {
        this.board = new Board(mapText);
        this.hideAvailableMoves();
        this.hideLaserPath();
      });
  }

  private hideAvailableMoves() {
    this.availableMoves = (new Array(this.board.height)).fill([], 0, this.board.height);
    for (const i in this.availableMoves) {
      this.availableMoves[i] = (new Array(this.board.width)).fill(false, 0, this.board.width);
    }
    this.availableRotation = (new Array(this.board.height)).fill([], 0, this.board.height);
    for (const i in this.availableRotation) {
      this.availableRotation[i] = (new Array(this.board.width)).fill(false, 0, this.board.width);
    }
  }

  private hideLaserPath() {
    this.laserPath = (new Array(this.board.height)).fill([], 0, this.board.height);
    for (const i in this.laserPath) {
      this.laserPath[i] = (new Array(this.board.width)).fill(null, 0, this.board.width);
    }
  }

  handleRotate(direction: number) {
    this.board.rotatePiece(this._selectedPieceX, this._selectedPieceY, direction);
    this.hideAvailableMoves();
    this.shootLaser(this.board.getLaserPath());
    this.board.endTurn();
  }

  shootLaser(path: { string: number }[], move: number = 0) {
    if (path[move] !== undefined) {
      this.laserPath[path[move]['y']][path[move]['x']] = path[move]['direction'];
      move++;
      setTimeout(() => {this.shootLaser(path, move)}, 200);
    } else {
      this.hideLaserPath();
      this.board.removeDestroyedPiece();
    }
  }

  handleClick(_x: string, _y: string) {
    const x = Number(_x);
    const y = Number(_y);
    if (
      this._selectedPieceX === null &&
      this._selectedPieceY === null &&
      this.board.map[y][x] !== null &&
      this.board.turn === this.board.map[y][x].color
    ) {
      this._selectedPieceX = x;
      this._selectedPieceY = y;
      const piece = this.board.map[y][x];
      const aroundMapX = [x - 1, x, x + 1];
      const aroundMapY = [y - 1, y, y + 1];

      if (
        piece.canRotate
      ) {
        this.availableRotation[this._selectedPieceY][this._selectedPieceX] = true;
      }
      for (let i of aroundMapY) {
        for (let j of aroundMapX) {
          if (
            piece.canMove &&
            this.board.map[i] !== undefined &&
            this.board.map[i][j] !== undefined &&
            this.board.map[i][j] === null &&
            (
              this.board.tokenMap[i][j] === null ||
              this.board.tokenMap[i][j] === piece.color
            )
          ) {
            this.availableMoves[i][j] = true;
          }
          if (
            piece.canSwap &&
            this.board.map[i] !== undefined &&
            this.board.map[i][j] !== undefined &&
            this.board.map[i][j] !== null &&
            this.board.map[i][j].swappable
          ) {
            this.availableMoves[i][j] = true;
          }
        }
      }
    } else if (
      this._selectedPieceX !== null &&
      this._selectedPieceY !== null
    ) {
      if (this.availableMoves[y][x]) {
        this.board.movePiece(this._selectedPieceX, this._selectedPieceY, x, y);
        this.shootLaser(this.board.getLaserPath());
        this.board.endTurn();
      }
      this.hideAvailableMoves();
      this._selectedPieceX = null;
      this._selectedPieceY = null;
    }
  }
}
