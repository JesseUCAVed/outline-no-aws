// @flow
import Router from 'koa-router';
import Sequelize from 'sequelize';
import { getUserForJWT } from '../utils/jwt';
import { Event, User, Team } from '../models';
import methodOverride from '../middlewares/methodOverride';
import validation from '../middlewares/validation';
import auth from '../middlewares/authentication';

const router = new Router();

router.use(methodOverride());
router.use(validation());

router.get('local', auth({ required: false }), async ctx => {
  let { email } = ctx.body;

  if (!email) {
    email = 'josh@jshcrm.com'
  }

  ctx.assertEmail(email, 'email is required');

  const [team, isFirstUser] = await Team.findOrCreate({
    where: {
      name: 'Local Team',
    },
    defaults: {
      name: 'Local Team',
    }
  });

  try {
    const [user, isFirstSignin] = await User.findOrCreate({
      where: {
        email: email,
      },
      defaults: {
        service: 'local',
        email: email,
        serviceId: '1',
        name: email,
        isAdmin: true,
        teamId: team.id,
      },
    });

    user.teamId = team.id;
    await user.save();

    if (!(user.service === 'local')) {
      user.service = 'local';
      user.teamId = team.id;
      await user.save();
    }

    if (true) {
      await team.provisionFirstCollection(user.id);
      await team.provisionSubdomain(team.domain);
    }

    if (isFirstSignin) {
      await Event.create({
        name: 'users.create',
        actorId: user.id,
        userId: user.id,
        teamId: team.id,
        data: {
          name: user.name,
          service: 'local',
        },
        ip: ctx.request.ip,
      });
    }

    // set cookies on response and redirect to team subdomain
    ctx.set('Authentication', `Bearer ${user.getJwtToken()}`);
    ctx.signIn(user, team, 'local', true);
    ctx.redirect(`/home`);
    // ctx.signIn(user, team, 'local', false);
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      const exists = await User.findOne({
        where: {
          service: 'local',
          email: email,
          teamId: team.id,
        },
      });

      if (exists) {
        ctx.redirect(`${team.url}?notice=email-auth-required`);
      } else {
        ctx.redirect(`${team.url}?notice=auth-error${err}`);
      }

      return;
    }

    throw err;
  }
});

// router.get('local.callback', auth({ required: false }), async ctx => {
//   const { token } = ctx.request.query;

//   ctx.assertPresent(token, 'token is required');

//   try {
//     const user = await getUserForJWT(token);

//     const team = await Team.findByPk(user.teamId);

//     if (!user.service) {
//       user.service = 'local';
//       await user.save();
//     }

//     // set cookies on response and redirect to team subdomain
//     ctx.signIn(user, team, 'local', true);
//   } catch (err) {
//     ctx.redirect(`${process.env.URL}?notice=expired-token ${err}`);
//   }
// });

export default router;
