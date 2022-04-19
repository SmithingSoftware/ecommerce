import { CartActionTypes } from "./actions/ActionTypes";

export interface Item {
  id: string;
  name: string;
  price: string;
  image?: string;
  description: string;
}

type CartState = {
  items: Item[];
};

export interface User {
  id: string;
  name: string;
  email: string;
}
