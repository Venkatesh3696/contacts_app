import sequelize from './database';

const syncDatabase = async () => {
	if (process.env.NODE_ENV === 'development') {
		try {
			await sequelize.sync({ alter: true });
			console.log('Database synchronized');
		} catch (error) {
			console.error('Unable to sync database:', error);
		}
	}
	return;
};

export default syncDatabase;
