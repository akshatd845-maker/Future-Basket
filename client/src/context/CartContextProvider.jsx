import { CartProvider } from "./CartProvider";

export function CartContextProvider({ children }) {
  return <CartProvider>{children}</CartProvider>;
}


