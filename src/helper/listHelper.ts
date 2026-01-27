export const addItemToList = (
    value: string,
    setValue: (v: string) => void,
    setList: React.Dispatch<React.SetStateAction<string[]>>
) => {
    if (!value.trim()) return;

    setList(prev => [...prev, value.trim()]);
    setValue('');
};

export const removeItemFromList = (
    index: number,
    setList: React.Dispatch<React.SetStateAction<string[]>>
) => {
    setList(prev => prev.filter((_, i) => i !== index));
};
