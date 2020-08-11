import React, { Component, Fragment } from "react";
import algoliasearch from "algoliasearch";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
} from "react-instantsearch-dom";
import { connect } from "react-redux";
import Post from "../post/Post";

const Hit = ({ hit }) => (
  <Fragment>
    <Highlight attribute="body" hit={hit} tagName="mark" />
    <Post key={hit.objectID} post={{ ...hit, postId: hit.objectID }} />
  </Fragment>
);

const Content = () => (
  <div>
    <Hits hitComponent={Hit} />
  </div>
);

class Search extends Component {
  state = {
    show: false,
  };

  showContent = (event) => {
    if (this.state.show === false) {
      this.setState({ show: true });
    } else {
      this.setState({ show: false });
    }
  };

  render() {
    const searchClient = algoliasearch(
      "JBC1H3K4WE",
      "9fa29b2f3c2d25db85446801fd385494"
    );

    return (
      <InstantSearch indexName="post_search" searchClient={searchClient}>
        <div className="right-panel">
          <header className="header">
            <SearchBox
              onClick={this.showContent}
              translations={{ placeholder: "Search Posts" }}
            />
          </header>

          <main>{this.state.show ? <Content /> : ""}</main>
        </div>
      </InstantSearch>
    );
  }
}

export default connect()(Search);
