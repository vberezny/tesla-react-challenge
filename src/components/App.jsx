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
  InputGroup,
  InputGroupAddon
} from 'reactstrap';

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

function NewPostForm(props) {
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
          <ImageInputFields 
            imageInputCounter={props.imageInputCounter}
            handleRemoveUrlInput={props.handleRemoveUrlInput}
          />
        </FormGroup>
        <Button color="primary">Submit</Button>
        <Button color="success" className="new-post-form-add-image-button" onClick={props.handleAddImageInput}>Add Another Image</Button>
      </Form>
    </div>
  );
}

NewPostForm.propTypes = {
  handleAddImageInput: PropTypes.func,
  handleRemoveUrlInput: PropTypes.func,
  imageInputCounter: PropTypes.number
};

// TODO: make this remove the selected field rather than just the bottom one
function ImageInputFields(props) {
  const imageInputFields = [];
  const firstImageInputField = <Input type="url" name="image" id="imageUrl" placeholder="https://www.tesla.com/sites/default/files/blog_images/model-s-photo-gallery-06.jpg" />;
  const removableImageInputField =  
  <InputGroup>
    <Input type="url" name="image" id="imageUrl" placeholder="https://www.tesla.com/sites/default/files/blog_images/model-s-photo-gallery-06.jpg" />
    <InputGroupAddon addonType="append">
      <Button color="danger" onClick={props.handleRemoveUrlInput}>Remove</Button>
    </InputGroupAddon>
  </InputGroup>;

  imageInputFields.push(firstImageInputField);
  for (let i = 1; i < props.imageInputCounter; i++) {
    imageInputFields.push(removableImageInputField);
  }
  const indexedImageInputFields = imageInputFields.map((input, index) => {
    return (
      <div key={index} className="new-post-form-url-input-field">
        {input}
      </div>
    );
  });
  return indexedImageInputFields;
}

ImageInputFields.propTypes = {
  handleRemoveUrlInput: PropTypes.func,
  imageInputCounter: PropTypes.number
}

// TODO: refactor components into their own files

// TODO: setup contants file if it makes sense afterwards
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      imageInputCounter: 1
    };

    this.handleAddImageInput = this.handleAddImageInput.bind(this);
    this.handleRemoveUrlInput = this.handleRemoveUrlInput.bind(this);
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

  handleAddImageInput(event) {
    event.preventDefault();
    let imageInputCounter = this.state.imageInputCounter;
    imageInputCounter++;
    this.setState({
      imageInputCounter: imageInputCounter
    });
  }

  handleRemoveUrlInput(event) {
    event.preventDefault();
    let imageInputCounter = this.state.imageInputCounter;
    imageInputCounter--;
    this.setState({
      imageInputCounter: imageInputCounter
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
              handleRemoveUrlInput={this.handleRemoveUrlInput}
              imageInputCounter={this.state.imageInputCounter}
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
