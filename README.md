# 📝 Serverless Notes App (AWS Amplify + Cognito + AppSync + Lambda + DynamoDB)

This project is a **serverless full-stack notes application** built on AWS.  
It demonstrates how to combine **React (frontend)** with **Cognito authentication**,  
**AppSync GraphQL API**, **DynamoDB**, and **Lambda (Python)** functions.

---

## 📌 Architecture Overview

The application consists of the following components:

- **Frontend**: React app hosted with Amplify Hosting.
- **Authentication**: Amazon Cognito User Pool + Hosted UI.
- **API**: AWS AppSync (GraphQL) connected to DynamoDB.
- **Database**: DynamoDB table storing notes.
- **Functions**: Lambda triggers (Python) for signup logic.

![Architecture Diagram](https://docs.amplify.aws/assets/diagrams/serverless-appsync-architecture.png) <!-- (Optional: Replace with your own diagram if you make one) -->

---

## 🚀 Deployment Requirements

- Node.js ≥ 18
- AWS CLI configured
- AWS services used:
    - Amplify Hosting
    - Cognito
    - AppSync
    - DynamoDB
    - Lambda (Python)

---

## 🖥️ Frontend (React + Amplify)

### Setup

```bash
npx create-react-app notes-app
cd notes-app
npm install aws-amplify@^6 @aws-amplify/ui-react@^6
npm install @aws-amplify/ui@^6
npm i graphql    
npm i aws-amplify@^6 @aws-amplify/ui-react@^6 graphql
```

### Amplify Configuration (src/aws-config.js)
```javascript
const awsconfig = {
  Auth: {
    region: "us-east-1",
    userPoolId: "<your-user-pool-id>",
    userPoolWebClientId: "<your-app-client-id>",
    oauth: {
      domain: "<your-cognito-domain>.auth.us-east-1.amazoncognito.com",
      scope: ["email", "openid", "profile"],
      redirectSignIn: "http://localhost:3000/,https://<amplify-app-url>.amplifyapp.com/",
      redirectSignOut: "http://localhost:3000/,https://<amplify-app-url>.amplifyapp.com/",
      responseType: "code"
    }
  },
  aws_appsync_graphqlEndpoint: "<your-appsync-endpoint>",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"
};

export default awsconfig;
```

### Features

- Sign up / Sign in / Sign out (via Cognito Hosted UI)
- Create a new note
- List all notes from DynamoDB

--- 

## 🔐 Authentication (Cognito)
### Setup

- Created a User Pool in Cognito.
- Created an App Client (no client secret).
- Enabled a Cognito Hosted UI domain:

```cpp
https://<your-domain>.auth.us-east-1.amazoncognito.com
```
- Added callback URLs:
    - http://localhost:3000/
    - https://<amplify-app-url>.amplifyapp.com/

### Lambda Triggers

- Added PreSignUp and PostConfirmation triggers to the User Pool.

### ⚠️ UI Notes
- In the **new AWS Console UI**, Lambda triggers are under **“Extensions”**, not directly under **“Triggers”** (older tutorials show “Triggers”).  
- When setting callback URLs, they are now located in the **App client → Login pages** section, not where older docs suggest.

---

## API & Database (AppSync + DynamoDB)
### GraphQL Schema

```graphql
type Note @model {
  id: ID!
  name: String!
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
}
```
- AppSync connected to a DynamoDB table.
- CRUD resolvers configured for Note.

### ⚠️ UI Notes
- AppSync now separates **“Schema”** and **“Resolvers”** in a slightly different way.  
  - After creating your model, queries/mutations are linked automatically.  
  - Subscriptions and connections are created, but you may need to manually attach them to the data source if required.
  
--- 

## Lambda Function (Python)
### Function: onUserSignupPy

- Runtime: Python 3.12
- Handler: lambda_function.lambda_handler

```python
def lambda_handler(event, context):
    # Auto-confirm user + verify email
    event["response"] = {
        "autoConfirmUser": True,
        "autoVerifyEmail": True,
        "autoVerifyPhone": False
    }
    return event
```

- Attached to PreSignUp in Cognito.
- Logs monitored in CloudWatch.

---

## Hosting (Amplify Hosting)
### Steps

- Push code to GitHub.
- In Amplify Console → “Host Web App” → connect repo & branch.
- Amplify auto-builds and deploys with npm run build.
- Live URL provided:

```bash
https://main.<hash>.amplifyapp.com
```

- Update Cognito callback/sign-out URLs to include Amplify URL.

--- 

## Final Working Flow

- User signs up (Cognito Hosted UI).
- PreSignUp Lambda runs → user auto-confirmed.
- User signs in → redirected to frontend.
- User creates a note → stored in DynamoDB via AppSync.
- Notes display in frontend.
- User can sign out successfully.