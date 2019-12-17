import React, {Component} from 'react'
import EngineerList from './EngineerList'
import axios from 'axios'

export default class Engineer extends Component {
  constructor() {
    super()

    this.state = {
      engineers: [],
      loading: false,
      total_data: 0,
      per_page: 0,
      current_page: 0,
      filterText: ''
    }
  }
  
  fetchEngineers = pageNumber => {
    this.setState({ loading: true })
    axios.get(`http://3.90.152.67:5000/api/v1/engineers?page=${pageNumber}`)
    .then(res => {
      this.setState({ 
        loading: false,
        engineers: res.data.data,
        total_data: res.data.total_data,
        per_page: res.data.per_page,
        current_page: res.data.current_page
      })
    }).catch(err => {
      console.log(err)
    })
  }
    
  componentDidMount() {
    this.fetchEngineers(1)
  }

  render() {

    const { filter } = this.props

    let renderPageNumbers

    const pageNumbers = []
    if (this.state.total !== null) {
      for (let i = 1; i <= Math.ceil(this.state.total_data / this.state.per_page); i++) {
        pageNumbers.push(i)
      }
    }

    renderPageNumbers = pageNumbers.map(number => {
        return (
          <span key={number}  onClick={() => this.fetchEngineers(number)}>{number}</span>
        )
    })

    return (
      <>
        <div className='container'>
        { this.state.loading && <p>Loading...</p> } 
        { !this.state.loading && <EngineerList engineers={this.state.engineers}  /> }
        </div>
        <ul className='pagination-container'>
          <li> {renderPageNumbers} </li>
        </ul>
      </>
    )
  }

 }
