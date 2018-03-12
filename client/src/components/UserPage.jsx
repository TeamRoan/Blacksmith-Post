import React from 'react';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import { Form, FormGroup, Label, Input, FormFeedback, FormText, Button, InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter, Media } from 'reactstrap';


class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItems: false,
      soldItems: false,
      boughtItems: false,
      thisUserRatings: false,
      thisUserFeedback: false,
      feedbackSent: false,
      myRating: '',
      myFeedback: '',
      modal: false
    }

    this.submitFeedback = this.submitFeedback.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    let thisUser = {username: this.props.user};
    $.get('/userSells', thisUser, (data) => {
      console.log('DATA SELLS->', data)
      this.setState({soldItems: data.sells});
    })
    $.get('/userBuys', thisUser, (data) => {
      this.setState({boughtItems: data.buys});
    })
    $.get('/userCurrentItems', thisUser, (data) => {
      this.setState({currentItems: data.currentItems});
    })
    $.get('/userFeedback', thisUser, (data) => {
      if (data.rating && data.feedback) {
        this.setState({
          thisUserRatings: data.rating,
          thisUserFeedback: data.feedback
        })
      }
    })
  }

   toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitFeedback() {
    this.setState({
      feedbackSent: true,
      modal: false
    });
    var feedback = {
      username: this.props.user,
      rating: {
        user: this.props.currentUser.local.username,
        rating: Number(this.state.myRating)
      },
      feedback: {
        user: this.props.currentUser.local.username,
        message: this.state.myFeedback
      }
    }
    $.post('/userFeedback', feedback, (data) => {
      console.log(data);
  })
   
};

  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1 className="display-4 text-white">{this.props.user}    <button onClick={this.props.goback} className="btn btw-white align-right">Back</button></h1>
          {this.state.thisUserRatings &&
            <h2 className="display-4 text-white">{this.state.thisUserRatings[0].rating}</h2>
          }
          <div className="card-deck">
            <div className="card text-white bg-dark mb-3">
              <h4 className="card-title">Currently Listed Items</h4>
              {!this.state.currentItems && <div>None so far . . .</div>}
              {this.state.currentItems &&
                this.state.currentItems.map((item) => <div>{item.name}</div>)
              }
            </div>
            <div className="card text-white text-center bg-dark mb-3">
              <h4 className="card-title">Sold items</h4>
              {!this.state.soldItems && <div>None so far . . .</div>}
              {this.state.soldItems &&
                this.state.soldItems.map((item) => <div>{item.item}</div>)
              }
            </div>
            <div className="card text-white text-center bg-dark mb-3">
              <h4 className="card-title">Purchased items</h4>
              {!this.state.boughtItems && <div>None so far . . .</div>}
              {this.state.boughtItems &&
                this.state.boughtItems.map((item) => <div>{item.item}</div>)
              }
            </div>
            <div className="card text-white text-center bg-dark mb-3">
              <h4 className="card-title">User Reviews</h4>
              {!this.state.thisUserFeedback && <div>None so far . . .</div>}
              {this.state.thisUserFeedback &&
                this.state.thisUserFeedback.map((review) => <div>{review.user} : {review.message}</div>)
              }
            </div>
            <div className="card text-white text-center bg-dark mb-3">
              <h4 className="card-title"> Give Feedback</h4>
              <p>Review</p>
              <textarea
                className="user-feedback"
                name="myFeedback"
                type="string"
                value={this.state.myFeedback}
                onChange={e => this.handleChange(e)}
                rows="3"
                placeholder="..."
              >
              </textarea>
              <p>Rating</p>
              <select
              className="user-review"
              name="myRating"
              onChange={e => this.handleChange(e)}>
                <option>Select a rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              {!this.state.feedbackSent && <Button className="btn btn-white" onClick={this.toggle}>Submit Feedback</Button>}
              {this.state.feedbackSent && <Button className="btn btn-white" disabled>Feedback Sent</Button>}
                 <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Confirmation</ModalHeader>
                          <ModalBody>
                            <div>
                              <h5> Feedback for {this.props.user}</h5>
                              <ul>Your Message: {this.state.myFeedback}</ul>
                              <ul>Your Rating: {this.state.myRating}</ul>
                            </div>
                          </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={this.submitFeedback}>Submit Feedback</Button>{' '}
                          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                      </Modal>
              <form>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default UserPage;
