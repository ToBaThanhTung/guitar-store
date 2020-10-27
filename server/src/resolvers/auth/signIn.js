import { generateToken } from '../../utils/generate-token';
import bcrypt from 'bcryptjs';

/**
 * Sign In resolver
 *
 * @param {object} root The return value of the resolver for this field's parent
 * @param {object} args An object that contains all GraphQL arguments provided for this field.
 * @param {object} context  Object shared across all resolvers
 */

const signIn = async (
  root,
  { input: { emailOrUsername, password } },
  { User }
) => {
  const user = await User.findOne().or([
    { email: emailOrUsername },
    { username: emailOrUsername },
  ]);

  if (!user) {
    throw new Error(`User not found`);
  }

  const isValidPassword = await bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    throw new Error(`Wrong username or password`);
  }

  return {
    token: generateToken(user, 'secret', '1h'),
  };
};

export default signIn;
