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
    quantity: number;
}

type CartContextType = {
    items: CartItem[];
    totalItems: number;
    isInitialized: boolean;
    addToCart: (productId: number) => void;
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
                const parsedCart = JSON.parse(savedCart);

                if(!Array.isArray(parsedCart)){
                    throw new Error("Formato de carrinho inválido.");
                }

                const sanitizedCart: CartItem[] = parsedCart
                    .filter((item) =>
                        Number.isSafeInteger(item.productId) &&
                        item.productId > 0 &&
                        Number.isSafeInteger(item.quantity) &&
                        item.quantity > 0
                    )
                    .map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    }));

                setItems(sanitizedCart);

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

    function addToCart(productId: number) {
        if(!Number.isSafeInteger(productId) || productId <= 0){
            return;
        }

        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.productId === productId
            );

            if(existingItem){
                return currentItems.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentItems, { productId, quantity: 1, }];
        });
    }

    function removeFromCart(productId: number) {
        setItems((currentItems) =>
            currentItems.filter((item) => item.productId !== productId)
        );
    }

    function updateQuantity(productId: number, quantity: number) {
        if(!Number.isSafeInteger(quantity) || quantity < 1) return;

        setItems((currentItems) => 
            currentItems.map((item) =>
                item.productId === productId
                    ? { ...item, quantity, }
                    : item
            )
        );
    }

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                isInitialized,
                addToCart,
                removeFromCart,
                updateQuantity,
            }}
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