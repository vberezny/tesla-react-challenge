import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  UncontrolledCarousel
} from 'reactstrap';
import CreatePostForm from './CreatePostForm.jsx';
import {
  STRINGS,
  URLS
} from './Constants.js';

function Post(props) {
  let multipleImages = true;
  if (props.postData.images.length == 1) multipleImages = false;
  let items = [];
  props.postData.images.map((image, index) => {
    items.push({ 
      "src": image[STRINGS.IMAGE_URL_INDEX],
      "key": index
    });
  });
  return (
    <Card>
      <CardBody>
        <CardTitle className="post-title">{props.postData.title}</CardTitle>
        <UncontrolledCarousel 
          className="post-image-carousel" 
          items={items} 
          autoPlay={false}
          controls={multipleImages}
          indicators={multipleImages}
        />
        <CardSubtitle className="post-description">{props.postData.description}</CardSubtitle>
      </CardBody>
    </Card>
  );
}

Post.propTypes = {
  postData: PropTypes.object,
};

function Feed(props) {
  const posts = props.posts.reverse().map((post, index) => {
    return (
      <div className="post" key={index}>
        <Post postData={post}></Post>
      </div>
    );
  });
  return posts;
}

Feed.propTypes = {
  posts: PropTypes.array
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      nextPostId: 0
    };
    this.handleRefreshFeed = this.handleRefreshFeed.bind(this);
  }

  componentDidMount = () => {
    this.handleRefreshFeed();
  };

  handleRefreshFeed = async () => {
    try {
      const response = await fetch(URLS.POSTS_ENDPOINT);
      const posts = await response.json();
      if (posts) {
        let nextPostId = posts[posts.length - 1][STRINGS.POST_ID_INDEX] + 1;
        this.setState({
          posts: posts,
          nextPostId: nextPostId
        });
      }
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div className="insta-basic-page-container container-fluid">
        <div className="row justify-content-center">
          <h1 className="insta-basic-title">{STRINGS.APP_TITLE}</h1>
        </div>
        <div className="row new-post-form-row">
          <div className="col-md-8 offset-md-2">
            <CreatePostForm 
              postId={this.state.nextPostId}
              handleRefreshFeed={this.handleRefreshFeed}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <Feed posts={this.state.posts} />
          </div>
        </div>
      </div>
    );
  };
}

export default App;
