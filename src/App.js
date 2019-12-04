import React from 'react';
import './App.css';
import FacebookLoginButton from './FacebookLoginButton';
import htmlToImage from 'html-to-image';
import p0 from './snowman-op.svg';
import p1 from './p1.svg';
import p2 from './p2.svg';
import p3 from './p3.svg';
import p4 from './p4.svg';
import p5 from './p5.svg';
import p6 from './p6.svg';
import p7 from './p7.svg';
import p8 from './p8.svg';
import p9 from './p9.svg';
import p10 from './p10.svg';
import logo from './logo.png';
import facebook from './facebook.png';
import twitter from './twitter.png';

class App extends React.Component {
  state = {
    oldProfileImage: null,
    newProfileImage: null,
    imgSrc: null,
    bckgrnd: '',
    showHow: false
  }
  componentDidMount() {
    let bckgrnd = this.getRandomBackground()
    this.setState({
      bckgrnd
    })
  }
  setProfilePhotos = data => {
    console.log(data);

    this.setState({
      newProfileImage: data.newProfilePicture.images[0].source,
      oldProfileImage: data.oldProfilePictures[data.oldProfilePictures.length - 1].images[0].source,
      accessToken: data.accessToken
    })

    const oldImg = this.refs.oldImage
    const newImg = this.refs.newImage

    const that = this;
    oldImg.onload = () => {
      newImg.onload = () => {
        that.renderImage();
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
    let { oldProfileImage, newProfileImage, imgSrc, bckgrnd, showHow } = this.state;
    // oldProfileImage = "https://scontent.xx.fbcdn.net/v/t1.0-9/1918717_305833920639_4779934_n.jpg?_nc_cat=100&_nc_ohc=SFytBfLwYuoAQn4lHO0N2pOduu0xO8tOW0hYGYzRpmdcNK0JdrHSgF80g&_nc_ht=scontent.xx&oh=cab2990cff23c2698e242fdcade3af13&oe=5E8A8A26";
    // newProfileImage = "https://scontent.xx.fbcdn.net/v/t31.0-8/21994378_10159318624840640_251949960033879695_o.jpg?_nc_cat=111&_nc_ohc=ruIejebQl2sAQmGA3jqW7HFxOjFhhtDi5UhKQfsHLdCUfCLZOAufyIiuw&_nc_ht=scontent.xx&oh=b4a8f9f71deb3c3831fbc8c008fbeef2&oe=5E80D3F9"
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
                          <h2>glowup.lol</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {imgSrc &&
                      <div>
                        <a href={imgSrc} download className="btn btn-2 btn-2c">Save & Share</a>
                        <br />
                        <button onClick={() => this.setState({ showHow: !this.state.showHow })} className="btn btn-3 btn-3c">How to Share?</button>
                      </div>
                    }
                  </div>
                </div>
              )}
          </div>
        </section>
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
        {/* <section className="hero">
          <div className="hero-inner" style={{width: '50%'}}>
            <h2>About</h2>
            <p>Connect your Facebook account to retrieve your profile picture from the beginning of the decade and your current one. That is as simple as it gets - no gimmicks, no user profiles, no accounts.</p>
            <h3>Data Policy</h3>
            <p>We don't store anything. Literally nothing. We do have analytics to </p>
          </div>
        </section> */}

      </div >
    )
  };
}

export default App;
