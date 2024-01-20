export default class DataObserver implements INotifier, IObservable {
  observers: Set<IObserver> = new Set<IObserver>();
  subscribe(observer: IObserver) {
    this.observers.add(observer);
  }

  unsubscribe(observer: IObserver) {
    this.observers.delete(observer);
  }

  notifyAll() {
    console.debug("Notifying all");
    this.observers.forEach((x) => x.notify());
  }
}

export interface IObserver {
  notify(): void;
}

export interface INotifier {
  notifyAll(): void;
}

export interface IObservable {
  subscribe(observer: IObserver): void;
  unsubscribe(observer: IObserver): void;
}

export class NotifierBuilder implements IObserver {
  private _callback: Function;
  constructor(callback: Function) {
    this._callback = callback;
  }

  notify(): void {
    this._callback();
  }
}
