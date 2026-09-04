export type TxStep =
  | 'idle'
  | 'wallet_confirmation'
  | 'submitted'
  | 'confirming'
  | 'confirmed'
  | 'cancelled'
  | 'reverted';

export const TX_PIPELINE: TxStep[] = [
  'wallet_confirmation',
  'submitted',
  'confirming',
  'confirmed',
];
