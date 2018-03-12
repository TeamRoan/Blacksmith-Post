import React from 'react';
import {Component} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import $ from 'jquery';
import bcrypt from 'bcryptjs';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width: '30%'
  }
};

class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      signUpView: false,
      email:'',
      password:'',
      errMsg: '',
      validEmail: false,
      passwordClicked: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignUpView = this.handleSignUpView.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleSignUpView() {
    this.setState({signUpView: !this.state.signUpView, errMsg:''})
  }

  handleLoginSubmit(e) {
    e.preventDefault();
    let password = this.state.password;
    var salt = "$2a$10$yg5TlmPRWL2O2S6yR0Q6X."
    var hash = bcrypt.hashSync(password, salt)
    console.log('in handleSubmit');
    var newUser = {username: this.state.email, password: hash};
    $.post('/login', newUser, (data) => {
      if (data.message) {
        this.setState({errMsg: data.message[0]})
      } else {
        this.setState({modalIsOpen: false});
        this.setState({errMsg: false});
        this.props.setCurrentUser(data[0]);
        this.props.close();
      }
    })
  }

  handleSignUpSubmit(e) {
    e.preventDefault();
    let password = this.state.password;
    var salt = "$2a$10$yg5TlmPRWL2O2S6yR0Q6X."
    var hash = bcrypt.hashSync(password, salt)
    var newUser = {username: this.state.email, password: hash};
    $.post('/signup', newUser, (data) => {
      console.log(data);
      if (data.message) {
        this.setState({errMsg: data.message[0]})
      } else {
        this.setState({modalIsOpen: false});
        this.setState({errMsg: false});
        this.props.setCurrentUser(data[0]);
        this.props.close();
      }
    })
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value, errMsg:''});

  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value, errMsg:''});
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({signUpView: false})
    this.setState({modalIsOpen: false});
    this.props.close();
  }

  checkEmail(charsAfter) {
    charsAfter = charsAfter || 2;
    this.setState({passwordClicked: true})
    let email = this.state.email;
    let atIndex = email.indexOf('@') || 0;
    let periodAfterAt = false;
    for (let i = 0; i < email.length; i++) {
      if (email[i] === '.' && i > atIndex && email[i + charsAfter]) {
        periodAfterAt = true;
        break;
      }
    }
    if (atIndex && periodAfterAt) {
      this.setState({
        validEmail: true
      });
    }
  }

  handleKeyPress(e) {
    if (e.keyCode === 9 || this.state.passwordClicked) {
      this.checkEmail(1);
    }
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Login Modal"
        >
        {this.state.signUpView === false &&
        <div>
          <h2 ref={subtitle => this.subtitle = subtitle}></h2>
          <button style={{marginLeft:"90%"}} className="btn btn-secondary" onClick={this.closeModal}>X</button>
          <div>
        <form onSubmit={this.handleLoginSubmit}>

          <h1>Login</h1>
          <div>
          <label></label>
          <input
            type='text'
            onChange={this.handleEmailChange}
            className="form-control"
            placeholder="Email"

          />
          </div>
          <div>
          <label></label>
          <input
            type='password'
            onChange={this.handlePasswordChange}
            className="form-control"
            placeholder="Password"
            style={{marginBottom: '20px'}}
          />
          </div>
          <div>
          <button className="btn btn-info btn-lg btn-block" type='submit'>Log in</button>
          {this.state.errMsg &&
            <p style={{color: 'red'}}>{this.state.errMsg}</p>
          }
          <button className="btn btn-danger btn-lg btn-block" onClick={this.handleSignUpView} >Sign up</button></div>
        </form>
      </div>
      </div>
}
{this.state.signUpView &&
  <div>
          <h2 ref={subtitle => this.subtitle = subtitle}></h2>
          <button style={{marginLeft:"90%"}} className="btn btn-secondary" onClick={this.closeModal}>X</button>
          <div>
        <form onSubmit={this.handleSignUpSubmit}>
          <h1>Sign up</h1>
          <label>Email</label>
          <input
            type='text'
            className="form-control"
            onChange={this.handleEmailChange}
            placeholder='Enter your email here...'
            onKeyDown={this.handleKeyPress}
          />
          {!this.state.validEmail && this.state.passwordClicked &&
          <div>
            <label style={{color: "red"}}>Please enter a valid email</label>
            <br />
          </div>}
          <label>Password</label>
          <input
            type='password'
            className="form-control"
            onChange={this.handlePasswordChange}
            placeholder='Create a new password...'
            style={{marginBottom: '20px'}}
            onClick={this.checkEmail}
          />
          <button
            className="btn btn-info btn-lg btn-block"
            type='submit'
            // disabled={!this.state.validEmail}
          >
            Sign up
          </button>
          {this.state.errMsg &&
            <p style={{color: 'red'}}>{this.state.errMsg}</p>
          }
          <div>Already have Account? <button className="btn btn-danger btn-lg btn-block" onClick={this.handleSignUpView} >Log in</button></div>
        </form>
      </div>
      </div>
}
        </Modal>
      </div>
    );
  }
}

export default LoginModal;
