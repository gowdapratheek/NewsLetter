const express = require("express");
const bp = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const email = req.body.mail;
  const fname = req.body.fn;
  const lname = req.body.ln;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const JsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/dc2fcd872f";
  const options = {
    method: "POST",
    auth: "prathimailchimp:0a614ce1a4ec7c270372a0e4157c4c820-us17",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      const d = JSON.parse(data);
    });
  });

  request.write(JsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("listening on port 3000");
});

// api Key
// 0614ce1a4ec7c270372a0e4157c4c820-us17    https://<dc>.api.mailchimp.com/3.0/

// id
// dc2fcd872f              https://us17.api.mailchimp.com/3.0/dc2fcd872f
