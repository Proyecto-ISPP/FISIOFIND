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

const MyGroupRenderer = (props) => {
  const { uischema, schema, path, visible, renderers } = props;
  const layoutProps = { elements: uischema.elements, schema, path, visible, uischema, renderers };

  return (
    <Hidden xsUp={!visible}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{uischema.label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MaterialLayoutRenderer {...layoutProps} />
        </AccordionDetails>
      </Accordion>
    </Hidden>
  );
};

export default withJsonFormsLayoutProps(MyGroupRenderer);

// Tester para detectar 'Group'
export const myGroupTester = rankWith(1000, uiTypeIs('Group'));