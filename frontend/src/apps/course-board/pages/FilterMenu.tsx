import { CheckCircle2 } from "lucide-react";

interface FilterMenuProps {
    activeFilters: string[];
    onFilterItemToggle: (filter: string) => void;
}


const FilterMenu: React.FC<FilterMenuProps> = ({ activeFilters, onFilterItemToggle }) => {

    const majorOpts = [
        'Computer Science',
        'Information Technology',
        'Business'
    ];

    const locationOpts = [
        'Newark',
        'New Brunswick',
        'Online'
    ];

    const statusOpts = [
        'Open',
        'Closed'
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 className="font-medium mb-3 text-slate-800">Major</h3>
                    <div className="flex flex-wrap gap-2">
                        {majorOpts.map(major => (
                            <FilterBadge
                                key={major}
                                label={major}
                                isActive={activeFilters.includes(major)}
                                onClick={() => onFilterItemToggle(major)}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-3 text-slate-800">Location</h3>
                    <div className="flex flex-wrap gap-2">
                        {locationOpts.map(location => (
                            <FilterBadge
                                key={location}
                                label={location}
                                isActive={activeFilters.includes(location)}
                                onClick={() => onFilterItemToggle(location)}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-3 text-slate-800">Status</h3>
                    <div className="flex flex-wrap gap-2">
                        {statusOpts.map(status => (
                            <FilterBadge
                                key={status}
                                label={status}
                                isActive={activeFilters.includes(status)}
                                onClick={() => onFilterItemToggle(status)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {activeFilters.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied
                    </div>
                    <button className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 rounded-md px-3 hover:bg-accent hover:text-accent-foreground">
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}

export default FilterMenu;

interface FilterBadgeProps {
    label: string,
    isActive: boolean,
    onClick: () => void
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ label, isActive, onClick }) => {
    return (
        <button
            className={`flex items-center cursor-pointer py-1 px-3 rounded-full font-normal transition-all text-xs border border-gray-200 select-none
            ${isActive ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`}
            onClick={onClick}>
            {isActive && <CheckCircle2 className="mr-1 h-3 w-3" />}
            <span>{label}</span>
        </button>
    );
}