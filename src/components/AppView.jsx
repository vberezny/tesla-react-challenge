import React from 'react';
import PropTypes from 'prop-types';
import './AppView.css';
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button
} from 'reactstrap';

// TODO: style the post
// TODO: look into faster image loading
function Post(props) {
  if (props.postContents) {
    return (
      <Card>
        <CardImg top width="80%" src={props.postContents.images[0].url} alt="Card image cap" />
        <CardBody>
          <CardTitle>{props.postContents.title}</CardTitle>
          <CardSubtitle>{props.postContents.description}</CardSubtitle>
        </CardBody>
      </Card>
    );
  } else {
    return null
  }
}

Post.propTypes = {
  postContents: PropTypes.object
};

// TODO: Feed component/function

// TODO: New Post form component/function

// TODO: set up CSS organization/structure... containers, and general styling

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }

  async componentWillMount() {
    try {
      const response = await fetch('http://127.0.0.1:5000/posts')
      const posts = await response.json()
      if (posts) {
        this.setState({
          posts: posts
        });
      }
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    const postsJsx = this.state.posts.map((post, index) => {
      return <li key={index}>{post.title}</li>
    });

    return (
      <div id='app'>
        <h1 className='title'>InstaBasic</h1>
        <ul>{postsJsx}</ul>
        <Post postContents={this.state.posts[0]}></Post>
        <Post postContents={this.state.posts[1]}></Post>
      </div>
    )
  }
}

export default App;
