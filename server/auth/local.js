// @flow
import Router from 'koa-router';
import Sequelize from 'sequelize';
import { Event, User, Team } from '../models';
import methodOverride from '../middlewares/methodOverride';
import validation from '../middlewares/validation';
import auth from '../middlewares/authentication';

const router = new Router();

router.use(methodOverride());
router.use(validation());

router.post('local', auth({ required: false }), async ctx => {
  let { email, password } = ctx.body;

  ctx.assertEmail(email, 'email is required');
  ctx.assertNotEmpty(password, 'password is required');

  const user = await User.findOne({
    where: { email: email.toLowerCase() },
  });

  if (user) {
    try {
      const passwordIsValid = await user.validPassword(password)

      if (!passwordIsValid) {
        ctx.redirect(`/?notice=invalid-password`);
      }

      const team = await Team.findOne({
        where: {
          id: user.teamId,
        }
      })

      // set cookies on response and redirect to team subdomain
      ctx.set('Authentication', `Bearer ${user.getJwtToken()}`);
      ctx.signIn(user, team, 'local', true);
      // ctx.signIn(user, team, 'local', false);
    } catch (err) {
      if (err instanceof Sequelize.UniqueConstraintError) {
        const exists = await User.findOne({
          where: {
            service: 'local',
            email: email,
          },
        });

        if (exists) {
          ctx.redirect(`${process.env.URL}?notice=email-auth-required`);
        } else {
          ctx.redirect(`${process.env.URL}?notice=auth-error`);
        }

        return;
      }

      throw err;
    }
  } else {
    ctx.redirect(`${process.env.URL}?notice=auth-error`);
  }
});

router.post('local.create', auth({ required: false }), async ctx => {
  let { email, password } = ctx.body;

  ctx.assertEmail(email, 'email is required');
  ctx.assertNotEmpty(password, 'password is required');

  const [team, isFirstUser] = await Team.findOrCreate({
    where: {
      name: 'Local Team',
    },
    defaults: {
      name: 'Local Team',
    },
  });

  try {
    const [user, isFirstSignin] = await User.findOrCreate({
      where: {
        email: email,
      },
      defaults: {
        service: 'local',
        email: email,
        username: email,
        password: password,
        serviceId: '1',
        name: email,
        isAdmin: isFirstUser,
        teamId: team.id,
      },
    });

    if (!isFirstUser) {
      user.password = password;
      user.hashPassword();
    }

    if (!(user.service === 'local')) {
      user.service = 'local';
      await user.save();
    }

    if (isFirstUser) {
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
    // ctx.redirect(`/home`);
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
        ctx.redirect(`${team.url}?notice=auth-error`);
      }

      return;
    }

    throw err;
  }
});

export default router;
