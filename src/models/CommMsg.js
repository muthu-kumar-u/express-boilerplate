module.exports = (sequelize, DataTypes) => {

    const CommMsg = sequelize.define("comm_msg", {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            comm_id: DataTypes.INTEGER,
            seq:  DataTypes.INTEGER,
            is_reply:  DataTypes.STRING,
            from_id :  DataTypes.INTEGER,
            msg: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: 'comm_msg',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }

    );

    return CommMsg;

}