import * as argon2 from "argon2";

const hash = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    console.log(`An error in hashing: ${error}`);
    throw error;
  }
};

const verifyPassword = async (
  hashed: string,
  password: string
): Promise<boolean> => {
  try {
    const isValid = await argon2.verify(hashed, password);
    return isValid;
  } catch (error) {
    console.log(`Error in verifying: ${error}`);
    throw error;
  }
};

const password = "123";

hash(password)
  .then((hashed) => {
    console.log(`Hashed password: ${hashed}`);
    return verifyPassword(hashed, password);
  })
  .then((isValid) => {
    console.log(`The password is: ${isValid}`);
  })
  .catch((err) => console.log(err));
