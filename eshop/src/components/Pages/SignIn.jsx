import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FacebookProvider, LoginButton } from 'react-facebook';
import {useEffect, useState } from "react";
import { useAppContext } from '../../store/AppProvider';
import { useNavigate } from 'react-router-dom';

export function SignIn(){
    const navigate = useNavigate();
    const {dispatch, location} = useAppContext();
    const params = new URLSearchParams(location.search);
    const ref_url = params.get("ref") || "";
    const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const facebook_app_id = process.env.REACT_APP_FACEBOOK_APP_ID;
    const [isLogin, setIsLogin] = useState(false);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
    const [error, setError] = useState(null);
    const [emailLogin, setEmailLogin] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const picture = '';
    const type = 'email';

    const handleGgSuccess = (response) => {
        const token = response.credential;
        const base64Url = token.split('.')[1]; // Extract payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix padding
        const decodedPayload = JSON.parse(window.atob(base64)); // Decode Base64
        const userInfo = {
            name: decodedPayload.name,
            email: decodedPayload.email,
            picture: decodedPayload.picture,
            type: 'google'
        };
        dispatch({type:'USER_SIGN_IN', payload:userInfo});
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLogin(true);
        setUserInfo(userInfo);
        if(ref_url !== '') { setTimeout((navigate(`/${ref_url}`), 1500));}
    };
    
    const handleGgFailure = (error) => {
        console.log('Google Login Failed:', error);
        setIsLogin(false);
        setError(error)
    };  

    const handleFbResponse = (data) => {
        const accessToken = data.authResponse.accessToken;
        if(accessToken && accessToken !== '')
        {
            fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`)
            .then((res) => res.json())
            .then((userData) => {
                /* console.log("User Data:", userData);
                console.log("Picture Arr: ", userData.picture);
                console.log("Picture:",  userData.picture.data.url) */
                const userInfo = {
                    name: userData.name,
                    email: userData.email,
                    picture: userData.picture.data.url || '',
                    type: 'facebook'
                };
                dispatch({type:'USER_SIGN_IN', payload:userInfo});
                setIsLogin(true);
                setUserInfo(userInfo);
                setError(null)
                if(ref_url !== '') { setTimeout((navigate(`/${ref_url}`), 1500));}
            })
            .catch((err) => {
                console.error("Error fetching user data:", err);
                setError('Facebook login failed. Please try again.')
                setIsLogin(false);
            });
            };
        }
    
    const handleFbError = (error) => {
        console.log("FB Login Error:", error);
        setError('Facebook login failed. Please try again.');
    };

    const handleName =(e)=> { setName(e.target.value); }
    const handleEmail =(e)=> { setEmail(e.target.value); }

    const handleSubmit = () => {
        const userInfo = {
            name: name,
            email: email,
            picture: picture,
            type: type
        };
        
        dispatch({type:'USER_SIGN_IN', payload:userInfo});
        setIsLogin(true);
        setUserInfo(userInfo);
    }

    const handleSignOut =()=> {
        dispatch({type:'USER_SIGN_OUT', payload:null});
        setIsLogin(false);
        
    }

    useEffect(()=> {
        document.title = "Sign In to ReactEShop Demo Store by Chirag Khatri";
        if(userInfo !== null) {
            setIsLogin(true);
            if(ref_url !== '') { setTimeout(() => navigate(`/${ref_url}`, 1500));}
        }
    }, [userInfo,ref_url, navigate]);

    return(
        <div className="container" style={{minHeight:'27rem'}}>
            <h1 className="text-center my-4">Sign In</h1>
            <div className="d-flex align-items-center flex-wrap justify-content-center gap-4 section-signin py-5 mb-5">
           { isLogin === true ? 
            <p className="fs-3">Hi <span className="text-primary">{userInfo.name}</span>,  Welcome to ReactEShop
                <button type="button" className="btn btn-danger d-block text-center mt-5 m-auto" onClick={handleSignOut}>Sign Out</button>
                </p>
           :
            emailLogin === true ?
                <form style={{width:'250px'}} onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label for="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" onChange={handleName} value={name} />
                    </div>
                    <div className="mb-3">
                        <label for="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={email} onChange={handleEmail}  />
                    </div>
                    <div className='d-flex justify-content-between'>
                        <button type="submit" className="btn btn-primary mx-1">Sign In</button>
                <button type="button" className="btn btn-dark mx-1" onClick={()=>setEmailLogin(false)}><i className="bi bi-arrow-left"></i>Back</button>
                    </div>
                
            </form>
            :
           <>
                <GoogleOAuthProvider clientId={google_client_id}>
                    <GoogleLogin onSuccess={handleGgSuccess} onError={handleGgFailure} />
                </GoogleOAuthProvider>

                <FacebookProvider appId={facebook_app_id}>
                    <LoginButton
                        fields="name,email,picture, public_profile"
                        onSuccess={handleFbResponse}
                        onError={handleFbError}
                        style={{border:'1px solid #dadce0', background: 'none', padding:'7px 10px', color:'#3c4043', borderRadius:'4px'}}
                    >
                    <i className="bi bi-facebook text-primary"></i>  Sign In with Facebook
                    </LoginButton>
                </FacebookProvider>

                <button type="btn" 
                style={{border:'1px solid #dadce0', background: 'none', padding:'7px 10px', color:'#3c4043', borderRadius:'4px'}}
                onClick={()=>setEmailLogin(true)}
                >
                     <i className="bi bi-envelope text-dark"></i>  Sign In with Email
                    </button>
            </>
            }
            </div>
            {(error && error !=='') &&
                <p className='text-center text-danger py-3'>{error}</p>
            }
        </div>
    )
}