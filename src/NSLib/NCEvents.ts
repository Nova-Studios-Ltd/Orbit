import { Dictionary } from "./Dictionary";

class Event {
  once: boolean;
  func: (...args: any[]) => void;

  constructor(once: boolean, func: (...args: any[]) => void) {
    this.once = once;
    this.func = func;
  }
}

/**
 * Event system for application wide events.
 * A channel can only be used once, but can have multiple function calls
 */
export default class NCEvents {
  private Events: Dictionary<Event[]>;

  constructor() {
    this.Events = new Dictionary<Event[]>();
  }

  /**
   * Registers a event that will only trigger once before being destroyed
   * @param channel Event channel, can only be used once per event
   * @param func A function to call when NCEvents.send() is invoked
   * @returns True on event creation otherwise false
   */
  once(channel: string, func: (...args: any[]) => void) : boolean {
    if (!this.Events.containsKey(channel)) {
      this.Events.setValue(channel, [] as Event[]);
    }
    this.Events.getValue(channel).push(new Event(true, func));
    return true;
  }

  on(channel: string, func: (...args: any[]) => void): boolean {
    if (!this.Events.containsKey(channel)) {
      this.Events.setValue(channel, [] as Event[]);
    }
    this.Events.getValue(channel).push(new Event(false, func));
    return true;
  }

  send(channel: string, ...data: any[]) {
    this.Events.getValue(channel).forEach(event => {
      event.func(...data);
    });
    if (this.Events.getValue(channel)[0].once)
      this.Events.clear(channel);
  }

  remove(channel: string) {
    return this.Events.clear(channel);
  }
}
