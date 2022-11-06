import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import newsImage from "./newsImage.jpg"
import PropTypes from 'prop-types';


export default class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }


  constructor() {
  
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  async componentDidMount() {
    this.props.setProgress(0)
    const url =
      `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=14e9b693197f45ee98e4f59730c451e8&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading: true})
    let response = await fetch(url);
    let data = await response.json();
    this.setState({ 
      articles: data.articles, 
      totalResults: data.totalResults,
      loading: false
     });
     this.props.setProgress(100)
  }

  handleNextClick = async () => {
    this.props.setProgress(0)
    if (this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)) {
    } else {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=14e9b693197f45ee98e4f59730c451e8&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true})
      let response = await fetch(url);
      let data = await response.json();

      this.setState({
        page: this.state.page + 1,
        articles: data.articles,
        loading: false
      });
    }
    this.props.setProgress(100)
  };

  handlePrevClick = async () => {
    this.props.setProgress(0)

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=14e9b693197f45ee98e4f59730c451e8&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true})
    let response = await fetch(url);
    let data = await response.json();

    this.setState({
      page: this.state.page - 1,
      articles: data.articles,
      loading: true
    });
    this.props.setProgress(100)

  };

  render() {
    
    return (
      <div className="container my-3 ">
        <h1 className="text-center">Quicky News - Top Headlines</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title}
                  description={element.description}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                />
              </div>
            );
          })}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}>
            &larr; Previous
          </button>
          <button
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}>
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}
