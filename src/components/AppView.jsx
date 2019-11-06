import React from 'react';
import './AppView.css';
import { Button } from 'reactstrap';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }

  async componentDidMount() {
    await fetch('http://127.0.0.1:5000/posts')
      .then(response => response.json())
      .then((posts) => {
        this.setState({
          posts: posts
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const postsJsx = this.state.posts.map((post, index) => {
      return <li key={index}>{post.title}</li>
    });

    return (
      <div id='app'>
        <h1 className='title'>InstaBasic</h1>
        <p>Challenge: Create a React web app of anonymous posts and images.</p>
        <p>See "Basic Requirements" in README.md.</p>
        <br />
        <ul>{postsJsx}</ul>
        <Button>{"testing reactstrap"}</Button>
      </div>
    )
  }
}

export default App;
