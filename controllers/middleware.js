exports.isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/home");
};
exports.isEditor = async (req, res, next) => {
  if (req.user.type == 1) {
    return next();
  }
};
exports.isAdmin = async (req, res, next) => {
  if (req.user.type == 2) {
    return next();
  }
};
exports.redirectUserType = async (req, res, next) => {
  if (req.user.type == 0) {
    await res.redirect("/dashboard");
  } else if (req.user.type == 1) {
    await res.redirect("/editor/dashboard");
  } else if (req.user.type == 2) {
    await res.redirect("/admin/dashboard");
  } else {
    res.redirect("/");
  }
  await next();
};

// Redirect from flag
exports.postRedirectedUserGateway = async (req, res, next) => {
  const { redirect } = await req.cookies;
  if (redirect != undefined) {
    await res.redirect(`/nanozyme/raise-flag/${redirect.nanozymeId}`);
  }
  next();
};
