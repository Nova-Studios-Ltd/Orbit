import { Dictionary } from "./Dictionary";

class Event {
  once: boolean;
  func: (...args: any[]) => void;

  constructor(once: boolean, func: (...args: any[]) => void) {
    this.once = once;
    this.func = func;
  }
}

export default class NCEvents {
  private Events: Dictionary<Event>;

  constructor() {
    this.Events = new Dictionary<Event>();
  }

  once(channel: string, func: (...args: any[]) => void) : boolean {
    if (this.Events.containsKey(channel)) return false;
    this.Events.setValue(channel, new Event(true, func));
    return true;
  }

  on(channel: string, func: (...args: any[]) => void): boolean {
    if (this.Events.containsKey(channel)) return false;
    this.Events.setValue(channel, new Event(false, func));
    return true;
  }

  send(channel: string, ...data: any[]) {
    this.Events.getValue(channel).func(...data);
    if (this.Events.getValue(channel).once)
      this.Events.clear(channel);
  }

  remove(channel: string) {
    return this.Events.clear(channel);
  }
}
