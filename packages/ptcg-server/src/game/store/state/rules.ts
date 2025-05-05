export class Rules {

  public firstTurnDrawCard = true;

  public firstTurnUseSupporter = true;

  constructor(init: Partial<Rules> = {}) {
    Object.assign(this, init);
  }

}
