export interface EventHandler<T> {

  handleEvent(event: T): void;

}
