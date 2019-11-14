import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {
  Button,
  Form, 
  FormGroup, 
  Label, 
  Input,
  InputGroup,
  InputGroupAddon
} from 'reactstrap';

function ImageInputs(props) {
  const imageInputs = props.images.map((image, index) => {
    const isFirstInput = index == 0;
    const inputValue = image['url']
    return (
      <div key={index} className="new-post-form-url-input-field">
        <InputGroup>
          <Input 
            type="url" 
            name="image" 
            id="url"
            value={inputValue}
            placeholder="https://www.tesla.com/sites/default/files/blog_images/model-s-photo-gallery-06.jpg"
            onChange={(event) => props.handleUrlInputChange(event, index)}
          />
          <CustomInputGroupAddon
            index={index}
            isFirstInput={isFirstInput}
            handleRemoveImageInput={props.handleRemoveImageInput}
          />                      
        </InputGroup>
      </div>
    );
  });
  return imageInputs;
}

ImageInputs.propTypes = {
  images: PropTypes.array,
  handleUrlInputChange: PropTypes.func,
  handleRemoveImageInput: PropTypes.func
};

function CustomInputGroupAddon(props) {
  if (props.isFirstInput) {
    return null;
  } else {
    return (
      <InputGroupAddon addonType="append">
        <Button 
          color="danger" 
          onClick={(event) => props.handleRemoveImageInput(event, props.index)}
        >
          Remove
        </Button>
      </InputGroupAddon>
    );
  }
}

CustomInputGroupAddon.propTypes = {
  index: PropTypes.number,
  handleRemoveImageInput: PropTypes.func,
  isFirstInput: PropTypes.bool
};

class CreatePostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [{
        url: ''
      }],
      postTitle: '',
      postDescription: ''
    };

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleAddImageInput = this.handleAddImageInput.bind(this);
    this.handleRemoveImageInput = this.handleRemoveImageInput.bind(this);
    this.handleUrlInputChange = this.handleUrlInputChange.bind(this);
    this.handlePostTitleChange = this.handlePostTitleChange.bind(this);
    this.handlePostDescriptionChange = this.handlePostDescriptionChange.bind(this);
  }

  async handleSubmitForm(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/posts', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: this.state.postTitle,
          description: this.state.postDescription
        })
      });
      console.log(response);
      if (response.state == 200) {
        const body = this.state.images.map((image, index) => {
          return JSON.stringify({
            url: image['url'],
            post_id: this.props.postId
          })
        });
        const newImages = await fetch('http://127.0.0.1:5000/images', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            title: this.state.postTitle,
            description: this.state.postDescription
          })
        });
        console.log(newImages);
      }
    } catch(err) {
      console.error(err);
    }
  }


  handleAddImageInput(event) {
    event.preventDefault();
    const image = {
      url: ""
    }
    let images = this.state.images;
    images.push(image);
    this.setState({images: images});
  }

  handleRemoveImageInput(event, index) {
    event.preventDefault();
    let images = this.state.images;
      images.splice(index, 1);
    this.setState({images: images});
  }

  handleUrlInputChange(event, index) {
    const url = event.target.value;
    let images = this.state.images;
    images[index]['url'] = url;
    this.setState({images: images});
  }

  handlePostTitleChange(event) {
    const postTitle = event.target.value;
    this.setState({postTitle: postTitle});
  }

  handlePostDescriptionChange(event) {
    const postDescription = event.target.value;
    this.setState({postDescription: postDescription});
  }

  render() {
    let images = this.state.images
    let submissionDisabled = this.state.postTitle == '' || this.state.postDescription == '' || this.state.images[0]['url'] == '';
    return (
      <div>
        <h1 className="new-post-form-header-text">{"Create a New Post"}</h1>
        <Form 
          className="new-post-form border-bottom" 
          onSubmit={this.handleSubmitForm}>
          <FormGroup>
            <Label for="title">Post Title</Label>
            <Input 
              type="text" 
              name="title" 
              id="title" 
              placeholder="Post Title"
              onChange={(event) => this.handlePostTitleChange(event)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Post Description</Label>
            <Input 
              type="textarea" 
              name="description" 
              id="description" 
              placeholder="Post Description"
              onChange={(event) => this.handlePostDescriptionChange(event)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="url">Image Urls</Label>
            <ImageInputs 
              images={this.state.images}
              handleUrlInputChange={this.handleUrlInputChange}
              handleRemoveImageInput={this.handleRemoveImageInput}
            />
          </FormGroup>
          <Button 
            color="success" 
            className="new-post-form-add-image-button" 
            onClick={this.handleAddImageInput}
          >
            Add Image Field
          </Button>
          <Button 
            color="primary" 
            className="new-post-form-submit-image-button"
            disabled={submissionDisabled}
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default CreatePostForm;