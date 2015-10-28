import passport from 'passport';
import {Strategy as TwitterStrategy} from 'passport-twitter';

exports.setup = function(User, config) {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    <% if (filters.mongooseModels) { %>User.findOneAsync({<% }
       if (filters.sequelizeModels) { %>User.find({<% } %>
      'twitter.id_str': profile.id
    })
      .then(function(user) {
        if (!user) {
          <% if (filters.mongooseModels) { %>user = new User({<% }
             if (filters.sequelizeModels) { %>user = User.build({<% } %>
            name: profile.displayName,
            username: profile.username,
            role: 'user',
            provider: 'twitter',
            twitter: profile._json
          });
          <% if (filters.mongooseModels) { %>user.saveAsync().spread(function(user) {<% }
             if (filters.sequelizeModels) { %>user.save().then(function(user) {<% } %>
              return done(null, user);
            })
            .catch(function(err) {
              return done(err);
            });
        } else {
          return done(null, user);
        }
      })
      .catch(function(err) {
        return done(err);
      });
  }));
};
