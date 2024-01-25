import React, { useEffect, useState } from 'react';

//Custom components
import Button from './Button.component.tsx';

//Props
import { SearchFieldProps } from '../../props/SearchField.props.tsx';
import { useTranslation } from 'react-i18next';

const SearchField = (search_field: SearchFieldProps) => {

    const [searchField, setSearchField] = useState<SearchFieldProps>(search_field);
    const [searchedString, setSearchedString] = useState("");

    const { t } = useTranslation();

    useEffect(() => {
        setSearchField(search_field);
    }, [search_field])

    return (
        <div className='flex'>
            <div>
                <input className='border-1' type='text' value={searchedString} onChange={(e) => setSearchedString(e.currentTarget.value)} ></input>
            </div>
            <div className='flex'>
                <Button label={t("search")} type='Submit' on_click_handler={() => { searchField.confirmSearchHandler(searchedString) }}></Button>
            </div>
        </div>
    );
};

export default SearchField;
