import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { IUploadButton } from '@/controls/menu';

const Input = styled('input')({
    display: 'none',
});

interface IProps {
    item: IUploadButton;
}

export default function (props: IProps) {

    return (
        <label htmlFor="contained-button-file">
            <Input accept=".json" id="contained-button-file" type="file" onChange={ props.item.onChange }/>
            <Button
                fullWidth={ true }
                component="div">
                { props.item.label }
            </Button>
        </label>
    );
}