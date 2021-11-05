import { createTheme } from '@material-ui/core';
import { getItem } from '@/utilities/storage';
import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider } from '@mui/material';
import MarkListTable from '@/components/mark-list/table';
import TASK_CheckMarkList from '@/tasks/check-mark-list';

const darkMode = await getItem('Switch::dark-mode');
if (darkMode) document.body.style.background = '#252626';

const theme = createTheme({
    palette: {
        mode: darkMode ? 'dark' : 'light',
    },
});


const domain = await getItem('GlobalData::domain');


ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={ theme }>

            <MarkListTable domain={ domain }/>

        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

TASK_CheckMarkList();