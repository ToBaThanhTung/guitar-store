import { generateToken } from '../../utils/generate-token';

/**
 * Sign Up resolver
 *
 * @param {object} root The return value of the resolver for this field's parent
 * @param {object} args An object that contains all GraphQL arguments provided for this field.
 * @param {object} context  Object shared across all resolvers
 */


const signUp = async (
  root,
  { input: { fullName, email, username, password } },
  { User }
) => {
  // Check if user with given email or username already exists
  const user = await User.findOne().or([{ email }, { username }]);
  if (user) {
    const field = user.email === email ? 'email' : 'username';
    throw new Error(`User with given ${field} already exists.`);
  }

  // Empty field validation
  if (!fullName || !email || !username || !password) {
    throw new Error('All fields are required.');
  }

  // FullName validation
  if (fullName.length > 40) {
    throw new Error('Full name no more than 40 characters.');
  }
  if (fullName.length < 4) {
    throw new Error('Full name min 4 characters.');
  }

  // Email validation
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(String(email).toLowerCase())) {
    throw new Error('Enter a valid email address.');
  }

  // Username validation
  const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
  if (!usernameRegex.test(username)) {
    throw new Error(
      'Usernames can only use letters, numbers, underscores and periods.'
    );
  }
  if (username.length > 20) {
    throw new Error('Username no more than 50 characters.');
  }
  if (username.length < 3) {
    throw new Error('Username min 3 characters.');
  }
  const frontEndPages = [
    'forgot-password',
    'reset-password',
    'explore',
    'people',
    'notifications',
    'post',
  ];
  if (frontEndPages.includes(username)) {
    throw new Error("This username isn't available. Please try another.");
  }

  // Password validation
  if (password.length < 6) {
    throw new Error('Password min 6 characters.');
  }

  const newUser = await new User({
    fullName,
    email,
    username,
    password,
  }).save();

  return {
    token: generateToken(newUser, 'secret', '1h'),
  };
};

export default signUp;
