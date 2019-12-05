import React from 'react';
import './App.css';
import FacebookLoginButton from './FacebookLoginButton';
import htmlToImage from 'html-to-image';
import p0 from './media/snowman-op.svg';
import p1 from './media/p1.svg';
import p2 from './media/p2.svg';
import p3 from './media/p3.svg';
import p4 from './media/p4.svg';
import p5 from './media/p5.svg';
import p6 from './media/p6.svg';
import p7 from './media/p7.svg';
import p8 from './media/p8.svg';
import p9 from './media/p9.svg';
import p10 from './media/p10.svg';
import logo from './media/logo.png';
import facebook from './media/facebook.png';
import twitter from './media/twitter.png';
import countapi from 'countapi-js';

class App extends React.Component {
  state = {
    oldProfileImage: null,
    newProfileImage: null,
    imgSrc: null,
    bckgrnd: '',
    showHow: false,
    showError: false,
    showAbout: false,
    counter: 0,
  }
  componentDidMount() {
    let bckgrnd = this.getRandomBackground()
    this.setState({
      bckgrnd
    })
    countapi.get('glow-up', 'glow-up').then(result => {
      console.log('a', result);
      this.setState({counter: result.value});
    })
  }
  setProfilePhotos = data => {
    if (data == null) {
      this.setState({showError: true})

    } else {
      this.setState({
        newProfileImage: data.newProfilePicture.images[0].source,
        oldProfileImage: data.oldProfilePictures.images[0].source,
        accessToken: data.accessToken
      })

      const oldImg = this.refs.oldImage
      const newImg = this.refs.newImage

      const that = this;
      oldImg.onload = () => {
        newImg.onload = () => {
          that.renderImage();
          countapi.hit('glow-up', 'glow-up').then((result) => {
            console.log('res', result);
            this.setState({counter: result.value})
          })
        }
      }
    }
  }

  getRandomBackground = () => {
    let images = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]
    return images[Math.floor(Math.random() * Math.floor(11))]
  }

  renderImage = () => {
    const node = document.getElementById('share');
    const that = this;

    htmlToImage.toJpeg(node)
      .then(function (dataUrl) {
        console.log('image generated');
        var img = new Image();
        img.src = dataUrl;
        that.setState({
          imgSrc: dataUrl
        });

      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  render() {
    let { oldProfileImage, newProfileImage, imgSrc, bckgrnd, showHow, showError, showAbout, counter } = this.state;
    return (
      <div className='app' style={{ backgroundImage: `url(${bckgrnd})`, height: '100%' }}>
        <section className="hero">
          <div className="hero-inner">
            <img src={logo} alt="Glow Up" style={{ width: '50%' }} />
            {!oldProfileImage && !newProfileImage ?
              <div>
                <p>Compare your profile picture from 10 years ago to now.</p>
                <br />
                <FacebookLoginButton setProfilePhotos={this.setProfilePhotos} />
                <br />
                {counter !== 0 &&
                  <small># of Glow Ups: {counter}</small>
                }
              </div> :
              (
                <div>
                  <div className="card">
                    <div id="share" className="card-inner">
                      <div className="card-wrapper">
                        <img className="card-img" ref="oldImage" src={oldProfileImage} alt="You 10 years ago" />
                      </div>
                      <h2 className="date-left">2009</h2>
                      <div className="card-wrapper">
                        <img className="card-img" ref="newImage" src={newProfileImage} alt="You today" />
                      </div>
                      <h2 className="date-right">2019</h2>
                      <div className="promotion">
                        <div className="promotion-inner">
                          <h2>goglowup.com</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {imgSrc ?
                      <div className="share-btns">
                        <a href={imgSrc} download className="btn btn-2 btn-2c">Save & Share</a>
                        <br />
                        <button onClick={() => this.setState({ showHow: !this.state.showHow })} className="btn btn-3 btn-3c">How to Share?</button>
                      </div>
                    : 
                      <div className="share-btns">
                        <p>Generating image...</p>
                      </div>
                    }
                  </div>
                </div>
              )}
          </div>
        </section>
        {showError &&
          <div className="error">
            <h2 style={{
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '700'
            }}>Uhoh</h2>
            <p style={{lineHeight: '1.0'}}>Dang, were unable to find your profile photos. <br />Here are some potential reasons why:</p>
            <p>1. The default "Profile Pictures" album was renamed or doesn't exist</p>
            <p>2. You don't have any profile photos going back that far</p>
            <p>Think it is something else? Email kevin@harvy.app</p>
          </div>
        }
        {showHow &&
          <div className="how">
            <h2 style={{
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '700'
            }}>HOW TO SHARE</h2>
            <p>1. Click "Save & Share" to download the image</p>
            <p>2. Open up your social site (facebook, twitter)</p>
            <small>Faceboook</small>
            <br />
            <img src={facebook} alt="Share to Facebook" style={{ width: '300px' }} />
            <br />
            <small>Twitter</small>
            <br />
            <img src={twitter} alt="Share to Twitter" style={{ width: '300px' }} />
            <p>3. Upload and enjoy!</p>
          </div>
        }
        {showAbout &&
        <div className="how">
          <button className="btn" style={{position: 'absolute', right: '10px', fontSize: '0.8em'}} onClick={() => this.setState({showAbout: false})}>Close</button>
          <h2 style={{
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '700'
            }}>About</h2>
            <p>Glow up is as simple as it can get.</p><p>Quickly connect your Facebook account and retrieve your photos side by side.</p>
            <hr />
            <p>Curious about privacy?</p><p>We are too. We store <i>nothing.</i> Everything is done right here in your browser.</p>
            <p>Don't believe us? Refresh the page!</p>
            <hr />
            <p>Have more questions? Email kevin@harvy.app</p>
          </div>
        }
        <div className="footer">
          {counter !== 0 &&
            <a className="btn">#{counter}</a>
          }
          <button onClick={() => this.setState({showAbout: true})} className="btn">About</button>
          <a href="https://www.buymeacoffee.com/J5qYUau" target="_blank" className="btn">Built with ☕️ by Kevin</a>

        </div>

      </div >
    )
  };
}

export default App;
