module.exports = (sequelize, DataTypes) => {

    const Comm = sequelize.define("comm", {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            from_id: DataTypes.INTEGER,
            from_dr: DataTypes.STRING,
            to_id:  DataTypes.INTEGER,
            to_dr:  DataTypes.STRING,
            status: DataTypes.STRING, 
            first_msg: DataTypes.STRING,
            last_msg_time: DataTypes.DATE,
            closed_by_1: DataTypes.INTEGER,
            closed_by_1_date: DataTypes.DATE,
            closed_by_2: DataTypes.INTEGER,
            closed_by_2_date: DataTypes.DATE,
        },
        {
            sequelize,
            tableName: 'comm',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }

    );

    return Comm;

}
