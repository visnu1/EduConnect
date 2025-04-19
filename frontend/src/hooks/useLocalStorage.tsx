import { useState } from 'react';

type UseLocalStorageReturn<T> = [
    localStoreValue: T,
    setValue: (val: T) => void,
    removeValue: () => void,
];

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
    const [localStoreValue, setLocalStoreValue] = useState<T>(() => {
        try {
            console.log("Will see if called useLocalStorage hook");
            const temp = localStorage.getItem(key);
            if (temp) return JSON.parse(temp);

            localStorage.setItem(key, JSON.stringify(initialValue));
            return initialValue;
        } catch (err) {
            console.warn(err);
            return initialValue;
        }
    });

    const setValue = (newValue: T) => {
        try {
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch (err) {
            console.warn(err);
        }
        setLocalStoreValue(newValue);
    };

    const removeValue = () => {
        try {
            localStorage.removeItem(key);
            setLocalStoreValue(initialValue);
        } catch (err) {
            console.warn(err);
        }
    };

    return [localStoreValue, setValue, removeValue];
};
