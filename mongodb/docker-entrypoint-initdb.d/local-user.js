db = db.getSiblingDB('urlshortener');

db.createUser({
  'user': 'local-user',
  'pwd': 'local-user-password',
  'roles': [
    {
      'role': 'readWrite',
      'db': 'urlshortener'
    }
  ]
});
