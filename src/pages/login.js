import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/icon.png";
import { Link } from "react-router-dom";
import axios from "axios";

// MUI Stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
// Google oAuth
import GoogleLogin from "react-google-login";
// Redux stuff
import { connect } from "react-redux";
import { loginUser, signupUser } from "../redux/actions/userActions";

const styles = (theme) => ({ ...theme.spreadIt });

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.UI.errors) {
  //     this.setState({ errors: props.UI.errors });
  //   }
  //   return state;
  // }
  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  responseGoogle = (response) => {
    console.log(response);
    console.log(response.profileObj);
    if (response && response.profileObj) {
      let user = response.profileObj;
      const userData = {
        email: user.email,
        password: user.googleId,
        confirmPassword: user.googleId,
        username: user.givenName,
        imageUrl: user.imageUrl,
      };
      axios
        .get("/checkGoogleUser", { params: { username: user.givenName } })
        .then((res) => {
          if (res.data._fieldsProto) {
            this.props.loginUser(
              { email: userData.email, password: userData.password },
              this.props.history
            );
          } else {
            this.props.signupUser(userData, this.props.history);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monkey" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              <hr />
              dont have an account ? sign up <Link to="/signup">here</Link>
              <hr />
              <GoogleLogin
                clientId="606193713392-bknt6dbes8uriv4n6vka3ats750ahhvq.apps.googleusercontent.com"
                buttonText="Login With Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
              <hr />
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
  signupUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(login));
