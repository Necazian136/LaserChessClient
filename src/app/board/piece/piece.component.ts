import {Component, Input, OnInit} from '@angular/core';
import {Piece} from './piece';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {

  @Input() piece: Piece;

  constructor() {
  }

  ngOnInit(): void {
  }
}
