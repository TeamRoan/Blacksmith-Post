import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import ItemForm from './components/ItemForm.jsx'
import Footer from './components/Footer.jsx'
import DeleteWeapon from './components/DeleteWeapon.jsx'
import SingleItem from './components/SingleItem.jsx'
import ViewItems from './components/ViewItems.jsx'
import Login from './components/Login.jsx'
import LandingPage from './components/LandingPage.jsx'
import SignUp from './components/SignUp.jsx';
import ImageUploader from './components/ImageUploader.jsx';
import LoginModal from './components/LoginModal.jsx';
import MyPage from './components/MyPage.jsx';
import UserPage from './components/UserPage.jsx';


class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      loginModalOpen: false,
      isLoggedIn: false,
      items:[],
      deleteitem:'',
      viewState:'LandingPage',
      isLoading:false,
      currentUser: false,
      clickedUser: false
    }

    this.fetch = this.fetch.bind(this);
    this.itemBought = this.itemBought.bind(this);
    this.closeLogin = this.closeLogin.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.sellItem = this.sellItem.bind(this);
    this.stripeTokenHandler = this.stripeTokenHandler.bind(this);
    this.handleNewSession = this.handleNewSession.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.openMyPage = this.openMyPage.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
  }

    componentDidMount(){
    this.setState({isLoading: true});

    fetch('/api/items')
    .then(response => response.json())
    .then(data => this.setState({ items: data, isloading:false}));
  }

  fetch() {
    this.setState({
      isLoading: true,
      viewState: 'LandingPage'});
    fetch('/api/items')
    .then(response => response.json())
    .then(data => this.setState({ items: data, isloading:false}));

  }

   goHome(){
    this.setState({viewState:'LandingPage'});
     window.scrollTo(0, 0);
  }

  itemBought(item) {
    $.ajax({
      url: '/api/deleteItem',
      type: 'POST',
      data: item,
      success: function(data) {
        console.log("Item removed from database! ", data)
      },
      error: function(err){
        console.log('errror in ajax', err);
      }
    });
    fetch('/api/items')
      .then(response => response.json())
      .then(data => this.setState({ items: data, isloading:false}));
  }

  stripeTokenHandler(data) {
    var user = this.state.currentUser
    $.ajax({
      url: '/charge',
      type: 'POST',
      data: {'data': data, 'user': user},
      success: function(data) {
        console.log("Charge successs! ", data)
      },
      error: function(err){
        console.log('errror in ajax', err);
      }
    });
  }

  openMyPage() {
    this.setState({viewState: 'MyPage'})
    window.scrollTo(0, 0);
  }

  handleNewSession(user) {
    this.setState({isLoggedIn: true})
    this.setState({currentUser: user})
  }

  closeLogin() {
    this.setState({loginModalOpen: false});
  }

  buyItem(){
    this.setState({viewState:'ViewItems'});
    window.scrollTo(0, 0);
  }

  sellItem(){
     if (this.state.isLoggedIn) {
      this.setState({viewState:'ItemForm'});
     } else {
       this.setState({loginModalOpen: true})
     }
    window.scrollTo(0, 0);
  }

  handleUserClick(e) {
    this.setState({
      viewState: 'UserPage',
      clickedUser: e
    })
    window.scrollTo(0, 0);
  }

  login(){
    this.setState({loginModalOpen: true});
  }

  logout() {
    $.get('/logout')
    this.setState({
      isLoggedIn: false,
      currentUser: false,
      viewState: 'LandingPage'
    })
    window.scrollTo(0, 0);
  }

  render () {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top">
          <a className="navbar-brand" href="#"></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <button className="btn btn-link" onClick={() => this.goHome()}>Home</button>
              </li>
              <li className="nav-item active">
                <button className="btn btn-link" onClick={() => this.buyItem()}>Browse</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link " onClick={() => this.sellItem()}>Sell</button>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {this.state.isLoggedIn === false &&
              <li className="nav-item">
                <button className="btn btn-link" onClick={() => this.login()}>Login</button>
              </li>
              }
              {this.state.isLoggedIn === true &&
              <div>
              <li className="nav-item">
                <button className="btn btn-link" onClick={() => this.openMyPage()}>My Profile</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link" onClick={() => this.logout()}>Logout</button>
              </li>
              </div>
              }
            </ul>
          </div>
        </nav>
        <div style={{paddingTop: "51px"}}>
          {this.state.viewState === 'UserPage' && <UserPage goback={this.buyItem} currentUser={this.state.currentUser} user={this.state.clickedUser} />}
          {this.state.viewState === 'MyPage' && <MyPage user={this.state.currentUser} />}
          {this.state.viewState === 'LandingPage' && <LandingPage buyclick={this.buyItem} sellclick={this.sellItem}/>}
          {this.state.viewState === 'ItemForm' && <ItemForm user={this.state.currentUser.local.username} fetch={this.fetch} />}
          {this.state.viewState === 'ViewItems' && <ViewItems userClick={this.handleUserClick} login={this.login} isLoggedIn={this.state.isLoggedIn} itembought={this.itemBought} stripe={this.stripeTokenHandler} items={this.state.items} />}
          {this.state.isLoggedIn === false && <LoginModal setCurrentUser={this.handleNewSession} modalIsOpen={this.state.loginModalOpen} close={this.closeLogin} />}
          {this.state.viewState === 'upload' && <ImageUploader />}
          <Footer />
        </div>
      </div>
    );
  };
};


ReactDOM.render(<App/>, document.getElementById('app'));