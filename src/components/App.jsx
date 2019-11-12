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
  Input
} from 'reactstrap';

// TODO: style check, make sure code follows consistent pattens, airbnb javascript/react to make sure

function Post(props) {
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
  const posts = props.posts.map((post, index) => {
    return (
      <div className="post" key={index}>
        <Post postContent={post}></Post>
      </div>
    );
  })
  return posts;
}

Feed.propTypes = {
  posts: PropTypes.array
};

// TODO try moving component to separate file and making use of state to control number of input fields, easier than passing functions around
function NewPostForm(props) {
  let deleteButton;
  if (props.imageInputFields.length > 0) {
    deleteButton = <Button 
      color="danger"
      className="new-post-form-remove-image-button"
      onClick={(event) => {props.handleRemoveImageInput(event)}}>
      Remove Image Field
    </Button>
  }
  const extraImageInputFields = props.imageInputFields.map((input, index) => {
    return (
      <div className="new-post-form-url-input-field" key={index}>{input}</div>
    );
  });
  return (
    <div>
      <h1 className="new-post-form-header-text">{"Create a New Post"}</h1>
      <Form className="new-post-form">
        <FormGroup>
          <Label for="postTitle">Post Title</Label>
          <Input type="text" name="title" id="postTitle" placeholder="Post Title" />
        </FormGroup>
        <FormGroup>
          <Label for="postDescription">Post Description</Label>
          <Input type="textarea" name="description" id="postDescription" placeholder="Post Description" />
        </FormGroup>
        <FormGroup>
          <Label for="imageUrl">Image Urls</Label>
          <div className="new-post-form-url-input-field">
            <Input 
              type="url" 
              name="image" 
              id="imageUrl" 
              placeholder="https://www.tesla.com/sites/default/files/blog_images/model-s-photo-gallery-06.jpg"
            />
          </div>
          {extraImageInputFields}
        </FormGroup>
        {/* TODO: rethink button layout */}
        <div class="row">
          <div class="col-sm-4">
          <Button 
            color="success" 
            className="new-post-form-add-image-button" 
            onClick={props.handleAddImageInput}>
            {"Add Another Image"}
          </Button>
          </div>
          <div class="col-sm-4">
          {deleteButton}
          </div>
          <div class="col-sm-4">
          <Button 
            color="primary" 
            className="new-post-form-submit-image-button">
            {"Submit"}
          </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

NewPostForm.propTypes = {
  handleAddImageInput: PropTypes.func,
  handleRemoveImageInput: PropTypes.func,
  imageInputFields: PropTypes.array
};

// TODO: refactor components into their own files if it seems necessary
// TODO: setup contants file if it makes sense afterwards
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      imageInputFields: []
    };

    this.handleAddImageInput = this.handleAddImageInput.bind(this);
    this.handleRemoveImageInput = this.handleRemoveImageInput.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch('http://127.0.0.1:5000/posts');
      const posts = await response.json();
      if (posts) {
        this.setState({
          posts: posts
        });
      }
    } catch(err) {
      console.error(err);
    }
  };

  // TODO: refactor to separate newform component
  handleAddImageInput(event) {
    event.preventDefault();
    const imageInputFields = this.state.imageInputFields;
    const imageInputField = <Input 
      type="url" 
      name="image" 
      id="imageUrl" 
      placeholder="https://www.tesla.com/sites/default/files/blog_images/model-s-photo-gallery-06.jpg" 
    />
    imageInputFields.push(imageInputField);
    this.setState({
      imageInputFields: imageInputFields
    });
  }

  // TODO: refactor to separate newform component
  // TODO: change to remove selected input field
  handleRemoveImageInput(event) {
    event.preventDefault();
    let imageInputFields = this.state.imageInputFields;
    imageInputFields.pop();
    this.setState({
      imageInputFields: imageInputFields
    });
  }

  render() {
    return (
      <div className="insta-basic-page-container container-fluid">
        <div className="row justify-content-center">
          <h1 className="insta-basic-title">InstaBasic</h1>
        </div>
        <div className="row new-post-form-row">
          <div className="col-md-8 offset-md-2 border-bottom">
            <NewPostForm 
              imageInputFields={this.state.imageInputFields} 
              handleAddImageInput={this.handleAddImageInput}
              handleRemoveImageInput={this.handleRemoveImageInput}
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
