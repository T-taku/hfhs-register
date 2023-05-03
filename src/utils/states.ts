import { atom } from "recoil";

export const amountPaidState = atom<number[]>({
    key: 'amountPaid',
    default: [],
});