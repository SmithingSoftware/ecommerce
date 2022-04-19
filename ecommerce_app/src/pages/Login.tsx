import React from "react";
import { TextField } from "@mui/material";
import { Box, Button } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { User } from "../type";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

interface LoginResponse {
  user: User;
}

async function attemptLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch("http://localhost/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Login failed");
  }
}

export default function Login(props: LoginProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
  const { setUser } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("sending request...");
    attemptLogin(email, password)
      .then((response: LoginResponse) => {
        console.log("Got response");
        console.log(response);
        setUser(response.user.email);
        console.log("redirecting user");
        window.location.href = "/";
      })
      .catch((error) => {
        console.log("Error");
        setErrorMessage("Login failed");
        // TODO: handle error
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: "1000px" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="email"
              variant="filled"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              sx={{ p: 1 }}
            />
            <br />
            <TextField
              label="password"
              variant="filled"
              type="password"
              required
              value={password}
              sx={{ p: 1 }}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errorMessage ? (
              <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
            ) : null}
            <Box sx={{ p: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Log in
              </Button>
              <Link to="/signup">
                <Button size="small" sx={{ pl: 2 }}>
                  Sign up
                </Button>
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
