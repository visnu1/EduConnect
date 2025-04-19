import { Plus, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts, registerOrder } from "../../../services/api";
import { useAuth } from "../../../hooks/AuthProvider";

interface NutritionalInformation {
    carbohydrates?: string;
    fiber?: string;
    calories?: number;
    sugar?: string;
    protein?: string;
}

interface Item {
    itemId: string;
    name: string;
    image: string;
    category: string;
    quantity: number;
    isDiscontinued: boolean;
    description: string;
    allergens?: string;
    expiry?: string;
    color?: string;
    ingredients?: string;
    eggType?: string;
    origin?: string;
    size?: string;
    nutritionalInformation?: NutritionalInformation;
    organic?: boolean;
    storageInstructions?: string;
}

interface CartItem extends Item {
    orderQuantity: number;
}

const Products = () => {
    const { user: studentInfo } = useAuth();
    const [products, setProducts] = useState<Item[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

    const [trackItems, setTrackItems] = useState<string[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { results } = await getProducts();
                setProducts(results);
                setFilteredItems(results);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = products.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
    };

    const addToCart = (item: Item) => {
        if (!trackItems.includes(item.itemId)) {
            setCart(prevCart => {
                return [...prevCart, { ...item, orderQuantity: 1 }];
            });
            setTrackItems(prevItems => [...prevItems, item.itemId]);
        }
    };

    const removeFromCart = (itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.itemId !== itemId));
    };

    useEffect(() => {
        setTrackItems(cart.map(item => item.itemId));
    }, [cart])

    const onCheckout = async () => {
        if (!(studentInfo && studentInfo.id)) {
            alert("Please Login to continue");
            return;
        }

        const newOrder = {
            orderId: crypto.randomUUID(),
            studentId: studentInfo.id,
            createdAt: new Date().toISOString(),
            picked: false,
            orderDetails: cart.map(item => ({ itemId: item.itemId, image: item.image }))
        };

        console.log(newOrder);

        try {
            const response = await registerOrder(newOrder);
            alert('Your order has been placed!');
            console.log(response);
            setCart([]);
            setTrackItems([]);
            setIsCartOpen(false);
        } catch (error) {
            console.error('Something went wrong', error);
        }
    };


    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-black text-3xl font-bold">Products</h2>
                <div className="flex items-center space-x-2">
                    {/* <button className="flex px-4 py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-purple-600 hover:bg-purple-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </button> */}
                    <button
                        className="flex relative px-4 py-2 text-sm font-medium leading-5 shadow text-black transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue"
                        onClick={() => setIsCartOpen(true)}
                    >
                        {cart.length > 0 && (
                            <div className="absolute right-0 -top-1">
                                <p className="text-sm flex h-1 w-1 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                                    {cart.reduce((total, item) => total + item.orderQuantity, 0)}
                                </p>
                            </div>
                        )}
                        <ShoppingCart className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div>
                <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <Search className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Products"
                        />
                        <button
                            type="submit"
                            className="text-white absolute end-2 top-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
                    {filteredItems.map((item) => (
                        <div
                            key={item.itemId}
                            className="rounded-lg bg-white text-card-foreground shadow-md overflow-hidden w-full lg:w-54"
                        >
                            <div className="w-full h-32 p-4 overflow-hidden bg-secondary/20">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-contain transition-all hover:scale-105"
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5 p-3">
                                <div className="flex justify-between">
                                    <h3 className="text-black font-semibold text-lg">{item.name}</h3>
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-black">
                                        {item.category}
                                    </div>
                                </div>
                                <p className="text-sm pt-1 text-muted-black line-clamp-2 min-h-[40px]">{item.description}</p>
                            </div>

                            <div className="px-3 py-0">
                                <div className="flex justify-between text-sm">
                                    <span className="text-black">Stock:</span>
                                    <span className="text-green-600">{item.quantity} available</span>
                                </div>
                            </div>

                            <div className="items-center p-3 flex gap-2">
                                {/* <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-black h-8 px-4 py-2 flex-1">
                                    Edit
                                </button> */}
                                <button
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white h-8 px-4 py-2 flex-1 bg-orange-500 hover:bg-orange-600"
                                    onClick={() => addToCart(item)}
                                    disabled={trackItems.includes(item.itemId)}>
                                    Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* shopping cart pop-up */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-[#5f5f5fe6] flex items-center justify-center z-10">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Cart</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-200"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Your cart is empty</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.itemId} className="flex items-center justify-between border-b pb-4">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-16 w-16 object-cover rounded"
                                                />
                                                <div>
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">{item.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <button type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                    onClick={() => removeFromCart(item.itemId)}
                                                >Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    onClick={onCheckout}>
                                    Checkout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;