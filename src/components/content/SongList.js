import React, { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Pagination from "react-js-pagination";
import axios from 'axios'
import apiConfig from '../../apiConfig'
import Search from './Search'
import Request from './Request'
import './SongList.css';
import paginate from '../../paginate'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const SongList = props => {
  const [songList, setSongList] = useState([])
  const [activePage, setActivePage] = useState(1)

  useEffect(() => {
    axios({
      url: `${apiConfig.apiUrl}/station/${apiConfig.stationId}/requests`,
      method: 'GET'
    })
      .then(response => {
        setSongList(response.data)
        setSearchResults(response.data)
      })
      .catch(console.error)
  }, [])

  const [searchTerm, setSearchTerm] = React.useState("");
  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const [searchResults, setSearchResults] = React.useState([]);
  React.useEffect(() => {
    const results = songList.filter(song =>
      song.song.title.toLowerCase().includes(searchTerm) || song.song.artist.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
    setActivePage(1);
  }, [searchTerm, songList]);

  
  const songsPerPage = 20;
  const paginatedResults = paginate(searchResults, activePage, songsPerPage);
  const propertiesJsx = paginatedResults.map(song => (
    <ListGroup.Item variant="dark" key={song.song.id}>
      <div className="song-item">
        <img src={song.song.art} className="song-art" alt="song art" />
        <div className="song-info">
          {song.song.text}<br />
          <span className="song-album">{song.song.album}</span>
        </div>
        <Request 
          requestId={song.request_id} />
        
      </div>

    </ListGroup.Item>
  ))

  return (
    <div>
      <Row>
        <Col>
          <h1>Song List</h1>
        </Col>
        <Col>
          <Search
            searchTerm={searchTerm}
            handleChange={handleChange} />
        </Col>
      </Row>

      <ListGroup>
        {propertiesJsx}
      </ListGroup>

      <Pagination
          activePage={activePage}
          itemsCountPerPage={songsPerPage}
          totalItemsCount={searchResults.length}
          pageRangeDisplayed={5}
          onChange={setActivePage}
          itemClass="page-item"
          linkClass="page-link"
        />

    </div>
  )

  // handlePageChange(pageNumber) {
  //   console.log(`active page is ${pageNumber}`);
  //   this.setState({activePage: pageNumber});
  // }
}

export default SongList