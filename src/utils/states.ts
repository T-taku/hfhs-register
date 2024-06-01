import { atom } from "recoil";

export const amountPaidState = atom<number[]>({
  key: 'amountPaidState',
  default: [0],
});