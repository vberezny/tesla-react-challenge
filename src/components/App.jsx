import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  UncontrolledCarousel,
  Button,
  Form, 
  FormGroup, 
  Label, 
  Input, 
  FormText
} from 'reactstrap';

// TODO: style the post
function Post(props) {
  // TODO refactor into separate function after figuring out how to use es6 syntax
  let items = [];
  props.postContent.images.map((image, index) => {
    items.push({ 
      "src": image["url"],
      "key": index
    })
  })
  return (
    <Card>
      <CardBody>
        <CardTitle>{props.postContent.title}</CardTitle>
        {/* TODO: make it so it doesn't autoPlay, pause on hover prop? */}
        <UncontrolledCarousel items={items} autoPlay={false} />
        <CardSubtitle>{props.postContent.description}</CardSubtitle>
      </CardBody>
    </Card>
  );
}

Post.propTypes = {
  postContent: PropTypes.object,
};

// TODO style the feed
function Feed(props) {
  const postsJsx = props.posts.map((post, index) => {
    return (
      <ul key={index}>
        <Post postContent={post}></Post>
      </ul>
    );
  })
  return postsJsx;
}

Feed.propTypes = {
  posts: PropTypes.array
};

function NewPostForm(props) {
  return (
    <div>
      <h1 className="form-header-text">{"Create a New Post"}</h1>
      <Form>
        <FormGroup>
          <Label for="postTitle">Post Title</Label>
          <Input type="email" name="title" id="postTitle" placeholder="Post Title" />
        </FormGroup>
        <FormGroup>
          <Label for="postDescription">Text Area</Label>
          <Input type="textarea" name="description" id="postDescription" placeholder="Post Description" />
        </FormGroup>
        <FormGroup>
          <Label for="imageUrl">Image Url</Label>
          <Input type="url" name="image" id="imageUrl" placeholder="https://www.tesla.com/sites/default/files/blog_images/model-s-photo-gallery-06.jpg" />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    </div>
  );
}

// TODO: set up CSS organization/structure... containers, and general styling

// TODO: refactor components into their own files

// TODO: setup contants file if it makes sense afterwards

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('http://127.0.0.1:5000/posts');
      const posts = await response.json();
      if (posts) {
        this.setState({
          posts: posts,
          isFetching: false
        });
      }
    } catch(err) {
      console.error(err);
    }
  };

  render() {
    return (
      <div className="insta-basic-page-container">
        <h1 className="insta-basic-title">InstaBasic</h1>
        <NewPostForm></NewPostForm>
        <Feed posts={this.state.posts}></Feed>
      </div>
    );
  };
}

export default App;
