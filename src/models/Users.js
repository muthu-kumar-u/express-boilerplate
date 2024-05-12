module.exports=(sequelize,DataTypes)=>{
    const Users=sequelize.define("users",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        email:{
            type:DataTypes.STRING,
        },
        password:{
            type:DataTypes.STRING,
        },

        //name: DataTypes.STRING,
       // speciality:  DataTypes.STRING,
        //status: DataTypes.STRING, 
       //email: DataTypes.STRING,
        //password:DataTypes.STRING,
       // ConformPassword:DataTypes.STRING,
        //online: DataTypes.INTEGER,
       // user_id: DataTypes.INTEGER,
        //userOnlineStatus : DataTypes.STRING
    },
    {
        sequelize,
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        //timestamps: false,
    }
)
return Users;
}