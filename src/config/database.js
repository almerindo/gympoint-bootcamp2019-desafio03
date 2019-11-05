module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  // username: 'gympoint',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
