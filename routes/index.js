const express = require('express');
const router = express.Router();
const config = require('config');
const fetch = require('node-fetch');


/* GET home page. */
router.get('/', async (req, res, next) => {
  const responses = await Promise.all(
    ['https://calendly.com/api/v1/users/me', 'https://calendly.com/api/v1/users/me/event_types?include=owner'].map(
      url => fetch(url, { headers: { 'X-TOKEN': config.get('api-key') } })
    )
  );

  const errors = responses.filter(response => !response.ok);
  if (errors.length) {
    res.render('error', {message:'Could not query Calendly API - please check your API key'});
  } else {
    const [user, eventTypes] = await Promise.all(responses.map(response => response.json()));

    res.render('index', {
      user: user.data.attributes.name,
      eventTypes: eventTypes.data
        .filter(({ relationships: { owner } }) => owner.data.type === user.data.type && owner.data.id === user.data.id)
        .map(({ attributes: { name, slug } }) => ({ name, url: `${user.data.attributes.url}/${slug}` }))
    });
  }
});

module.exports = router;
