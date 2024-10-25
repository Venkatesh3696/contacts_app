import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const sequelize = new Sequelize(
	process.env.DATABASE_NAME!,
	process.env.DATABASE_USER_NAME!,
	process.env.DATABASE_PASSWORD!,

	{
		host: process.env.DATABASE_HOST!,
		port: parseInt(process.env.DATABASE_PORT!) || 18269,
		dialect: 'mysql',
		dialectModule: mysql2,
		dialectOptions: {
			connectTimeout: 60000, // Increase timeout to 60 seconds
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
);

export default sequelize;
