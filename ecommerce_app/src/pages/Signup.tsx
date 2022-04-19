import React from "react";
import { TextField } from "@mui/material";
import { Box, Button } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

async function attemptSignup(
  email: string,
  password: string,
  name: string
): Promise<any> {
  const response = await fetch("http://localhost/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Signup failed");
  }
}

export default function Signup() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting signup");
    console.log(email);
    console.log(password);
    console.log(username);

    console.log("sending request...");
    attemptSignup(email, password, username)
      .then((response) => {
        console.log("Got response");
        console.log(response);
        console.log("redirecting user");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
        setErrorMessage("Registration failed");
        // TODO: handle error
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: "1000px" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Sign up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="username"
              variant="filled"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              sx={{ p: 1 }}
            />
            <br />
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
                Sign up
              </Button>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button size="small" sx={{ pl: 2 }}>
                  Log in
                </Button>
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
