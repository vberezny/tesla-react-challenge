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
import {
  STRINGS,
  URLS
} from './Constants.js';

function ImageInputs(props) {
  const imageInputs = props.images.map((image, index) => {
    const isFirstInput = index == 0;
    const inputValue = image[STRINGS.IMAGE_URL_INDEX];
    return (
      <div key={index} className="new-post-form-url-input-field">
        <InputGroup>
          <Input 
            type="url" 
            name="image" 
            id="url"
            value={inputValue}
            placeholder={STRINGS.IMAGE_INPUT_PLACEHOLDER}
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
          {STRINGS.FORM_REMOVE_BUTTON}
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
    this.handleResetState = this.handleResetState.bind(this);
  }

  async handleSubmitForm(event) {
    event.preventDefault();
    let postResponse;
    try {
      postResponse = await fetch(URLS.POSTS_ENDPOINT, {
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
    } catch(err) {
      console.error(err);
    }
    try {
      if (postResponse.status == 200) {
        for (const image of this.state.images) {
          await fetch(URLS.IMAGES_ENDPOINT, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              url: image[STRINGS.IMAGE_URL_INDEX],
              post_id: this.props.postId
            })
          });
        }
      }
    } catch(err) {
      console.error(err);
    }
    this.props.handleRefreshFeed();
    this.handleResetState();
  }

  handleAddImageInput(event) {
    event.preventDefault();
    const image = {
      url: ""
    };
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
    images[index][STRINGS.IMAGE_URL_INDEX] = url;
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

  handleResetState() {
    this.setState({
      images: [{
        url: ''
      }],
      postTitle: '',
      postDescription: ''
    })
  }

  render() {
    let urlFieldsEmpty = true;
    const filteredImages = this.state.images.filter(image => image[STRINGS.IMAGE_URL_INDEX] == '');
    if (filteredImages.length == 0) urlFieldsEmpty = false;
    let submissionDisabled = this.state.postTitle == '' || this.state.postDescription == '' || urlFieldsEmpty;
    return (
      <div>
        <h1 className="new-post-form-header-text">{STRINGS.FORM_HEADER_TEXT}</h1>
        <Form 
          className="new-post-form border-bottom" 
          onSubmit={this.handleSubmitForm}>
          <FormGroup>
            <Label for="title">{STRINGS.FORM_POST_TITLE_TEXT}</Label>
            <Input 
              type="text" 
              name="title" 
              id="title" 
              placeholder={STRINGS.FORM_POST_TITLE_TEXT}
              onChange={(event) => this.handlePostTitleChange(event)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">{STRINGS.FORM_POST_DESCRIPTION_TEXT}</Label>
            <Input 
              type="textarea" 
              name="description" 
              id="description" 
              placeholder={STRINGS.FORM_POST_DESCRIPTION_TEXT}
              onChange={(event) => this.handlePostDescriptionChange(event)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="url">{STRINGS.FORM_IMAGE_URLS_TEXT}</Label>
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
            {STRINGS.FORM_ADD_FIELD_BUTTON}
          </Button>
          <Button 
            color="primary" 
            className="new-post-form-submit-image-button"
            disabled={submissionDisabled}
          >
            {STRINGS.FORM_SUBMIT_BUTTON}
          </Button>
        </Form>
      </div>
    );
  }
}

export default CreatePostForm;