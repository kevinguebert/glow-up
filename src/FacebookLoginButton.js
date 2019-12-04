/*global FB*/
import React, { Component } from 'react';

class FacebookLoginButton extends Component {
  state = {
    oldProfilePictures: [],
    newProfilePicture: [],
    accessToken: null
  }
  componentDidMount() {
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    window.fbAsyncInit = () => {
      FB.init({
        appId: '428076311459548',//Change with your Facebook app id
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v5.0'
      });

      FB.Event.subscribe('auth.statusChange', response => {
        if (response.authResponse) {
          // this.checkLoginState();
        } else {
          console.log('[FacebookLoginButton] User cancelled login or did not fully authorize.');
        }
      });
    };
  }

  checkLoginState() {
    FB.getLoginStatus(function (response) {
      this.statusChangeCallback(response);
    }.bind(this));
  }

  login() {
    FB.login(response => {
      this.statusChangeCallback(response)
    }, { scope: 'user_photos'});
  }

  statusChangeCallback(response) {
    if (response.status === 'connected') {
      this.setState({accessToken: response.authResponse.accessToken});
      this.getProfilePictureAlbum();
    } else if (response.status === 'not_authorized') {
      console.log("[FacebookLoginButton] Person is logged into Facebook but not your app");
    } else {
      console.log("[FacebookLoginButton] Person is not logged into Facebook");
    }
  }

  getProfilePictureAlbum() {
    FB.api('/me/albums', response => {
      let albums = response.data;
      let profilePicturesAlbum;
      albums.forEach(album => {
        if (album.name === "Profile Pictures") {
          profilePicturesAlbum = album;
        }
      });
      this.getOldProfilePictures(profilePicturesAlbum);
    });
  }

  getOldProfilePictures(album) {
    FB.api(`/${album.id}/photos?since=1257033600&until=1270080000&fields=images,name,link,created_time`, response => {
      this.setState({
        oldProfilePictures: response.data
      });
      FB.api(`/${album.id}/photos?fields=images,name,link,created_time`, newResponse => {
        this.setState({
          newProfilePicture: newResponse.data.shift()
        })
        this.props.setProfilePhotos(this.state);
      })
    })
  }

  render() {
    return (
      <button className="btn btn-2 btn-2c btn-fb" onClick={() => this.login()}>
        <i className="fa fa-facebook" /> Connect with Facebook
      </button>
    )
  }
}

export default FacebookLoginButton;