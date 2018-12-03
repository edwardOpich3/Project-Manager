const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // Force cast to strings to cover some security flaws!
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or passsword' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

    // Cast to strings to cover up some security flaws!
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      premium: false,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const settingsChange = (request, response) => {
  const req = request;
  const res = response;

  // First thing that needs to be done is check if the password is correct.
  // If not, insta-abort the operation
  Account.AccountModel.authenticate(req.session.account.username, req.body.passAuth,
  (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong password, changes not applied' });
    }

    const promise = Account.AccountModel.findOne({ username: req.session.account.username })
    .exec((findErr, findDoc) => {
      if (findErr) {
        console.log(findErr);
        res.status(400).json({ error: 'Something happened' });
      }

      return findDoc;
    });

    // If so, next step is account deletion, since nothing else matters if it'll just be gone
    if (req.body.delete) {
      promise.then((doc) => {
        const deletePromise = Account.AccountModel.deleteOne({ _id: doc._id }, (delErr, delDoc) => {
          if (delErr) {
            console.log(delErr);
            return res.status(400).json({ error: 'Something happened, no delete' });
          }

          return delDoc;
        });

        deletePromise.then(() => {
          req.session.destroy();
          res.redirect('/');
        });

        return deletePromise;
      });

      return promise;
    }

    // After that, check for premium and for password change in no particular order
    promise.then((document) => {
      const doc = document;

      // Check if the passwords are the same before changing
      if (req.body.passChange === req.body.passChange2 && req.body.passChange !== '') {
          // Generate salt and whatnot
        Account.AccountModel.generateHash(req.body.passChange, (salt, hash) => {
          const accountData = {
            salt,
            password: hash,
          };

          Account.AccountModel.updateOne({ _id: doc._id }, accountData, (passErr) => {
            if (passErr) {
              console.log(passErr);
              console.log('Password change failed');
            }
          });
        });
      }

      // console.log("Given value is " + req.body.premium);
      // console.log("Before it's " + doc.premium);
      doc.premium = (req.body.premium !== undefined);
      // console.log("After it's " + doc.premium);

      // Update the actual document!
      const updatePromise = Account.AccountModel.updateOne(
        { _id: doc._id },
        doc
      );

      // console.log(doc);

      updatePromise.then(() => {
        res.json({ redirect: '/maker' });
        console.log(`Given value is ${doc.premium}`);
        console.log(`Before it's ${req.session.account.premium}`);
        req.session.account = Account.AccountModel.toAPI(doc);
        console.log(`After it's ${req.session.account.premium}`);
      });

      updatePromise.catch((updateErr) => {
        console.log(updateErr);
      });

      return updatePromise;
    });

    return promise;
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const getAccount = (request, response) => {
  // console.log(request.session.account);
  response.json(request.session.account);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.settings = settingsChange;
module.exports.getToken = getToken;
module.exports.getAccount = getAccount;
