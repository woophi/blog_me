export type IgEventParams = {
  blogId: string;
  done?: (err?: Error) => void;
}

export enum IgEvents {
  INSTAGRAM_ASK = 'post to instagram',
  INSTAGRAM_RESPONSE = 'post to instagram done'
}
