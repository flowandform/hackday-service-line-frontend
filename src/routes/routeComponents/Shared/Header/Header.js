import React, { memo } from 'react';
import { useRouter } from 'router';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import './Header.scss';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    cursor: 'pointer',
    flexGrow: 1,
  },
}));

function Header() {
  const classes = useStyles();
  const router = useRouter();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  console.log(router);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() =>
              router.transitionTo(router.transitionTo(router.routes.services))
            }
          >
            Serviceline
          </Typography>
          {!isLoggedIn ? (
            <>
              <Button
                color="inherit"
                onClick={() => router.transitionTo(router.routes.login)}
              >
                Sign in
              </Button>
              <Button
                color="inherit"
                onClick={() => router.transitionTo(router.routes.register)}
              >
                Sign up
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => router.transitionTo(router.routes.logout)}
            >
              Log out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

Header.propTypes = {};

Header.defaultProps = {};

export default memo(Header);
