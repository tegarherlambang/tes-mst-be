const db = require("./index")
const { DataTypes, Model } = require("sequelize");

class UserModel extends Model { }
UserModel.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: true,
        primaryKey: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    foto_url: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    forgot_pass_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    register_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    indexes: [{
        unique: true,
        fields: ['id']
    }],
    sequelize: db.sequelize,
    modelName: 'user',
    freezeTableName: true,
    timestamps: true
});

module.exports = UserModel
