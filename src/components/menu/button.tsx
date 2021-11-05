import React from 'react';
import { IButton } from '@/controls/menu';
import { Button } from '@mui/material';

interface IProps {
    item: IButton;
}


export default function (props: IProps) {

    return (
        <Button
            onClick={ props.item.onClick }
            color={ props.item.color }
            fullWidth={ true }
            sx={ { typography: 'button' } }
        >
            { props.item.label }
        </Button>

    );

}