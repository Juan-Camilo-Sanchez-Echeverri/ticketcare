export interface INotificationProvider<TPayload> {
  send(payload: TPayload): Promise<boolean>;
}
