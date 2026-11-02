"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

type CartItem = {
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

type CartContextType = {
    items: CartItem[];
    totalItems: number;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    function addToCart(item: Omit<CartItem, "quantity">) {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (cartItem) => cartItem.productId === item.productId
            );

            if(existingItem){
                return currentItems.map((cartItem) =>
                    cartItem.productId === item.productId
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }

            return [...currentItems, { ...item, quantity: 1 }];
        });
    }

    function removeFromCart(productId: number) {
        setItems((currentItems) =>
            currentItems.filter((item) => item.productId !== productId)
        );
    }

    function updateQuantity(productId: number, quantity: number) {
        if(quantity < 1) return;

        setItems((currentItems) => 
            currentItems.map((item) =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    }

    return (
        <CartContext.Provider
            value={{ items, totalItems, addToCart, removeFromCart, updateQuantity }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if(!context) {
        throw new Error("useCart deve ser utilizado dentro de CartProvider");
    }

    return context;
}