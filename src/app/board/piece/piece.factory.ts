import {OnInit} from '@angular/core';
import {Piece} from './piece';

export class PieceFactory {
  public static create(char: string, direction: number, color: number): Piece {
    switch (char.toUpperCase()) {
      case 'L':
        return new Piece(
          'Laser',
          direction,
          color,
          [false, false, false, false],
          [true, true, true, true],
          false,
          true,
          false,
          false,
          'assets/sprite/laser/',
        );
      case 'N':
        return new Piece(
          'Defender',
          direction,
          color,
          [false, false, false, false],
          [false, false, true, false],
          true,
          true,
          false,
          true,
          'assets/sprite/defender/',
        );
      case 'D':
        return new Piece(
          'Deflector',
          direction,
          color,
          [false, true, true, false],
          [false, false, false, false],
          true,
          true,
          false,
          true,
          'assets/sprite/deflector/',
        );
      case 'K':
        return new Piece(
          'King',
          direction,
          color,
          [false, false, false, false],
          [false, false, false, false],
          true,
          false,
          false,
          false,
          'assets/sprite/king/',
        );
      case 'M':
        return new Piece(
          'Mirror',
          direction,
          color,
          [true, true, true, true],
          [false, false, false, false],
          true,
          true,
          true,
          false,
          'assets/sprite/mirror/',
        );
    }
    return null;
  }
}
