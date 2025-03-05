import useLabelStore from '@/src/stores/useLabelStore'
import React, { useEffect, useRef, useState } from 'react'
import colors from '@/src/config/labelColors.json'

const filterLabels = (labels, search) => {
    return labels.filter(label => (
        label.title.toLowerCase().startsWith(search)
        || colors[label.color].name.startsWith(search)
    ));
}

const CardLabelSearch = ({ setLabels }) => {
    const { labels } = useLabelStore();
    const [ searchTerm, setSearchTerm ] = useState('');
    const debounceTimer = useRef(null);

    // useEffect(() => {
    //     setLabels(labels);
    // }, []);

    useEffect(() => {
        setLabels(filterLabels(labels, searchTerm));
    }, [labels]);


    const onChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            const filteredLabels = filterLabels(labels, value);

            setLabels(filteredLabels);

            console.log("Executed search");
        }, 200);
    }

    return (
        <div className='w-full text-center my-2'>
            <input
                type='text'
                placeholder='Search labels...'
                className='w-full text-foreground p-2 border bg-secondary/30 border-gray-400 rounded-sm h-8'
                onChange={onChange}
            />
        </div>
    )
}

export default CardLabelSearch
