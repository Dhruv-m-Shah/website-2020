import React, { Component } from "react";
import AWS from 'aws-sdk';

import ForgotPasswordLayout from "../../components/ForgotPasswordLayout";
import InputField from "../../components/InputField";
import SubmitButton from "../../components/SubmitButton";

const awsRegion = process.env.REACT_APP_AWS_REGION
AWS.config.update({region:awsRegion});
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export default class ForgotPasswordPageChange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newPassword: undefined,
      confirmPassword: undefined,
      code: props.location.code,
      email: props.location.email,
      err: false,
      success: false,
    };

    if (this.state.code === undefined || this.state.email === undefined) {
      // Somehow disable the input fields and button
      this.state.err = "noCode";
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    // do something
    event.preventDefault()

    if (this.state.newPassword === this.state.confirmPassword) {
      var params = {
        ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
        ConfirmationCode: this.state.code,
        Password: this.state.newPassword,
        Username: this.state.email
      };
      cognitoIdentityServiceProvider.confirmForgotPassword(params, function(err, data) {
        if (err) {
          console.log(err);
          // Do something to communicate error
        }
        else {
          this.setState({ success: true });
          // Do something when successfully changed
        }       
      }.bind(this));
    } else {
      this.setState({ err: "noMatch" });
    }  
  };
  

  displayErrors = () => {
    if (this.state.err === "noCode") {
      return (
        <div className="alert alert-danger">
          You haven't requested to change your password! Please click <a href="/forgotpassword">here</a> to begin the password reset process.
        </div>
      );
    } else if (this.state.err === "noMatch") {
      return (
        <div className="alert alert-danger">
          Please ensure that passwords match.
        </div>
      );
    }
  };

  displaySuccess = () => {
    if (this.state.success) {
      return (
        <div className="alert alert-success">
          You have successfully changed your password! Please click <a href="/login">here</a> to login to your account.
        </div>
      );
    }
  };

  render() {
    return (
      <ForgotPasswordLayout
        title={"Reset Password"}
        subtitle={"Please enter a new password for your GoldenHack account."}
      >
        <InputField
          isRequired={true}
          isPassword={true}
          label={"newPassword"}
          name={"newPassword"}
          placeholder={"New Password"}
          handleChange={this.handleChange}
          type={"password"}
        />

        <InputField
          isRequired={true}
          isPassword={true}
          label={"confimPassword"}
          name={"confirmPassword"}
          placeholder={"Confirm Password"}
          handleChange={this.handleChange}
          type={"password"}
        />

        {/* Display an error if needed */}
        {this.displayErrors()}

        {/* Display a success message if needed */}
        {this.displaySuccess()}

        <SubmitButton
          text={"Recover Account"}
          handleSubmit={this.handleSubmit.bind(this)}
        />
      </ForgotPasswordLayout>
    );
  }
}
