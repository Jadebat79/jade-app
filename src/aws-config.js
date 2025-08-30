// src/aws-config.js
const awsConfig = {
  // ---- Region (top-right of AWS console) ----
  aws_project_region: "us-east-1",              // e.g. "us-east-1"
  aws_cognito_region: "us-east-1",

  // ---- Cognito User Pool identifiers ----
  aws_user_pools_id: "us-east-1_B8WYKXZCS",         // e.g. "us-east-1_AbCdEf123"
  aws_user_pools_web_client_id: "7qq0jn96m3h91k1erjtph0j667", // from your screenshot

  // ---- OAuth / Hosted UI ----
  oauth: {
    domain: "https://us-east-1b8wykxzcs.auth.us-east-1.amazoncognito.com",
    scope: ["email", "openid", "profile"],
    redirectSignIn: "http://localhost:3000/",
    redirectSignOut: "http://localhost:3000/",
    responseType: "code", // Authorization code grant
  },

  // ---- AppSync (GraphQL) – if you’ve created it already ----
  aws_appsync_graphqlEndpoint: "https://q7oibfi2lnhonbftv3k4aw3qze.appsync-api.us-east-1.amazonaws.com/graphql", // optional for now
  aws_appsync_region: "us-east-1",                           // e.g. "us-east-1"
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
};

export default awsConfig;