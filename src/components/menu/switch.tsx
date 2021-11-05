import React from 'react';
import { ISwitch } from '@/controls/menu';
import { ListItem, ListItemText, Switch } from '@mui/material';

interface IProps {
    item: ISwitch;
}


export default function (props: IProps) {
    const [checked, setChecked] = React.useState(props.item.checked ?? false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.item.checked = e.target.checked;
        setChecked(e.target.checked);
    };

    return (

        <ListItem dense={ true } disablePadding={ true }>
            <Switch
                edge="end"
                onChange={ handleChange }
                checked={ checked }
            />
            <ListItemText
                id={ props.item.key }
                primary={ props.item.label }
                sx={ {
                    marginLeft: '0.618em',
                    borderLeft: 'none',
                } }
            />

        </ListItem>

    );

}