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
        post_id: null,
        url: ''
      }]
    };

    this.handleAddImageInput = this.handleAddImageInput.bind(this);
    this.handleRemoveImageInput = this.handleRemoveImageInput.bind(this);
    this.handleUrlInputChange = this.handleUrlInputChange.bind(this);
  }

  handleAddImageInput(event) {
    event.preventDefault();
    const image = {
      post_id: this.props.postId,
      url: ""
    }
    let images = this.state.images;
    images.push(image);
    this.setState({images: images})
  }

  handleRemoveImageInput(event, index) {
    event.preventDefault();
    let images = this.state.images;
      images.splice(index, 1);
    this.setState({images: images})
  }

  handleUrlInputChange(event, index) {
    const url = event.target.value
    let images = this.state.images;
    images[index]['url'] = url;
    this.setState({images: images})
  }

  render() {
    let images = this.state.images
    return (
      <div>
        <h1 className="new-post-form-header-text">{"Create a New Post"}</h1>
        <Form 
          className="new-post-form border-bottom" 
          onSubmit={this.props.handleSubmitForm}>
          <FormGroup>
            <Label for="title">Post Title</Label>
            <Input type="text" name="title" id="title" placeholder="Post Title" />
          </FormGroup>
          <FormGroup>
            <Label for="description">Post Description</Label>
            <Input type="textarea" name="description" id="description" placeholder="Post Description" />
          </FormGroup>
          <FormGroup>
            <Label for="url">Image Urls</Label>
            {
              images.map((image, index) => {
                const isFirstInput = index == 0;
                const inputValue = this.state.images[index]['url']
                return (
                  <div key={index} className="new-post-form-url-input-field">
                    <InputGroup>
                      <Input 
                        type="url" 
                        name="image" 
                        id="url"
                        value={inputValue}
                        placeholder="https://www.tesla.com/sites/default/files/blog_images/model-s-photo-gallery-06.jpg"
                        onChange={(event) => this.handleUrlInputChange(event, index)}
                      />
                      <CustomInputGroupAddon
                        index={index}
                        isFirstInput={isFirstInput}
                        handleRemoveImageInput={this.handleRemoveImageInput}
                      />                      
                    </InputGroup>
                  </div>
                );
              })
            }
          </FormGroup>
          {/* TODO: rethink button layout */}
          <div className="row">
            <div className="col-sm-4">
            <Button 
              color="success" 
              className="new-post-form-add-image-button" 
              onClick={this.handleAddImageInput}>
              Add Image Field
            </Button>
            </div>
            <div className="col-sm-4">
            </div>
            <div className="col-sm-4">
            <Button 
              color="primary" 
              className="new-post-form-submit-image-button">
              Submit
            </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default CreatePostForm;