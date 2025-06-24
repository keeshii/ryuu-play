export class Rules {

  public formatName = '';

  public firstTurnDrawCard = true;

  public firstTurnUseSupporter = true;
  
  public noPrizeForFossil = true;

  constructor(init: Partial<Rules> = {}) {
    Object.assign(this, init);
  }

}
