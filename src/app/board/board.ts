import {OnInit} from '@angular/core';
import {Piece} from './piece/piece';
import {PieceFactory} from './piece/piece.factory';

export class Board {
  private _width: number;
  private _height: number;
  map: Piece[][];
  tokenMap: number[][];
  private _turn: number;
  private _destroyedPieceX: number;
  private _destroyedPieceY: number;

  constructor(config: string) {
    const mapLayouts = config.split('\n-\n');
    const mapPieces = mapLayouts[0].split('\n');
    const mapRotations = mapLayouts[1].split('\n');
    const mapColors = mapLayouts[2].split('\n');
    const mapTokens = mapLayouts[3].split('\n');

    this._height = mapPieces.length;
    this._width = mapPieces[0].length;
    this._turn = 0;
    this.map = [];
    this.tokenMap = [];
    this._destroyedPieceX = null;
    this._destroyedPieceY = null;

    // tslint:disable-next-line:forin
    for (const i in mapPieces) {
      this.map[i] = [];
      this.tokenMap[i] = [];
      // tslint:disable-next-line:forin
      for (const j in mapPieces[i].split('')) {
        const pieceChar = mapPieces[i][j];
        const pieceDirection = mapRotations[i][j];
        const pieceColor = mapColors[i][j];
        const tokenNumber = mapTokens[i][j];
        if (pieceChar !== '*') {
          this.map[i][j] = PieceFactory.create(pieceChar, Number(pieceDirection), Number(pieceColor));
        } else {
          this.map[i][j] = null;
        }
        if (tokenNumber !== '*') {
          this.tokenMap[i][j] = Number(tokenNumber);
        } else {
          this.tokenMap[i][j] = null;
        }
      }
    }
  }

  movePiece(x1: number, y1: number, x2: number, y2: number): void {
    // TODO: добавить проверку
    const piece = this.map[y1][x1];
    this.map[y1][x1] = this.map[y2][x2];
    this.map[y2][x2] = piece;
  }

  rotatePiece(x: number, y: number, direction: number): void {
    // TODO: добавить проверку
    const piece = this.map[y][x];
    piece.direction = (piece.direction + 4 + direction) % 4;
  }

  endTurn() {
    this._turn = (this._turn + 1) % 2;
  }

  getLaserPath() : {string: number}[]{
    let laser = null;
    let x = null;
    let y = null;

    for (const i in this.map) {
      for (const j in this.map[i]) {
        if (this.map[i][j] !== null && this.map[i][j].type === 'Laser' && this.map[i][j].color === this.turn) {
          laser = this.map[i][j];
          x = Number(j);
          y = Number(i);
        }
      }
    }

    let beamDirection = laser.direction;

    let path = [];
    while (true) {
      switch (beamDirection) {
        case 0:
          y++;
          break;
        case 1:
          x--;
          break;
        case 2:
          y--;
          break;
        case 3:
          x++;
          break;
      }
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        break;
      }
      let piece = this.map[y][x];
      if (piece === null) {
        path.push({'x': x, 'y': y, 'direction': beamDirection});
        continue;
      }
      if (piece.isHit(beamDirection)) {
        this._destroyedPieceX = x;
        this._destroyedPieceY = y;
        break;
      }
      if (piece.isBlock(beamDirection)) {
        break;
      }
      if (piece.isDeflect(beamDirection)) {
        beamDirection = piece.getLaserDeflection(beamDirection);
        path.push({'x': x, 'y': y, 'direction': beamDirection});
      }
    }
    return path;
  }

  removeDestroyedPiece() {
    if (this._destroyedPieceX !== null && this._destroyedPieceY !== null) {
      this.map[this._destroyedPieceY][this._destroyedPieceX] = null;
      this._destroyedPieceX = null;
      this._destroyedPieceY = null;
    }
  }

  get turn(): number {
    return this._turn;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }
}
