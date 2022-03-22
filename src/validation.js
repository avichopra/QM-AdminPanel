const isValidEmailFormat = email => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
};
const isValidPhoneNumberFormat = number => {
  let re = /^[0-9]{10}$/;
  return re.test(String(number));
};

const isValidYearFormat = number => {
  let re = /^[0-9]{4}$/;
  return re.test(String(number));
};

const isValidYear = number => {
  if (number === '') {
    return { valid: false, message: 'Year cannot be empty' };
  }
  if (!isValidYearFormat(number)) {
    return { valid: false, message: 'Please enter the valid Year' };
  }
  return { valid: true };
};
const isValidField = field => {
  // console.log('>>>>>>>>>for validation', field);
  if (field.trim() === '') {
    return { valid: false, message: '{{Field}} cannot be empty.' };
  }
  return { valid: true };
};

const isValidPhoneNumber = number => {
  if (number === '') {
    console.log('empty phone no.', number);
    return { valid: false, message: 'Number cannot be empty' };
  }
  if (!isValidPhoneNumberFormat(number)) {
    console.log('invalid phone no format.', number);
    return { valid: false, message: 'Please enter the valid phone number' };
  }
  return { valid: true };
};

const isValidEmail = email => {
  if (email === '') {
    return { valid: false, message: 'Email cannot be empty' };
  }
  if (!isValidEmailFormat(email)) return { valid: false, message: 'Please enter the valid email' };
  return { valid: true };
};

const isValidConfirmPassword = (password, confirmPassword) => {
  if (confirmPassword === '') return { valid: false, message: 'Confirm password cannot be empty' };
  if (password !== confirmPassword)
    return {
      valid: false,
      message: 'Password and Confirm password do not match!'
    };
  return { valid: true };
};

const isValidPassword = password => {
  if (password === '') return { valid: false, message: 'Password cannot be empty' };
  if (password.length < 6)
    return {
      valid: false,
      message: 'Password cannot be shorter than 6 characters!'
    };
  return { valid: true };
};

export {
  isValidConfirmPassword,
  isValidEmail,
  isValidPassword,
  isValidEmailFormat,
  isValidPhoneNumber,
  isValidField,
  isValidYear
};
