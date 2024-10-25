import sequelize from '@/lib/db/database';
import { DataTypes } from 'sequelize';
import User from './users';

const Contact = sequelize.define(
	'Contact',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: 'id',
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
		},
		address: {
			type: DataTypes.STRING,
		},
		isDeleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		tableName: 'contacts',
	},
);

Contact.belongsTo(User, {
	foreignKey: 'userId',
});

export default Contact;
