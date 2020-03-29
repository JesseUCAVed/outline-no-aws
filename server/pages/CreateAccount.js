// @flow
import * as React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Submit from './components/Submit';
import Grid from 'styled-components-grid';
import Hero from './components/Hero';
import Input from './components/Input'
import Branding from '../../shared/components/Branding';
import { githubUrl } from '../../shared/utils/routeHelpers';
import Flex from './../../shared/components/Flex';
import breakpoint from 'styled-components-breakpoint';

type Props = {};

function CreateAccount(props: Props) {
  return (
    <span>
      <Helmet>
        <title>Create Account</title>
      </Helmet>
      <Grid>
        <Hero id="signin">
          <h1>Create Account</h1>

          <form method="POST" action="/auth/local.create">
            <Input placeholder="email" name="email" type="email" />
            <Input placeholder="password" name="password" type="password" />
            <Wrapper>
              <Column column>
                <Submit type="submit" value="Create Account" />
              </Column>
            </Wrapper>
          </form>
        </Hero>
      </Grid>
      <Branding href={githubUrl()} />
    </span>
  );
}

const Wrapper = styled(Flex)`
  display: block;
  justify-content: center;
  margin-top: 16px;

  ${breakpoint('tablet')`
    display: flex;
    justify-content: flex-start;
    margin-top: 0;
  `};
`;

const Column = styled(Flex)`
  text-align: center;

  ${breakpoint('tablet')`
    &:first-child {
      margin-right: 8px;
    }
  `};
`;

const Spacer = styled.span`
  padding-left: 10px;
`;

export default CreateAccount;
