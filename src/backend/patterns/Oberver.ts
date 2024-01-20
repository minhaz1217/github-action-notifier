export default class DataObserver {
  observers: IObserver[] = [];
  subscribe(observer: IObserver) {
    this.observers.push(observer);
  }

  unsubscribe(observer: IObserver) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x) => x !== observer);
    }
  }

  notifyAll() {
    if (this.observers.length > 0) {
      this.observers.forEach((x) => x.notify());
    }
  }
}

export interface IObserver {
  notify(): void;
}

export interface Observable {}
