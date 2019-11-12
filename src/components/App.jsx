import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {
  Card,
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
        <CardTitle className="post-title">{props.postContent.title}</CardTitle>
        {/* TODO: make it so it doesn't autoPlay, pause on hover prop? */}
        <UncontrolledCarousel className="post-carousel" items={items} autoPlay={false} />
        <CardSubtitle className="post-description">{props.postContent.description}</CardSubtitle>
      </CardBody>
    </Card>
  );
}

Post.propTypes = {
  postContent: PropTypes.object,
};

function Feed(props) {
  const postsJsx = props.posts.map((post, index) => {
    return (
      <div className="post" key={index}>
        <Post postContent={post}></Post>
      </div>
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
      <h1 className="new-post-form-header-text">{"Create a New Post"}</h1>
      <Form className="new-post-form">
        <FormGroup>
          <Label for="postTitle">Post Title</Label>
          <Input type="email" name="title" id="postTitle" placeholder="Post Title" />
        </FormGroup>
        <FormGroup>
          <Label for="postDescription">Post Description</Label>
          <Input type="textarea" name="description" id="postDescription" placeholder="Post Description" />
        </FormGroup>
        <FormGroup>
          <Label for="imageUrl">Image Url</Label>
          <Input type="url" name="image" id="imageUrl" placeholder="https://www.tesla.com/sites/default/files/blog_images/model-s-photo-gallery-06.jpg" />
        </FormGroup>
        <Button color="primary">Submit</Button>
      </Form>
    </div>
  );
}

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
      <div className="insta-basic-page-container container-fluid">
        <div className="row justify-content-center">
          <h1 className="insta-basic-title">InstaBasic</h1>
        </div>
        <div className="row new-post-form-row">
          <div className="col-md-8 offset-md-2 border-bottom">
            <NewPostForm />
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
