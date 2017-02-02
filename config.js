exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://daileytj:QazPlm123!@ds139909.mlab.com:39909/blogchallengedb';
exports.PORT = process.env.PORT || 8080;
