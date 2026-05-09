import { useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

import { auth } from "./firebase";

function AuthPage({ setIsLoggedIn }) {

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);



  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {

    try {

      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      setIsLoggedIn(true);

    } catch (error) {

      console.log(error);

    }

  };



  // SEND OTP
  const sendOTP = async () => {

  try {

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal",
        callback: () => {
          console.log("Recaptcha solved");
        }
      }
    );

    const appVerifier = window.recaptchaVerifier;

    const result = await signInWithPhoneNumber(
      auth,
      phone,
      appVerifier
    );

    setConfirmationResult(result);

    alert("OTP Sent Successfully");

  } catch (error) {

    console.log(error);

    alert(error.message);

  }

};



  // VERIFY OTP
  const verifyOTP = async () => {

    try {

      await confirmationResult.confirm(otp);

      setIsLoggedIn(true);

    } catch (error) {

      console.log(error);

    }

  };



  return (

    <div style={{
      backgroundColor: "#020617",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontFamily: "Arial"
    }}>

      <div style={{
        backgroundColor: "#1e293b",
        padding: "40px",
        borderRadius: "15px",
        width: "350px",
        boxShadow: "0px 0px 20px rgba(56,189,248,0.3)"
      }}>

        <h1 style={{
          textAlign: "center",
          marginBottom: "30px"
        }}>
          🔐 NetSecure Login
        </h1>



        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4285F4",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Continue with Google
        </button>



        <input
          type="text"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            marginBottom: "15px"
          }}
        />



        <button
          onClick={sendOTP}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#22c55e",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Send OTP
        </button>



        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            marginBottom: "15px"
          }}
        />



        <button
          onClick={verifyOTP}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#38bdf8",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Verify OTP
        </button>



        <div id="recaptcha-container"></div>

      </div>

    </div>

  );

}

export default AuthPage;