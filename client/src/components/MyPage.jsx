import React from 'react';
import $ from 'jquery';
import ReactDOM from 'react-dom';

class MyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItems: false,
      soldItems: false,
      boughtItems: false,
      thisUserRatings: false,
      thisUserFeedback: false
    }

  }

  componentDidMount() {
    let thisUser = {username: this.props.user.local.username};
    $.get('/userSells', thisUser, (data) => {
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

  render() {
    return (
       <div>
        <div className="jumbotron">
          <h1 className="display-4 text-white">{this.props.user.local.username}</h1>
          {this.state.thisUserRatings &&
            <h2 className="display-4 text-white">5</h2>
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
                this.state.soldItems.map((item) => <div>Sold: {item.item}</div>)
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
              <h4 className="card-title">Purchased items</h4>
              {!this.state.boughtItems && <div>None so far . . .</div>}
              {this.state.boughtItems &&
                this.state.boughtItems.map((item) => <div>Bought: {item.item}</div>)
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default MyPage;
