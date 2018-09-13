import { KrakenClient } from '../src/lib/kraken'

export const kk = {
  public_key: 'UK/voBX4cjpA9ZYD03SS2eKSyHU0UMzfemrihFKklpr',
  private_key: 'bSpSsykugf2Gzdye4rJwUiNN5Z0H3OJFCPq8T1m4GOU0Vafv1LzAnMcgIic15se'
}
export const kraken = new KrakenClient(kk.public_key, kk.private_key)
