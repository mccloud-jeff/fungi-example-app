// NPM imports
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SemVer from 'semver';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SvgIcon from 'material-ui/SvgIcon';
import FontIcon from 'material-ui/FontIcon';
import { Actions } from '../../state';
import logoImage from '../../resources/images/logo.png';

class LoginPage extends React.Component {
  onLogin() {
    this.props.login({
      username: this.email.getValue(),
      password: this.password.getValue()
    })
      .then(() => this.props.router.push('/'))
  }

  componentDidMount() {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }

  render() {
    const { muiTheme, loginError } = this.props;

    let actions = [
      <FlatButton label="Login" primary onTouchTap={() => this.onLogin() } />
    ];

    if (loginError) {
      actions = [
        <h3 style={{ display: 'inline', color: muiTheme.textField.errorColor, marginRight: 32 }}>Invalid login, please try again.</h3>,
        ...actions
      ];
    }

    const logo = (
      <img style={{ height: 80, display: 'block', margin: 'auto' }} src={logoImage} />
    );

    const cssStyle = `
      input:-webkit-autofill {
        -webkit-text-fill-color: ${muiTheme.palette.textColor};
        -webkit-box-shadow: 0 0 0px 1000px ${muiTheme.palette.canvasColor} inset;
      }
      @media only screen 
        and (min-device-width : 320px) 
        and (max-device-width : 568px) 
        and (orientation : portrait) {
          .col-xs-4 {
            float: none;
          }
        }
      `;

    return (
      <div>
        <Dialog
          actions={actions}
          modal={false}
          open
          contentStyle={{ minWidth: 320, maxWidth: 640 }}
          >
          <style dangerouslySetInnerHTML={{ __html: cssStyle }} />
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-4 text-center" style={{ width: 'auto', padding: 16 }}>
                {logo}
              </div>
              <div className="col-xs-8 text-center" style={{ minWidth: 260, width: 'auto', padding: '0 16px' }}>
                <input style={{ display: 'none' }} type="text" name="fakeemailremembered" />
                <input style={{ display: 'none' }} type="password" name="fakepasswordremembered" />
                <TextField
                  ref={ref => (this.email = ref) }
                  floatingLabelText="Email"
                  type="text"
                  fullWidth
                  autoFocus
                  style={{ marginTop: 0 }}
                  onKeyDown={(e) => { if (e.keyCode === 13) this.onLogin(); } }
                  errorText={loginError && ' '}
                  />
                <br />
                <TextField
                  ref={ref => (this.password = ref) }
                  floatingLabelText="Password"
                  type="password"
                  fullWidth
                  style={{ marginTop: 0 }}
                  onKeyDown={(e) => { if (e.keyCode === 13) this.onLogin(); } }
                  errorText={loginError && ' '}
                  />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      loginError: state.loginError
    };
  },
  dispatch => ({
    ...bindActionCreators(Actions, dispatch)
  })
)(muiThemeable()(LoginPage));
