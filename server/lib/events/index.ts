import * as events from 'events';

class ClientCallbackClass extends events.EventEmitter {
  constructor() {
    super();
  }
}

export const EventBus = new ClientCallbackClass();

export enum BusEvents {
  NEW_COMMENT = 'new_comment',
  NEW_REPLY = 'new_replie',
  NEW_BLOG = 'new_blog'
}
