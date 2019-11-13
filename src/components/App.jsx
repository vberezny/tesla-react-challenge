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
import CreatePostForm from './CreatePostForm.jsx'

// TODO: style check: consistent use of semicolons, no code re-use, airbnb standards, css class on everything
// TODO: setup contants file

function Post(props) {
  let items = [];
  props.postData.images.map((image, index) => {
    items.push({ 
      "src": image["url"],
      "key": index
    })
  })
  return (
    <Card>
      <CardBody>
        <CardTitle className="post-title">{props.postData.title}</CardTitle>
        {/* TODO: make it so it doesn't autoPlay, pause on hover prop? */}
        <UncontrolledCarousel className="post-carousel" items={items} autoPlay={false} />
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
  })
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
  }

  async componentDidMount() {
    try {
      const response = await fetch('http://127.0.0.1:5000/posts');
      const posts = await response.json();
      if (posts) {
        let nextPostId = posts[posts.length - 1]['id'] + 1;
        this.setState({
          posts: posts,
          nextPostId: nextPostId
        });
      }
    } catch(err) {
      console.error(err);
    }
  };

  // TODO: implement and pass this to the Form component, call the fetch again
  // handleUpdateFeed() {
  // }

  render() {
    return (
      <div className="insta-basic-page-container container-fluid">
        <div className="row justify-content-center">
          <h1 className="insta-basic-title">InstaBasic</h1>
        </div>
        <div className="row new-post-form-row">
          <div className="col-md-8 offset-md-2">
            <CreatePostForm 
              postId={this.state.nextPostId}
              // handleSubmitForm={this.handleSubmitForm}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <Feed posts={this.state.posts}></Feed>
          </div>
        </div>
      </div>
    );
  };
}

export default App;
