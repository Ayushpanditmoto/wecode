import React, {  useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import apiService from "../../services/apiService";
import "./index.css";
import { Link } from "react-router-dom";
import FormNavBar from "../navbar/FormNavbar";
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
const Login=(props)=> {

  const [userdetails, setUserdetails] = useState({
    username: "",
    password: "",
    usertype:""
  });

  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserdetails({ ...userdetails, [name]: value });
  };
  useEffect(()=>{
    
    setUserdetails({...userdetails,"usertype":props.usertype});
  },[]);
 
  const handleSubmit = async (e) => {
    // e.preventDefault();
    e.preventDefault();
    setWaiting(true);
    try {
      const response = await apiService.login(userdetails);
      setErrorType("success");
      setError(response.message);

      const { token } = response;
      Cookies.set('token', token, { expires: 1/48 });
      Cookies.set('user', userdetails.username, { expires: 1/48 });
      props.setuser(true);
      navigate('/');
    } catch (error) {
      setErrorType("danger");
      setError(error.response.data.message);

      console.error("Error message:", error);
    } finally {
      setWaiting(false);
      setUserdetails({
        username: "",
        password: "",
        usertype:userdetails.usertype
      });
    }
  };
  return (
    <>
      <FormNavBar />
      <div className="form-container">
        <div className="form-group row header-container">
             <h2>
              Login as {props.usertype}
              </h2>
        </div>
      {
        error && 
        <Alert variant={errorType} onClose={() => {setError(""); setErrorType("");}} dismissible>
        <Alert.Heading>{errorType==="danger"?"Failed":"Success"}</Alert.Heading>
        <p>
          {error}
        </p>
      </Alert>

      }
      
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label for="inputEmail3" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input
                type="email"
                className="form-control"
                id="inputEmail3"
                name="username"
                required={true}
                onChange={handleInputChange}
                value={userdetails.username}
                placeholder="Email"
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="inputPassword3" className="col-sm-2 col-form-label">
              Password
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                className="form-control"
                name="password"
                required={true}
                onChange={handleInputChange}
                value={userdetails.password}
                id="inputPassword3"
                placeholder="Password"
              />
              
            </div>
          </div>

          
          <div className="form-group row">
            <div className="col-sm btn-container">
              <button type="submit" className="btn btn-primary">
                {
                  waiting?"please wait...":"Login"
                }
                
              </button>
            </div>
            <div className="form-group row">
              <div className="col-sum">
                <Form.Text>
                  Don't have an account? <Link to="/register">Create new account</Link>
                </Form.Text>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

Login.propTypes = {
  usertype:PropTypes.string
}
Login.defaultProps = {
  usertype:"Learner"
}
export default Login;