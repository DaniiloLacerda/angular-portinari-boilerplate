export class MessageResponse {
  constructor(
    public type: string,
    public code: number,
    public message?: string | null,
    public detailedMessage?: string | null
  ) {}
}
