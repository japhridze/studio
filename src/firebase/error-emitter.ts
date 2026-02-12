type Listener = (event: any) => void;
type Listeners = { [event: string]: Listener[] };

class EventEmitter {
  private listeners: Listeners = {};

  on(event: string, listener: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: string, payload: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => listener(payload));
  }
}

export const errorEmitter = new EventEmitter();
