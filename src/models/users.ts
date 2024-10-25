import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db/database';

const User = sequelize.define(
	'User',
	{
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		tableName: 'users',
	},
);

export default User;
