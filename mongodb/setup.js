db = db.getSiblingDB('urlshortener');

db.createUser({
  'user': 'urlshortener',
  'pwd': 'urlshortener',
  'roles': [
    {
      'role': 'readWrite',
      'db': 'urlshortener',
    },
  ],
});
