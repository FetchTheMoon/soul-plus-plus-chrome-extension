import React, { useState } from 'react';
import { IInput } from '@/controls/menu';
import { TextField } from '@mui/material';

interface IProps {
    item: IInput;
}

export default function (props: IProps) {
    const [value, setValue] = useState(props.item.value);
    const [error, setError] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(false);
        setValue(event.target.value);
    };
    const handleBlur = () => {
        if (!value) {
            props.item.value = '';
            return;
        }
        if (!props.item.validate) return;
        const { valid, result } = props.item.validate(value);
        if (valid) {
            props.item.value = result;
            setValue(result);
            setError(false);
        } else {
            setError(true);
        }

    };

    return <TextField
        fullWidth
        label={ props.item.label }
        variant="standard"
        placeholder={ props.item.placeholder }
        onChange={ handleChange }
        onBlur={ handleBlur }
        onKeyDown={ (e) => {
            if (e.key === 'Enter') {
                handleBlur();
            }
        } }
        value={ value }
        error={ error }
        helperText={ props.item.helperText }
    />;
}