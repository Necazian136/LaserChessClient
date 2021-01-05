export class Piece {

  private _direction: number;
  private _color: number;
  private _type: string;
  deflectionMap: boolean[];
  blockMap: boolean[];
  private _canMove: boolean;
  private _canRotate: boolean;
  private _canSwap: boolean;
  private _swappable: boolean;
  private _spriteDirectory: string;

  constructor(
    type: string,
    direction: number,
    color: number,
    deflectionMap: boolean[],
    blockMap: boolean[],
    canMove: boolean,
    canRotate: boolean,
    canSwap: boolean,
    swappable: boolean,
    spriteDirectory: string,
  ) {
    this._direction = direction;
    this._color = color;
    this._type = type;
    this.deflectionMap = deflectionMap;
    this.blockMap = blockMap;
    this._canMove = canMove;
    this._canRotate = canRotate;
    this._canSwap = canSwap;
    this._swappable = swappable;
    this._spriteDirectory = spriteDirectory;
  }

  public isHit(laserDirection: number): boolean {
    return !this.isBlock(laserDirection) && !this.isDeflect(laserDirection);
  }

  public isBlock(laserDirection: number): boolean {
    return this.blockMap[(laserDirection + 4 - this.direction) % 4];
  }

  public isDeflect(laserDirection: number): boolean {
    return this.deflectionMap[(laserDirection + 4 - this.direction) % 4];
  }

  public getLaserDeflection(laserDirection: number): number {
    if (this._direction % 2 == 0) {
      return {0: 1, 1: 0, 2: 3, 3: 2}[laserDirection];
    }
    return {0: 3, 3: 0, 2: 1, 1: 2}[laserDirection];
  }

  get color(): number {
    return this._color;
  }

  get direction(): number {
    return this._direction;
  }

  set direction(value: number) {
    this._direction = value;
  }

  get type(): string {
    return this._type;
  }

  get canMove(): boolean {
    return this._canMove;
  }

  get canRotate(): boolean {
    return this._canRotate;
  }

  get canSwap(): boolean {
    return this._canSwap;
  }

  get swappable(): boolean {
    return this._swappable;
  }

  get sprite(): string {
    return this._spriteDirectory + this._color + '.png';
  }
}
