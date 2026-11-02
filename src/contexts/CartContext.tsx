"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

type CartItem = {
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stockQuantity: number;
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
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem("rosa-merger-cart");
        
        if(savedCart){
            try{
                setItems(JSON.parse(savedCart));
            } catch{
                localStorage.removeItem("rosa-merger-cart");
            }
        }

        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if(!isInitialized) return;

        localStorage.setItem("rosa-merger-cart", JSON.stringify(items));
    }, [items, isInitialized]);

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    function addToCart(item: Omit<CartItem, "quantity">) {
        if(item.stockQuantity <= 0) return;

        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (cartItem) => cartItem.productId === item.productId
            );

            if(existingItem){
                if(existingItem.quantity >= item.stockQuantity){
                    return currentItems;
                }

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
                    ? { ...item, quantity: Math.min(quantity, item.stockQuantity), }
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