'use client';
import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Hidden
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import { styled } from '@mui/material/styles';

// Custom styled components to match the application's aesthetic
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  marginBottom: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(229, 231, 235, 1)',
  '&:before': {
    display: 'none', // Remove the default divider
  },
  '&.Mui-expanded': {
    margin: '16px 0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: 'white',
  borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
  '&.Mui-expanded': {
    minHeight: '48px',
    borderBottom: '1px solid rgba(229, 231, 235, 1)',
  },
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
    '&.Mui-expanded': {
      margin: '12px 0',
    }
  }
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: '16px 24px 24px',
  backgroundColor: 'rgb(248, 250, 252)',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#05668D',
  fontSize: '1.25rem',
}));

const StyledExpandMoreIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  color: '#6BC9BE',
}));

const MyGroupRenderer = (props) => {
  const { uischema, schema, path, visible, renderers } = props;
  const layoutProps = { elements: uischema.elements, schema, path, visible, uischema, renderers };

  return (
    <Hidden xsUp={!visible}>
      <StyledAccordion defaultExpanded>
        <StyledAccordionSummary 
          expandIcon={<StyledExpandMoreIcon />}
          aria-controls="questionnaire-content"
          id="questionnaire-header"
        >
          <StyledTypography>{uischema.label}</StyledTypography>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <MaterialLayoutRenderer {...layoutProps} />
        </StyledAccordionDetails>
      </StyledAccordion>
    </Hidden>
  );
};

export default withJsonFormsLayoutProps(MyGroupRenderer);

// Tester para detectar 'Group'
export const myGroupTester = rankWith(1000, uiTypeIs('Group'));