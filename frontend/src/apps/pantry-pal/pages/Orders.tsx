import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyOrders } from "../../../services/api";


interface OrderDetails {
    itemId: string;
    image: string;
}

interface Order {
    createdAt: string;
    picked: boolean;
    studentId: string;
    orderDetails: OrderDetails[];
    orderId: string;
}


const studentInfo = JSON.parse(localStorage.getItem("student") as string) || [];

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { results } = await getMyOrders(studentInfo.id);
                setOrders(results);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                alert("Something went wrong!!");
            }
        };
        fetchProducts();
    }, []);


    return <>
        <div className="flex items-center justify-between">
            <h1 className="text-black text-3xl font-bold">Orders</h1>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-5xl mx-auto my-8 font-sans">


            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order History</h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">

                <div className="relative flex-grow w-full md:w-auto">
                    <Search className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground" />
                    <input type="search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Order-ID" />
                </div>
            </div>


            <div className="border border-gray-200 rounded-md overflow-x-auto">
                <div className="min-w-full divide-y divide-gray-200">
                    <div className="grid grid-cols-[50%_15%_15%_20%] gap-4 bg-gray-50 px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        <div className="col-span-1">Order ID</div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-1">Items</div>
                        <div className="col-span-1">Status</div>
                    </div>

                    {orders && orders.map(order => (
                        <div key={order.orderId} className="bg-white divide-y divide-gray-200">
                            <div className="grid grid-cols-[50%_15%_15%_20%] gap-4 px-4 sm:px-6 py-4 items-center hover:bg-gray-50">
                                <div className="col-span-1 text-sm font-medium text-gray-900">ORD-{order.orderId}</div>
                                <div className="col-span-1 text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</div>
                                <div className="col-span-1 text-sm text-gray-700">{order.orderDetails.length} items</div>
                                <div className="col-span-1">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.picked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.picked ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div >
    </>
}

export default Orders;