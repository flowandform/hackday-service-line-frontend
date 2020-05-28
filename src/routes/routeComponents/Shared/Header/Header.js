import React, { memo } from 'react';
import { useRouter } from 'router';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import './Header.scss';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Header() {
  const classes = useStyles();
  const router = useRouter();

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
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() =>
              router.transitionTo(router.transitionTo(router.routes.services))
            }
          >
            Service Line
          </Typography>
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
        </Toolbar>
      </AppBar>
    </div>
  );
}

Header.propTypes = {};

Header.defaultProps = {};

export default memo(Header);
