import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  },
  complete: {
    color: '#5ebc01',
    iconColor: '#6ddb00'
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Receipt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalisOpen: false
    };

    this.okay = this.okay.bind(this);
  }

  okay() {
    this.setState({
        modalisOpen: false
    });
    this.props.fetch();
    this.props.close();
  }

   render() {
    return(
      <div>
        <Modal
          isOpen={this.props.modalIsOpen}
          onRequestClose={this.cancel}
          style={style}
          ariaHideApp={false}
          contentLabel="Payment Modal"
          >
          <h2>Payment Success</h2>
            <p>Congratulations on your new {this.props.itemname}!</p>
            <img width="100px" height="100px" src={this.props.image}></img>
            <p>Blacksmith {this.props.owner} has received your payment of ${this.props.price} and will be in touch shortly for shipping details.</p>
            <button onClick={this.okay}>Okay</button>
        </Modal>
      </div>
      )
  }

}

export default Receipt;
