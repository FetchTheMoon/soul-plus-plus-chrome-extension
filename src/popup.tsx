import React from 'react';
import ReactDOM from 'react-dom';
import { AppBar, Box, ThemeProvider, Toolbar, Typography } from '@mui/material';
import Category from '@/components/menu/category';
import { createTheme } from '@material-ui/core';
import { getItem } from '@/utilities/storage';
import menu from '@/settings';
import { Scrollbars } from 'react-custom-scrollbars';

const theme = createTheme({
    palette: {
        mode: await getItem('Switch::dark-mode') ? 'dark' : 'light',
    },
});


ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={ theme }>
            <Box sx={ {
                width: '600px',
            } }>
                <Scrollbars style={ { width: 600 } }
                            autoHeight={ true }
                            autoHeightMax={ 600 }
                >
                    <AppBar position="static" color="inherit">
                        <Toolbar variant="dense">
                            <Typography variant="h6" color="inherit" component="div">
                                Soul++设置
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    {
                        menu.map((category) =>
                            <Category
                                category={ category }
                                key={ category.label }
                            />,
                        )
                    }

                </Scrollbars>
            </Box>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
