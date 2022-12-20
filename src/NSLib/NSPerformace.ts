/**
 * Very simple class to wrap performance
 */
export class NSPerformace {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.startTime = performance.now();
    this.name = name;
  }

  Stop() {
    performance.measure(this.name, {
      start: this.startTime,
      end: performance.now()
    });
  }
}
