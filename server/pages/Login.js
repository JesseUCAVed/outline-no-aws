// @flow
import * as React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Button from './components/Button';
import Grid from 'styled-components-grid';
import Hero from './components/Hero';
import Input from './components/Input'
import Branding from '../../shared/components/Branding';
import { githubUrl, signin } from '../../shared/utils/routeHelpers';

type Props = {};

function Login(props: Props) {
  return (
    <span>
      <Helmet>
        <title>Outline - Team wiki & knowledge base</title>
      </Helmet>
      <Grid>
        <Hero id="signin">
          <Input type="text"/>
          <Input type="password"/>
          <Button href={signin('local')}>
            <Spacer>Log In</Spacer>
          </Button>
        </Hero>
      </Grid>
      <Branding href={githubUrl()} />
    </span>
  );
}

const Spacer = styled.span`
  padding-left: 10px;
`;

export default Login;
