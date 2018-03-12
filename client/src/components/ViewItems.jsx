
import React from 'react';
import {Component} from 'react';
import SingleItem from './SingleItem.jsx';


//map through items in state and display as a card deck
class ViewItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      category: 'Filter by Category',
      subcategory: 'Choose Subcategory'
    }
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }
  handleCategoryChange(e){
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div style={{paddingTop: "10px"}}>
        <div className="form-group">
            <select className="form-control" name="category"
              value={this.state.category}
              onChange={e => this.handleCategoryChange(e)}>
              <option>Filter by Category</option>
              <option>Weapon</option>
              <option>Armor</option>
            </select>
            {this.state.category === "Weapon" &&
                      <select className="form-control"
                       name="subcategory"
                       value={this.state.subcategory}
                       onChange={e => this.handleCategoryChange(e)}
                       >
                         <option className="text-danger">Select weapon type</option>
                         <option>Sword</option>
                         <option>Spear</option>
                         <option>Axe</option>
                         <option>Other</option>
                      </select>
                    }
                    {this.state.category === "Armor" &&
                      <select className="form-control"
                       name="subcategory"
                       value={this.state.subcategory}
                       onChange={e => this.handleCategoryChange(e)}
                       >
                         <option className="text-danger">Select armor type</option>
                         <option>Helmet</option>
                         <option>Suit</option>
                         <option>Shield</option>
                         <option>Other</option>
                      </select>
                    }
        </div>
        <div className = "card-deck">
          {this.state.items.map((item) =>

          <SingleItem
          fetch={this.props.fetch}
          userClick={this.props.userClick}
          login={this.props.login}
          isLoggedIn={this.props.isLoggedIn}
          itembought={this.props.itembought}
          stripe={this.props.stripe}
          item={item}
          key={item._id}
          itemID={item._id}
          filter={this.state.category}
          subfilter={this.state.subcategory} />
          )}
        </div>
      </div>
    )
  }
}


export default ViewItems;
