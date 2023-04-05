import { CALL_BACK_DATA } from './constants';

class State {
  private state: Map<number, CALL_BACK_DATA>;

  constructor() {
    this.state = new Map();
  }

  setState = (id: number, mode: CALL_BACK_DATA) => {
    this.state.set(id, mode);
  };

  getState = (id: number) => {
    return this.state.get(id);
  };

  resetState = (id: number) => {
    this.state.delete(id);
  };
}

export const state = new State();
