import React, { memo, useEffect } from 'react';
import { useApi } from 'api';
import { RouterLink } from 'components';
import { useRouter } from 'router';
import { services } from 'orm/selectors';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function ServiceList() {
  const classes = useStyles();
  const router = useRouter();
  const Api = useApi();
  const servicesData = useSelector(state => services(state));
  const jwt = useSelector(state => state.auth.token);

  useEffect(() => {
    Api.index('Service').then(body => {
      console.log(body);
    });
  }, []);

  const join = url => {
    fetch(url, { headers: { Authorization: `Bearer ${jwt}` } })
      .then(res => res.json())
      .then(data => {
        window.open(
          `${data.redirect_url}?jwt=${data.jwt}`,
          'super cool video conference',
          'height=570,width=720,resizable,scrollbars,status'
        );
      });
  };

  return (
    <>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Learn and share in real time.
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Unique, real-time courses, led by a world of hosts.
            </Typography>
            {/* <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Main call to action
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Secondary action
                  </Button>
                </Grid>
              </Grid>
            </div> */}
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {servicesData.map(service => (
              <Grid item key={service.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {service.category}
                    </Typography>
                    <Typography gutterBottom variant="h4" component="h2">
                      {service.title}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="h4">
                      {service.duration}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="h6">
                      {service.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => join(service.join_url)}
                    >
                      Join
                    </Button>
                    <RouterLink
                      to={router.routes.details}
                      params={[service.id]}
                    >
                      <Button size="small" color="primary">
                        Details
                      </Button>
                    </RouterLink>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Serviceline
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Services &nbsp; Account &nbsp; Support
        </Typography>
      </footer>
      {/* End footer */}
    </>
  );
}

export default memo(ServiceList);
