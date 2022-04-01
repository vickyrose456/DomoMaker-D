// redirection requests. If a user is not logged in, dont let them go to a page
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    // redirect to homepage if not logged in
    return res.redirect('/');
  }
  return next();
};// requires log in

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    // if already logged in, go to the application
    return res.redirect('/maker');
  }
  return next();
};// requires logout

// part 2

// since running locally - override secure HTTPS when logging in
// when not using heroku, would check req.secure and redirect to HTTPS
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};// require secure

const bypassSecure = (req, res, next) => {
  next();
};// bypass secure

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// NODE_ENV = production when using heroku
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
