const jsforce = require("jsforce"),
  path = require("path"),
  session = require("express-session"),
  express = require("express"),
  _ = require("dotenv").config();

// Load and check config
if (
  !(
    process.env.loginUrl &&
    process.env.consumerKey &&
    process.env.consumerSecret &&
    process.env.callbackUrl &&
    process.env.apiVersion
  )
) {
  console.error(
    "Cannot start app: missing mandatory configuration. Check your .env file."
  );
  process.exit(-1);
}

const oauth2 = new jsforce.OAuth2({
  loginUrl: process.env.loginUrl,
  clientId: process.env.consumerKey,
  clientSecret: process.env.consumerSecret,
  redirectUri: process.env.callbackUrl,
});

// Setup HTTP server
const app = express();
const port = process.env.PORT || 3002;
app.set("port", port);

// Enable server-side sessions
app.use(
  session({
    secret: process.env.sessionSecretKey,
    cookie: { secure: process.env.isHttps === "true" },
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", express.static(path.join(__dirname, "../public")));

/**
 * Login endpoint
 */
app.get("/auth/login", (request, response) => {
  // Redirect to Salesforce login/authorization page
  response.redirect(oauth2.getAuthorizationUrl({ scope: "api" }));
});

/**
 * Logout endpoint
 */
app.get("/auth/logout", (request, response) => {
  const session = getSession(request, response);
  if (session == null) return;

  // Revoke OAuth token
  const conn = resumeSalesforceConnection(session);
  conn.logout((error) => {
    if (error) {
      console.error("Salesforce OAuth revoke error: " + JSON.stringify(error));
      response.status(500).json(error);
      return;
    }

    // Destroy server-side session
    session.destroy((error) => {
      if (error) {
        console.error(
          "Salesforce session destruction error: " + JSON.stringify(error)
        );
      }
    });

    // Redirect to app home page
    return response.redirect("/");
  });
});

/**
 * Login callback endpoint (only called by Salesforce)
 */
app.get("/auth/callback", (request, response) => {
  if (!request.query.code) {
    response
      .status(500)
      .send("Failed to get authorization code from server callback.");
    return;
  }

  // Authenticate with OAuth
  const conn = new jsforce.Connection({
    oauth2: oauth2,
    version: process.env.apiVersion,
  });

  conn.authorize(request.query.code, (error, userInfo) => {
    if (error) {
      console.log("Salesforce authorization error: " + JSON.stringify(error));
      response.status(500).json(error);
      return;
    }

    // Store oauth session data in server (never expose it directly to client)
    request.session.sfdcAuth = {
      instanceUrl: conn.instanceUrl,
      accessToken: conn.accessToken,
    };
    // Redirect to app home page
    return response.redirect("/");
  });
});

app.get("/auth/whoami", (request, response) => {
  const session = getSession(request, response);
  if (session == null) {
    return;
  }

  // Request session info from Salesforce
  const conn = resumeSalesforceConnection(session);
  conn.identity((error, res) => {
    response.send(res);
  });
});

/**
 * Endpoint for retrieving org limits info on Salesforce
 */
app.get("/limits", (request, response) => {
  const session = getSession(request, response);
  if (session == null) {
    return;
  }

  // Request session info from Salesforce
  const conn = resumeSalesforceConnection(session);
  conn.limits((error, result) => {
    if (error) {
      console.error("Salesforce data API error: " + JSON.stringify(error));
      response.status(500).json(error);
      return;
    } else {
      response.send(result);
      return;
    }
  });
});

function getSession(request, response) {
  const session = request.session;
  if (!session.sfdcAuth) {
    response.status(401).send("No active session");
    return null;
  }
  return session;
}

function resumeSalesforceConnection(session) {
  return new jsforce.Connection({
    oauth2: oauth2,
    instanceUrl: session.sfdcAuth.instanceUrl,
    accessToken: session.sfdcAuth.accessToken,
    version: process.env.apiVersion,
  });
}

app.listen(app.get("port"), () => {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
