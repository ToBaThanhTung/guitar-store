import { gql } from 'apollo-server-express';

/**
 * User schema
 */
const UserSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type User {
    id: ID!
    fullName: String!
    email: String!
    username: String!
    password: String!
    resetToken: String
    resetTokenExpiry: String
    coverImage: File
    coverImagePublicId: String
    role: String
    createdAt: String
    updatedAt: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Token {
    token: String!
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input SignInInput {
    emailOrUsername: String!
    password: String
  }

  input SignUpInput {
    email: String!
    username: String!
    fullName: String!
    password: String!
  }

  input RequestPasswordResetInput {
    email: String!
  }

  input ResetPasswordInput {
    email: String!
    token: String!
    password: String!
  }

  input UploadUserPhotoInput {
    id: ID!
    image: Upload!
    imagePublicId: String
    isCover: Boolean
  }

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type UserPayload {
    id: ID!
    fullName: String
    email: String
    username: String
    coverImage: String
    coverImagePublicId: String
    createdAt: String
    updatedAt: String
  }

  type SuccessMessage {
    message: String!
  }

  type UsersPayload {
    users: [UserPayload]!
    count: String!
  }



  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Verifies reset password token
    verifyResetPasswordToken(email: String, token: String!): SuccessMessage

    # Gets the currently logged in user
    getAuthUser: UserPayload

    # Gets user by username or by id
    getUser(username: String, id: ID): UserPayload

    # Gets all users
    getUsers(userId: String!, skip: Int, limit: Int): UsersPayload
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Signs in user
    signIn(input: SignInInput!): Token

    # Signs up user
    signUp(input: SignUpInput!): Token

    # Requests reset password
    requestPasswordReset(input: RequestPasswordResetInput!): SuccessMessage

    # Resets user password
    resetPassword(input: ResetPasswordInput!): Token

    # Uploads user Profile or Cover photo
    uploadUserPhoto(input: UploadUserPhotoInput!): UserPayload
  }
`;

export default UserSchema;
