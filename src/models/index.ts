import Contact from './contacts';
import User from './users';

User.hasMany(Contact, {
	foreignKey: 'userId',
});
