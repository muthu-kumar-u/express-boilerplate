
module.exports = (sequelize, DataTypes) => {

    const Doctor = sequelize.define("doctor", {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            name:{
                type:DataTypes.STRING,
            },
            email:{
                type:DataTypes.STRING,
            },


            name: DataTypes.STRING,
            phone: DataTypes.STRING,
            speciality:  DataTypes.STRING,
            practice:  DataTypes.STRING,
            status: DataTypes.STRING, 
            imagePath: DataTypes.STRING,
        
            online: DataTypes.STRING,
            user_id: DataTypes.INTEGER,
            userOnlineStatus : DataTypes.STRING
        },
        {
            sequelize,
            tableName: 'doctor',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }



    );

    //Doctor.belongsTo(Author, { foreignKey: 'author_id' });

    return Doctor;
}