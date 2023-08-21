export interface APIResponse {
  data?: Record<string, unknown> | null;
  message: Record<string, unknown> | string;
  success: boolean;
}
