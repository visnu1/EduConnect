import { Filter, Search } from "lucide-react";
import CourseList from "./CourseList";
import { useState } from "react";
import FilterMenu from "./FilterMenu";

const CourseRegistration = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterToggle = (filter: string) => {
        if (activeFilters.includes(filter)) {
            setActiveFilters(activeFilters.filter(f => f !== filter));
        } else {
            setActiveFilters([...activeFilters, filter]);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Register for Your Courses
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Browse available courses, filter by your preferences, and register for the upcoming semester.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <Search className="absolute left-3.5 top-2.4 h-5 w-5 text-muted-foreground" />
                            </div>
                            <input type="search" id="default-search"
                                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Products"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none border border-gray-200 hover:text-accent-foreground h-9 px-4 py-1 flex items-center gap-2 bg-white hover:bg-gray-50"
                            onClick={() => setShowFilters(!showFilters)}>
                            <Filter size={18} />
                            <span>Filters</span>
                            {activeFilters.length > 0 && (
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 ml-2 bg-blue-100 text-blue-800">
                                    {activeFilters.length}
                                </div>
                            )}
                        </button>
                    </div>
                    {showFilters && (
                        <FilterMenu
                            activeFilters={activeFilters}
                            onFilterItemToggle={handleFilterToggle}
                        />
                    )}
                    <CourseList searchTerm={searchTerm} activeFilters={activeFilters} />
                </div>
            </main>
        </div>
    );
}

export default CourseRegistration;