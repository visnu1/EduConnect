

import { ShoppingBag, ClipboardList } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex flex-wrap bg-gray-100 w-full min-h-screen h-auto">
            <div className="w-2/12 bg-white rounded p-3 shadow-lg">
                <div className="gap-2 flex items-center justify-center space-x-4 p-2 mb-5">
                    <div className="flex items-center space-x-2">
                        <ShoppingBag className="h-6 w-6 text-purple-500" />
                        <h1 className="font-bold text-lg">Pantry Pal</h1>
                    </div>
                </div>
                <ul className="space-y-2 text-sm">
                    <li>
                        <Link to={'/pantry/products'} className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                            <ShoppingBag size={20} />
                            <span>Products</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/pantry/orders'} className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                            <ClipboardList size={20} />
                            <span>Orders</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="flex-1">
                <div className="p-6 text-gray-500">
                    {/* We will Render child routes here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
