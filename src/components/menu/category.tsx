import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowBackwardIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { ICategory } from '@/controls/menu';
import { Accordion, AccordionDetails, Typography } from '@mui/material';
import Item from '@/components/menu/item';

interface IProps {
    category: ICategory;
}


export default (props: IProps) => {
    const [isExpanded, setExpanded] = useState({ expanded: props.category.expanded || false });
    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        props.category.expanded = isExpanded;
        setExpanded({ expanded: isExpanded });
    };

    return (
        <Accordion
            expanded={ isExpanded.expanded }
            onChange={ handleChange }
            square={ true }
            sx={ { width: 'auto' } }
            disableGutters={ true }
        >
            <AccordionSummary>

                <Typography variant="subtitle2" gutterBottom={ false } sx={ {
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                } }>
                    <props.category.icon fontSize={ 'small' } sx={ { marginRight: '0.618em' } }/>
                    { props.category.label }
                </Typography>
            </AccordionSummary>
            <AccordionDetails>

                {
                    props.category.items.map(option => <Item key={ option.key } item={ option }/>)
                }

            </AccordionDetails>
        </Accordion>
    );
};


const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={ <ArrowBackwardIosSharpIcon sx={ { fontSize: '0.8rem' } }/> }
        { ...props }
    />
))(({ theme }) => ({

    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(-90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

