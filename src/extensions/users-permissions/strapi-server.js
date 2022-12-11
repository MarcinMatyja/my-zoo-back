module.exports = (plugin) => {
  const sanitizeOutput = (user) => {
    const {
      password,
      resetPasswordToken,
      confirmationToken,
      ...sanitizedUser
    } = user; // be careful, you need to omit other private attributes yourself
    return sanitizedUser;
  };

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      ctx.state.user.id,
      { populate: ["role,pets"] }
    );

    ctx.body = sanitizeOutput(user);
  };

  plugin.controllers.user.find = async (ctx) => {
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      { ...ctx.params, populate: ["role,pets"] }
    );

    ctx.body = users.map((user) => sanitizeOutput(user));
  };

  plugin.controllers.auth.refreshToken = async (ctx) => {
    //   // refresh userself token
    //   // const newJwt = strapi.plugins["users-permissions"].services.jwt.issue({
    //   //   id: ctx.state.user.id,
    //   // });
    //   // return { jwt: newJwt };
    //   // comment out next lines, and refresh the request body's token like {token: 'xxx'}
    const { token } = await ctx.request.body;
    console.log(token);
    const payload = await strapi.plugins["users-permissions"].services.jwt
      .verify(token)
      .catch((err) => {
        console.log("error");
      });
    const newJwt = await strapi.plugins["users-permissions"].services.jwt.issue(
      {
        id: payload.id,
      }
    );
    return { jwt: newJwt };
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/refreshToken",
    handler: "auth.refreshToken",
    config: {
      policies: [],
      prefix: "",
    },
  });

  return plugin;
};
