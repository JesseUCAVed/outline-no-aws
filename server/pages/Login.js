// @flow
import * as React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Grid from 'styled-components-grid';
import Button from './components/Button';
import Submit from './components/Submit'
import AuthNotices from './components/AuthNotices';
import Hero from './components/Hero';
import Input from './components/Input'
import Branding from '../../shared/components/Branding';
import { githubUrl, signin } from '../../shared/utils/routeHelpers';
import Flex from './../../shared/components/Flex';
import breakpoint from 'styled-components-breakpoint';

type Props = {};

function Login(props: Props) {

  return (
    <span>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Grid>
        <Hero id="signin">
          <AuthNotices notice={props.notice} />
          <h1>Login</h1>

          <form method="POST" action={signin('local')}>
            <Input placeholder="email" name="email" type="text" />
            <Input placeholder="password" name="password" type="password" />
            <Wrapper>
              <Column column>
                <Submit type="submit" value="Log In" />
              </Column>
              <Column column>
                <Button href={'/create-account'}>
                  <Spacer>Create Account</Spacer>
                </Button>
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

export default Login;