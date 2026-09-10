type SuccessEnvelope<T> = { data: T; status: number }

/**
 * Orval types each endpoint's query data as a union of the success and error
 * response envelopes (e.g. { data: T[]; status: 200 } | { data: void; status: 401 }).
 * React Query only ever surfaces the success envelope through `data` (error
 * responses reject the promise instead), so this narrows that union to the
 * actual payload in one typed place instead of repeating `as any` in every hook.
 */
export function unwrapResponse<T>(
  envelope: SuccessEnvelope<T> | { data: unknown; status: number } | undefined
): T | undefined {
  return envelope?.data as T | undefined
}
