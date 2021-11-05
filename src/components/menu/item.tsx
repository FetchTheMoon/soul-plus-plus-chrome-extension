import React from 'react';
import { Button, Input, MenuItem, Switch } from '@/controls/menu';
import MenuInput from '@/components/menu/input';
import MenuSwitch from '@/components/menu/switch';
import MenuButton from '@/components/menu/button';


interface IItem {
    item: MenuItem;
}

export default function (props: IItem) {
    if (props.item instanceof Switch)
        return <MenuSwitch key={ props.item.key } item={ props.item }/>;
    if (props.item instanceof Button)
        return <MenuButton key={ props.item.key } item={ props.item }/>;
    if (props.item instanceof Input)
        return <MenuInput key={ props.item.key } item={ props.item }/>;

    return <></>;

}

