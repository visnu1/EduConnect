import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from 'lucide-react';

interface SelectProps {
    label: string,
    options: { value: string, label: string, image?: string }[],
    value?: string,
    onChange?: (value: string) => void
    disabled?: boolean
    name?: string
}


const Select: React.FC<SelectProps> = ({ label = 'Choose', options, value = null, onChange, disabled, name }) => {
    const [toggle, setToggle] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const [selected, setSelected] = useState<string | null>(value);
    const dropDownRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node) &&
                btnRef.current && !btnRef.current.contains(event.target as Node))
                setToggle(false);
        }

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setSelected(value);
        if (onChange) onChange(value);
        setToggle(false);
    }

    useEffect(() => {
        console.log(selected);
    }, [selected])


    return (
        <div>
            <label id="listbox-label" className="block text-sm/6 font-medium text-gray-900">{label}</label>
            <div className="relative mt-2">
                <button
                    ref={btnRef}
                    onClick={() => setToggle(!toggle)}
                    type="button"
                    className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    aria-haspopup="listbox"
                    aria-expanded={toggle}
                    aria-labelledby="listbox-label"
                    disabled={disabled}
                >
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">

                        {selected && options.find((opt) => opt.value === selected)?.image && (
                            <img
                                src={options.find((opt) => opt.value === selected)?.image}
                                alt=""
                                className="size-5 shrink-0 rounded-full"
                            />
                        )}
                        <span className="block truncate">
                            {selected
                                ? options.find((opt) => opt.value === selected)?.label
                                : 'Select an option'}
                        </span>
                    </span>
                    <ChevronsUpDown className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                </button>

                {toggle &&
                    <ul
                        ref={dropDownRef}
                        className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm"
                        tabIndex={-1}
                        role="listbox"
                        aria-labelledby="listbox-label"
                    >
                        {options && options.map((item, index) => (
                            <li
                                key={index}
                                className={`relative cursor-pointer py-2 pr-9 pl-3 text-gray-900 select-none hover:bg-gray-200 ${selected === item.value ? "bg-indigo-100" : ""}`}
                                id={`listbox-option-${index}`}
                                role="option"
                                onClick={() => handleSelect(item.value)}>
                                <div className="flex items-center">
                                    {item.image && <img src={item.image} alt="" className="size-5 shrink-0 rounded-full" />}
                                    <span className="ml-3 block truncate font-normal">{item.label}</span>
                                </div>

                                {selected === item.value && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                        <Check className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                }
            </div>
            <input type="hidden" name={name} value={selected || ''} />
        </div>
    );
}


export default Select;